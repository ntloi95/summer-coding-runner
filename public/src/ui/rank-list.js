var sort_by;
(function() {
    // utility functions
    var default_cmp = function(a, b) {
        if (a == b) return 0;
        return a < b ? -1 : 1;
    },
        getCmpFunc = function(primer, reverse) {
            var cmp = default_cmp;
            if (primer) {
                cmp = function(a, b) {
                    return default_cmp(primer(a), primer(b));
                };
            }
            if (reverse) {
                return function(a, b) {
                    return -1 * cmp(a, b);
                };
            }
            return cmp;
        };

    // actual implementation
    sort_by = function() {
        var fields = [],
            n_fields = arguments.length,
            field, name, reverse, cmp;

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
            field = arguments[i];
            if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
            }
            else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }
            fields.push({
                name: name,
                cmp: cmp
            });
        }

        return function(A, B) {
            var a, b, name, cmp, result;
            for (var i = 0, l = n_fields; i < l; i++) {
                result = 0;
                field = fields[i];
                name = field.name;
                cmp = field.cmp;

                result = cmp(A[name], B[name]);
                if (result !== 0) break;
            }
            return result;
        }
    }
}());

SummerCoding.UI.RankList = function (game, x, y, max, value) {
    Phaser.Sprite.call(this, game, x, y, 'trans');

    this.items = []
    this.current = null;
}

SummerCoding.UI.RankList.prototype = Object.create(Phaser.Sprite.prototype);
SummerCoding.UI.RankList.prototype.constructor = SummerCoding.UI.RankList;

SummerCoding.UI.RankList.prototype.addItem = function (name, id) {

    item = new SummerCoding.UI.RankItem(this.game, 0, 0, name, 1, 0, 0, id);
    item.setCurrent(true);
    for(var it of this.items) {
        it.setCurrent(false);
    }
    this.items.push(item);
    this.current = item;
    this.addChild(item);
}

SummerCoding.UI.RankList.prototype.updateCurrent = function (tank) {
    if(this.current != null) {
        this.current.setStar(tank.star);
        this.current.setFuel(tank.fuelUsed);
    }
}

SummerCoding.UI.RankList.prototype.update = function () {
    Phaser.Sprite.prototype.update.call(this);

    this.items.sort(sort_by({name:'starValue', reverse: true}, 'fuelValue', 'nameValue'));
    rank = 1;
    for(var i = 0; i < this.items.length; i++) {
        var currItem = this.items[i];
        var prevItem = this.items[i-1];

        if(prevItem) {
            if(currItem.starValue  != prevItem.starValue || currItem.fuelValue  != prevItem.fuelValue) {
                rank++;
            }
        }

        currItem.setRank(rank);
        currItem.y = i * 90;
    }
}

SummerCoding.UI.RankList.prototype.unfocus = function() {
    this.current.setCurrent(false);
    this.current = null;
}