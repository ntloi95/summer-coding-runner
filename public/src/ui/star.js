SummerCoding.UI.Star = function (game, x, y, max, value, colorInput) {
    Phaser.Sprite.call(this, game, x, y, 'star');
    this.anchor.setTo(0.5, 0.5);

    var color = "#000";
    if(colorInput) {
        color = colorInput;
    }
    var style = { font: "18px Press Start 2P", fill: color, tabs: [150, 150, 200] };
    this.text = game.make.text(32, -8, value + "/" + max, style);
    this.addChild(this.text);

    this.max = max;
    this.value = value;

    return this;
}

SummerCoding.UI.Star.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.UI.Star.prototype.constructor = SummerCoding.UI.Star;

SummerCoding.UI.Star.prototype.setValue = function(value) {
    this.value = value;
    this.updateText();
}

SummerCoding.UI.Star.prototype.updateText = function () {
    this.text.text = this.value + "/" + this.max;
}