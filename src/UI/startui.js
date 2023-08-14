import { Container, Text, TextStyle, Texture } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";
import { MusicButton } from "./musicbutton";
export class StartUI extends Container{
    constructor(){
        super();
        this.drawBallz();
        this.drawPlayButton();
        this.drawRateButton();
        this.drawMusicButton();
        this.drawChartButton();
        this.drawBalltButton();
        this.drawAdsButton();
    }
    drawBallz(){
        var tmp= Sprite.from(Texture.from("ballz"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*14
        tmp.height = GameConstants.squareEdge*5
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.1);
        this.addChild(tmp)
        gsap.to(tmp,{
            y: GameConstants.screenHeight*0.2,
            duration:1,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
        })
    }
    drawPlayButton(){
        var tmp = Sprite.from(Texture.from("play"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.4);
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Play");
            Game.play();
        });
        this.addChild(tmp);
    }
    drawRateButton(){
        var tmp = Sprite.from(Texture.from("rate"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8;
        tmp.height = GameConstants.squareEdge*2;
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.52);
        this.addChild(tmp);
    }
    drawMusicButton(){
        this.musicButton = new MusicButton(GameConstants.screenWidth*0.2, GameConstants.screenHeight*0.7);
        this.addChild(this.musicButton);
    }
    drawChartButton(){
        var tmp = Sprite.from(Texture.from("chart"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.4, GameConstants.screenHeight*0.7);
        this.addChild(tmp);
    }
    drawBalltButton(){
        var tmp = Sprite.from(Texture.from("iconBall"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.6, GameConstants.screenHeight*0.7);
        tmp.eventMode = "static";
        tmp.on("pointerup", () => {
            console.log("Shop");
            Game.app.stage.removeChild(Game.uiManager.stUI);
            Game.app.stage.addChild(Game.uiManager.shUI);
            Game.uiManager.shUI.drawNumberOfRing();
        })
        this.addChild(tmp);
    }
    drawAdsButton(){
        var tmp = Sprite.from(Texture.from("ads"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.8, GameConstants.screenHeight*0.7);
        this.addChild(tmp);
    }
}