var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Movieclip Demo
*/
var Demo3 = (function (_super) {
    __extends(Demo3, _super);
    function Demo3() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }
    /**游戏启动后，会自动执行此方法*/
    Demo3.prototype.startGame = function () {
        this.loadResource();
    };

    /**加载所需资源*/
    Demo3.prototype.loadResource = function () {
        //使用资源管理器加载资源
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup("demo3");
    };

    /**加载完毕后即可使用*/
    Demo3.prototype.onResourceLoadComplete = function () {
        var data = RES.getRes("monkey_json");
        var texture = RES.getRes("monkey_png");
        var monkey = new egret.MovieClip(new egret.DefaultMovieClipDelegate(texture, data));
        this.addChild(monkey); //添加到显示列表
        monkey.frameRate = 60; //设置动画的帧频
        monkey.gotoAndPlay("stand");
    };
    return Demo3;
})(egret.DisplayObjectContainer);
