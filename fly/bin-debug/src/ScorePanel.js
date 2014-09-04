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
    * 成绩显示
    */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            _super.call(this);
            var g = this.graphics;

            //            g.beginFill(0x000000,0.8);
            g.drawRect(0, 0, 100, 100);
            g.endFill();
            this.txt = new egret.TextField();
            this.txt.width = 100;
            this.txt.height = 100;
            this.txt.textAlign = "center";
            this.txt.textColor = 0x00dddd;
            this.txt.size = 24;
            this.txt.y = 60;
            this.addChild(this.txt);
            this.touchChildren = false;
            this.touchEnabled = false;
        }
        ScorePanel.prototype.showScore = function (value) {
            var msg = value + "";
            this.txt.text = msg;
        };
        return ScorePanel;
    })(egret.Sprite);
    AvoidShit.ScorePanel = ScorePanel;
    ScorePanel.prototype.__class__ = "AvoidShit.ScorePanel";
})(AvoidShit || (AvoidShit = {}));
