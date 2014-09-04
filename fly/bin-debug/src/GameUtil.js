/**
* Created by lizhe on 14-7-29.
* http://www.lizhexp.cn
*/
var AvoidShit;
(function (AvoidShit) {
    var GameUtil = (function () {
        function GameUtil() {
        }
        /**基于矩形的碰撞检测*/
        GameUtil.hitTest = function (obj1, obj2) {
            var rect1 = obj1.getBounds();
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2);
        };

        /**基于圆心的碰撞检测*/
        GameUtil.hitTestP = function (obj1, obj2) {
            //            var rect1:egret.Rectangle = obj1.getBounds();
            var rect2x;
            var rect2y;

            //            rect1.x = obj1.x;
            //            rect1.y = obj1.y;
            rect2x = obj2.x + obj2.width / 2;
            rect2y = obj2.y + obj2.height / 2;
            return obj1.hitTestPoint(rect2x, rect2y);
        };
        return GameUtil;
    })();
    AvoidShit.GameUtil = GameUtil;
    GameUtil.prototype.__class__ = "AvoidShit.GameUtil";

    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    */
    function createBitmapByName(name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    AvoidShit.createBitmapByName = createBitmapByName;
})(AvoidShit || (AvoidShit = {}));
