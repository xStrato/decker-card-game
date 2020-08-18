import { GameObjects, Scene } from "phaser";
import Card from "./Card";
import BoardService, { BoardServiceConfig } from "./Services/BoardService";

export default class Board extends GameObjects.Container
{
    public height: number
    public width: number
    private player1: Array<Card>;
    private player2: Array<Card>;
    private placeholderPlayer1: Array<GameObjects.Sprite>;
    private placeholderPlayer2: Array<GameObjects.Sprite>;
    private paddingX: number
    private paddingY: number
    private cardWidth: number
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

    get players(): { [player:string]: Card[] }
    {
      return {
          player1: this.player1,
          player2: this.player2
      }
    }

    get placeholders(): { [player:string]: GameObjects.Sprite[] }
    {
        return {
          player1: this.placeholderPlayer1, 
          player2: this.placeholderPlayer2
        }
    }

    public shuffleAndCut(): this
    {
        //Placeholder cards for Player 1 at Top of the board
        this.placeholderPlayer1 = BoardService.placeholderAt(this, this.spreadNumber, this.paddingX, this.height-this.cardHeight-this.paddingY, this.cardWidth, this.cardHeight)
        //Placeholder cards for Player 2 at Bottom of the board
        this.placeholderPlayer2 = BoardService.placeholderAt(this, this.spreadNumber, this.paddingX, this.paddingY, this.cardWidth, this.cardHeight)

        this.player1 = BoardService.mixUp(this.getCreateCardParams())
        this.player2 = BoardService.mixUp(this.getCreateCardParams())

        return this
    }

    public playCards(player:string, setIteration:boolean=false, reveal:boolean=false): this
    {
      this.players[player].forEach((card, index) => {

        if(setIteration)
        {
          card.setInteration()
          .on("pointerdown", () => this.scene.events.emit("cardSeleted", card))
          .on("pointerover", () => this.scene.events.emit("cardSeletedOver", card))
          .on("pointerout", () => this.scene.events.emit("cardSeletedOut", card))
        }

        this.scene.tweens.add({
          onStart: () => this.removeInteractive(),
          targets: card,
          x: this.placeholders[player][index].x - ((this.width)/2),
          y: player.includes("player2") ? this.height-this.cardHeight-this.paddingY : this.paddingY,
          duration: 2000,
          ease: 'Power2',
          angle: 0,
          delay: 1000*index,
          onComplete: reveal ? () => this.scene.time.delayedCall(50*index, () => card.flip()) : null,
        })
      })
      return this
    }

    public requestADeal(label: string = ""): Card
    {
      var card = BoardService.requestNewCard(this.getCreateCardParams())
      card.label = label
      return card;
    }

    private getCreateCardParams(): BoardServiceConfig
    {
      const mixUpConfig: BoardServiceConfig = 
      {
          scope: this,
          spreadNumber: this.spreadNumber,
          x: this.width-this.cardWidth,
          y: this.height/2 - this.cardHeight/2+this.paddingY,
          width: this.cardWidth,
          height: this.cardHeight
      }
      return mixUpConfig
    }

    public setupCardDeck():void
    {
      const deck = this.requestADeal("deck")
        .setAngle(90)
        .setInteration()
        .on("pointerdown", () => this.scene.events.emit("cardSeleted", deck))
        .on("pointerover", () => this.scene.events.emit("cardSeletedOver", deck))
        .on("pointerout", () => this.scene.events.emit("cardSeletedOut", deck))
    }
}