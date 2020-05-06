SummerCoding.Brick = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'brick');
    this.anchor.setTo(0.5, 0.5);
    return this;
}

SummerCoding.Brick.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Brick.prototype.constructor = SummerCoding.Brick;

SummerCoding.Brick.prototype.getType = function () {
    return SummerCoding.GameObjects.BRICK;
}
