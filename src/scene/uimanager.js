import { Game } from "../game";
import { InGameUI } from "../UI/ingameui";
import { GameOverUI } from "../UI/gameoverui";
import { StartUI } from "../UI/startui";
import { PauseUI } from "../UI/pauseui";
import { ShopUI } from "../UI/shopui";

export class UIManager{
    constructor(){
        this.stUI = new StartUI();
        this.igUI = new InGameUI();
        this.psUI = new PauseUI();
        this.goUI = new GameOverUI();
        this.shUI = new ShopUI();
    }
    update(){
        this.stUI.musicButton.listen();
        this.psUI.musicButton.listen();
    }
}