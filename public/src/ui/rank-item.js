SummerCoding.UI.RankItem = function (game, x, y, name, rank, fuel, star, id) {
    Phaser.Sprite.call(this, game, x, y, 'trans');
    this.anchor.setTo(0.5, 0.5);

    var style = { font: "12px Press Start 2P", fill: "#000", tabs: [150, 150, 200] };
    var style18 = { font: "22px Press Start 2P", fill: "#000", tabs: [150, 150, 200] };
    this.id = id;
    this.name = game.make.text(28, 0, name, style);
    this.rank = game.make.text(0, -9, rank, style18);

    this.fuel = game.make.text(52, 56, fuel, style);
    this.star = game.make.text(52, 28, star, style);



    style = { font: "12px Press Start 2P", fill: "#fff", tabs: [150, 150, 200] };
    style18 = { font: "22px Press Start 2P", fill: "#fff", tabs: [150, 150, 200] };
    this.nameCurrent = game.make.text(28, 0, name, style);
    this.rankCurrent = game.make.text(0, -9, rank, style18);

    this.fuelCurrent = game.make.text(52, 56, fuel, style);
    this.starCurrent = game.make.text(52, 28, star, style);

    this.rankSprites = {};
    this.rankSprites[1] = game.make.sprite(250, -14, 'first');
    this.rankSprites[2] = game.make.sprite(250, -14, 'second');
    this.rankSprites[3] = game.make.sprite(250, -14, 'third');
    this.rankSprites[0] = game.make.sprite(250, -14, 'other_rank');

    for (var key in this.rankSprites) {
        this.addChild(this.rankSprites[key]);
    }

    this.starSprite = game.make.sprite(20, 22, 'star');
    this.starSprite.scale.setTo(0.5, 0.5);
    this.addChild(this.starSprite);

    this.fuelSprite = game.make.sprite(20, 50, 'tank_sym');
    this.fuelSprite.scale.setTo(0.5, 0.5);
    this.addChild(this.fuelSprite);

    this.setRank(rank);

    this.starValue = star;
    this.fuelValue = fuel;
    this.nameValue = name;

    this.name.visible = false;
    this.rank.visible = false;
    this.fuel.visible = false;
    this.star.visible = false;
    this.isCurrent = false;

    this.addChild(this.name);
    this.addChild(this.rank);
    this.addChild(this.fuel);
    this.addChild(this.star);

    this.addChild(this.nameCurrent);
    this.addChild(this.rankCurrent);
    this.addChild(this.fuelCurrent);
    this.addChild(this.starCurrent);

    return this;
}

SummerCoding.UI.RankItem.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.UI.RankItem.prototype.constructor = SummerCoding.UI.RankItem;

SummerCoding.UI.RankItem.prototype.setRank = function (rank) {
    if(parseInt(this.rank.text) > rank && this.isCurrent) {
        var tween = this.game.add.tween(this).to( { alpha: 0 }, 350, "Linear", true);
        tween.repeat(5, 60);
        tween.onComplete.add(function(){this.alpha = 1}, this);
    }
    this.rank.text = rank + "";
    this.rankCurrent.text = rank + "";

    for (var key in this.rankSprites) {
        this.rankSprites[key].visible = false;
    }
    var rankSprite = this.rankSprites[rank];
    if (!rankSprite) {
        rankSprite = this.rankSprites[0];
    }
    rankSprite.visible = true;
}

SummerCoding.UI.RankItem.prototype.setStar = function (value) {
    this.star.text = value + "";
    this.starCurrent.text = value + "";

    this.starValue = value;

}

SummerCoding.UI.RankItem.prototype.setFuel = function (value) {
    this.fuel.text = value + "";
    this.fuelCurrent.text = value + "";
    this.fuelValue = value;
}

SummerCoding.UI.RankItem.prototype.setCurrent = function (value) {
    this.isCurrent = value;

    this.name.visible = false;
    this.rank.visible = false;
    this.fuel.visible = false;
    this.star.visible = false;

    this.nameCurrent.visible = false;
    this.rankCurrent.visible = false;
    this.fuelCurrent.visible = false;
    this.starCurrent.visible = false;

    if (value) {
        this.nameCurrent.visible = true;
        this.rankCurrent.visible = true;
        this.fuelCurrent.visible = true;
        this.starCurrent.visible = true;
    } else {
        this.name.visible = true;
        this.rank.visible = true;
        this.fuel.visible = true;
        this.star.visible = true;
    }
}