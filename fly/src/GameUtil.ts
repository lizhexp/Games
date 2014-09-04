/**
 * Created by lizhe on 14-7-29.
 * http://www.lizhexp.cn
 */
module AvoidShit
{
    export class GameUtil
    {
        /**基于矩形的碰撞检测*/
        public static hitTest(obj1:egret.DisplayObject,obj2:egret.DisplayObject):boolean
        {
            var rect1:egret.Rectangle = obj1.getBounds();
            var rect2:egret.Rectangle = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2);
        }

        /**基于圆心的碰撞检测*/
        public static hitTestP(obj1:egret.DisplayObject,obj2:egret.DisplayObject):boolean
        {
//            var rect1:egret.Rectangle = obj1.getBounds();
            var rect2x:number;
            var rect2y:number;
//            rect1.x = obj1.x;
//            rect1.y = obj1.y;
            rect2x = obj2.x + obj2.width/2;
            rect2y = obj2.y + obj2.height/2;
            return obj1.hitTestPoint(rect2x, rect2y);
        }
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    export function createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}