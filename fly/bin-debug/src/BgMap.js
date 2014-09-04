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
    * 可滚动的底图
    */
    var BgMap = (function (_super) {
        __extends(BgMap, _super);
        function BgMap() {
            _super.call(this);
            /**控制滚动速度*/
            this.speed = 4;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        /**初始化*/
        BgMap.prototype.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var texture = RES.getRes("bgImage");
            this.textureHeight = texture.textureHeight; //保留原始纹理的高度，用于后续的计算
            this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1; //计算在当前屏幕中，需要的图片数量
            this.bmpArr = [];

            for (var i = 0; i < this.rowCount; i++) {
                var bgBmp = AvoidShit.createBitmapByName("bgImage");
                bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        };

        /**开始滚动*/
        BgMap.prototype.start = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };

        /**逐帧运动*/
        BgMap.prototype.enterFrameHandler = function (event) {
            for (var i = 0; i < this.rowCount; i++) {
                var bgBmp = this.bmpArr[i];
                bgBmp.y += this.speed;

                //判断超出屏幕后，回到队首，这样来实现循环反复
                if (bgBmp.y > this.stageH) {
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);
                }
            }
        };

        /**暂停滚动*/
        BgMap.prototype.pause = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        return BgMap;
    })(egret.DisplayObjectContainer);
    AvoidShit.BgMap = BgMap;
    BgMap.prototype.__class__ = "AvoidShit.BgMap";
})(AvoidShit || (AvoidShit = {}));
