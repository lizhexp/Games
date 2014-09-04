/**
 * Created by lizhe on 14-7-29.
 * http://www.lizhexp.cn
 */
module AvoidShit
{
    /**
     * 大便，利用对象池
     */
    export class Shit extends egret.Bitmap
    {
        private static cacheDict:Object = {};
        /**生产*/
        public static produce(textureName:string):AvoidShit.Shit
        {
            if(AvoidShit.Shit.cacheDict[textureName]==null)
                AvoidShit.Shit.cacheDict[textureName] = [];
            var dict:AvoidShit.Shit[] = AvoidShit.Shit.cacheDict[textureName];
            var shit:AvoidShit.Shit;
            if(dict.length>0) {
                shit = dict.pop();
            } else {
                shit = new AvoidShit.Shit(RES.getRes(textureName));
            }
            shit.textureName = textureName;
            return shit;
        }
        /**回收*/
        public static reclaim(shit:AvoidShit.Shit,textureName:string):void
        {
            if(AvoidShit.Shit.cacheDict[textureName]==null)
                AvoidShit.Shit.cacheDict[textureName] = [];
            var dict:AvoidShit.Shit[] = AvoidShit.Shit.cacheDict[textureName];
            if(dict.indexOf(shit)==-1)
                dict.push(shit);
        }

        public textureName:string;

        public constructor(texture:egret.Texture) {
            super(texture);
        }
    }
}