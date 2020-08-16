import { Geom, GameObjects, Scene, Types, Display } from "phaser";

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
    private cardState: CardState
    private faceData: CardData
    /*
    *
    * @param {CardData} - Naipes: 1 - clubs (♣), 2 - diamonds (♦), 3 - hearts (♥), 4 - spades (♠)
    */
    constructor(scene: Scene, dimensions: CardDimensions, data: CardData, cardState: CardState = CardState.FACE_DOWN, flipAnimation: boolean = true)
    {
        super(scene)
        const { x, y, width, height } = dimensions

      this.width = width
      this.height = height
      this.x = x
      this.y = y
      this.textConfig = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: data.color, fontSize: `${Math.floor(width * .2)}` }
      this.cardState = cardState
      this.faceData = data

      this.flip(cardState, flipAnimation)

      this.scene.add.existing(this)
    }
    
    private faceUp(data: CardData): void
    {
        let {naipe, cardNumber, color} = data

        naipe = this.getCardNaipe(naipe)
        cardNumber = this.getCardNumber(cardNumber)

        const layout = new Graphics(this.scene).fillRectShape(new Rectangle(0, 0, this.width, this.height)).fillStyle(0xFFFFFF)

        const text1 = new Text(this.scene, 5, 0, cardNumber, this.textConfig);
        const text2 = new Text(this.scene, this.width - text1.width-3, 0, cardNumber, this.textConfig);
        const text3 = new Text(this.scene, text1.width+5, this.height, cardNumber, this.textConfig).setAngle(180);
        const text4 = new Text(this.scene, this.width-3, this.height, cardNumber, this.textConfig).setAngle(180);

        //Creates the naipe symbols under the numbers
        const text1Symbol1 = new Text(this.scene, 0, 0, naipe, this.textConfig)
        text1Symbol1.setPosition(text1Symbol1.width/2 - text1.width *.1, text1.height/2)
        const text1Symbol2 = new Text(this.scene, (this.width - text1Symbol1.width) - text1.width * .1, text1.height/2, naipe, this.textConfig)
        const text1Symbol3 = new Text(this.scene, text1Symbol1.width+text1.width * .2, this.height-text1.height/2, naipe, this.textConfig).setAngle(180)
        const text1Symbol4 = new Text(this.scene, this.width-text1.width *.1, this.height-text1.height/2, naipe, this.textConfig).setAngle(180)

        //Creates main symbol
        let symbol = new Text(this.scene, 0,0, naipe, this.textConfig).setFontSize(this.width)
        symbol.setPosition(this.width/2-symbol.width/2, this.height/2 - symbol.height/2)
        symbol = this.ajustNaipeSize(symbol);

        const centerText = new Text(this.scene, 0,0, cardNumber, this.textConfig).setFontSize(this.width/2.5).setColor("#fff")
        centerText.setPosition(this.width/2 - centerText.width/2, this.height/2 - centerText.height/2)

        const rect = new Graphics(this.scene)
        rect.lineStyle(1, color !== '#000'? 0xff0000 : 0x000, 1)
        rect.strokeRect(0, 0, this.width/1.5, this.height/1.5)
        //Centralizar a 1/6 to tamanho total da carta
        rect.setPosition(this.width/6, this.height/6)

        this.add([layout, text1, text2, text3, text4, text1Symbol1, text1Symbol2, text1Symbol3, text1Symbol4, symbol, centerText, rect])
        this.setPosition(this.x, this.y)
    }

    private faceDown(color: number): void
    {
        const layout = new Graphics(this.scene, {fillStyle: { color: 0xffffff } })
            .fillRectShape(new Rectangle(0, 0, this.width, this.height))

        const squadSize = this.width/15
        const cellSize = 7

        const diamond = new Graphics(this.scene, {fillStyle: { color } }).fillRectShape(new Rectangle(0, 0, squadSize, squadSize))

        const textureName = `diamond${Math.floor(Math.random()*100000)}`
        diamond.generateTexture(textureName)

        const alignConfig: 
        Types.Actions.GridAlignConfig = 
        {
            width: this.width/cellSize,
            height: this.height/cellSize,
            cellWidth: cellSize,
            cellHeight: cellSize,
            x: 5,
            y: 6
        }

        const groupConfig: 
        Types.GameObjects.Group.GroupCreateConfig = 
        {
            key: textureName,
            frameQuantity: (this.width/7) * Math.floor(this.height/7),
            gridAlign: alignConfig
        }

        const group = new Group(this.scene, groupConfig)
        this.add([layout,...group.getChildren()])
        group.destroy()
        layout.closePath()
    }

    private ajustNaipeSize(naipeText: GameObjects.Text): GameObjects.Text
    {
        const ref = new Text(this.scene, 0,0, "♥", this.textConfig).setFontSize(this.width).setVisible(false)
        naipeText.width = ref.width
        ref.destroy()

        return naipeText
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

    private getCardNaipe(naipe: string): string
    {
        // 1 - clubs (♣), 2 - diamonds (♦), 3 - hearts (♥), 4 - spades (♠)
        switch(naipe)
        {
            case '1': return "♣"
            case '2': return "♦"
            case '3': return "♥"
            case '4': return "♠"
            default: return naipe
        }
    }

    public flip(cardState: CardState, animation: boolean = true): void
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
        
        switch(cardState)
        {
            case CardState.FACE_DOWN: this.faceDown(Color.HexStringToColor(this.faceData.color).color); break;
            case CardState.FACE_UP: this.faceUp({...this.faceData}); break;
            default: break;
        }
    }
  }