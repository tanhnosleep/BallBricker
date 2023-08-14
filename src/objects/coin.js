import { Container, Sprite, Texture } from "pixi.js"
import { GameConstants } from "../gameconstants/gameconstants";

export class Coin extends Container{
    constructor(x, y){
        super();
        this.coin = Sprite.from(Texture.from("ring"));
        this.coin.tint = "yellow";
        this.coin.anchor.set(0.5, 0.5);
        this.coin.width = 2*GameConstants.coinRadius;
        this.coin.height = 2*GameConstants.coinRadius;
        this.coin.x = x;
        this.coin.y = y;
        this.addChild(this.coin);
    }
}