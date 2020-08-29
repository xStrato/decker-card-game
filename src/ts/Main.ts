import { Geom, Scene, GameObjects, Display } from "phaser";
import Match from "./Match";
import Card from "./Card";
import GambleBoard from "./components/GambleBoard";

const { Graphics, Color } = {...GameObjects, ...Display}

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

        this.data.set('backPlateRectSize', width/15) 

        this.match = this.scene.add("Match", new Match(), true) as Match
        this.gambleboard = new GambleBoard(this, width, height, {player1: 10, player2: 8})
    }

    public create(): void
    {  
        const miniRectSize = this.data.get('backPlateRectSize')

        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#FF0000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("redBackPlate")

        this.add.graphics()
        .fillStyle(Color.HexStringToColor("#000").color)
        .fillRect(0, 0, miniRectSize, miniRectSize)
        .generateTexture("blackBackPlate")

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