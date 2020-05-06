SummerCoding.StartRound = function (game) {
    this.loadMapStatus = null;
};

SummerCoding.StartRound.prototype = {

    preload: function () {
    },

    create: function () {
        this.createText();
        sprite = this.add.sprite(SummerCoding.screenWidth / 2, SummerCoding.screenHeight / 2 - 120, 'summer_coding');
        sprite.anchor.setTo(0.5, 0.5);

        tank = this.add.sprite(SummerCoding.screenWidth / 2, SummerCoding.screenHeight / 2, 'tank');
        tank.anchor.setTo(0.5, 0.5);
        tank.angle = 90;
        tank.animations.add('run');
        tank.animations.play('run', 20, true);
    },

    createText: function () {
        //  You can either set the tab size in the style object:
        var style28 = { font: "28px Press Start 2P", fill: "#fff", tabs: [150, 150, 200] };
        var style14 = { font: "14px Press Start 2P", fill: "#fff", tabs: [100, 100, 150] };

        var text = this.add.text(SummerCoding.screenWidth / 2, SummerCoding.screenHeight / 2 + 90, "LOAD MAP", style28);
        text.anchor.setTo(0.5, 0.5);
        text.inputEnabled = true;

        text.events.onInputOver.add(this.over, this);
        text.events.onInputOut.add(this.out, this);
        text.events.onInputUp.add(this.up, this);

        this.loadMapStatus = this.add.text(SummerCoding.screenWidth / 2, SummerCoding.screenHeight / 2 + 50, "", style14);
        this.loadMapStatus.anchor.setTo(0.5, 0.5);
    },

    gameResized: function (width, height) {
    },

    over: function (item) {
        item.scale.setTo(1.2, 1.2);
    },

    out: function (item) {
        item.scale.setTo(1.0, 1.0);
    },

    up: function (item) {
        try {
            SummerCoding.Map = MAP;
            if (MAP) {
                MAP = null;
                SummerCoding.round++;
                this.state.start('Game');
            } else {

                this.loadMapStatus.text = "Loading map failed"
            }
        } catch (err) {
            this.loadMapStatus.text = "Loading map failed"
        }
    }

};