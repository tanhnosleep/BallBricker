import { Container, Sprite, Texture, Ticker} from "pixi.js"
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";

const ballRadius = GameConstants.ballRadius;
const edge = GameConstants.squareEdge;
export class Ball extends Container{
    constructor(x = GameConstants.defaultBallX, y = GameConstants.defaultBottomBall){
        super();
        var ball0 = new Sprite(Texture.from("ball"));
        this.ballSkin = [];
        this.ballSkin.push(ball0);
        for (var i = 1; i< 10; i++){
            var ball = new Sprite(Texture.from("ball"+i));
            this.ballSkin.push(ball);
        }
        this.ball = this.ballSkin[0];
        this.init(x, y);
        this.addChild(this.ball);
    }
    init(x = GameConstants.defaultBallX, y = GameConstants.defaultBottomBall){
        this.ball.width = GameConstants.ballRadius*2;
        this.ball.height = GameConstants.ballRadius*2;
        this.ball.anchor.set(0.5, 0.5);
        this.ball.x = x;
        this.ball.y = y;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.readyGo = false;
        this.isBall = true;
    }
    changeColor(color){
        this.ball.tint = color;
    }
    squareCollision(dt, b){
        // if(this.isBall){
            for(var s = 0; s< Game.map.squares.length; s++){
                //Destroy square
                if(Game.map.squares[s].index == 0) {
                    Game.collision.emitSquareParticale(Game.map.squares[s]);
                    Game.map.squarePool.push(Game.collision.squares[s]);
                    Game.collision.squares[s].parent.removeChild(Game.collision.squares[s]);
                    Game.collision.squares.splice(s, 1);
                    break;
                }
                //Ball container
                var bc = this;
                //Get bounds
                var ball = bc.ball.getBounds();
                var square = Game.map.squares[s].square.getBounds();
                if(this.vectorDistance(ball, square > ballRadius + edge*Math.sqrt(2))) continue;
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
                var color = Math.abs(0xffffff - Game.map.squares[s].color + 4096*b);
                //Corner collision
                if(this.vectorDistance(bp, leftBottom)<ballRadius){
                    Game.collision.playSquareMusic();
                    this.changeColor(color);
                    if(bc.dx>0) bc.dx = -bc.dx;
                    if(bc.dy<0) bc.dy = -bc.dy;
                    Game.map.squares[s].decreaseIndex();
                    continue;
                } 
                //Corner collision
                if(this.vectorDistance(bp, leftTop)<ballRadius){
                    Game.collision.playSquareMusic();
                    this.changeColor(color);
                    if(bc.dx>0) bc.dx = -bc.dx;
                    if(bc.dy>0) bc.dy = -bc.dy;
                    Game.map.squares[s].decreaseIndex();
                    continue;
                } 
                //Corner collision
                if(this.vectorDistance(bp, rightBottom)<ballRadius){
                    Game.collision.playSquareMusic();
                    this.changeColor(color);
                    if(bc.dx<0) bc.dx = -bc.dx;
                    if(bc.dy<0) bc.dy = -bc.dy;
                    Game.map.squares[s].decreaseIndex();
                    continue;
                } 
                //Corner collision
                if(this.vectorDistance(bp, rightTop)<ballRadius){
                    Game.collision.playSquareMusic();
                    this.changeColor(color);
                    if(bc.dx<0) bc.dx = -bc.dx;
                    if(bc.dy>0) bc.dy = -bc.dy;
                    Game.map.squares[s].decreaseIndex();
                    continue;
                }     
                if(dx > dy) {      
                    //Horizontal collision     
                    if( dx < ballRadius + edge && dy < edge ) { 
                        Game.collision.playSquareMusic();
                        this.changeColor(color);
                        //this.balls[b].ball.x -=bc.dx*dt;
                        bc.dx = -bc.dx;   
                        Game.map.squares[s].decreaseIndex();      
                        //console.log("ngang");        
                    }
                } else { 
                    //Vertical collision
                    if( dy < ballRadius + edge && dx < edge) {   
                        Game.collision.playSquareMusic();
                        this.changeColor(color);
                        //this.balls[b].ball.y -=bc.dy*dt;
                        bc.dy = -bc.dy;  
                        Game.map.squares[s].decreaseIndex(); 
                        //console.log("doc");
                    }
                } 
            }
        // }      
    }
    vectorDistance(objA, objB){
        return Math.sqrt((objA.x- objB.x)*(objA.x- objB.x)+(objA.y- objB.y)*(objA.y- objB.y));
    }
}