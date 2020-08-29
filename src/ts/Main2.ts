import { Geom, Scene, GameObjects, Display } from "phaser";
import PokerCard from "./objects/PokerCard";
import { CardState } from "./shared/Enums";

const { Color } = {...Display}

export default class Main2 extends Scene
{
    constructor()
    {
        super("Main2")
    }

    public preload():void
    {
        const width = +this.game.config.width
        const height = +this.game.config.height

        this.data.set('backPlateRectSize', 100/15) 

        const miniRectSize = this.data.get('backPlateRectSize')

        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#FF0000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("redBackPlate")

        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("blackBackPlate")
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
        let card = new PokerCard(baseConfig, cardInfo)
        // this.time.delayedCall(10000, ()=>{
        //     card.destroy()
        //     console.log(card)
        //     card = undefined
        //     console.log(card)
        // })
    }
}