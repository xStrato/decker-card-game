import { Geom, GameObjects, Scene, Types, Display } from "phaser";
import CardService from "./Services/CardService";

const { Color, Graphics, Group, Text  } = {...Display, ...GameObjects}
const { Rectangle } = Geom

export enum CardState
{
    FACE_DOWN,
    FACE_UP,
}

type CardDimensions = {
    x: number
    y: number
    width: number
    height: number
}

type CardData = {
    naipe: string
    cardNumber: string
    color: string
}

interface ICard
{
    // card: T
    width: number
    height: number
    x: number
    y: number
    draw(data: CardData): void
}

export default class Card extends GameObjects.Container
{
    // public card: GameObjects.Container;
    public width: number
    public height: number
    public x: number
    public y: number
    private textConfig: Types.GameObjects.Text.TextStyle
    private flipState: boolean
    private faceData: CardData
    /*
    *
    * @param {CardData} - Naipes: 1 - clubs (♣), 2 - diamonds (♦), 3 - hearts (♥), 4 - spades (♠)
    */
    constructor(scene: Scene, dimensions: CardDimensions, data: CardData, flipAnimation: boolean = false, flipState: boolean = false)
    {
        super(scene)
        const { x, y, width, height } = dimensions

      this.width = width
      this.height = height
      this.x = x
      this.y = y
      this.textConfig = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: data.color, fontSize: `${Math.floor(width * .2)}px` }
      this.flipState = flipState
      this.faceData = data

      this.flip(flipAnimation)
      this.scene.add.existing(this)
    }
    
    private faceUp(data: CardData): void
    {
        let {naipe, cardNumber, color} = data

        naipe = this.getCardSuit(naipe)
        cardNumber = this.getCardNumber(cardNumber)

        const layout = new Graphics(this.scene).fillRectShape(new Rectangle(0, 0, this.width, this.height)).fillStyle(0xFFFFFF)

        const text1 = new Text(this.scene, 0, 0, cardNumber, this.textConfig)
        const text2 = new Text(this.scene, 0, 0, cardNumber, this.textConfig)
        const text3 = new Text(this.scene, 0, 0, cardNumber, this.textConfig).setAngle(180)
        const text4 = new Text(this.scene, 0, 0, cardNumber, this.textConfig).setAngle(180)

        const centerText = new Text(this.scene, 0,0, cardNumber, this.textConfig)
        .setFontSize(this.width/3)
        .setColor("#fff")
        .setShadowStroke(true)

        //Creates the naipe symbols under the numbers
        const textSuit1 = new Text(this.scene, 0, 0, naipe, this.textConfig)
        const textSuit2 = new Text(this.scene, 0, 0, naipe, this.textConfig)
        const textSuit3 = new Text(this.scene, 0, 0, naipe, this.textConfig).setAngle(180)
        const textSuit4 = new Text(this.scene, 0, 0, naipe, this.textConfig).setAngle(180)

        //Creates main Suit
        let centralSuit = new Text(this.scene, 0,0, naipe, this.textConfig).setFontSize(this.width)

        CardService.standardizeTextDimensions(this, [centralSuit, textSuit1, textSuit2, textSuit3, textSuit4], "♦");
        CardService.standardizeTextDimensions(this, [text1, text2, text3, text4, centerText], "5");

        const layoutConfig = 
        {
            paddingX: text1.displayWidth * .3,
            paddingY: text1.displayHeight * .3
        }

        text1.setPosition(layoutConfig.paddingX, 0)
        text2.setPosition(this.width - text2.displayWidth - layoutConfig.paddingX, 0)
        text3.setPosition(text2.displayWidth + layoutConfig.paddingX, this.height)
        text4.setPosition(this.width - layoutConfig.paddingX, this.height)
        centerText.setPosition(this.width/2 - centerText.displayWidth/2, this.height/2 - centerText.displayHeight/2)

        centralSuit.setPosition(this.width/2 - centralSuit.displayWidth/2, this.height/2 - centralSuit.displayHeight/2)
        textSuit1.setPosition(layoutConfig.paddingX, text1.displayHeight/2+layoutConfig.paddingY)
        textSuit2.setPosition(this.width - textSuit2.displayWidth - layoutConfig.paddingX, text2.displayHeight/2+layoutConfig.paddingY)
        textSuit3.setPosition(textSuit3.displayWidth + layoutConfig.paddingX, this.height-(text3.displayHeight/2+layoutConfig.paddingY))
        textSuit4.setPosition(this.width - layoutConfig.paddingX, this.height-(textSuit4.displayHeight/2+layoutConfig.paddingY))

        const centralRect = new Graphics(this.scene)
        .lineStyle(1, Color.HexStringToColor(color).color, 1)
        .strokeRect(this.width/6, this.height/6, this.width/1.5, this.height/1.5)

        this.add([layout, text1, text2, text3, text4, textSuit1, textSuit2, textSuit3, textSuit4, centralSuit, centerText, centralRect])
        this.setPosition(this.x, this.y)
    }

    private faceDown(color: number): void
    {
        const layout = new Graphics(this.scene, {fillStyle: { color: 0xffffff } })
            .fillRectShape(new Rectangle(0, 0, this.width, this.height))

        const rectacleSize = this.width/15
        const cellSize = this.width * 0.1

        const diamond = new Graphics(this.scene, {fillStyle: { color } }).fillRectShape(new Rectangle(0, 0, rectacleSize, rectacleSize))
        2020
        const textureName = `diamond${Math.floor(Math.random()*100000)}`
        diamond.generateTexture(textureName)

        const alignConfig:
        Types.Actions.GridAlignConfig = 
        {
            width: Math.ceil(this.width/cellSize),
            height: Math.floor(this.height/cellSize),
            cellWidth: cellSize,
            cellHeight: cellSize,
            x: rectacleSize,
            y: rectacleSize
        }
        
        const groupConfig: 
        Types.GameObjects.Group.GroupCreateConfig = 
        {
            key: textureName,
            frameQuantity: Math.floor(this.height/cellSize) * 10,
            gridAlign: alignConfig
        }

        const group = new Group(this.scene, groupConfig)
        this.add([layout,...group.getChildren()])
        group.destroy()
    }

    private getCardNumber(num: string): string
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

    private getCardSuit(suit: string): string
    {
        // 1 - clubs (♣), 2 - diamonds (♦), 3 - hearts (♥), 4 - spades (♠)
        switch(suit)
        {
            case '1': return "♣"
            case '2': return "♦"
            case '3': return "♥"
            case '4': return "♠"
            default: return suit
        }
    }

    public flip(animation: boolean = true): void
    {
        if(animation)
        {
            this.scene.tweens.add({
                targets: this,
                x: this.x + 10,
                y: this.y + 10,
                duration: 400,
                ease: 'Power2',
                yoyo: true
            })
        }
        
        switch(this.flipState)
        {
            case false: this.faceDown(Color.HexStringToColor(this.faceData.color).color); break;
            case true: this.faceUp({...this.faceData}); break;
        }

        this.flipState = !this.flipState
    }

    public addEvent(): this
    {
        this.setInteractive()
        this.input.hitArea.x += this.width/2
        this.input.hitArea.y += this.height/2

        return this
    }
  }