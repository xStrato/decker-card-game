import { Geom, GameObjects, Scene } from "phaser";

const { Rectangle } = Geom
const { Group } = GameObjects

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

interface ICard<T extends GameObjects.Group | GameObjects.Container>
{
    card: T
    width: number
    height: number
    x: number
    y: number
    draw(data: CardData): void
}

export default class Card extends GameObjects.Container
{
    public card: GameObjects.Container;
    public width: number
    public height: number
    public x: number
    public y: number
    private textConfig: {}

    /*
    *
    * @param {CardData} - Naipes: 1 - clubs (♣), 2 - diamonds (♦), 3 - hearts (♥), 4 - spades (♠)
    */
    constructor(scene: Scene, dimensions: CardDimensions, data: CardData )
    {
        super(scene)
        const { x, y, width, height } = dimensions

      this.width = width
      this.height = height
      this.x = x
      this.y = y
      this.textConfig = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: data.color, fontSize: Math.floor(width * .2) }

      this.draw({...data})
    }

    get ref(): GameObjects.Container
    {
        return this.card
    }

    public draw(data: CardData): void
    {
        let {naipe, cardNumber, color} = data

        naipe = this.getCardNaipe(naipe)
        cardNumber = this.getCardNumber(cardNumber)

        this.card = this.scene.add.container()
        const layout = this.scene.add.graphics()
            .fillRectShape(new Rectangle(0, 0, this.width, this.height))
            .fillStyle(0xFFFFFF)

        const text1 = this.scene.add.text(5, 0, cardNumber, this.textConfig);
        const text2 = this.scene.add.text(this.width - text1.width-3, 0, cardNumber, this.textConfig);
        const text3 = this.scene.add.text(text1.width+5, this.height, cardNumber, this.textConfig).setAngle(180);
        const text4 = this.scene.add.text(this.width-3, this.height, cardNumber, this.textConfig).setAngle(180);

        //Creates the naipe symbols under the numbers
        const text1Symbol1 = this.scene.add.text(0, 0, naipe, this.textConfig)
        text1Symbol1.setPosition(text1Symbol1.width/2 - text1.width *.1, text1.height/2)
        const text1Symbol2 = this.scene.add.text((this.width - text1Symbol1.width) - text1.width * .1, text1.height/2, naipe, this.textConfig)
        const text1Symbol3 = this.scene.add.text(text1Symbol1.width+text1.width * .2, this.height-text1.height/2, naipe, this.textConfig).setAngle(180)
        const text1Symbol4 = this.scene.add.text(this.width-text1.width *.1, this.height-text1.height/2, naipe, this.textConfig).setAngle(180)

        //Creates main symbol
        let symbol = this.scene.add.text(0,0, naipe, this.textConfig).setFontSize(this.width)
        symbol.setPosition(this.width/2-symbol.width/2, this.height/2 - symbol.height/2)
        symbol = this.ajustNaipeSize(symbol);

        const centerText = this.scene.add.text(0,0, cardNumber, this.textConfig).setFontSize(this.width/2.5).setColor("#fff")
        centerText.setPosition(this.width/2 - centerText.width/2, this.height/2 - centerText.height/2)

        const rect = this.scene.add.graphics()
        rect.lineStyle(1, color !== '#000'? 0xff0000 : 0x000, 1)
        rect.strokeRect(0, 0, this.width/1.5, this.height/1.5)
        //Centralizar a 1/6 to tamanho total da carta
        rect.setPosition(this.width/6, this.height/6)

        this.card.add([layout, text1, text2, text3, text4, text1Symbol1, text1Symbol2, text1Symbol3, text1Symbol4, symbol, centerText, rect])
        this.card.setPosition(this.x, this.y)
    }

    private ajustNaipeSize(naipeText: GameObjects.Text): GameObjects.Text
    {
        const ref = this.scene.add.text(0,0, "♥", this.textConfig).setFontSize(this.width).setVisible(false)
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

    public update(): void
    {
    }
  }