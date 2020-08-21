import { Scene, Geom, GameObjects, Input } from "phaser";
import Board from "./Board";
import Card from "./Card";
import { Score } from "./Components/GambleBoard";

const { Graphics } = { ...Input, ...GameObjects}

export default class Match extends Scene
{
    private placehold: GameObjects.Graphics | undefined
    public board: Board

    constructor()
    {
        super("Match")
    }

    public create(): void
    {
        this.data.set('counter', 0)

        this.placehold = undefined

        this.board = new Board(this)

        //makes the central deck
        this.board.setupCardDeck()
        
        this.board.shuffleAndCut()
        this.board.playCards("player1", true)
        this.board.playCards("player2", false, true)

        this.events
        .on("cardSeleted", this.cardSeleted, this)
        .on("cardSeletedOver", this.cardSeletedOver, this)
        .on("cardSeletedOut", this.cardSeletedOut, this)
    }

    get scores(): Score
    {
        return {
            player1: this.board.players["player1"].map(card => +card.cardInfo.cardNumber).reduce((acc, cur) => acc+cur),
            player2: this.board.players["player2"].map(card => +card.cardInfo.cardNumber).reduce((acc, cur) => acc+cur),
        }
    }

    public cardSeleted(card:Card): void
    {
        if(card.flipState && card.label !== 'deck')
        {
            this.placehold?.destroy()
            card.flip()

            this.data.values.counter++
        }
    }

    public cardSeletedOver(card: Card): void
    {
        if(card.label === 'deck')
        {
            this.placehold = new Graphics(this).fillStyle(0x000, 0.3)
            .fillRectShape(new Geom.Rectangle(card.x-card.height, card.y, card.height, card.width))
        }else
        {
            this.placehold = new Graphics(this).fillStyle(0x000, 0.3)
            .fillRectShape(new Geom.Rectangle(card.x, card.y, card.width, card.height))
        }
        
        this.add.existing(this.placehold)
    }

    public cardSeletedOut(card: Card): void
    {
        this.placehold?.destroy()
    }

    public enableInteraction(player:string): void
    {
        console.log(player)
        console.log("object")
        this.board.players[player].forEach(card=> {
            card.setInteration()
          .on("pointerdown", () => this.events.emit("cardSeleted", card))
          .on("pointerover", () => this.events.emit("cardSeletedOver", card))
          .on("pointerout", () => this.events.emit("cardSeletedOut", card))
        })
    }
}