SummerCoding.Game = function (game) {
    this.objectCache = {};

    this.map = [];
    this.drawMap = [];
    this.drawMapBk = [];
    this.mapCol;
    this.mapRow;

    this.path = [];

    this.infoUIGroup = null;
    this.rankGroup = null;
    this.mainGroup = null;
    this.mapGroup = null;
    this.tankGroup = null;
    this.overMapGroup = null;
    this.hideUIGroup = null;

    this.rankList = null;

    this.dialogGroup = null;
    this.dialogMessage = null;

    this.destroyGroup = null;

    this.endRoundBtn = null;
    this.nextTeamBtn = null;
    this.loadPathBtn = null;
    this.startBtn = null;

    this.tank = null;

    this.uiStar = null;
    this.uiFuel = null;
    this.uiFuelUsed = null;

    this.maxFuel = 50;
    this.maxStar = 50;

    this.startIndex = {};
    this.playState = SummerCoding.PLAY_STATES.STOP;

    this.isVavlidate = false;
    this.countDown = 5;
};

SummerCoding.Game.prototype = {

    preload: function () {
        // Load map.
        this.preloadMap();
    },

    preloadMap: function () {
        this.mapCol = SummerCoding.Map.mapSize.col;
        this.mapRow = SummerCoding.Map.mapSize.row;
        this.map = JSON.parse(JSON.stringify(SummerCoding.Map.map));
        this.createDrawMap();

        this.startIndex = SummerCoding.Map.startIndex;
        this.maxFuel = SummerCoding.Map.fuelSize;

        this.path = [];
        this.playState = SummerCoding.PLAY_STATES.STOP;

        this.maxStar = 0;
        for (var i = 0; i < this.mapRow; i++) {
            for (var j = 0; j < this.mapCol; j++) {
                if (this.map[i][j] == SummerCoding.GameObjects.STAR)
                    this.maxStar++;
            }
        }

    },

    createDrawMap: function () {
        this.drawMap = JSON.parse(JSON.stringify(SummerCoding.Map.map));
        for (var i = 0; i < this.mapRow; i++) {
            for (var j = 0; j < this.mapCol; j++) {
                if (this.drawMap[i][j] == SummerCoding.GameObjects.STREET) {
                    if (Math.random() < 0.15) {
                        this.drawMap[i][j] = SummerCoding.GameObjects.GRASS;
                    }
                } else if (i > 1 && j > 1 && i < this.mapRow - 2 && j < this.mapCol - 2 && this.drawMap[i][j] == SummerCoding.GameObjects.BRICK) {
                    var count = 0;
                    var countStone = 0;
                    for (var l = -1; l < 2; l++) {
                        for (var k = -1; k < 2; k++) {
                            if (this.drawMap[i + l][j + k] == SummerCoding.GameObjects.STREET || this.drawMap[i + l][j + k] == SummerCoding.GameObjects.GRASS) {
                                count++;
                            }
                            if (this.drawMap[i + l][j + k] == SummerCoding.GameObjects.STONE) {
                                countStone++
                            }
                        }
                    }
                    var rate = 0.2;
                    if (countStone > 0)
                        rate = 0.8;

                    if (Math.random() < rate && count > 4) {
                        this.drawMap[i][j] = SummerCoding.GameObjects.STONE;
                    }
                }
            }
        }

        for (var i = 0; i < this.mapRow; i++) {
            for (var j = 0; j < this.mapCol; j++) {
                if (i > 1 && j > 1 && i < this.mapRow - 2 && j < this.mapCol - 2 &&
                    (this.drawMap[i][j] == SummerCoding.GameObjects.STONE || this.drawMap[i][j] == SummerCoding.GameObjects.BRICK)) {
                    var count = 0;
                    for (var l = -1; l < 2; l++) {
                        for (var k = -1; k < 2; k++) {
                            if (this.drawMap[i + l][j + k] == SummerCoding.GameObjects.WATER) {
                                count++;
                            }
                        }
                    }

                    var rate = Math.random();
                    if (count) {
                        rate = 0.0;
                    }

                    if (rate < 0.005) {
                        this.drawMap[i][j] = SummerCoding.GameObjects.WATER;
                    }
                }
            }
        }
        this.drawMapBk = JSON.stringify(this.drawMap);
    },

    create: function () {

        this.createMap();
        this.createInfoUI();
        this.createRankUI();
        this.createHideUI();
        this.createTank();
        this.createDialogs();

        this.destroyGroup = this.add.group();
        this.destroyGroup.visible = false;

        cursors = this.input.keyboard.createCursorKeys();
        oneKey = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
        oneKey.onDown.add(function () {
            this.isVavlidate = !this.isVavlidate;
            this.countDown = 5;
        }, this);

        zeroKey = this.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        zeroKey.onDown.add(function () {
            if (this.scale.isFullScreen) {
                this.scale.stopFullScreen();
            }
            else {
                this.scale.startFullScreen(false);
            }
        }, this);

        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    },

    createMap: function () {
        //  Modify the world and camera bounds
        this.world.resize(this.mapCol * SummerCoding.TILE_SIZE + 300, this.mapRow * SummerCoding.TILE_SIZE + 50);

        this.mapGroup = this.add.group();
        this.tankGroup = this.add.group();
        this.overMapGroup = this.add.group();
        this.overOverMapGroup = this.add.group();
        this.mainGroup = this.add.group();
        this.mainGroup.add(this.mapGroup);
        this.mainGroup.add(this.tankGroup);
        this.mainGroup.add(this.overMapGroup);
        this.mainGroup.add(this.overOverMapGroup);

        // Create cache objects.
        this.objectCache[SummerCoding.GameObjects.BRICK] = this.add.group();
        this.objectCache[SummerCoding.GameObjects.BRICK].visible = false;
        for (var i = 0; i < SummerCoding.CACHE_SIZE; i++) {
            var brick = new SummerCoding.Brick(this.game, 0, 0);
            this.objectCache[SummerCoding.GameObjects.BRICK].add(brick);
        }

        this.objectCache[SummerCoding.GameObjects.STONE] = this.add.group();
        this.objectCache[SummerCoding.GameObjects.STONE].visible = false;
        for (var i = 0; i < SummerCoding.CACHE_SIZE; i++) {
            var stone = new SummerCoding.Stone(this.game, 0, 0);
            this.objectCache[SummerCoding.GameObjects.STONE].add(stone);
        }

        this.objectCache[SummerCoding.GameObjects.GRASS] = this.add.group();
        this.objectCache[SummerCoding.GameObjects.GRASS].visible = false;
        for (var i = 0; i < SummerCoding.CACHE_SIZE; i++) {
            var grass = new SummerCoding.Grass(this.game, 0, 0);
            this.objectCache[SummerCoding.GameObjects.GRASS].add(grass);
        }

        this.objectCache[SummerCoding.GameObjects.WATER] = this.add.group();
        this.objectCache[SummerCoding.GameObjects.WATER].visible = false;
        for (var i = 0; i < SummerCoding.CACHE_SIZE; i++) {
            var water = new SummerCoding.Water(this.game, 0, 0);
            this.objectCache[SummerCoding.GameObjects.WATER].add(water);
        }

        this.objectCache[SummerCoding.GameObjects.STAR] = this.add.group();
        this.objectCache[SummerCoding.GameObjects.STAR].visible = false;
        for (var i = 0; i < SummerCoding.CACHE_SIZE; i++) {
            var star = new SummerCoding.Star(this.game, 0, 0);
            this.objectCache[SummerCoding.GameObjects.STAR].add(star);
        }

        this.objectCache[SummerCoding.GameObjects.FUEL] = this.add.group();
        this.objectCache[SummerCoding.GameObjects.FUEL].visible = false;
        for (var i = 0; i < SummerCoding.CACHE_SIZE; i++) {
            var fuel = new SummerCoding.Fuel(this.game, 0, 0);
            this.objectCache[SummerCoding.GameObjects.FUEL].add(fuel);
        }
    },

    createInfoUI: function () {
        this.infoUIGroup = this.add.group();

        infoBg = this.add.graphics(0, 0, this.infoUIGroup);
        infoBg.beginFill(0x747474);
        infoBg.drawRect(0, 0, 1100, 50);
        infoBg.endFill();

        var mask = this.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 1100, 50);
        this.infoUIGroup.mask = mask;

        this.infoUIGroup.fixedToCamera = true;
        this.infoUIGroup.mask.fixedToCamera = true;

        this.uiStar = new SummerCoding.UI.Star(this.game, 50, 25, this.maxStar, 0);
        this.infoUIGroup.add(this.uiStar);

        this.uiFuel = new SummerCoding.UI.Fuel(this.game, 350, 25, this.maxFuel, this.maxFuel);
        this.infoUIGroup.add(this.uiFuel);

        this.uiFuelUsed = new SummerCoding.UI.FuelUsed(this.game, 650, 25);
        this.infoUIGroup.add(this.uiFuelUsed);
    },

    createHideUI: function () {
        this.hideUIGroup = this.add.group();

        uiBg = this.add.graphics(0, 50, this.hideUIGroup);
        uiBg.beginFill(0x000000);
        uiBg.drawRect(0, 0, 800, 600);
        uiBg.endFill();

        this.hideUIGroup.fixedToCamera = true;
        this.hideUIGroup.visible = false;

        this.uiStarHide = new SummerCoding.UI.Star(this.game, 50, 100, this.maxStar, 0, "#fff");
        this.hideUIGroup.add(this.uiStarHide);

        this.uiFuelHide = new SummerCoding.UI.Fuel(this.game, 350, 100, this.maxFuel, this.maxFuel, "#fff");
        this.hideUIGroup.add(this.uiFuelHide);

        this.uiFuelUsedHide = new SummerCoding.UI.FuelUsed(this.game, 650, 100, "#fff");
        this.hideUIGroup.add(this.uiFuelUsedHide);
    },

    createDialogs: function () {
        this.dialogGroup = this.add.group();

        overBg = this.add.graphics(0, 0, this.dialogGroup);
        overBg.beginFill(0x000000, 0.5);
        overBg.drawRect(0, 50, 800, 400);
        overBg.endFill();

        infoBg = this.add.graphics(0, 0, this.dialogGroup);
        infoBg.beginFill(0x000000);
        infoBg.drawRect(0, 450, 800, 200);
        infoBg.endFill();

        this.dialogGroup.fixedToCamera = true;

        var style18 = { font: "18px Press Start 2P", fill: "#fff", tabs: [150, 150, 200] };
        var style14 = { font: "14px Press Start 2P", fill: "#fff", tabs: [100, 100, 150] };


        this.loadPathBtn = this.make.text(670, 570, "LOAD PATH", style18);
        this.loadPathBtn.inputEnabled = true;
        this.loadPathBtn.anchor.setTo(0.5, 0.5);
        this.loadPathBtn.events.onInputOver.add(this.over, this);
        this.loadPathBtn.events.onInputOut.add(this.out, this);
        this.loadPathBtn.events.onInputUp.add(this.loadPathBtnUp, this);
        this.loadPathBtn.visible = true;

        this.nextTeamBtn = this.make.text(670, 570, "NEXT TEAM", style18);
        this.nextTeamBtn.inputEnabled = true;
        this.nextTeamBtn.anchor.setTo(0.5, 0.5);
        this.nextTeamBtn.events.onInputOver.add(this.over, this);
        this.nextTeamBtn.events.onInputOut.add(this.out, this);
        this.nextTeamBtn.events.onInputUp.add(this.nextTeamBtnUp, this);
        this.nextTeamBtn.visible = false;

        this.startBtn = this.make.text(670, 570, "START", style18);
        this.startBtn.inputEnabled = true;
        this.startBtn.anchor.setTo(0.5, 0.5);
        this.startBtn.events.onInputOver.add(this.over, this);
        this.startBtn.events.onInputOut.add(this.out, this);
        this.startBtn.events.onInputUp.add(this.startBtnUp, this);
        this.startBtn.visible = false;

        this.endRoundBtn = this.make.text(450, 570, "END ROUND", style18);
        this.endRoundBtn.inputEnabled = true;
        this.endRoundBtn.anchor.setTo(0.5, 0.5);
        this.endRoundBtn.events.onInputOver.add(this.over, this);
        this.endRoundBtn.events.onInputOut.add(this.out, this);
        this.endRoundBtn.events.onInputUp.add(this.endRoundBtnUp, this);
        this.endRoundBtn.visible = false;

        this.dialogMessage = this.make.text(20, 470, "", style14);

        this.dialogGroup.add(this.dialogMessage);
        this.dialogGroup.add(this.loadPathBtn);
        this.dialogGroup.add(this.nextTeamBtn);
        this.dialogGroup.add(this.startBtn);
        this.dialogGroup.add(this.endRoundBtn);
    },

    createRankUI: function () {
        this.rankGroup = this.add.group();

        rankBg = this.add.graphics(800, 0, this.rankGroup);
        rankBg.beginFill(0x747474);
        rankBg.drawRect(0, 0, 300, 650);
        rankBg.endFill();

        var mask = this.add.graphics(800, 50);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 300, 600);
        this.rankGroup.mask = mask;

        this.rankGroup.fixedToCamera = true;
        this.rankGroup.mask.fixedToCamera = true;

        this.rankList = new SummerCoding.UI.RankList(this.game, 810, 100);
        this.rankGroup.add(this.rankList);

        style = { font: "24px Press Start 2P", fill: "#000", tabs: [150, 150, 200] };
        rankTitle = this.make.text(900, 20, "Rank", style);
        this.infoUIGroup.add(rankTitle);
    },

    createTank: function () {
        if (this.path.length == 0) {
            this.path.push(this.startIndex);
        } else if (this.path[0].i != this.startIndex.i || this.path[0].j != this.startIndex.j) {
            this.path.unshift(this.startIndex);
        }

        this.tank = new SummerCoding.Tank(this.game, this.path, this.map, this.drawMap, this.mapCol, this.mapRow, this.maxFuel);
        this.camera.follow(this.tank.shadow);
        this.tankGroup.add(this.tank);
    },

    createText: function () {
        //  You can either set the tab size in the style object:
        var style = { font: "14px Press Start 2P", fill: "#fff", tabs: [150, 150, 200] };

        this.add.text(32, 64, "Armor\tSpells\tDamage\tWeapons", style);
        this.add.text(32, 180, "100\tFire\t+50\tAxe\n67\tIce\t+23\tStaff", style);
    },

    update: function () {
        this.updateMap();
        this.updateUI();
        this.updateHideUI();

        if (this.isVavlidate) {
            this.tank.setToCenterPos();
            for (var i = 0; i < 1000; i++) {
                this.tank.updateTank();
                if (this.tank.state != SummerCoding.TANK_STATES.RUN) {
                    this.playState = SummerCoding.PLAY_STATES.STOP;
                    this.dialogGroup.visible = true;
                    this.isVavlidate = false;
                    break;
                }
                if (this.tank.pathIndex > this.tank.path.length - 100) {
                    this.isVavlidate = false;
                    break;
                }
            }
            if (this.tank.state == SummerCoding.TANK_STATES.INVALID_PATH) {
                this.playState = SummerCoding.PLAY_STATES.STOP;
            } else if (this.tank.state == SummerCoding.TANK_STATES.INVALID_LOCATION) {
                this.dialogMessage.text = "Break wall.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.EMPTY_FUEL) {
                this.dialogMessage.text = "Fuel empty.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.END) {
                this.dialogMessage.text = "End path.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.INVALID_PATH) {
                this.dialogMessage.text = "Invalid step.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.OUT_OF_MAP) {
                this.dialogMessage.text = "Tank run out of map.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.STOP) {
                this.dialogMessage.text = "Tank stop at position.";
            }

            while (this.destroyGroup.getAt(0) != -1) {
                var item = this.destroyGroup.getAt(0);
                this.destroyGroup.remove(item);
                item.destroy();
            }
            return;
        }
        if (cursors.up.isDown) {
            this.rankList.y -= 10;
        }
        else if (cursors.down.isDown) {
            this.rankList.y += 10;
        }

        if (this.playState != SummerCoding.PLAY_STATES.STOP) {
            // if (cursors.left.isDown) {
            //     this.rankList.x -= 30;
            // }
            // else if (cursors.right.isDown) {
            //     this.rankList.x += 30;
            // }

            if (this.tank.state != SummerCoding.TANK_STATES.RUN) {
                this.playState = SummerCoding.PLAY_STATES.STOP;
                this.dialogGroup.visible = true;
            }

            if (this.tank.state == SummerCoding.TANK_STATES.INVALID_PATH) {
                this.playState = SummerCoding.PLAY_STATES.STOP;
            } else if (this.tank.state == SummerCoding.TANK_STATES.INVALID_LOCATION) {
                this.dialogMessage.text = "Break wall.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.EMPTY_FUEL) {
                this.dialogMessage.text = "Fuel empty.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.END) {
                this.dialogMessage.text = "End path.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.INVALID_PATH) {
                this.dialogMessage.text = "Invalid step.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.OUT_OF_MAP) {
                this.dialogMessage.text = "Tank run out of map.";
            } else if (this.tank.state == SummerCoding.TANK_STATES.STOP) {
                this.dialogMessage.text = "Tank stop at position.";
            }

            while (this.destroyGroup.getAt(0) != -1) {
                var item = this.destroyGroup.getAt(0);
                this.destroyGroup.remove(item);
                item.destroy();
            }
        }
    },

    updateHideUI: function () {
        this.uiStarHide.setValue(this.tank.star);
        this.uiFuelHide.setValue(this.tank.fuel);
        this.uiFuelUsedHide.setValue(this.tank.fuelUsed);

        this.rankList.updateCurrent(this.tank);
    },

    updateUI: function () {
        if (this.uiStar.value != this.tank.star && this.playState != SummerCoding.PLAY_STATES.STOP) {
            this.createEatStar(this.tank.path[this.tank.pathIndex], this.tank.fuelUsed);
        }
        this.uiStar.setValue(this.tank.star);
        this.uiFuel.setValue(this.tank.fuel);
        this.uiFuelUsed.setValue(this.tank.fuelUsed);

        this.rankList.updateCurrent(this.tank);
    },

    updateMap: function () {
        var xViewport = this.camera.x;
        var yViewport = this.camera.y;

        var iIndex = parseInt(yViewport / SummerCoding.TILE_SIZE);
        var jIndex = parseInt(xViewport / SummerCoding.TILE_SIZE);

        var iNum = parseInt(SummerCoding.VIEWPORT_WIDTH / SummerCoding.TILE_SIZE + iIndex + 10);
        var jNum = parseInt(SummerCoding.VIEWPORT_HEIGHT / SummerCoding.TILE_SIZE + jIndex + 10);

        if (iNum > this.mapRow) {
            iNum = this.mapRow;
            if (iNum < 0) {
                iNum = this.mapRow;
            }
        } else if (iNum < 0) {
            iNum = 0;
        }

        if (jNum > this.mapCol) {
            jNum = this.mapCol;
            if (jNum < 0) {
                jNum = this.mapCol;
            }
        } else if (jNum < 0) {
            jNum = 0;
        }

        // Clear map.
        while (this.mapGroup.getAt(0) != -1) {
            var item = this.mapGroup.getAt(0);
            this.objectCache[item.getType()].add(item);
        }

        while (this.overMapGroup.getAt(0) != -1) {
            var item = this.overMapGroup.getAt(0);
            this.objectCache[item.getType()].add(item);
        }

        // Build map.
        for (var i = iIndex; i < iNum; i++) {
            for (var j = jIndex; j < jNum; j++) {
                var objectId = this.drawMap[i][j];
                if (objectId != SummerCoding.GameObjects.STREET && objectId != SummerCoding.GameObjects.GRASS) {

                    var item = this.objectCache[objectId].getAt(0);
                    item.x = (j + 0.5) * SummerCoding.TILE_SIZE;
                    item.y = (i + 0.5) * SummerCoding.TILE_SIZE + 50;

                    this.mapGroup.add(item);
                }
            }
        }

        for (var i = iIndex; i < iNum; i++) {
            for (var j = jIndex; j < jNum; j++) {
                var objectId = this.drawMap[i][j];
                if (objectId == SummerCoding.GameObjects.GRASS) {

                    var item = this.objectCache[objectId].getAt(0);
                    item.x = (j + 0.5) * SummerCoding.TILE_SIZE;
                    item.y = (i + 0.5) * SummerCoding.TILE_SIZE + 50;

                    this.overMapGroup.add(item);
                }
            }
        }
    },

    render: function () {
        this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    },

    over: function (item) {
        item.scale.setTo(1.1, 1.1);
    },

    out: function (item) {
        item.scale.setTo(1.0, 1.0);
    },

    loadPathBtnUp: function (item) {
        var resultObject = PATH;
        if (!PATH) {
            this.dialogMessage.text = "Load path failed!"
            return;
        }
        
        PATH = null;

        this.path = resultObject.path;
        if (this.path.length == 0) {
            this.path.push(this.startIndex);
        } else if (this.path[0].i != this.startIndex.i || this.path[0].j != this.startIndex.j) {
            this.path.unshift(this.startIndex);
        }

        this.rankList.addItem(resultObject.teamInfo.name, 0);
        this.loadPathBtn.visible = false;
        this.dialogMessage.text = "Load path successful! Total step: " + resultObject.path.length;
        this.startBtn.visible = true;
    },

    nextTeamBtnUp: function (item) {
        this.loadPathBtn.visible = true;

        this.nextTeamBtn.visible = false;
        this.endRoundBtn.visible = false;

        this.map = JSON.parse(JSON.stringify(SummerCoding.Map.map));
        this.drawMap = JSON.parse(this.drawMapBk);
        this.tank.setIndex(this.startIndex.i, this.startIndex.j);

        this.tank.star = 0;
        this.tank.fuel = this.tank.maxFuel;
        this.tank.fuelUsed = 0;
        this.tank.v = { x: 0, y: 0 };
        this.rankList.unfocus();
    },

    endRoundBtnUp: function (item) {
        this.state.start('StartRound');
    },

    startBtnUp: function (item) {
        this.dialogGroup.visible = false;

        this.startBtn.visible = false;
        this.nextTeamBtn.visible = true;
        this.endRoundBtn.visible = true;

        this.tank.reset(this.path, this.map, this.drawMap);
        this.playState = SummerCoding.PLAY_STATES.PLAY;
    },

    createEatStar: function (index, fuelUsed) {
        var self = this
        sprite = this.make.sprite((index.j - 1 + 0.5) * SummerCoding.TILE_SIZE,
            (index.i - 1 + 0.5) * SummerCoding.TILE_SIZE + 50, 'eat_star');
        sprite.anchor.setTo(0.5, 0.5);
        var anim = sprite.animations.add('flap');
        anim.killOnComplete = true;
        anim.onComplete.add(function () {
            self.destroyGroup.add(this);
        }, sprite);
        this.overOverMapGroup.add(sprite);
        anim.play(12);
    },

};