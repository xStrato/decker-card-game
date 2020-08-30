import { GameObjects, Display } from "phaser"
import Card from "../shared/Card"

const { Color, Graphics, Text  } = {...Display, ...GameObjects}

export default class CardService
{
    public static generateLayout(card: Card): GameObjects.Graphics
    {
        return new Graphics(card.scene)
        .fillStyle(0xFFFFFF)
        .fillRect(0, 0, card.width, card.height)
    }

    public static getCardSuit(suit: number): string
    {
        switch(suit)
        {
            case 1: return "♣"
            case 2: return "♦"
            case 3: return "♥"
            case 4: return "♠"
            default: return String(suit)
        }
    }

    public static getCardNumber(num: number): string
    {
        switch(num)
        {
            case 1: return "A"
            case 11: return "K"
            case 12: return "Q"
            case 13: return "J"
            default: return String(num)
        }
    }

    public static setInteration<T extends Card>(card: T): T
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

    public static generateCardBackPlate(card:Card, width:number, color:string): void
    {
        const rectacleSize = card.width/15
        const cellSize = width * 0.1

        const diamond = new Graphics(card.scene)
        .fillStyle(Color.HexStringToColor(color).color)
        .fillRect(0, 0, rectacleSize, rectacleSize)
        .generateTexture("cardBackPlate")

        // const textureName = `diamond${Math.floor(Math.random()*100000)}`

        const blitter = card.scene.add.blitter(0, 0, 'cardBackPlate')

    }
}