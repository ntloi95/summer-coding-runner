SummerCoding.Grass = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'grass');
    this.anchor.setTo(0.5, 0.5);
    return this;
}

SummerCoding.Grass.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Grass.prototype.constructor = SummerCoding.Grass;

SummerCoding.Grass.prototype.getType = function () {
    return SummerCoding.GameObjects.GRASS;
}
