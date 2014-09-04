/**
 * Created by lizhe on 14-7-29.
 * http://www.lizhexp.cn
 */
module AvoidShit
{
    /**
     * 成绩显示
     */
    export class ScorePanel extends egret.Sprite
    {
        private txt:egret.TextField;

        public constructor() {
            super();
            var g:egret.Graphics = this.graphics;
//            g.beginFill(0x000000,0.8);
            g.drawRect(0,0,100,100);
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

        public showScore(value:number):void {
            var msg:string = value+"";
            this.txt.text = msg;
        }
    }
}