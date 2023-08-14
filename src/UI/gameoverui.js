import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";

export class GameOverUI extends Container {
    constructor() {
        super();
        this.style = new TextStyle({
            fontFamily: GameConstants.defaultFont,
            fontSize: GameConstants.fontSize*3,
            fill: "white",
            align: "center"
        });
        this.isFirst = true;
        this.drawReplayButton();
        this.drawMainMenuButton();
        this.drawChartButton();
        this.drawLikeButton();
        this.drawAdsButton();
    }
    showScore(score){
        if(this.isFirst) {
            this.score = new Text(score, this.style);
            this.score.anchor.set(0.5, 0.5);
            this.score.position.set(GameConstants.screenWidth/2, GameConstants.screenHeight*0.2);
            this.addChild(this.score);
        }
        else {
            this.score.text = score;
            this.score.position.set(GameConstants.screenWidth/2, GameConstants.screenHeight*0.2);
        }
    }
    showBest(){
        if(this.isFirst) {
            this.best = new Text("BEST " + Game.best, {
                fontFamily: GameConstants.defaultFont,
                fontSize: GameConstants.fontSize*2,
                fill: "white",
                align: "center"
            });
            this.best.position.set(GameConstants.screenWidth/2, GameConstants.screenHeight*0.3);
            this.best.anchor.set(0.5, 0.5);
            this.addChild(this.best);
            this.isFirst = false;
        }
        else {
            this.best.text = "BEST " + Game.best;
            this.best.position.set(GameConstants.screenWidth/2, GameConstants.screenHeight*0.3);
        }
    }
    drawReplayButton(){
        var tmp = Sprite.from(Texture.from("replay"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.4);
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Replay");
            Game.rePlay();
        });
        this.addChild(tmp);
    }
    drawMainMenuButton(){
        var tmp = Sprite.from(Texture.from("mainmenu"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*8
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth/2, GameConstants.screenHeight*0.52);
        tmp.eventMode = "static";
        tmp.on("pointerup",() => {
            console.log("Mainmenu");
            Game.menu();
        });
        this.addChild(tmp);
    }
    drawChartButton(){
        var tmp = Sprite.from(Texture.from("chart"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.3, GameConstants.screenHeight*0.7);
        this.addChild(tmp);
    }
    drawLikeButton(){
        var tmp = Sprite.from("assets/images/like.png");
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2.25
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.7);
        this.addChild(tmp);
    }
    drawAdsButton(){
        var tmp = Sprite.from(Texture.from("ads"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*2
        tmp.height = GameConstants.squareEdge*2
        tmp.position.set(GameConstants.screenWidth*0.7, GameConstants.screenHeight*0.7);
        this.addChild(tmp);
    }
}
