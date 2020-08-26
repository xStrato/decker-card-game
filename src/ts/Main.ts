import { Geom, Scene, GameObjects } from "phaser";
import Match from "./Match";
import Card from "./Card";
import GambleBoard from "./components/GambleBoard";

const { Graphics } = GameObjects

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
        this.gambleboard = new GambleBoard(this, width, height, {player1: 10, player2: 8})
    }

    public create(): void
    {  
        // this.add.text(200, 160, "New Game", { fontSize: 34 }).setInteractive().on("pointerdown", () => this.resetMatch())

        this.match.data.events.on("changedata-counter", this.hasTurnEnded, this)
    }

    public hasTurnEnded(card:Card, currentValue:number, previousValue:number): void
    {
        if(currentValue >= this.match.board.spreadNumber)
        {
            const { player1, player2 } = this.match.scores

            const winner = player1 > player2 ? "player1" : "player2"
            const scores = this.gambleboard.data.get('scores')
            scores[winner]++

            this.gambleboard.data.set('scores', scores)

            const graph = new Graphics(this, {fillStyle: {color: 0x000, alpha: .3}}).fillRectShape(new Geom.Rectangle(0, 0, 640, 360))
            this.match.scene.pause()

            this.children.add(graph)

            this.time.delayedCall(3000, () => {graph.clear();this.resetMatch()})
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