import { GameObjects, Scene } from "phaser";
import BoardService from "../services/BoardService";
import CardService from "../services/CardService";
import Card from "../shared/Card";
import { IBoard } from "../shared/contracts/IBoard";
import { Player, BoardServiceConfig, BinaryEntity } from "../shared/Types";

class Board extends GameObjects.Container implements IBoard<Card>
{
    public height: number
    public width: number
    private playersCard: BinaryEntity<Card[]>
    private playersPlaceholder: BinaryEntity<GameObjects.Sprite[]>
    private paddingX_Y: BinaryEntity<number>
    public cardWidth_Height: BinaryEntity<number>
    public spreadNumber: number

    constructor(public scene:Scene)
    {
      super(scene)
      this.width = +this.scene.game.config.width
      this.height = +this.scene.game.config.height
      
      this.cardWidth_Height = {
        entity0: this.width * .11,
        entity1: (this.width * .11) + (100*.3)
      }

      this.spreadNumber = Math.floor((this.width-this.cardWidth_Height.entity0)/ Math.floor(this.cardWidth_Height.entity0 + (this.cardWidth_Height.entity0 * .5)))
      
      this.paddingX_Y = { 
        entity0: (this.width - (this.spreadNumber  * this.cardWidth_Height.entity0))/3, 
        entity1: this.height * .05
      }

      this.setPosition(0, 0, this.width, this.height)
      this.setDataEnabled()
      this.data.set('shufflesCount', 0)
      this.scene.add.existing(this)
    }

    get players(): Player<Card>
    {
      return {
          player1: this.playersCard.entity0,
          player2: this.playersCard.entity1
      }
    }

    get placeholders(): Player<GameObjects.Sprite>
    {
        return {
          player1: this.playersPlaceholder.entity0, 
          player2: this.playersPlaceholder.entity1
        }
    }

    public shuffleAndCut(): this
    {
        let player1: Card[] | GameObjects.Sprite[]
        let player2: Card[] | GameObjects.Sprite[]

        //Placeholder cards for Player 1 at Top of the board
        const configPlayer1: BoardServiceConfig = {
          scope: this, 
          spreadNumber: this.spreadNumber, 
          x: this.paddingX_Y.entity0, 
          y: this.height-this.cardWidth_Height.entity1-this.paddingX_Y.entity1, 
          width: this.cardWidth_Height.entity0,
          height: this.cardWidth_Height.entity1
        }
        //Placeholder cards for Player 2 at Bottom of the board
        const configPlayer2: BoardServiceConfig = {
          scope: this, 
          spreadNumber: this.spreadNumber, 
          x: this.paddingX_Y.entity0, 
          y: this.paddingX_Y.entity1, 
          width: this.cardWidth_Height.entity0, 
          height: this.cardWidth_Height.entity1
        }

        player1 = BoardService.placeholderAt(configPlayer1)
        player2 = BoardService.placeholderAt(configPlayer2)

        this.playersPlaceholder = { entity0: player1, entity1: player2 }

        player1 = BoardService.mixUp(this.getCreateCardParams())
        player2 = BoardService.mixUp(this.getCreateCardParams())

        this.playersCard = { entity0: player1, entity1: player2 }

        return this
    }

    public playCards(player:string, setIteration:boolean=false, reveal:boolean=false): this
    {
      const effects = ['Quad', 'Back', 'Sine.easeInOut', 'Expo.easeIn', 'Back.easeInOut']
      const sortedEffect = effects[Phaser.Math.Between(0, effects.length-1)]

      this.players[player].forEach((card, index) => {

        this.scene.tweens.add({
          targets: card,
          x: this.placeholders[player][index].x - ((this.width)/2),
          y: player.includes("player2") ? this.height-this.cardWidth_Height.entity1-this.paddingX_Y.entity1 : this.paddingX_Y.entity1,
          duration: 1000,
          ease: sortedEffect,
          angle: 0,
          delay: 500*index,
          onComplete: reveal ? () => this.handleFlip(card) : null,
        })

        if(setIteration)
        {
          CardService
          .setInteration(card)
            .on("pointerdown", () => this.scene.events.emit("cardSeleted", card))
            .on("pointerover", () => this.scene.events.emit("cardSeletedOver", card))
            .on("pointerout", () => this.scene.events.emit("cardSeletedOut", card))
        }
      })

      return this
    }

    private handleFlip(card:Card)
    {
      card.flip(true)
      this.data.values.shufflesCount++
    }

    public requestADeal(name:string=""): Card
    {
      return BoardService
      .requestNewCard(this.getCreateCardParams())
      .setName(name)
    }

    private getCreateCardParams(): BoardServiceConfig
    {
      const mixUpConfig: BoardServiceConfig = 
      {
          scope: this,
          spreadNumber: this.spreadNumber,
          x: this.width-this.cardWidth_Height.entity0+(Math.floor(this.cardWidth_Height.entity0*.15)),
          y: (this.height/2 - this.cardWidth_Height.entity1/2+this.paddingX_Y.entity1)-(Math.floor(this.cardWidth_Height.entity0*.15)),
          width: this.cardWidth_Height.entity0,
          height: this.cardWidth_Height.entity1
      }
      return mixUpConfig
    }

    public setupCardDeck():void
    {
      const qtdCards = (Math.floor(this.cardWidth_Height.entity0*.15))
      const increment = (Math.floor(this.cardWidth_Height.entity0*.015))

      for (let i = 0; i <= qtdCards; i+=increment)
      {
        const mixUpConfig: BoardServiceConfig = 
        {
            scope: this,
            spreadNumber: this.spreadNumber,
            x: (this.width-this.cardWidth_Height.entity0) + i,
            y: (this.height/2 - this.cardWidth_Height.entity1/2+this.paddingX_Y.entity1) - i,
            width: this.cardWidth_Height.entity0,
            height: this.cardWidth_Height.entity1
        }

        const card = BoardService
          .requestNewCard(mixUpConfig)
          .setAngle(90)
          .setName('deck')

        if(i >= qtdCards-increment)
        {
          CardService
          .setInteration(card)
            .on("pointerdown", () => this.scene.events.emit("cardSeleted", card))
            .on("pointerover", () => this.scene.events.emit("cardSeletedOver", card))
            .on("pointerout", () => this.scene.events.emit("cardSeletedOut", card))
        }
      }
    }
}

export default Board