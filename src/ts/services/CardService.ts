import { GameObjects } from "phaser"
import Card from "../shared/Card"
const { Text } = GameObjects

export default class CardService
{
    public static getCardSuit(suit: string): string
    {
        switch(suit)
        {
            case '1': return "♣"
            case '2': return "♦"
            case '3': return "♥"
            case '4': return "♠"
            default: return suit
        }
    }

    public static getCardNumber(num: string): string
    {
        switch(num)
        {
            case '1': return "A"
            case '11': return "K"
            case '12': return "Q"
            case '13': return "J"
            default: return num
        }
    }

    public static setInteration(card: Card): Card
    {
        card.setInteractive()
        card.input.hitArea.x += card.width/2
        card.input.hitArea.y += card.height/2

        return card
    }

    public static standardizeTextDimensions(scope:Card, textObjs:GameObjects.Text[], refSuit:string): void
    {
        textObjs.forEach(text => {
            const ref = new Text(scope.scene, 0,0, refSuit, text.style).setVisible(false)
            text.setDisplaySize(ref.displayWidth, ref.displayHeight)
            ref.destroy()
        })
    }
}