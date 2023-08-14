import { Container, Text, TextStyle, Texture } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";
import { PauseUI } from "./pauseui";
export class InGameUI extends Container{
    constructor(){
        super();
        this.isFirst = true;
        this.isFirstCoin = true;
        //Back yard
        this.backYard = Sprite.from("assets/images/square.png");
        this.backYard.tint = 0x222222;
        this.backYard.width = GameConstants.screenWidth;
        this.backYard.height = GameConstants.defaultBottom - GameConstants.defaultTop;
        this.backYard.x = 0.5;
        this.backYard.y = GameConstants.defaultTop;
        this.addChildAt(this.backYard);
        this.drawPauseButton();
        this.drawCoinSymbol();
        this.drawSpeedupButton(); 
        this.drawBestScore();
        this.drawCoinScore();
    }
    drawPauseButton(){
        var tmp = Sprite.from(Texture.from("pause"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*0.75;
        tmp.height = GameConstants.squareEdge*1.25;
        tmp.x = GameConstants.squareEdge;
        tmp.y = GameConstants.squareEdge*1.2;
        tmp.tint = "white";
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Pause");
            if(!Game.isWaiting){
                Game.uiManager.psUI = new PauseUI();
                Game.app.stage.addChild(Game.uiManager.psUI);
            }
            Game.isWaiting = true;
        });
        this.addChild(tmp);
    }
    drawBestScore(){
        if(this.isFirst) {
            this.textStyle = new TextStyle({
                fontSize: GameConstants.fontSize/2,
                fill: "white",
                fontFamily: GameConstants.defaultFont, 
            }); 
            this.bestText = new Text("B E S T", this.textStyle);
            this.bestText.anchor.set(0, 0.5);
            this.bestText.x = GameConstants.squareEdge*2;
            this.bestText.y = GameConstants.squareEdge/2;
            this.addChild(this.bestText);
    
            this.textStyle = new TextStyle({
                fontSize: GameConstants.fontSize,
                fill: "white",
                fontFamily: GameConstants.defaultFont, 
            }); 
            this.bestScore = new Text(Game.best, this.textStyle);
            this.bestScore.anchor.set(0, 0.5);
            this.bestScore.x = GameConstants.squareEdge*2;
            this.bestScore.y = GameConstants.squareEdge*1.5;
            this.addChild(this.bestScore);
        }
        else {
            this.bestScore.text = Game.best;
            this.bestScore.x = GameConstants.squareEdge*2;
            this.bestScore.y = GameConstants.squareEdge*1.5;
        }
    }
    drawCoinSymbol(){
        this.tmp = Sprite.from(Texture.from("ring"));
        this.tmp.anchor.set(0.5, 0.5);
        this.tmp.width = GameConstants.coinRadius*2;
        this.tmp.height = GameConstants.coinRadius*2;
        this.tmp.x = GameConstants.screenWidth - GameConstants.squareEdge;
        this.tmp.y = GameConstants.squareEdge*1.5;
        this.tmp.tint = "yellow";
        this.addChild(this.tmp);
    }
    drawCoinScore(){
        if (this.isFirstCoin) {
            this.textStyle = new TextStyle({
                fontSize: GameConstants.fontSize,
                fill: "white",
                fontFamily: GameConstants.defaultFont, 
            }); 
            this.coinText = new Text(Game.coinScore, this.textStyle);
            this.coinText.anchor.set(1, 0.5);
            this.coinText.x = GameConstants.screenWidth - GameConstants.squareEdge*2;
            this.coinText.y = GameConstants.squareEdge*1.5;
            this.addChild(this.coinText);
            this.isFirstCoin = false;
        }
        else {
            this.coinText.text = Game.coinScore;
            this.coinText.x = GameConstants.screenWidth - GameConstants.squareEdge*2;
            this.coinText.y = GameConstants.squareEdge*1.5;
        }
    }
    drawSpeedupButton(){
        var tmp = Sprite.from(Texture.from("lightning"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*1.5;
        tmp.height = GameConstants.squareEdge*1.5;
        tmp.x = GameConstants.screenWidth*0.95;
        tmp.y = GameConstants.defaultTop + GameConstants.squareEdge;
        tmp.tint = "red";
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Speedup");
            Game.balls.forEach(ball => {
                ball.dx = ball.dx*2; //van toc phuong x cua bong
                ball.dy = ball.dy*2; // van toc phuong y cua bong
            })
        });
        this.textStyle = new TextStyle({
            fontSize: GameConstants.fontSize,
            fill: "white",
            fontFamily: GameConstants.defaultFont, 
        }); 
        //console.log(this.textStyle.fontFamily);
        this.speedText = new Text("Speedup", this.textStyle);
        this.speedText.anchor.set(0.5, 0.5);
        this.speedText.x = GameConstants.screenWidth*0.8;
        this.speedText.y = GameConstants.defaultTop + GameConstants.squareEdge;
        this.addChild(this.speedText);
        this.addChild(tmp);
    }
    
    setText(score){   
        if (this.isFirst) {
            this.textStyle = new TextStyle({
                fontSize: GameConstants.fontSize*2,
                fill: "white",
                fontFamily: GameConstants.defaultFont, 
            });     
            this.text = new Text(score, this.textStyle);
            this.text.anchor.set(0.5, 0.5);
            this.text.x = GameConstants.screenWidth/2;
            this.text.y = GameConstants.squareEdge*1.5;
            this.addChild(this.text);   
            this.isFirst = false;    
        } 
        else {
            this.text.text = score;
            this.text.x = GameConstants.screenWidth/2;
            this.text.y = GameConstants.squareEdge*1.5;
        }
    }
}