import { Scene } from "phaser";
import Match from "./Match";
import Card from "./Card";
import GambleBoard from "./Components/GambleBoard";

export default class Main extends Scene
{
    public match: Match
    public gambleboard: GambleBoard

    constructor()
    {
        super("Main")
    }

    public preload(): void
    {
        const width = +this.game.config.width
        const height = +this.game.config.height

        this.match = this.scene.add("Match", new Match(), true) as Match
        this.gambleboard = new GambleBoard(this, width, height, {player1: 0, player2: 0})
    }

    public create(): void
    {  
        // this.add.text(200, 160, "New Game", { fontSize: 34 }).setInteractive().on("pointerdown", () => this.resetMatch())

        this.match.data.events.on("changedata-counter", this.hasTurnEnded, this)
    }

    public hasTurnEnded(card: Card, currentValue:number, previousValue:number): void
    {
        if(currentValue >= this.match.board.spreadNumber)
        {
            const { player1, player2 } = this.match.scores

            const winner = player1 > player2 ? "player1" : "player2"

            this.resetMatch()
        }
    }
    
    public resetMatch():void
    {
        this.match.events.off('cardSeleted')
        this.match.events.off('cardSeletedOver')
        this.match.events.off('cardSeletedOut')

        this.match.scene.restart()
    }
}