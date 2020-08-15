import { Scene, GameObjects } from "phaser";
import Card from "./Card";

export default class Main extends Scene
{
  private height: number
  private width: number
  public mainDeck: Card
  public deck1: Array<GameObjects.Container> = [];
  public deck2: Array<GameObjects.Container> = [];
  public paddingX = 120;
  public paddingLeft = 25;
  public paddingY = 20;
  public widthCard = 70
  public heightCard = 100

    constructor()
    {
      super("Main") 
    }

    public preload(): void
    {
      this.width = +this.game.config.width
      this.height = +this.game.config.height
      this.initSetup()
    }

    public create(): void
    {
      const card = new Card(this, {x: this.width-this.widthCard, y: this.height/2 - this.heightCard/2+this.paddingY, width:this.widthCard, height:this.heightCard}, {naipe: `${Phaser.Math.Between(1, 4)}`, cardNumber: `${Phaser.Math.Between(1, 13)}`, color: '#FF0000' })

      card.ref.setRotation(90*Math.PI/180)

      this.revealDeck(this.deck1, this.paddingX, this.height-this.heightCard-this.paddingY)
      this.revealDeck(this.deck2, this.paddingX, this.paddingY)
      
    }

    public initSetup(): void
    {
      for (let i = 0; i < 5; i++)
      {
        this.add.graphics()
        .lineStyle(1, 0x000, 1)
        .strokeRect(this.paddingLeft+this.paddingX*i, this.paddingY, this.widthCard, this.heightCard)
      }

      for (let i = 0; i < 5; i++)
      {
        this.add.graphics()
        .lineStyle(1, 0x000, 1)
        .strokeRect(this.paddingLeft+this.paddingX*i, this.height-this.heightCard-this.paddingY, this.widthCard, this.heightCard)
      }

      for (let i = 0; i < 5; i++)
      {
        this.tweens.add({
          targets: this.deck1[i],
          x: (this.paddingLeft+this.paddingX)*i,
          y: this.height-this.heightCard-this.paddingY,
          duration: 3000,
          ease: 'Power2',
          angle: 0
        })
      }
      for (let i = 0; i < 5; i++)
      {
        const card = new Card(this, {x:this.width-this.widthCard, y:this.height/2 - this.heightCard/2+this.paddingY, width:this.widthCard, height:this.heightCard}, {naipe: `${Phaser.Math.Between(1, 4)}`, cardNumber: `${Phaser.Math.Between(1, 13)}`, color: '#FF0000' })
        this.deck1.push(card.ref.setRotation(90*Math.PI/180));
      }

      for (let i = 0; i < 5; i++)
      {
        const card = new Card(this, {x: this.width-this.widthCard, y:this.height/2 - this.heightCard/2+this.paddingY, width:this.widthCard, height:this.heightCard}, {naipe: `${Phaser.Math.Between(1, 4)}`, cardNumber: `${Phaser.Math.Between(1, 13)}`, color: '#000' })
        this.deck2.push(card.ref.setRotation(90*Math.PI/180));
      }
    }

    public revealDeck(deck: GameObjects.Container[], x: number, y: number): void
    {
      this.time.addEvent({delay: 1000})
      for (let i = 0; i < 5; i++)
      {
        this.tweens.add({
          targets: deck[i],
          x: this.paddingLeft+x*i,
          y,
          duration: 3000,
          ease: 'Power2',
          angle: 0
        })
      }
    }

    public update(): void
    {
    }
  }