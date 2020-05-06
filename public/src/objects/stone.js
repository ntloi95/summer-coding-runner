SummerCoding.Stone = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'stone');
    this.anchor.setTo(0.5, 0.5);
    return this;
}

SummerCoding.Stone.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Stone.prototype.constructor = SummerCoding.Stone;

SummerCoding.Stone.prototype.getType = function () {
    return SummerCoding.GameObjects.STONE;
}
