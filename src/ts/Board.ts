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
    private paddingLeft: number = 0
    private paddingX: number
    private paddingY: number
    private cardWidth: number
    private cardHeight: number

    constructor(
        public scene:Scene,
        private spreadNumber: number,
        // private cardWidth = 100,
        // private cardHeight = cardWidth+(100*.3),
        private backgroundColor = "#00AA37"
        )
    {
      super(scene)
      this.width = +this.scene.game.config.width
      this.height = +this.scene.game.config.height
      this.scene.add.existing(this)

      this.paddingX = this.width * .1
      this.paddingY = this.height * .05

      this.cardWidth = this.width * .11
      this.cardHeight = this.cardWidth + (100*.3)

      this.setPosition(0, 0, this.width, this.height)
    }

    public shuffleAndCut(): this
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

        //Placeholder cards for Player 1 at Top of the board
        this.placeholderPlayer1 = BoardService.placeholderAt(this, this.spreadNumber, this.paddingLeft+this.paddingX, this.height-this.cardHeight-this.paddingY, this.cardWidth, this.cardHeight)
        //Placeholder cards for Player 2 at Bottom of the board
        this.placeholderPlayer2 = BoardService.placeholderAt(this, this.spreadNumber, this.paddingLeft+this.paddingX, this.paddingY, this.cardWidth, this.cardHeight)

        this.player1 = BoardService.mixUp(mixUpConfig)
        this.player2 = BoardService.mixUp(mixUpConfig)

        return this
    }

    public playCards(player: string, reveal: boolean = false): this
    {
      const players: { [player:string]: Card[] } = 
      {
        player1: this.player1,
        player2: this.player2
      }

      const placeholders: { [player:string]: GameObjects.Sprite[] } = 
      {
        player1: this.placeholderPlayer1, 
        player2: this.placeholderPlayer2
      }

      players[player].forEach((card, index) => {

        this.scene.tweens.add({
          targets: card,
          x: placeholders[player][index].x - ((this.width)/2),
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
}