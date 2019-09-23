
export default class LightManager {
    public ground: Phaser.Group = null;
    public walls: Phaser.Group = null;
    public game: Phaser.Game = null;
    public shadows;
    public bitmap;
    public lightCanvas;
    public light;
    public darkCanvas;
    public state;

    constructor(walls, game, state) {
        this.game = game;
        this.state = state;
        this.walls = walls;
    }

    createLight(lightSource, worldSize) {
        if (this.light) {
            this.light.destroy(true);
        }
        this.light = this.game.add.sprite(lightSource.x, lightSource.y, 'light');


        // Set the pivot point of the light to the center of the texture
        this.light.anchor.setTo(0.5, 0.5);
        this.light.body.immovable = true;
        this.light.body.allowGravity = false;
        // Create a bitmap texture for drawing light cones


        this.shadows = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        this.shadows.context.fillStyle = 'rgb(255, 255, 255)';
        this.shadows.context.strokeStyle = 'rgb(255, 255, 255)';

        this.game.cache.addBitmapData('shadows', this.shadows);
        this.bitmap = this.game.cache.getBitmapData('shadows');

        let lightBitmap = this.game.add.image(0, 0, this.bitmap);

        // This bitmap is drawn onto the screen using the MULTIPLY blend mode.
        // Since this bitmap is over the background, dark areas of the bitmap
        // will make the background darker. White areas of the bitmap will allow
        // the normal colors of the background to show through. Blend modes are
        // only supported in WebGL. If your browser doesn't support WebGL then
        // you'll see gray shadows and white light instead of colors and it
        // generally won't look nearly as cool. So use a browser with WebGL.
        lightBitmap.blendMode = PIXI.blendModes.MULTIPLY;
    }

