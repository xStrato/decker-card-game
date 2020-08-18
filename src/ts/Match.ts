import { Scene, Geom, GameObjects, Input } from "phaser";
import Board from "./Board";
import Card from "./Card";

const { Graphics } = { ...Input, ...GameObjects}

export default class Match extends GameObjects.GameObject
{
    private counter: number
    private placehold: GameObjects.Graphics
    private deck: Card

    constructor(public scene: Scene, public board: Board)
    {
        super(scene, "Match")
        this.counter = 0
    }

    public create(): void
    {
        this.board.shuffleAndCut()
        this.board.playCards("player1").setInteration()
        this.board.playCards("player2", true)

        //makes the central deck and attach events
        this.deck = this.board.requestADeal("deck")
        .setAngle(90)
        .setInteration()
        .on("pointerdown", () => this.scene.events.emit("cardSeleted", this.deck))
        .on("pointerover", () => this.scene.events.emit("cardSeletedOver", this.deck))
        .on("pointerout", () => this.scene.events.emit("cardSeletedOut", this.deck))


    }

    private drawComponents(): void
    {

    }

    public cardSeleted(card:Card): void
    {
        if(card.flipState && card.label !== 'deck')
        {
            this.placehold.destroy()
            card.flip()
            this.counter++
            this.scene.events.emit("counterUpdated", this.counter)
        }
    }

    public counterUpdated(counter:number):void
    {
        if(counter >= 5)
        {
            this.scene.events.emit("turnEnd", this)
        }
    }

    public cardSeletedOver(card: Card): void
    {
        if(card.label === 'deck')
        {
            this.placehold= new Graphics(this.scene).fillStyle(0x000, 0.3)
            .fillRectShape(new Geom.Rectangle(card.x-card.height, card.y, card.height, card.width))
        }else
        {
            this.placehold = new Graphics(this.scene).fillStyle(0x000, 0.3)
            .fillRectShape(new Geom.Rectangle(card.x, card.y, card.width, card.height))
        }
        this.scene.add.existing(this.placehold)
    }

    public cardSeletedOut(card: Card): void
    {
        this.placehold.destroy()
    }

    get scores(): { player1: number, player2: number }
    {
        return {
            player1: this.board.player1.map(card => +card.cardInfo.cardNumber).reduce((acc, cur) => acc+cur),
            player2: this.board.player2.map(card => +card.cardInfo.cardNumber).reduce((acc, cur) => acc+cur),
        }
    }
}