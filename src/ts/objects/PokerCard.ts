import { Scene, GameObjects, Types, Display, Geom } from 'phaser'
import CardService from '../services/CardService'
import Card from '../shared/Card'
import { CardBaseConfig, PokerCardInfo } from '../shared/Types'
const { Color, Graphics, Group, Text  } = {...Display, ...GameObjects}
const { Rectangle } = Geom

export default class PokerCard extends Card
{
    public suit:string
    public number:number
    public color:string
    public textConfig: Types.GameObjects.Text.TextStyle

    constructor(cardBaseConfig: CardBaseConfig, pokerCardInfo: PokerCardInfo)
    {
        const { scene, width, height, x, y, state } = cardBaseConfig
        const { suit, number, color, textConfig } = pokerCardInfo

        super(scene, width, height, x, y, state)
        this.suit = suit
        this.number = number
        this.color = color
        this.textConfig = textConfig

        this.drawFrontSide()
    }

    public flip(animation:boolean): void {
        throw new Error('Method not implemented.')
    }
    protected drawBackSide(): void {
        throw new Error('Method not implemented.')
    }
    protected drawFrontSide(): void 
    {
        const layout = new Graphics(this.scene)
        .fillRectShape(new Rectangle(0, 0, this.width, this.height))
        .fillStyle(0xFFFFFF)

        const cardNumber = CardService.getCardNumber(String(this.number))

        const text1 = new Text(this.scene, 0, 0, cardNumber, this.textConfig)
        const text2 = new Text(this.scene, 0, 0, cardNumber, this.textConfig)
        const text3 = new Text(this.scene, 0, 0, cardNumber, this.textConfig).setAngle(180)
        const text4 = new Text(this.scene, 0, 0, cardNumber, this.textConfig).setAngle(180)

        this.add([layout, text1, text2, text3, text4])
    }
}