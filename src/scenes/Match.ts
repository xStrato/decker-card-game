import { Scene, GameObjects, Display } from "phaser";
import Board from "../objects/Board";
import { Players } from "../shared/Types";
import { CardState } from "../shared/Enums";
import Card from "../shared/Card";

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
        this.data.set('counter', 0)

        this.placehold = undefined

        this.board = new Board(this)
        this.setupMatchAssets()
        this.board.setupCardDeck()
        this.board.shuffleAndCut()

        this.board.data.events.on('changedata-shufflesCount', this.enableGameplay, this)
    }

    get scores(): Players
    {
        return {
            player1: this.board.players["player1"].map(card => card.number).reduce((acc, cur) => acc+cur),
            player2: this.board.players["player2"].map(card => card.number).reduce((acc, cur) => acc+cur),
        }
    }

    public enableGameplay(board: Board, currentValue:number): void
    {
        if(currentValue >= 5)
        {
            this.events
            .on("cardSeleted", this.cardSeleted, this)
            .on("cardSeletedOver", this.cardSeletedOver, this)
            .on("cardSeletedOut", this.cardSeletedOut, this)
        }
    }

    private cardSeleted(card: Card): void
    {
        this.events.emit('updateInfoBar', 'cardSeleted', card)
        
        if(card.state !== CardState.BACK_SIDE && card.name !== 'deck')
        {
            this.placehold?.destroy()
            card.flip(true)

            this.data.values.counter++
        }

        if(card.name.includes('deck'))
        {
            this.events.emit('endTurn', card)
        }
    }

    private cardSeletedOver(card: Card): void
    {
        this.placehold = new Graphics(this).fillStyle(0x000, 0.4)

        switch(card.name)
        {
            case 'deck': this.placehold.fillRect(card.x-card.height, card.y, card.height, card.width);break
            default: this.placehold.fillRect(card.x, card.y, card.width, card.height);break
        }
        this.events.emit('updateInfoBar', 'cardSeletedOver', card)
        this.add.existing(this.placehold)
    }

    private cardSeletedOut(card: Card): void
    {
        this.placehold?.destroy()
        this.events.emit('updateInfoBar', 'cardSeletedOut', card)
    }

    private setupMatchAssets():void
    {
        this.data.set('backPlateRectSize', this.board.cardWidth_Height.entity0/15) 
        const miniRectSize = this.data.get('backPlateRectSize')
        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#FF0000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("redBackPlate")
        .setAlpha(0)

        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("blackBackPlate")
        .setAlpha(0)
    }
}