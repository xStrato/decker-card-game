import { Scene, GameObjects, Display } from "phaser";
import Board from "./Board";
import PokerCard from "./PokerCard";
import { Score } from "../shared/Types";
import CardService from "../services/CardService";

const { Graphics, Color } = {...GameObjects, ...Display}

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
        console.log(this.scene)
        this.data.set('counter', 0)

        this.placehold = undefined

        this.board = new Board(this)
        this.setupMathAssets()
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
            player1: this.board.players["player1"].map(card => card.number).reduce((acc, cur) => acc+cur),
            player2: this.board.players["player2"].map(card => card.number).reduce((acc, cur) => acc+cur),
        }
    }

    public cardSeleted(card:PokerCard): void
    {
        if(card.label !== 'deck')
        {
            this.placehold?.destroy()
            card.flip()

            this.data.values.counter++
        }
    }

    public cardSeletedOver(card: PokerCard): void
    {
        if(card.label === 'deck')
        {
            this.placehold = new Graphics(this).fillStyle(0x000, 0.3)
            .fillRect(card.x-card.height, card.y, card.height, card.width)
        }else
        {
            this.placehold = new Graphics(this).fillStyle(0x000, 0.3)
            .fillRect(card.x, card.y, card.width, card.height)
        }
        
        this.add.existing(this.placehold)
    }

    public cardSeletedOut(card: PokerCard): void
    {
        this.placehold?.destroy()
    }

    public enableInteraction(player:string): void
    {
        this.board.players[player].forEach(card => {
            CardService.setInteration(card)
          .on("pointerdown", () => this.events.emit("cardSeleted", card))
          .on("pointerover", () => this.events.emit("cardSeletedOver", card))
          .on("pointerout", () => this.events.emit("cardSeletedOut", card))
        })
    }

    private setupMathAssets():void
    {
        this.data.set('backPlateRectSize', this.board.cardWidth/15) 
        const miniRectSize = this.data.get('backPlateRectSize')
        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#FF0000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("redBackPlate")

        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("blackBackPlate")
    }
}