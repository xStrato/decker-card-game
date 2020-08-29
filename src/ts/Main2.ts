import { Geom, Scene, GameObjects } from "phaser";
import PokerCard from "./objects/PokerCard";
import { CardState } from "./shared/Enums";

export default class Main2 extends Scene
{
    constructor()
    {
        super("Main2")
    }

    public create() 
    {
        const baseConfig = {
            scene:this, 
            x:50, 
            y:50,
            width: 100,
            height: 150,
            state: CardState.BACK_SIDE
        }

        const cardInfo = {
            suit: "♣",
            number: 5,
            color: "#000",
            textConfig: { 
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', 
                color: "#000", 
                fontSize: `${Math.floor(100 * .2)}px`
            }
        }
        const card = new PokerCard(baseConfig, cardInfo)
        console.log(card)    
    }
}