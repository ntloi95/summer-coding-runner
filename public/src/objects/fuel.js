SummerCoding.Fuel = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'tank_sym');
    this.anchor.setTo(0.5, 0.5);
    return this;
}

SummerCoding.Fuel.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.Fuel.prototype.constructor = SummerCoding.Fuel;

SummerCoding.Fuel.prototype.getType = function () {
    return SummerCoding.GameObjects.FUEL;
}
