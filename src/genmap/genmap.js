import { Container, Ticker, copySearchParams } from "pixi.js";
import { GameConstants } from "../gameconstants/gameconstants";
import { Square } from "../objects/square";
import TWEEN, { Tween } from "@tweenjs/tween.js";
import { Coin } from "../objects/coin";
import { PreBall } from "../objects/preball";
import { Row } from "./row";
import { Game } from "../game";
import { ActiveBall } from "../objects/activeball";

export class GenMap extends Container{
    constructor(){
        super();
        this.line = 1;
        this.squares = [];
        this.coins = [];
        this.preBalls = [];   
        this.preBallPool = Game.preBallPool;        
        // for(var i = 0; i < 56; i++){
        //     var preBall = new PreBall();
        //     this.preBallPool.push(preBall);
        // }
        this.coinPool = Game.coinPool;        
        // for(var i = 0; i < 56; i++){
        //     var coin = new Coin();
        //     this.coinPool.push(coin);
        // }
        this.squarePool = Game.squarePool;        
        // for(var i = 0; i < 56; i++){
        //     var square = new Square(0, 0, 1);
        //     this.squarePool.push(square);
        // } 
        this.createNewLine();  
        this.distance = GameConstants.padding + 2*GameConstants.squareEdge;
        this.count = this.distance
        this.isCreatingMap = false;
        this.bottom = 0;
        this.bottom2 = 0;
    }
    update(dt){
        this.pushDown(dt);
        //console.log(this.isCreatingMap)
    }
    createNewLine(){
        Game.uiManager.igUI.setText(this.line);
        var line = new Row(this.line);
        var arr = line.data;
        for(var i = 0; i < arr.length ; i++){
            var positionX = (i+1)*GameConstants.padding + (2*i+1)*GameConstants.squareEdge;
            var positionY = GameConstants.defaultTopMap;
            var value = arr[i];
            //console.log(value);
            switch (value) {
                case 0:
                    continue;
                case -1:
                    var preBall = this.preBallPool.pop();
                    preBall.ball.position.set(positionX, positionY);
                    preBall.ring.position.set(positionX, positionY);
                    preBall.ringAnimation();
                    this.preBalls.push(preBall);
                    this.addChild(preBall);
                    continue;
                case -2:
                    var coin = this.coinPool.pop();
                    coin.coin.position.set(positionX, positionY);
                    this.coins.push(coin);
                    this.addChild(coin);
                    continue;
                default:
                    var square = this.squarePool.pop();
                    square.square.position.set(positionX, positionY);
                    square.index = value;
                    square.color = square.changeColor(value);
                    square.setText();
                    this.squares.push(square);
                    this.addChild(square);
                    continue;
            }
        }
        this.line++;
        if(this.line-1 > Game.best) {
            Game.best = this.line-1;
            Game.uiManager.igUI.drawBestScore();
        }
        this.count = this.distance;
        console.log("coinPool:" + this.coinPool.length + " preBallPool:" + this.preBallPool.length + " \nsquarePool:" + this.squarePool.length + " ballPool:" + Game.ballPool.length);
    }
    pushDown(delta){
        var dt = delta*GameConstants.pushDownSpeed;
        this.bottom = 0;
        this.bottom2 = 0;
        this.isCreatingMap = false;
        var bot = GameConstants.defaultBottom - GameConstants.ballRadius*3;
        if(this.squares.length>0){
            if(this.bottom < this.squares[0].getBounds().bottom)
            this.bottom = this.squares[0].getBounds().bottom;
            if(this.bottom2 < this.squares[0].getBounds().bottom)
            this.bottom2 = this.squares[0].getBounds().bottom;
        }
        if(this.coins.length>0){
            if(this.bottom2 < this.coins[0].getBounds().bottom)
            this.bottom2 = this.coins[0].getBounds().bottom;
            if(this.coins[0].getBounds().bottom > bot){
                this.coinPool.push(this.coins[0]);
                this.coins[0].parent.removeChild(this.coins[0]);
                this.coins.splice(0, 1);
            }
        }
        if(this.preBalls.length>0){
            if(this.bottom2 < this.preBalls[0].getBounds().bottom)
            this.bottom2 = this.preBalls[0].getBounds().bottom;
            if(this.preBalls[0].getBounds().bottom > bot){
                this.preBallPool.push(this.preBalls[0]);
                this.preBalls[0].parent.removeChild(this.preBalls[0]);
                this.preBalls.splice(0, 1);
            }
        }
        if(this.count > 0){
            if(this.count < dt) {
                dt = this.count;
            }
            for(var i = 0; i < this.squares.length; i++){
                //console.log(" over here");
                this.squares[i].square.y +=dt;
                this.squares[i].text.y +=dt;
            }
            for(var i = 0; i < this.coins.length; i++){
                this.coins[i].coin.y +=dt;
            }
            for(var i = 0; i < this.preBalls.length; i++){
                this.preBalls[i].ball.y +=dt;
                this.preBalls[i].ring.y +=dt;
            } 
            if(this.count >= dt) this.count -=dt;  
            this.isCreatingMap = true;         
        }       
    }
    resetMap(){
        TWEEN.removeAll();

        for(var i = 0; i < this.squares.length; i++){
            this.squarePool.push(this.squares[i]);
            this.squares[i].parent.removeChild(this.squares[i]);
        }
        this.squares.splice(0, this.squares.length);

        for(var i = 0; i < this.coins.length; i++){
            this.coinPool.push(this.coins[i]);
            this.coins[i].parent.removeChild(this.coins[i]);
        }
        this.coins.splice(0, this.coins.length);

        for(var i = 0; i < this.preBalls.length; i++){
            this.preBallPool.push(this.preBalls[i]);
            this.preBalls[i].parent.removeChild(this.preBalls[i]);
        } 
        this.preBalls.splice(0, this.preBalls.length);
        
        for(var i = 0; i < Game.balls.length; i++){   
            Game.balls[i].ball.x = GameConstants.defaultBallX;
            Game.balls[i].ball.y = GameConstants.defaultBottomBall;
            Game.balls[i].changeColor("white");
            Game.balls[i].distance = 0;  
            Game.balls[i].dx = 0;
            Game.balls[i].dy = 0;        
            Game.balls[i].readyGo = false;
            Game.balls[i].isBall = true;
            Game.ballPool.push(Game.balls[i]);
            Game.balls[i].parent.removeChild(Game.balls[i]);
        } 
        Game.balls.splice(0, Game.balls.length);

        this.bottom = 0;
        this.bottom2 = 0;
        this.line = 1;
        Game.ballController.removeChild(Game.ballController.ballGain);
        Game.ballController.removeChild(Game.ballController.ballNum); 
        Game.ballController.resetProp();
        Game.ballController.ballText = true;      
        Game.app.stage.removeChild(Game.uiManager.igUI);
        Game.isWaiting = true;

    }
}