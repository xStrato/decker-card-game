import { Scene, Geom } from "phaser";
import Match from "./Match";
import Board from "./Board";

export default class Main extends Scene
{
    public match: Match | undefined
    public matches: {player1: number, player2: number}

    constructor()
    {
        super("Main")
        this.matches = { player1: 0, player2: 0 }
    }

    public create(): void
    {
        this.add.text(200, 160, "New Game", { fontSize: 34 }).setInteractive().on("pointerdown", this.createMatch, this)
    }

    public createMatch(): void
    {
        if(this.match === undefined)
        {
            this.match = new Match(this, new Board(this))
            this.match.create()
            
            this.events
            .on("cardSeleted", this.match!.cardSeleted, this.match)
            .on("cardSeletedOver", this.match!.cardSeletedOver, this.match)
            .on("cardSeletedOut", this.match!.cardSeletedOut, this.match)
            .on("counterUpdated", this.match!.counterUpdated, this.match)
            .on("turnEnd", this.turnEnd, this)
            
        } else { this.resetScene(); this.createMatch() }
    }

    public turnEnd(match: Match):void
    {
        const { player1, player2 } = match.scores

        const winner = player1 > player2 ? "player1" : "player2"

        this.matches[winner]++
        this.resetScene()
    }

    public resetScene(): void
    {
        this.match = undefined
        this.createMatch()
        // this.scene.restart()
        // this.scene.start()
    }
}