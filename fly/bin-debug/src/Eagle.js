var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by lizhe on 14-7-29.
*/
var AvoidShit;
(function (AvoidShit) {
    var Eagle = (function (_super) {
        __extends(Eagle, _super);
        function Eagle(texture) {
            _super.call(this);
            /**生命值*/
            this.blood = 10;
            this.bmp = new egret.Bitmap(texture);
            this.addChild(this.bmp);
        }
        /**生产*/
        Eagle.produce = function (textureName) {
            if (AvoidShit.Eagle.cacheDict[textureName] == null)
                AvoidShit.Eagle.cacheDict[textureName] = [];
            var dict = AvoidShit.Eagle.cacheDict[textureName];
            var eagle;
            if (dict.length > 0) {
                eagle = dict.pop();
            } else {
                eagle = new AvoidShit.Eagle(RES.getRes(textureName));
            }
            return eagle;
        };

        /**回收*/
        Eagle.reclaim = function (eagle, textureName) {
            if (AvoidShit.Eagle.cacheDict[textureName] == null)
                AvoidShit.Eagle.cacheDict[textureName] = [];
            var dict = AvoidShit.Eagle.cacheDict[textureName];
            if (dict.indexOf(eagle) == -1)
                dict.push(eagle);
        };
        Eagle.cacheDict = {};
        return Eagle;
    })(egret.DisplayObjectContainer);
    AvoidShit.Eagle = Eagle;
})(AvoidShit || (AvoidShit = {}));
