/**
 * Created by lizhe on 14-7-29.
 * http://www.lizhexp.cn
 */
module AvoidShit {
    /*
    * Main Game Container
    * */
    export class GameContainer extends egret.DisplayObjectContainer
    {
        /**@private*/
        private stageW:number;
        /**@private*/
        private stageH:number;
        private bg:AvoidShit.BgMap;
        private logo:egret.Bitmap;
        private title:egret.Bitmap;
        private icon:egret.Bitmap;
        private follow:egret.Bitmap;
        private replay:egret.Bitmap;
        private share:egret.Bitmap;
        private score:egret.Bitmap;
        private timeline:egret.Bitmap;
        private timelinebg:egret.Bitmap;
        private timelinemask:egret.Rectangle;
        private gameTimer:egret.Timer;
        private eagle:egret.MovieClip;
        private timeDelay:number = 1000;
        private timeCount:number = 20;
        private downTimes:number = 15;
        private blood:number = 10;
        /**触发创建大便的间隔*/
        private shitTimer:egret.Timer = new egret.Timer(200);
        /**大便数组*/
        private shits:AvoidShit.Shit[] = [];
        /**@private*/
        private _lastTime:number;
        /**我的成绩*/
        private myScore:number = 0;
        /**成绩显示*/
        private scorePanel:AvoidShit.ScorePanel;

        public constructor() {
            super();
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }
        /**init*/
        private onAddToStage(event:egret.Event){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.createGameScene();
        }
        /**create Game Scene*/
        private createGameScene():void{
            this.bg = new AvoidShit.BgMap();
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            this.bg.width = this.stageW;
            this.bg.height = this.stageH;
            this.addChild(this.bg);

            this.logo = AvoidShit.createBitmapByName("logoImage");
            this.logo.x = 10;
            this.logo.y = 10;
            this.addChild(this.logo);

            this.title = AvoidShit.createBitmapByName("titleImage");
            this.title.anchorX = this.title.anchorY = 0.5;
            this.title.x = this.stageW / 2;
            this.title.y = this.stageH / 2 - 50;
            this.addChild(this.title);

            this.icon = AvoidShit.createBitmapByName("startBtn");
            this.icon.anchorX = this.icon.anchorY = 0.5;
            this.icon.x = this.stageW / 2;
            this.icon.y = this.stageH / 2 + 150;
            this.icon.touchEnabled = true;
            this.icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
            this.addChild(this.icon);

            this.scorePanel = new AvoidShit.ScorePanel();

            this.doShare(this.myScore,0);

            //预创建
            this.preCreatedInstance();
        }

        /**预创建一些对象，减少游戏时的创建消耗*/
        private preCreatedInstance():void {
            for(var i:number=0;i<20;i++) {
                var shit:AvoidShit.Shit = AvoidShit.Shit.produce("shitImage");
                AvoidShit.Shit.reclaim(shit,"shitImage");
            }
        }

        private gameStart() {
            this.removeChild(this.title);
            this.removeChild(this.icon);
            this.removeChild(this.logo);

            this.timelinebg = AvoidShit.createBitmapByName("tlbgImage");
            this.timelinebg.x = this.stageW - this.timelinebg.width - 10;
            this.timelinebg.y = 10;
            this.addChild(this.timelinebg);

            this.timeline = AvoidShit.createBitmapByName("tlImage");
            this.timeline.x = this.stageW - this.timeline.width - 13;
            this.timeline.y = 14;
            this.addChild(this.timeline);

            this.timelinemask = new egret.Rectangle(0, 0, this.timeline.width, this.timeline.height);
            this.timeline.mask = this.timelinemask;

            var data = RES.getRes("fly_json");//获取描述
            var texture = RES.getRes("fly_png");//获取大图
            this.eagle = new egret.MovieClip(new egret.DefaultMovieClipDelegate(data,texture));//创建电影剪辑
            this.addChild(this.eagle);//添加到显示列表
            this.eagle.x = this.stageW / 2;
            this.eagle.y = this.stageH - 150;
            this.eagle.frameRate = 6;//设置动画的帧频
            this.eagle.gotoAndPlay("fly");

            this.bg.start();
            this.touchEnabled=true;
            this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);

            this.shitTimer.addEventListener(egret.TimerEvent.TIMER,this.createShit,this);
            this.shitTimer.start();

