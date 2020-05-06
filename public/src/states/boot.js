SummerCoding.Boot = function (game) {
};

SummerCoding.Boot.prototype = {

    preload: function () {
        this.load.image('preloaderBar', 'assets/images/preload.png');
    },

    create: function () {

        // this.stage.smoothed = false;
        this.input.maxPointers = 1;

        // this.stage.disableVisibilityChange = true;

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 320;
            this.scale.minHeight = 200;
            this.scale.maxWidth = 1100;
            this.scale.maxHeight = 650;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            
            this.stage.disableVisibilityChange = true;

        this.state.start('Preloader');

    },

    gameResized: function (width, height) {
    },
    
};