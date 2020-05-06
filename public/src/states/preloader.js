SummerCoding.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

SummerCoding.Preloader.prototype = {

	preload: function () {

		this.preloadBar = this.add.sprite(350, 290, 'preloaderBar');

		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('first', 'assets/images/1.png');
		this.load.image('second', 'assets/images/2.png');
		this.load.image('third', 'assets/images/3.png');
		this.load.image('other_rank', 'assets/images/4.png');

		this.load.spritesheet('tank', 'assets/images/tank.png', 48, 48, 2);
		this.load.spritesheet('water', 'assets/images/water.png', 48, 48, 2);
		this.load.spritesheet('eat_star', 'assets/images/eat_star.png', 48, 48, 5);
		this.load.spritesheet('explore', 'assets/images/explore.png', 48, 48, 5);
		this.load.spritesheet('heart', 'assets/images/heart.png', 48, 48, 6);

		this.load.image('brick', 'assets/images/brick.png');
		this.load.image('stone', 'assets/images/stone.png');
		this.load.image('grass', 'assets/images/grass.png');

		this.load.image('star', 'assets/images/star.png');
		this.load.image('fuel', 'assets/images/fuel.png');
		this.load.image('gas_station', 'assets/images/gas_station.png');
		this.load.image('heart1', 'assets/images/heart1.png');
		this.load.image('angle', 'assets/images/angle.png');
		
		this.load.image('tank_sym', 'assets/images/tank_sym.png');

		this.load.image('trans', 'assets/images/trans.png');
		this.load.image('summer_coding', 'assets/images/summer_coding.png');

		var game = this;
		// Google WebFont Loader.
		WebFontConfig = {
			active: function () { game.time.events.add(Phaser.Timer.SECOND, game.nextState, game); },
			google: {
				families: ['Press Start 2P']
			}
		};
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	},

	create: function () {
	},

	nextState: function () {
		this.state.start('StartRound');
	},

	update: function () {
	}

};