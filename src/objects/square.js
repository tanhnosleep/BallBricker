import { Container, Sprite, Text, TextStyle, Texture, Ticker} from "pixi.js"
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";
import { ShopUI } from "../UI/shopui";

const edge = GameConstants.squareEdge;
export class Square extends Container{
    constructor(x, y, index){
        super();
        this.square = Sprite.from(Texture.from("square"));
        this.color = this.changeColor(index);
        this.square.tint = this.color;
        this.square.anchor.set(0.5, 0.5);
        this.square.width = 2*edge;
        this.square.height = 2*edge;
        this.square.x = x;
        this.square.y = y;
        this.addChild(this.square);
        this.index = index;
        this.isFirst = true;
        this.textStyle = new TextStyle({
            fontSize: GameConstants.fontSize,
            fill: "black",
            fontFamily: GameConstants.defaultFont, 
        })        
        this.setText();     
    }    
    decreaseIndex(s){
        if(this.index > 0)this.index--;
        if(this.index == 0 || ShopUI.used == 7) {
            Game.collision.emitSquareParticale(this);
            Game.map.squarePool.push(this);
            this.parent.removeChild(this);
            Game.collision.squares.splice(s, 1);
        }
        this.color = this.changeColor(this.index);
        this.setText();
    }
    setText(){
        this.square.tint = this.color;
        if(this.isFirst){
            this.text = new Text(this.index, this.textStyle);
            this.text.anchor.set(0.5, 0.5);
            this.text.x = this.square.x;
            this.text.y = this.square.y;
            this.addChild(this.text);   
            this.isFirst = false;
        }    
        else {
            this.text.text = this.index;
            this.text.x = this.square.x;
            this.text.y = this.square.y;
        }   
    }
    changeColor(score){// hàm đổi màu theo điểm
        var baseColor = 0xfff;
        var newColor = baseColor - score * 0xf;
        var hex = "#" + newColor.toString(16);
        return hex;
    }
}