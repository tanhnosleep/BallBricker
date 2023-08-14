import { GameConstants } from "../gameconstants/gameconstants";
import { Ball } from "./ball";
export class ActiveBall extends Ball{
    constructor(x=GameConstants.defaultBallX, y=GameConstants.defaultBottomBall){
        super(x,y);
    }

}