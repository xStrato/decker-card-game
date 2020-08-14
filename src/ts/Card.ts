import { Geom, GameObjects, Scene, Types, Actions } from "phaser";

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
    cardNumber: number
    color: string
}

interface ICard<T extends GameObjects.Group | GameObjects.Container>
{
    card: T
    width: number
    height: number
    x: number
    y: number
    create(): void
}

export default class Card extends Group implements ICard<GameObjects.Container>
{
    public card: GameObjects.Container;
    public width: number
    public height: number
    public x: number
    public y: number
    private naipes: GameObjects.Group

    constructor(scene: Scene, dimensions: CardDimensions, data: CardData )
    {
      super(scene)
      const { x, y, width, height } = dimensions

      this.width = width
      this.height = height
      this.x = x
      this.y = y

      this.create()
    }

    public create(): void
    {
        this.card = this.scene.add.container()
        const layout = this.scene.add.graphics()
            .fillRectShape(new Rectangle(0, 0, this.width, this.height))
            .fillStyle(0xffffff)

        const textConfig = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: 18 }

        const text1 = this.scene.add.text(0, 0, '10', textConfig);
        const text2 = this.scene.add.text(this.width - text1.width, 0, '10', textConfig);
        const text3 = this.scene.add.text(text1.width, this.height, '10', textConfig).setAngle(180);
        const text4 = this.scene.add.text(this.width, this.height, '10', textConfig).setAngle(180);

        
    
        this.card.add([layout, text1, text2, text3, text4])
        this.card.setPosition(this.x, this.y)

        //Creates the naipe symbols under the numbers
        const text1Symbol1 = this.scene.add.text(5, 15, '♥', textConfig)
        const text1Symbol2 = this.scene.add.text(this.width - text1.width + 5, 15, '♥', textConfig)
        const text1Symbol3 = this.scene.add.text(text1.width - 5, this.height - 15, '♥', textConfig).setAngle(180)
        const text1Symbol4 = this.scene.add.text(this.width - 5, this.height - 15, '♥', textConfig).setAngle(180)

        this.card.add([text1Symbol1, text1Symbol2, text1Symbol3, text1Symbol4]).setInteractive(new Rectangle(this.x, this.y, this.width, this.height), Rectangle.Contains).on('pointerdown', () => console.log("Clicked"))


        //Creates the Draw Symbols
        const alignConfig: Types.Actions.GridAlignConfig=
        {
            width: 2,
            height: 5,
            cellWidth: 64,
            cellHeight: 36,
            x: this.x + this.width * 0.40,
            y: this.y + this.height * 0.075
        }

        const symbols = this.scene.add.group()
        for (let i = 0; i < 10; i++) {
            symbols.add(this.scene.add.text(this.x, this.y, "♥", textConfig).setFontSize(52))
        }

        Actions.GridAlign(symbols.getChildren(), alignConfig)
    }
  }