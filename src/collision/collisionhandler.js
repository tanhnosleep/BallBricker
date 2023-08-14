import { Container, Text, TextStyle, Texture } from "pixi.js";
import { ActiveBall } from "../objects/activeball";
import { Game } from "../game";
import { GameConstants } from "../gameconstants/gameconstants";
import { Sound, sound } from "@pixi/sound";
import TWEEN from "@tweenjs/tween.js"
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import *as settingS1 from "../../assets/particle/emitter.json";
import *as settingS2 from "../../assets/particle/emitter1.json";
import *as settingP from "../../assets/particle/emitter2.json";
import { ShopUI } from "../UI/shopui";
const ballRadius = GameConstants.ballRadius;
const edge = GameConstants.squareEdge;
const coinRadius = GameConstants.coinRadius;


export class CollisionHandler{
    constructor(balls, squares, coins, preBalls){
        this.balls = balls;
        this.squares = squares;
        this.coins = coins;
        this.preBalls = preBalls;
        this.ballGainNum = 0;
    }
    update(dt){
        if(!Game.ballController.readyAttack) return;
        if(this.squares.length > 0) this.squareCollision(dt);
        // this.squareCollision2(dt);
        if(this.coins.length > 0) this.coinCollision(dt);
        if(this.preBalls.length > 0)  this.preBallCollision(dt);
    }
    playSquareMusic(){
        if(Game.music) {
            sound.play("ballSound");
        }
    }
    playCoinMusic(){
        // if (Game.music) this.coinSound.play();
        if(Game.music) sound.play("coinSound");
    }
    squareCollision(dt){
        for(var b = 0; b< this.balls.length; b++){
            if(this.balls[b].ball.getBounds().top > Game.map.bottom) continue;
            if(this.balls[b].isBall){
                for(var s = 0; s< this.squares.length; s++){
                    //Destroy square
                    // if(this.squares[s].index == 0) {
                    //     this.emitSquareParticale(this.squares[s]);
                    //     Game.map.squarePool.push(this.squares[s]);
                    //     this.squares[s].parent.removeChild(this.squares[s]);
                    //     this.squares.splice(s, 1);
                    //     continue;
                    // }
                    //Ball container
                    var bc = this.balls[b];
                    //Get bounds
                    var ball = bc.ball.getBounds();
                    var square = this.squares[s].square.getBounds();
                    //Position
                    var bx = ball.x + ballRadius + bc.dx*dt;
                    var by = ball.y + ballRadius + bc.dy*dt;
                    var sx = square.x + edge;
                    var sy = square.y + edge;
                    //Distance
                    var dx = Math.abs(bx - sx);
                    var dy = Math.abs(by - sy);
                    //Corner
                    var leftBottom = {x: square.left, y: square.bottom};
                    var leftTop = {x: square.left, y: square.top};
                    var rightBottom = {x: square.right, y: square.bottom};
                    var rightTop = {x: square.right, y: square.top};
                    var bp = {x: bx, y: by}
                    //ChangeBallCorlor
                    var color = this.squares[s].color;
                    //Corner collision
                    if(this.vectorDistance(bp, leftBottom)<ballRadius){
                        this.playSquareMusic();
                        this.balls[b].changeColor(color);
                        if(bc.dx>0) bc.dx = -bc.dx;
                        if(bc.dy<0) bc.dy = -bc.dy;
                        this.squares[s].decreaseIndex(s);
                        continue;
                    } 
                    //Corner collision
                    if(this.vectorDistance(bp, leftTop)<ballRadius){
                        this.playSquareMusic();
                        this.balls[b].changeColor(color);
                        if(bc.dx>0) bc.dx = -bc.dx;
                        if(bc.dy>0) bc.dy = -bc.dy;
                        this.squares[s].decreaseIndex(s);
                        continue;
                    } 
                    //Corner collision
                    if(this.vectorDistance(bp, rightBottom)<ballRadius){
                        this.playSquareMusic();
                        this.balls[b].changeColor(color);
                        if(bc.dx<0) bc.dx = -bc.dx;
                        if(bc.dy<0) bc.dy = -bc.dy;
                        this.squares[s].decreaseIndex(s);
                        continue;
                    } 
                    //Corner collision
                    if(this.vectorDistance(bp, rightTop)<ballRadius){
                        this.playSquareMusic();
                        this.balls[b].changeColor(color);
                        if(bc.dx<0) bc.dx = -bc.dx;
                        if(bc.dy>0) bc.dy = -bc.dy;
                        this.squares[s].decreaseIndex(s);
                        continue;
                    }     
                    if(dx > dy) {      
                        //Horizontal collision     
                        if( dx < ballRadius + edge && dy < edge ) { 
                            this.playSquareMusic();
                            this.balls[b].changeColor(color);
                            //this.balls[b].ball.x -=bc.dx*dt;
                            bc.dx = -bc.dx;   
                            this.squares[s].decreaseIndex(s);      
                            //console.log("ngang");        
                        }
                    } else { 
                        //Vertical collision
                        if( dy < ballRadius + edge && dx < edge) {   
                            this.playSquareMusic();
                            this.balls[b].changeColor(color);
                            //this.balls[b].ball.y -=bc.dy*dt;
                            bc.dy = -bc.dy;  
                            this.squares[s].decreaseIndex(s); 
                            //console.log("doc");
                        }
                    } 
                }
            }
        }
    }
    squareCollision2(dt){
        if(!Game.ballController.readyAttack) return;
        for(var b = 0; b< this.balls.length; b++){
            if(this.balls[b].dy == 0 || !this.balls[b].isBall) continue;
            this.balls[b].squareCollision(dt, b);
        }
    }
    coinCollision(dt){
        for(var b = 0; b< this.balls.length; b++){
            if(this.balls[b].ball.getBounds().top > Game.map.bottom2) continue;
            if(this.balls[b].isBall){
                for(var c = 0; c< this.coins.length; c++){
                    var ball = this.balls[b].ball;
                    var ballX = ball.getBounds().x + ballRadius + this.balls[b].dx*dt;
                    var ballY = ball.getBounds().y + ballRadius + this.balls[b].dy*dt;
                    var coin = {x: this.coins[c].coin.getBounds().x + coinRadius, y: this.coins[c].coin.getBounds().y + coinRadius};
                    if(this.vectorDistance({x: ballX, y: ballY}, coin)<ballRadius+coinRadius){
                        Game.map.coinPool.push(this.coins[c]);
                        this.coins[c].parent.removeChild(this.coins[c]);      
                        this.coins.splice(c, 1);
                        this.playCoinMusic();
                        Game.coinScore++;
                        Game.uiManager.igUI.drawCoinScore();
                    }
                }
            }
        }
    }
    preBallCollision(dt){
        for(var b = 0; b< this.balls.length; b++){
            if(this.balls[b].ball.getBounds().top > Game.map.bottom2) continue;
            if(this.balls[b].isBall){
                for(var p = 0; p< this.preBalls.length; p++){
                    var ball = this.balls[b].ball;
                    var ballX = ball.getBounds().x + ballRadius + this.balls[b].dx*dt;
                    var ballY = ball.getBounds().y + ballRadius + this.balls[b].dy*dt;
                    var preBall = {x: this.preBalls[p].ball.getBounds().x + ballRadius, y: this.preBalls[p].ball.getBounds().y + ballRadius};
                    if(this.vectorDistance({x: ballX, y: ballY}, preBall)<ballRadius+coinRadius){
                        // this.preBalls[p].ringDestroy = true;
                        // this.preBalls[p].ball.tint = "green";
                        // var preBall = this.preBalls[p];                    
                        // this.preBalls.splice(p, 1);
                        // this.balls.push(preBall);
                        // this.balls[this.balls.length-1].dx = 0; 
                        // this.balls[this.balls.length-1].dy = GameConstants.fallSpeed*dt;    
                        // this.balls[this.balls.length-1].readyGo = true; 
                        var newBall = Game.ballPool.pop();
                        newBall.ball.position.set(this.preBalls[p].ball.x, this.preBalls[p].ball.y);  
                        this.balls.push(newBall);
                        Game.app.stage.addChild(newBall);
                        newBall.isBall = false;  
                        newBall.readyGo = true;    
                        newBall.changeColor("green"); 
                        newBall.distance = 0; 
                        newBall.dx = 0; 
                        newBall.dy = GameConstants.fallSpeed*dt;  
                        this.emitPreBallParticle(this.preBalls[p]);
                        Game.map.preBallPool.push(this.preBalls[p]);
                        this.preBalls[p].parent.removeChild(this.preBalls[p]);       
                        // this.preBalls[p].destroy();               
                        this.preBalls.splice(p, 1);  
                        this.playSquareMusic();
                        this.ballGainNum++;
                    }
                }
            }
        }
    }
    vectorDistance(objA, objB){
        return Math.sqrt((objA.x- objB.x)*(objA.x- objB.x)+(objA.y- objB.y)*(objA.y- objB.y));
    }
    emitSquareParticale(square){
        // tạo particle trước khi biến mất
        var tmp = new Container();
        tmp.position.set(square.square.x-GameConstants.squareEdge/2,square.square.y-GameConstants.squareEdge/2); // vị trí của particle ở góc trái hình vuông
        Game.app.stage.addChild(tmp);
        let texture = Texture.from("square"); // các hạt là hình vuông
        var emitter1 = new Emitter(tmp, upgradeConfig(settingS1,[texture]));
        emitter1.autoUpdate = true;
        emitter1.emit = true;// chạy particle
        var emitter2 = new Emitter(tmp,upgradeConfig(settingS2,[texture]));
        emitter2.autoUpdate = true;
        emitter2.emit = true;// chạy particle
    }
    
    emitPreBallParticle(ball){
      // tạo particle trước khi biến mất
        var tmp = new Container();
        tmp.position.set(ball.ball.x,ball.ball.y); // vị trí của particle ở giữa hình vuông
        Game.app.stage.addChild(tmp);
        let texture = Texture.from("square"); // các hạt là hình tròn quả bóng
        var emitter = new Emitter(tmp, upgradeConfig(settingP,[texture]));
        emitter.autoUpdate = true;
        emitter.emit = true;// chạy particle
    }
}