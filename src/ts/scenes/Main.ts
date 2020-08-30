import { Scene, GameObjects } from "phaser";
import Match from "../scenes/Match";
import GambleBoard from "../components/GambleBoard";
import Card from "../shared/Card";

const { Graphics } = {...GameObjects }

export default class Main extends Scene
{
    public width: number
    public height: number
    public match: Match
    public gambleboard: GambleBoard

    constructor()
    {
        super("Main")
    }

    public preload(): void
    {
        this.width = +this.game.config.width
        this.height = +this.game.config.height

        this.match = this.scene.add("Match", new Match(), true) as Match
        this.gambleboard = new GambleBoard(this, this.width, this.height, {player1: 0, player2: 0}).create()
    }

    public create(): void
    {  
        this.match.data.events.on("changedata-counter", this.hasTurnEnded, this)
        

        this.tweens.add({
            targets: [this.match.cameras.main, this.cameras.main],
            // targets: ,
            zoom: { from: 2, to: 1 },
            duration: 1000,
            ease: "Bounce.easeOut",
            onComplete: () => {
                this.match.board.playCards("player1", true)
                this.match.board.playCards("player2", false, true)
            }
        })
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

            const graph = new Graphics(this, {fillStyle: {color: 0x000, alpha: .3}})
            .fillRect(0, 0, this.width, this.height)
            this.match.scene.pause()

            this.children.add(graph)

            this.time.delayedCall(3000, () => {
                graph.clear();
                this.resetMatch()
            })
        }
    }
    
    public resetMatch():void
    {
        this.match.events.off('cardSeleted')
        this.match.events.off('cardSeletedOver')
        this.match.events.off('cardSeletedOut')

        this.match.scene.restart()

        this.time.delayedCall(1000, () => {
            this.match.board.playCards("player1", true)
            this.match.board.playCards("player2", false, true)
        })
    }
}