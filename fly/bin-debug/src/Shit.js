var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by lizhe on 14-7-29.
* http://www.lizhexp.cn
*/
var AvoidShit;
(function (AvoidShit) {
    /**
    * 大便，利用对象池
    */
    var Shit = (function (_super) {
        __extends(Shit, _super);
        function Shit(texture) {
            _super.call(this, texture);
        }
        /**生产*/
        Shit.produce = function (textureName) {
            if (AvoidShit.Shit.cacheDict[textureName] == null)
                AvoidShit.Shit.cacheDict[textureName] = [];
            var dict = AvoidShit.Shit.cacheDict[textureName];
            var shit;
            if (dict.length > 0) {
                shit = dict.pop();
            } else {
                shit = new AvoidShit.Shit(RES.getRes(textureName));
            }
            shit.textureName = textureName;
            return shit;
        };

        /**回收*/
        Shit.reclaim = function (shit, textureName) {
            if (AvoidShit.Shit.cacheDict[textureName] == null)
                AvoidShit.Shit.cacheDict[textureName] = [];
            var dict = AvoidShit.Shit.cacheDict[textureName];
            if (dict.indexOf(shit) == -1)
                dict.push(shit);
        };
        Shit.cacheDict = {};
        return Shit;
    })(egret.Bitmap);
    AvoidShit.Shit = Shit;
    Shit.prototype.__class__ = "AvoidShit.Shit";
})(AvoidShit || (AvoidShit = {}));
