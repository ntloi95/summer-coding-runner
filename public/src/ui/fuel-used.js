SummerCoding.UI.FuelUsed = function (game, x, y, colorInput) {
    Phaser.Sprite.call(this, game, x, y, 'tank_sym');
    this.anchor.setTo(0.5, 0.5);

    var color = "#000";
    if(colorInput) {
        color = colorInput;
    }
    var style = { font: "18px Press Start 2P", fill: color, tabs: [150, 150, 200] };
    this.text = game.make.text(32, -8, 0, style);
    this.addChild(this.text);

    this.value = 0;

    return this;
}

SummerCoding.UI.FuelUsed.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.UI.FuelUsed.prototype.constructor = SummerCoding.UI.FuelUsed;

SummerCoding.UI.FuelUsed.prototype.setValue = function(value) {
    this.value = value;
    this.updateText();
}

SummerCoding.UI.FuelUsed.prototype.updateText = function () {
    this.text.text = this.value;
}