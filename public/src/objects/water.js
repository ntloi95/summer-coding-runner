SummerCoding.Water = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'water');
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('run');
    this.animations.play('run', 8, true);
    return this;
}

SummerCoding.Water.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Water.prototype.constructor = SummerCoding.Water;

SummerCoding.Water.prototype.getType = function () {
    return SummerCoding.GameObjects.WATER;
}