            this.gameTimer = new egret.Timer(this.timeDelay,this.timeCount);
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER, this.timelineDown, this);
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.gameSucc, this);
            this.gameTimer.start();
        }
        /**响应Touch*/
        private touchHandler(evt:egret.TouchEvent):void{
            if(evt.type==egret.TouchEvent.TOUCH_MOVE)
            {
                var tx:number = evt.localX;
                tx = Math.max(0,tx);
                tx = Math.min(this.stageW-this.eagle.width,tx);
                this.eagle.x = tx;
            }
        }
        /**创建大便*/
        private createShit(evt:egret.TimerEvent):void{
            var shit:AvoidShit.Shit = AvoidShit.Shit.produce("shitImage");
            shit.x = Math.random()*(this.stageW-shit.width);
            shit.y = -shit.height-Math.random()*300;
            this.addChildAt(shit,this.numChildren-1);
            this.shits.push(shit);
//            console.log("大便个数："+this.shits.length);
        }
        /**游戏画面更新*/
        private gameViewUpdate(evt:egret.Event):void {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime:number = egret.getTimer();
            var fps:number = 1000/(nowTime-this._lastTime);
            this._lastTime = nowTime;
            var speedOffset:number = 60/fps;
            var i:number = 0;
            var delArr:any[] = [];

            //大便运动
            var theShit:AvoidShit.Shit;
            var enemyFighterCount:number = this.shits.length;
            for(i=0;i<enemyFighterCount;i++) {
                theShit = this.shits[i];
                theShit.y += this.downTimes * speedOffset;
                if(theShit.y>this.stageH)
                    delArr.push(theShit);
            }
            for(i=0;i<delArr.length;i++) {
                theShit = delArr[i];
                this.removeChild(theShit);
                AvoidShit.Shit.reclaim(theShit,"shitImage");
                this.shits.splice(this.shits.indexOf(theShit),1);
            }

            this.myScore += delArr.length;

            this.gameHitTest();
        }
        private gameHitTest():void {
            var theShit:AvoidShit.Shit;
            var shitCount:number = this.shits.length;
            for(var j:number=0;j<shitCount;j++) {
                theShit = this.shits[j];
                if(AvoidShit.GameUtil.hitTestP(this.eagle, theShit)) {
                    this.blood -= 10;
//                    console.log(theShit.getBounds());
                }
            }

            if(this.blood<=0) {
                this.gameOver();
            }
        }

        private timelineDown(evt:egret.TimerEvent):void {
            this.timelinemask.y += this.timeline.height/20;
//            console.log(this.timeline.height);
        }

        private gameSucc():void {
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.shitTimer.removeEventListener(egret.TimerEvent.TIMER, this.createShit, this);
            this.shitTimer.stop();
            this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.gameSucc, this);
            this.gameTimer.stop();

            this.removeChild(this.timeline);
            this.removeChild(this.timelinebg);

            //清理大便
            var theShit:AvoidShit.Shit;
            while (this.shits.length > 0) {
                theShit = this.shits.pop();
                this.removeChild(theShit);
                AvoidShit.Shit.reclaim(theShit, "shitImage");
            }
            this.removeChild(this.eagle);

            //显示成绩
            this.logo = AvoidShit.createBitmapByName("logoImage");
            this.logo.x = 10;
            this.logo.y = 10;
            this.addChild(this.logo);

            this.share = AvoidShit.createBitmapByName("shareBtn");
            this.share.x = this.stageW - this.share.width - 10;
            this.share.y = 10;
            this.addChild(this.share);

            this.follow = AvoidShit.createBitmapByName("followBtn");
            this.follow.anchorX = this.follow.anchorY = 0.5;
            this.follow.x = this.stageW /2 - 100;
            this.follow.y = this.stageH - 100;
            this.follow.touchEnabled = true;
            this.follow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameFollow, this);
            this.addChild(this.follow);

            this.replay = AvoidShit.createBitmapByName("replayBtn");
            this.replay.anchorX = this.replay.anchorY = 0.5;
            this.replay.x = this.stageW /2 + 100;
            this.replay.y = this.stageH - 100;
            this.replay.touchEnabled = true;
            this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameReplay, this);
            this.addChild(this.replay);

            this.score = AvoidShit.createBitmapByName("scoreImage");
            this.score.anchorX = this.score.anchorY = 0.5;
            this.score.x = this.stageW / 2;
            this.score.y = this.stageH / 2;
            this.addChild(this.score);

            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.anchorX = this.scorePanel.anchorY = 0.5;
            this.scorePanel.x = this.stageW / 2 + 70;
            this.scorePanel.y = this.stageH / 2 + 25;
            this.addChild(this.scorePanel);

            this.doShare(this.myScore,1);
        }
        /**游戏结束*/
        private gameOver():void {

            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.shitTimer.removeEventListener(egret.TimerEvent.TIMER, this.createShit, this);
            this.shitTimer.stop();
            this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.gameSucc, this);
            this.gameTimer.stop();

            this.removeChild(this.timeline);
            this.removeChild(this.timelinebg);

            //清理大便
            var theShit:AvoidShit.Shit;
            while (this.shits.length > 0) {
                theShit = this.shits.pop();
                this.removeChild(theShit);
                AvoidShit.Shit.reclaim(theShit, "shitImage");
            }
            this.removeChild(this.eagle);

            //显示成绩
            this.logo = AvoidShit.createBitmapByName("logoImage");
            this.logo.x = 10;
            this.logo.y = 10;
            this.addChild(this.logo);

            this.share = AvoidShit.createBitmapByName("shareBtn");
            this.share.x = this.stageW - this.share.width - 10;
            this.share.y = 10;
            this.addChild(this.share);

            this.follow = AvoidShit.createBitmapByName("followBtn");
            this.follow.anchorX = this.follow.anchorY = 0.5;
            this.follow.x = this.stageW /2 - 100;
            this.follow.y = this.stageH - 100;
            this.follow.touchEnabled = true;
            this.follow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameFollow, this);
            this.addChild(this.follow);

            this.replay = AvoidShit.createBitmapByName("replayBtn");
            this.replay.anchorX = this.replay.anchorY = 0.5;
            this.replay.x = this.stageW /2 + 100;
            this.replay.y = this.stageH - 100;
            this.replay.touchEnabled = true;
            this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameReplay, this);
            this.addChild(this.replay);

            this.score = AvoidShit.createBitmapByName("scoreImage");
            this.score.anchorX = this.score.anchorY = 0.5;
            this.score.x = this.stageW / 2;
            this.score.y = this.stageH / 2;
            this.addChild(this.score);

            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.anchorX = this.scorePanel.anchorY = 0.5;
            this.scorePanel.x = this.stageW / 2 + 70;
            this.scorePanel.y = this.stageH / 2 + 25;
            this.addChild(this.scorePanel);

            this.doShare(this.myScore,1);
        }

        private gameReplay() {
            this.removeChild(this.logo);
            this.removeChild(this.share);
            this.removeChild(this.follow);
            this.removeChild(this.replay);
            this.removeChild(this.score);
            this.removeChild(this.scorePanel);
            this.myScore = 0;
            this.blood = 10;
            this.doShare(this.myScore,0);

            this.timelinebg = AvoidShit.createBitmapByName("tlbgImage");
            this.timelinebg.x = this.stageW - this.timelinebg.width - 10;
            this.timelinebg.y = 10;
            this.addChild(this.timelinebg);

            this.timeline = AvoidShit.createBitmapByName("tlImage");
            this.timeline.x = this.stageW - this.timeline.width - 13;
            this.timeline.y = 14;
            this.addChild(this.timeline);

            this.timelinemask = new egret.Rectangle(0, 0, this.timeline.width, this.timeline.height);
            this.timeline.mask = this.timelinemask;

            var data = RES.getRes("fly_json");//获取描述
            var texture = RES.getRes("fly_png");//获取大图
            this.eagle = new egret.MovieClip(new egret.DefaultMovieClipDelegate(data,texture));//创建电影剪辑
            this.addChild(this.eagle);//添加到显示列表
            this.eagle.y = this.stageH - 150;
            this.eagle.frameRate = 6;//设置动画的帧频
            this.eagle.gotoAndPlay("fly");

            this.bg.start();
            this.touchEnabled=true;
            this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);

            this.shitTimer.addEventListener(egret.TimerEvent.TIMER,this.createShit,this);
            this.shitTimer.start();

            this.gameTimer = new egret.Timer(this.timeDelay,this.timeCount);
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER, this.timelineDown, this);
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.gameSucc, this);
            this.gameTimer.start();
        }

        private gameFollow() {
            window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA4NzA4NzkxNw==&mid=200364675&idx=1&sn=e4fd9a49427322912e7fe646c50ad06a#rd";
        }

        private doShare(n:number,m:number) {
            WeixinApi.ready(function(api:WeixinApi) {

                var info:WeixinShareInfo = new WeixinShareInfo();

                info.title = "我本卖萌鸟，何处惹尘埃？";
                if (m == 0) {
                    info.desc = "我本卖萌鸟，何处惹尘埃？";
                } else {
                    info.desc = "我本卖萌鸟，何处惹尘埃？屎开，屎开～～我躲过了" + n + "坨大便，你行吗？";
                }
                info.link = "http://games.11wj.com/fly/launcher/release.html";
                info.imgUrl = "http://games.11wj.com/fly/resource/assets/icon.png";

                api.shareToFriend(info);
                api.shareToTimeline(info);
            })
        }
    }
}