    updateLight() {
        // Move the light to the pointer/touch location
        //   this.bitmap.context.clearRect(0, 0, this.game.width, this.game.height);

        //     this.bitmap = this.game.cache.getBitmapData('shadows');
        // Next, fill the entire light bitmap with a dark shadow color.

        this.bitmap.context.fillStyle = 'rgba(190, 170, 190, 0.75)';
        this.bitmap.context.fillRect(0, 0, this.game.world.width, this.game.world.height);



        // An array of the stage corners that we'll use later
        let stageCorners = [
            new Phaser.Point(0, 0),
            new Phaser.Point(this.game.world.width, 0),
            new Phaser.Point(this.game.world.width, this.game.world.height),
            new Phaser.Point(0, this.game.world.height)
        ];

        // Ray casting!
        // Cast rays through the corners of each wall towards the stage edge.
        // Save all of the intersection points or ray end points if there was no intersection.
        let points = [];
        let ray = null;
        let intersect;
        let i;
        this.walls.forEach(function (wall) {
            //
            if (wall.visible && wall.inCamera) {
                // Create a ray from the light through each corner out to the edge of the stage.
                // This array defines points just inside of each corner to make sure we hit each one.
                // It also defines points just outside of each corner so we can see to the stage edges.
                let corners = [
                    new Phaser.Point(wall.x + 0.1, wall.y + 0.1),
                    new Phaser.Point(wall.x - 0.1, wall.y - 0.1),

                    new Phaser.Point(wall.x - 0.1 + wall.width, wall.y + 0.1),
                    new Phaser.Point(wall.x + 0.1 + wall.width, wall.y - 0.1),

                    new Phaser.Point(wall.x - 0.1 + wall.width, wall.y - 0.1 + wall.height),
                    new Phaser.Point(wall.x + 0.1 + wall.width, wall.y + 0.1 + wall.height),

                    new Phaser.Point(wall.x + 0.1, wall.y - 0.1 + wall.height),
                    new Phaser.Point(wall.x - 0.1, wall.y + 0.1 + wall.height)
                ];

                // Calculate rays through each point to the edge of the stage
                for (i = 0; i < corners.length; i++) {
                    let c = corners[i];

                    // Here comes the linear algebra.
                    // The equation for a line is y = slope * x + b
                    // b is where the line crosses the left edge of the stage
                    let slope = (c.y - this.light.y) / (c.x - this.light.x);
                    let b = this.light.y - slope * this.light.x;

                    let end = null;

                    if (c.x === this.light.x) {
                        // Vertical lines are a special case
                        if (c.y <= this.light.y) {
                            end = new Phaser.Point(this.light.x, 0);
                        } else {
                            end = new Phaser.Point(this.light.x, this.game.world.height);
                        }
                    } else if (c.y === this.light.y) {
                        // Horizontal lines are a special case
                        if (c.x <= this.light.x) {
                            end = new Phaser.Point(0, this.light.y);
                        } else {
                            end = new Phaser.Point(this.game.world.width, this.light.y);
                        }
                    } else {
                        // Find the point where the line crosses the stage edge
                        let left = new Phaser.Point(0, b);
                        let right = new Phaser.Point(this.game.world.width, slope * this.game.world.width + b);
                        let top = new Phaser.Point(-b / slope, 0);
                        let bottom = new Phaser.Point((this.game.world.height - b) / slope, this.game.world.height);

                        // Get the actual intersection point
                        if (c.y <= this.light.y && c.x >= this.light.x) {
                            if (top.x >= 0 && top.x <= this.game.world.width) {
                                end = top;
                            } else {
                                end = right;
                            }
                        } else if (c.y <= this.light.y && c.x <= this.light.x) {
                            if (top.x >= 0 && top.x <= this.game.world.width) {
                                end = top;
                            } else {
                                end = left;
                            }
                        } else if (c.y >= this.light.y && c.x >= this.light.x) {
                            if (bottom.x >= 0 && bottom.x <= this.game.world.width) {
                                end = bottom;
                            } else {
                                end = right;
                            }
                        } else if (c.y >= this.light.y && c.x <= this.light.x) {
                            if (bottom.x >= 0 && bottom.x <= this.game.world.width) {
                                end = bottom;
                            } else {
                                end = left;
                            }
                        }
                    }

                    // Create a ray
                    ray = new Phaser.Line(this.light.x, this.light.y, end.x, end.y);

                    // Check if the ray intersected the wall
                    intersect = this.getWallIntersection(ray);
                    if (intersect) {
                        // This is the front edge of the light blocking object
                        points.push(intersect);
                    } else {
                        // Nothing blocked the ray
                        points.push(ray.end);
                    }
                }
            } //
        }, this);

        // Shoot rays at each of the stage corners to see if the corner
        // of the stage is in shadow. This needs to be done so that
        // shadows don't cut the corner.
        for (i = 0; i < stageCorners.length; i++) {
            ray = new Phaser.Line(this.light.x, this.light.y,
                stageCorners[i].x, stageCorners[i].y);
            intersect = this.getWallIntersection(ray);
            if (!intersect) {
                // Corner is in light
                points.push(stageCorners[i]);
            }
        }


        let center = { x: this.light.x, y: this.light.y };
        points = points.sort(function (a, b) {
            if (a.x - center.x >= 0 && b.x - center.x < 0)
                return 1;
            if (a.x - center.x < 0 && b.x - center.x >= 0)
                return -1;
            if (a.x - center.x === 0 && b.x - center.x === 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0)
                    return 1;
                return -1;
            }

            // Compute the cross product of vectors (center -> a) x (center -> b)
            let det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
            if (det < 0)
                return 1;
            if (det > 0)
                return -1;

            // Points a and b are on the same line from the center
            // Check which point is closer to the center
            let d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            let d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return 1;
        });


        this.bitmap.context.beginPath();
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.moveTo(points[0].x, points[0].y);

        for (let j = 0; j < points.length; j++) {
            this.bitmap.context.lineTo(points[j].x, points[j].y + 4);

        }
        this.bitmap.context.closePath();
        this.bitmap.context.fill();

        // This just tells the engine it should update the texture cache
        this.bitmap.dirty = true;
    }

    getWallIntersection(ray) {
        let distanceToWall = this.game.world.width;
        // Number.POSITIVE_INFINITY;
        let closestIntersection = null;

        // For each of the walls...
        this.walls.forEach(function (wall) {
            // Create an array of lines that represent the four edges of each wall
            let lines = [
                new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                new Phaser.Line(wall.x + wall.width, wall.y,
                    wall.x + wall.width, wall.y + wall.height),
                new Phaser.Line(wall.x, wall.y + wall.height,
                    wall.x + wall.width, wall.y + wall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for (let i = 0; i < lines.length; i++) {
                let intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    let distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);

        return closestIntersection;
    }
}