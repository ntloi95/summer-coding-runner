SummerCoding.Star = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'star');
    this.anchor.setTo(0.5, 0.5);

    // this.animations.add('run');
    // this.animations.play('run', 8, true);
    return this;
}

SummerCoding.Star.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Star.prototype.constructor = SummerCoding.Star;

SummerCoding.Star.prototype.getType = function () {
    return SummerCoding.GameObjects.STAR;
}
