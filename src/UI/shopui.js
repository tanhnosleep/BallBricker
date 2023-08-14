import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { GameConstants } from "../gameconstants/gameconstants";
import { Game } from "../game";

const halfEdge = GameConstants.screenWidth/(6 + 4/3);
const padding = halfEdge/3;
const top = GameConstants.screenHeight/2 - 4*halfEdge;
const used = localStorage.getItem("used");

export class ShopUI extends Container {
    static used = used == null ? 0 :used;
    constructor() {
        super();
        this.changeBallSkin(ShopUI.used);
        this.drawTextShop();
        this.drawBack();
        // this.drawNumberOfRing();
        this.isFirst = true;
        this.items = [];
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                this.drawItem(i,j);
            }
        }
        // this.changeBallSkin(ShopUI.used);
        // console.log(this.items);
    }
    drawBack(){
        var tmp = Sprite.from(Texture.from("backButton"));
        tmp.anchor.set(0.5, 0.5);
        tmp.width = GameConstants.squareEdge*1.5;
        tmp.height = GameConstants.squareEdge*1.5;
        tmp.x = GameConstants.squareEdge*1.5;
        tmp.y = GameConstants.squareEdge*1.5;
        tmp.eventMode = "static";
        tmp.on("pointerup", () => {
            console.log("Back");
            Game.app.stage.removeChild(Game.uiManager.shUI);
            Game.app.stage.addChild(Game.uiManager.stUI);
        })
        this.addChild(tmp);
    }
    drawTextShop(){ // vẽ chữ shop 
        const text = new Text("SHOP", { 
            fontFamily: "Arial",
            fontSize: 48,
            fill: 0xffffff, 
        });
        text.anchor.set(0.5, 0.5);
        text.x = GameConstants.screenWidth*0.5;
        text.y = GameConstants.screenHeight*0.15;
        this.addChild(text);        
    }
    drawNumberOfRing(){ 
        if(this.isFirst){
            var textStyle = new TextStyle({
                fontSize: GameConstants.fontSize,
                fill: "white",
                fontFamily: GameConstants.defaultFont, 
            }); 
            this.coinText = new Text(Game.coinScore, textStyle);
            this.coinText.anchor.set(1, 0.5);
            this.coinText.x =  GameConstants.screenWidth - GameConstants.squareEdge*1.5;
            this.coinText.y = GameConstants.squareEdge*1.5;
    
            var ring = Sprite.from(Texture.from("ring"));
            ring.anchor.set(0.5, 0.5);
            ring.width = GameConstants.coinRadius*1.5;
            ring.height = GameConstants.coinRadius*1.5;
            ring.x = GameConstants.screenWidth - GameConstants.squareEdge;
            ring.y = GameConstants.squareEdge*1.5;
            ring.tint = "yellow";
            this.addChild( this.coinText, ring);
            this.isFirst = false;
        }
        else {
            this.coinText.text = Game.coinScore;
            this.coinText.x =  GameConstants.screenWidth - GameConstants.squareEdge*1.5;
            this.coinText.y = GameConstants.squareEdge*1.5;
        }
    }
    drawItem(row, col) { // vẽ item shop ứng với hàng, cột
        var name = "ball"+(3*row+(col+1));
        // console.log(name);
        const item = Sprite.from(Texture.from(name));
        item.id = 3*row+col+1;
        item.anchor.set(0.5, 0.5);
        item.width = halfEdge;
        item.height = halfEdge;
        const x = (col+1)*padding + (2*col + 1)*halfEdge;
        const y = top + (3*row + 1)*halfEdge;
        item.position.set(x, y);
        item.price = 100*(3*row+(col+1));
        item.sold = false;

        var sold = localStorage.getItem("sold"+item.id);
        if(sold == "true" ) item.sold = true;

        item.tint = 0x000000;
        if(item.sold == true) {
            item.tint = 0x666666;
        }
        if(ShopUI.used == item.id) item.tint = 0xffffff;

        item.textStyle = new TextStyle({
            fontSize: GameConstants.fontSize,
            fill: "white",
            fontFamily: GameConstants.defaultFont, 
        }); 
        item.coinText = new Text(item.price, item.textStyle);
        item.coinText.anchor.set(0.5, 0.5);
        item.coinText.x =  x - GameConstants.coinRadius;
        item.coinText.y = y + halfEdge;

        item.ring = Sprite.from(Texture.from("ring"));
        item.ring.anchor.set(0.5, 0.5);
        item.ring.width = GameConstants.coinRadius*1.5;
        item.ring.height = GameConstants.coinRadius*1.5;
        item.ring.x = x + halfEdge*0.5;
        item.ring.y = y + halfEdge;
        item.ring.tint = "yellow";

        this.items.push(item);
        this.addChild(item, item.ring, item.coinText);

        item.eventMode = "static";
        item.on("pointerup", () => {   
            if(item.sold) {
                if(ShopUI.used>0) this.items[ShopUI.used-1].tint = 0x666666;
                if(ShopUI.used == item.id ) {
                    ShopUI.used = 0;
                    this.changeBallSkin(ShopUI.used);
                }
                else {
                    ShopUI.used = item.id;
                    this.changeBallSkin(ShopUI.used);
                    item.tint = 0xffffff;
                }
                console.log("Skin ball id:" + ShopUI.used); 
                return;
            }
            if(Game.coinScore >= item.price) {
                if(ShopUI.used>0 && this.items[ShopUI.used-1].sold) this.items[ShopUI.used-1].tint = 0x666666;
                ShopUI.used = item.id;
                item.sold = true;
                item.tint = 0xffffff;
                Game.coinScore -=item.price;
                this.changeBallSkin(ShopUI.used);
                Game.uiManager.shUI.drawNumberOfRing();
            }  
            console.log("Skin ball " +item.id + " sold:" + item.sold);  
            // console.log("Skin ball id:" + ShopUI.used); 
        })
    }
    changeBallSkin(){
        Game.ballPool.forEach(ball => {
            ball.removeChild(ball.ball);
            ball.ball = ball.ballSkin[ShopUI.used];
            ball.init();
            ball.addChild(ball.ball);
        })
        Game.preBallPool.forEach(ball => {
            ball.removeChild(ball.ball);
            ball.ball = ball.ballSkin[ShopUI.used];
            ball.init();
            ball.addChild(ball.ball);
        })
    }
}


