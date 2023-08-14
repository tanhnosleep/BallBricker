import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";
import { ActiveBall } from "../objects/activeball";
import { MusicButton } from "./musicbutton";

export class PauseUI extends Container {
    constructor() {
        super();
        this.drawBackground();
        this.drawTextPause();
        this.drawContinueButton();
        this.drawRestartButton();
        this.drawMainMenuButton();
        this.drawMusicButton();
        this.drawLikeButton();
        this.drawAdsButton();
    }
    drawBackground(){
        var tmp = Sprite.from(Texture.from("square")); 
        tmp.width = GameConstants.screenWidth
        tmp.height = GameConstants.screenHeight     
        tmp.position.set(0, 0);
        tmp.tint = 0x222222;
        this.addChild(tmp);
    }
    drawTextPause() {
        const style = new TextStyle({
            fontFamily: GameConstants.defaultFont,
            fontSize: 48,
            fill: "white",
            align: "center"
        });
        const text = new Text("PAUSE", style);
        text.anchor.set(0.5, 0.5);
        text.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.2);
        this.addChild(text);
    }
    drawContinueButton(){
        var tmp = Sprite.from(Texture.from("continue")); 
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8
        tmp.height = GameConstants.squareEdge*2      
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.32);

        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Continue");        
            Game.app.stage.removeChild(Game.uiManager.psUI);
            Game.isWaiting = false;            
        });
        this.addChild(tmp);
    }
    drawRestartButton(){
        var tmp = Sprite.from("assets/images/restart.png");
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.44);
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Restart");
            Game.reStart();
            
        });
        this.addChild(tmp);
    }
    drawMainMenuButton(){
        var tmp = Sprite.from(Texture.from("mainmenu"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.56);
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Mainmenu");
            Game.map.resetMap();
            Game.app.stage.removeChild(Game.uiManager.psUI);
            Game.menu();
        });
        this.addChild(tmp);
    }
    drawMusicButton(){        
        this.musicButton = new MusicButton(GameConstants.screenWidth*0.3, GameConstants.screenHeight*0.68);
        this.addChild(this.musicButton);
    }
    drawLikeButton(){
        var tmp = Sprite.from(Texture.from("like"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2.25
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.68);
        this.addChild(tmp);
    }
    drawAdsButton(){
        var tmp = Sprite.from(Texture.from("ads"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.7, GameConstants.screenHeight*0.68);
        this.addChild(tmp);
    }
}
