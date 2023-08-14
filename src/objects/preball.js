import { Container, Sprite, Texture, Ticker} from "pixi.js"
import TWEEN from "@tweenjs/tween.js"
import { Ball } from "./ball";
import { GameConstants } from "../gameconstants/gameconstants";
import { gsap} from "gsap"
import { Game } from "../game";
export class PreBall extends Ball{
    constructor(x=GameConstants.defaultBallX, y=GameConstants.defaultBottomBall){
        super(x, y);       
        this.ring = Sprite.from(Texture.from("ring"));
        this.ring.anchor.set(0.5, 0.5);
        this.ring.width = GameConstants.minRing;
        this.ring.height = GameConstants.minRing;
        this.ring.x = x;
        this.ring.y = y;
        this.isBall = false;
        this.addChild(this.ring);  
        this.ringDestroy = false;
    }
    ringAnimation(){        
        var tween = new TWEEN.Tween({ size: GameConstants.minRing});
            tween.to({size: GameConstants.maxRing }, GameConstants.ringTweenTime)
            .repeat(Infinity)
            .yoyo(true)
            .onUpdate((obj) => {
                this.ring.width = obj.size;
                this.ring.height = obj.size;
            })
            .start(Game._current);            
    }
    followBall(){
        this.ring.x = this.ball.x;
        this.ring.y = this.ball.y;
    }
}