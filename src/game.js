import { Application, Assets, Sprite, Text, Texture, Ticker } from "pixi.js"
import { ActiveBall } from "./objects/activeball";
import { PreBall } from "./objects/preball";
import { BallController } from "./controller/ballcontroller";
import { Square } from "./objects/square";
import { CollisionHandler } from "./collision/collisionhandler";
import { GameConstants } from "./gameconstants/gameconstants";
import { Coin } from "./objects/coin";
import { GenMap } from "./genmap/genmap";
import TWEEN from "@tweenjs/tween.js";
import { UIManager } from "./scene/uimanager";
import { manifest } from "./manifest/manifest";
import { ShopUI } from "./UI/shopui";


export class Game{
    static init(){
        this.app =  new Application({
            width: GameConstants.screenWidth,
            height: GameConstants.screenHeight,
            background: 0x111111
        })
        document.body.appendChild(this.app.view);
        this.isWaiting = true;
        this.isFirst = true;
        this.best = this.get("best", 0);
        this.coinScore = this.get("coinScore", 1000000);
        this.music = true;
        this.loadGame().then(() => {
            this.createPool().then(() => {
                this.ticker();
            })
        })
        console.log("Start");        
    } 
    static get(key, defaul){
        if (localStorage.getItem(key) != null)
        return localStorage.getItem(key);
        else return defaul;
    }
    static async createPool(){
        await this.pool();
    }
    static pool(){
        this.ballPool = [];
        for(var i = 0; i < 200; i++){
            var ball = new ActiveBall();
            this.ballPool.push(ball);
        }this.preBallPool = [];        
        for(var i = 0; i < 56; i++){
            var preBall = new PreBall();
            this.preBallPool.push(preBall);
        }
        this.coinPool = [];        
        for(var i = 0; i < 56; i++){
            var coin = new Coin();
            this.coinPool.push(coin);
        }
        this.squarePool = [];        
        for(var i = 0; i < 56; i++){
            var square = new Square(0, 0, 1);
            this.squarePool.push(square);
        }   
        this.textFXPool = [];        
        for(var i = 0; i < 56; i++){
            var text = new Text("SIUU !", {
                fontSize: GameConstants.fontSize,
                fill: "yellow",
                fontFamily: GameConstants.defaultFont,    
                stroke: "blue",
                strokeThickness:20             
            });
            text.anchor.set(0.5, 0.5);
            this.textFXPool.push(text);
        }          
        this.uiManager = new UIManager();
        this.app.stage.addChild(this.uiManager.stUI);
    }
    static async loadGame(){
        await Assets.init({manifest: manifest});
        const bundleIDs = manifest.bundles.map(bundle => bundle.name);
        await Assets.loadBundle(bundleIDs);
        console.log(Assets.cache);
    }
    static play(){
        this.app.stage.removeChild(this.uiManager.stUI);
        this.isWaiting = false;
        this.startGame();
    }
    static rePlay(){ 
        this.app.stage.removeChild(this.uiManager.goUI);
        this.app.stage.removeChild(this.ballController);
        this.isWaiting = false;        
        this.startGame();
    }
    static reStart(){
        this.app.stage.removeChild(this.uiManager.psUI);
        this.app.stage.removeChild(this.ballController);
        this.map.resetMap();
        this.isWaiting = false;
        this.startGame();
        
    }
    static menu(){
        this.app.stage.removeChild(this.ballController);
        this.app.stage.removeChild(this.uiManager.goUI);
        this.app.stage.addChild(this.uiManager.stUI);

    }
    static startGame(){  
        this.app.stage.addChild(this.uiManager.igUI);      
        this.uiManager.igUI.drawCoinScore();  
        //Add balls
        this.balls = [];
        for(var i = 0; i<1; i++){
            var ball = this.ballPool.pop();
            this.balls.push(ball);
        }
        this.balls.forEach(ball => {
            this.app.stage.addChild(ball);
        });
        if (this.isFirst) {
            this.map = new GenMap();
            this.app.stage.addChild(this.map);
        }else{
            this.map.createNewLine();
            this.app.stage.addChild(this.map);
        }
        //Ball controller
        this.ballController = new BallController(this.balls, this.map);
        this.app.stage.addChild(this.ballController);
        //Collision handler
        this.collision = new CollisionHandler(this.balls, this.map.squares, this.map.coins, this.map.preBalls);

    }
    static ticker(){
        this.app.ticker.add(Game.update.bind(this));
        //Delta time
        this._dt = 0;
        this._current = 0;
    }
    static update(dt){  
        this.store();  
        this.uiManager.update();
        if(this.isWaiting) return;
        if(this.map.bottom>GameConstants.defaultBottom - GameConstants.ballRadius*3) {
            console.log("Lose");
            var score = this.map.line - 1;
            this.app.stage.addChild(this.uiManager.goUI);
            this.uiManager.goUI.showScore(score);
            this.uiManager.goUI.showBest();
            this.map.resetMap();
            return;
        }  
        this._dt = Ticker.shared.deltaMS;
        this._current += this._dt;
        TWEEN.update(this._current);
        this.map.update(dt);
        this.ballController.update(dt);
        this.collision.update(dt);  
    }
    static store(){
        // localStorage.clear();
        localStorage.setItem("best", this.best);
        localStorage.setItem("coinScore", this.coinScore);
        localStorage.setItem("used", ShopUI.used);
        Game.uiManager.shUI.items.forEach(item => {
            localStorage.setItem("sold"+item.id, item.sold);
        })
    }
} 

window.onload = function() {
    Game.init();
}