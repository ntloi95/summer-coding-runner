SummerCoding.Tank = function (game, path, map, drawMap, mapCol, mapRow, maxFuel) {
    Phaser.Sprite.call(this, game,
        (path[0].j - 1 + 0.5) * SummerCoding.TILE_SIZE,
        (path[0].i - 1 + 0.5) * SummerCoding.TILE_SIZE + 50, 'tank');

    this.animations.add('run');
    this.animations.play('run', 20, true);
    this.anchor.setTo(0.5, 0.5);

    this.path = path;
    this.map = map;
    this.drawMap = drawMap;
    this.mapCol = mapCol;
    this.mapRow = mapRow;

    this.star = 0;
    this.fuel = maxFuel;
    this.fuelUsed = 0;

    this.maxFuel = maxFuel;

    this.pathIndex = 0;
    this.v = { x: 0, y: 0 };
    this.shadow = game.add.graphics(0, 0);

    this.state = SummerCoding.TANK_STATES.RUN;

    return this;
}

SummerCoding.Tank.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Tank.prototype.constructor = SummerCoding.Tank;

SummerCoding.Tank.prototype.getType = function () {
    return SummerCoding.GameObjects.TANK;
}

SummerCoding.Tank.prototype.update = function () {
    Phaser.Sprite.prototype.update.call(this);

    this.updateTank();
}

SummerCoding.Tank.prototype.updateTank = function (vInput) {
    if (this.state == SummerCoding.TANK_STATES.RUN) {
        var currIndex = {
            j: Math.floor((this.x / SummerCoding.TILE_SIZE) - 0.5) + 1,
            i: Math.floor(((this.y - 50) / SummerCoding.TILE_SIZE) - 0.5) + 1,
        }

        if (this.v.x < 0) {
            currIndex.j = Math.ceil((this.x / SummerCoding.TILE_SIZE) - 0.5) + 1;
        }

        if (this.v.y < 0) {
            currIndex.i = Math.ceil(((this.y - 50) / SummerCoding.TILE_SIZE) - 0.5) + 1;
        }

        var nextIndex = this.path[this.pathIndex + 1];

        var currObject = this.map[currIndex.i - 1][currIndex.j - 1];
        if (currObject != undefined) {
            if (currObject == SummerCoding.GameObjects.STAR) {
                this.map[currIndex.i - 1][currIndex.j - 1] = SummerCoding.GameObjects.STREET;
                this.drawMap[currIndex.i - 1][currIndex.j - 1] = SummerCoding.GameObjects.STREET;
                this.star++;
            } else if (currObject == SummerCoding.GameObjects.FUEL) {
                this.fuel = this.maxFuel;
            } else if (currObject == SummerCoding.GameObjects.STREET) {

            } else {
                this.state = SummerCoding.TANK_STATES.INVALID_LOCATION;
            }
        } else {
            this.state = SummerCoding.TANK_STATES.OUT_OF_MAP;
        }

        if (nextIndex) {
            if (nextIndex.i == currIndex.i && nextIndex.j == currIndex.j) {
                currIndex = nextIndex;
                this.pathIndex++;
                nextIndex = this.path[this.pathIndex + 1];

                var cIndex = this.path[this.pathIndex];
                var pIndex = this.path[this.pathIndex - 1];

                var currObject = this.map[currIndex.i - 1][currIndex.j - 1];
                if (currObject == SummerCoding.GameObjects.FUEL) {
                    this.fuel = this.maxFuel;
                } else {
                    this.fuel--;
                }
                this.fuelUsed++;
                if (this.fuel == 0) {
                    this.state = SummerCoding.TANK_STATES.EMPTY_FUEL;
                }
                if (!nextIndex) {
                    this.state = SummerCoding.TANK_STATES.END;
                } else if (pIndex.i == cIndex.i && pIndex.j == cIndex.j) {
                    this.state = SummerCoding.TANK_STATES.STOP;
                }
            } else {
                if (!this.isInvalidPath(nextIndex, currIndex)) {
                    this.state = SummerCoding.TANK_STATES.INVALID_PATH;
                }
            }
        } else {
            this.state = SummerCoding.TANK_STATES.END;
        }

        if (this.state == SummerCoding.TANK_STATES.RUN) {
            var deltaI = nextIndex.i - currIndex.i;
            var deltaJ = nextIndex.j - currIndex.j;

            this.angle = this.getAngle(deltaI, deltaJ);
            var veclocity_index = parseInt(this.fuelUsed / 50);
            if (veclocity_index >= SummerCoding.TANK_VECLOVITYS.length) {
                veclocity_index = SummerCoding.TANK_VECLOVITYS.length - 1;
            }
            var veclocity = SummerCoding.TANK_VECLOVITYS[veclocity_index];
            if(vInput) {
                veclocity = vInput;
            }
            this.v = { x: veclocity * deltaJ, y: veclocity * deltaI }

            this.x += this.v.x;
            this.y += this.v.y;

            this.shadow.x = this.x + 150;
            this.shadow.y = this.y - 25;
        } else {
            this.animations.stop('run');
        }
    }
}

SummerCoding.Tank.prototype.reset = function (path, map, drawMap) {
    this.pathIndex = 0;
    this.star = 0;
    this.fuel = this.maxFuel;
    this.fuelUsed = 0;
    this.v = { x: 0, y: 0 };
    this.path = path;
    this.map = map;
    this.drawMap = drawMap;

    this.state = SummerCoding.TANK_STATES.RUN;

    this.x = (this.path[0].j - 1 + 0.5) * SummerCoding.TILE_SIZE;
    this.y = (this.path[0].i - 1 + 0.5) * SummerCoding.TILE_SIZE + 50;

    this.animations.play('run', 20, true);
}

SummerCoding.Tank.prototype.setIndex = function (i, j) {
    this.x = (j - 1 + 0.5) * SummerCoding.TILE_SIZE;
    this.y = (i - 1 + 0.5) * SummerCoding.TILE_SIZE + 50;
}

SummerCoding.Tank.prototype.getAngle = function (deltaI, deltaJ) {
    if (deltaI == 0 && deltaJ > 0) {
        return -180;
    } else if (deltaI > 0 && deltaJ == 0) {
        return -90;
    } else if (deltaI == 0 && deltaJ < 0) {
        return 0;
    } else if (deltaI < 0 && deltaJ == 0) {
        return 90;
    }
}

SummerCoding.Tank.prototype.isInvalidPath = function (currIndex, prevIndex) {
    var deltaI = currIndex.i - prevIndex.i;
    var deltaJ = currIndex.j - prevIndex.j;

    if (Math.abs(deltaI) > 1 || Math.abs(deltaJ) > 1 || (deltaI != 0 && deltaJ != 0) || (deltaI == 0 && deltaJ == 0)) {
        return false;
    } else {
        return true;
    }
}

SummerCoding.Tank.prototype.setToCenterPos = function (currIndex, prevIndex) {
    var pos = this.path[this.pathIndex];

    this.x = (pos.j - 1 + 0.5) * SummerCoding.TILE_SIZE;
    this.y = (pos.i - 1 + 0.5) * SummerCoding.TILE_SIZE + 50;
    this.shadow.x = this.x + 150;
    this.shadow.y = this.y - 25;
}


