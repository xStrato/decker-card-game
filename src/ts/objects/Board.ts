import { GameObjects, Scene } from "phaser";
import BoardService from "../services/BoardService";
import CardService from "../services/CardService";
import Card from "../shared/Card";
import { BoardElement, BoardServiceConfig } from "../shared/Types";
import PokerCard from "./PokerCard";

export default class Board extends GameObjects.Container
{
    public height: number
    public width: number
    private player1: PokerCard[];
    private player2: PokerCard[];
    private placeholderPlayer1: GameObjects.Sprite[]
    private placeholderPlayer2: GameObjects.Sprite[]
    private paddingX: number
    private paddingY: number
    public cardWidth: number
    private cardHeight: number
    public spreadNumber: number

    constructor(public scene:Scene)
    {
      super(scene)
      this.width = +this.scene.game.config.width
      this.height = +this.scene.game.config.height

      this.cardWidth = this.width * .11
      this.cardHeight = this.cardWidth + (100*.3)

      this.paddingY = this.height * .05
      
      this.spreadNumber = Math.floor((this.width-this.cardWidth)/ Math.floor(this.cardWidth + (this.cardWidth * .5)))
      this.paddingX = (this.width - (this.spreadNumber  * this.cardWidth))/3

      this.setPosition(0, 0, this.width, this.height)
      this.scene.add.existing(this)
    }

    get players(): BoardElement<PokerCard>
    {
      return {
          player1: this.player1,
          player2: this.player2
      }
    }

    get placeholders(): BoardElement<GameObjects.Sprite>
    {
        return {
          player1: this.placeholderPlayer1, 
          player2: this.placeholderPlayer2
        }
    }

    public shuffleAndCut(): this
    {
        //Placeholder cards for Player 1 at Top of the board
        const configPlayer1: BoardServiceConfig = {
          scope: this, 
          spreadNumber: this.spreadNumber, 
          x: this.paddingX, 
          y: this.height-this.cardHeight-this.paddingY, 
          width: this.cardWidth, 
          height: this.cardHeight
        }
        this.placeholderPlayer1 = BoardService.placeholderAt(configPlayer1)

        //Placeholder cards for Player 2 at Bottom of the board
        const configPlayer2: BoardServiceConfig = {
          scope: this, 
          spreadNumber: this.spreadNumber, 
          x: this.paddingX, 
          y: this.paddingY, 
          width: this.cardWidth, 
          height: this.cardHeight
        }
        this.placeholderPlayer2 = BoardService.placeholderAt(configPlayer2)

        this.player1 = BoardService.mixUp(this.getCreateCardParams())
        this.player2 = BoardService.mixUp(this.getCreateCardParams())

        return this
    }

    public playCards(player:string, setIteration:boolean=false, reveal:boolean=false): this
    {
      this.players[player].forEach((card, index) => {

        this.scene.tweens.add({
          targets: card,
          x: this.placeholders[player][index].x - ((this.width)/2),
          y: player.includes("player2") ? this.height-this.cardHeight-this.paddingY : this.paddingY,
          duration: 2000,
          ease: 'Power2',
          angle: 0,
          delay: 1000*index,
          onComplete: reveal ? () => this.scene.time.delayedCall(50*index, () => card.flip()) : null,
        })

        if(setIteration)
        {
          CardService.setInteration(card)
            .on("pointerdown", () => this.scene.events.emit("cardSeleted", card))
            .on("pointerover", () => this.scene.events.emit("cardSeletedOver", card))
            .on("pointerout", () => this.scene.events.emit("cardSeletedOut", card))
        }
      })

      return this
    }

    public requestADeal(label: string = ""): PokerCard
    {
      const card = BoardService.requestNewCard(this.getCreateCardParams())
      card.label = label
      return card;
    }

    private getCreateCardParams(): BoardServiceConfig
    {
      const mixUpConfig: BoardServiceConfig = 
      {
          scope: this,
          spreadNumber: this.spreadNumber,
          x: this.width-this.cardWidth+(Math.floor(this.cardWidth*.15)),
          y: (this.height/2 - this.cardHeight/2+this.paddingY)-(Math.floor(this.cardWidth*.15)),
          width: this.cardWidth,
          height: this.cardHeight
      }
      return mixUpConfig
    }

    public setupCardDeck():void
    {
      const qtdCards = (Math.floor(this.cardWidth*.15))

      for (let i = 0; i <= qtdCards; i+=(Math.floor(this.cardWidth*.015)))
      {
        const mixUpConfig: BoardServiceConfig = 
        {
            scope: this,
            spreadNumber: this.spreadNumber,
            x: (this.width-this.cardWidth) + i,
            y: (this.height/2 - this.cardHeight/2+this.paddingY) - i,
            width: this.cardWidth,
            height: this.cardHeight
        }

        if(i >= qtdCards-1)
        {
          const card = BoardService.requestNewCard(mixUpConfig).setAngle(90)
            
          CardService
          .setInteration(card)
            .on("pointerdown", () => this.scene.events.emit("cardSeleted", card))
            .on("pointerover", () => this.scene.events.emit("cardSeletedOver", card))
            .on("pointerout", () => this.scene.events.emit("cardSeletedOut", card))

            card.label = 'deck'
        }else
        {
          const card = BoardService.requestNewCard(mixUpConfig).setAngle(90)
          card.label = 'deck'
        }
      }
    }
}