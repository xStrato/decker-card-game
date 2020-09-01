import { Scene, GameObjects } from "phaser";
import Match from "../scenes/Match";
import GambleBoard from "../components/GambleBoard";
import Card from "../shared/Card";
import { CardState } from "../shared/Enums";
import { Player } from "../shared/Types";

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
        this.match.data.events.on("changedata-counter", this.endTurn, this)
        this.match.data.events.on("endTurn", this.endTurn, this)
        this.match.data.events.on("updateInfoBar", this.updateInfoBar, this)
        
        this.tweens.add({
            targets: [this.match.cameras.main, this.cameras.main],
            zoom: { from: 2, to: 1 },
            duration: 1000,
            ease: "Bounce.easeOut",
            onComplete: () => this.setupCards()
        })
    }

    public updateInfoBar(event:string, target:Card): void
    {
        const potInc:number = this.gambleboard.data.get('potInc')
        const potBet:number = this.gambleboard.data.get('potBet')

        const { player1, player2 } = this.gambleboard.data.get('scores')

        const amount:number = Math.ceil((player1+player2)*potBet*.03)

        if(event === 'cardSeletedOver' && target.state === CardState.FRONT_SIDE)
        {
            if(target.name === 'deck')
            {
                this.gambleboard.sendHoldCommand(false)
                return
            }
            this.gambleboard.data.set('potInc', (potInc+amount))
        }

        if(event === 'cardSeletedOut' && target.state === CardState.FRONT_SIDE)
        {
            if(target.name === 'deck')
            {
                this.gambleboard.sendHoldCommand(true)
                return
            }
            this.gambleboard.data.set('potInc', (potInc-potInc))
        }

        if(event === "cardSeleted" && target.state === CardState.FRONT_SIDE)
        {
            if(target.name === 'deck')
            {
                this.gambleboard.data.set('potBet', potBet)
                return
            }
            this.gambleboard.data.set('potBet', potBet+amount)
            this.gambleboard.data.set('potInc', 0)
        }
    }

    private setupCards(): void
    {
        this.match.board.playCards("player1", true)
        this.match.board.playCards("player2", false, true)
    }

    public endTurn(card:Card, currentValue:number): void
    {
        if(currentValue >= this.match.board.spreadNumber || card.name?.includes('deck'))
        {
            const cardsPlayer1 = this.match.board.players['player1']
            const cardsPlayer2 = this.match.board.players['player2']

            cardsPlayer1.forEach(card => card.state===CardState.FRONT_SIDE ? card.flip(false):null)

            const graph = new Graphics(this, {fillStyle: {color: 0x000, alpha: .3}})
            .fillRect(0, 0, this.width, this.height)

            this.match.scene.pause()
            this.children.add(graph)

            const { player1, player2 } = this.match.scores

            this.updateUI(player1, player2)
            this.endTurnAnimation([...cardsPlayer1, ...cardsPlayer2], graph)
        }
    }

    private endTurnAnimation(targets:Card[], graph: GameObjects.Graphics): void
    {
        const xx = this.width/2-targets[0].width/2

        this.time.delayedCall(2000, () => {
            
            this.gambleboard.data.set('potBet', 200)

            this.tweens.add({
                targets: [...targets],
                duration: 500,
                x: xx-xx*.21,
                y: this.height/2-targets[0].height/2,
                ease: "Bounce",
                onComplete: () => {
                    graph.destroy()
                    this.resetMatch()
                }
            })
        })
    }

    private updateUI(player1:number, player2:number)
    {
        let winner:string
        let loser:string

        if(player1 > player2)
        {
            winner = "player1"
            loser = "player2"
        }else
        {
            winner = "player2"
            loser = "player1"
        }

        const scores = this.gambleboard.data.get('scores')
        const bags = this.gambleboard.data.get('bags')
        const pot = this.gambleboard.data.get('potBet')

        scores[winner]++
        bags[winner] += pot
        bags[loser] -= pot

        this.gambleboard.data.set('potBet', pot)
        this.gambleboard.data.set('bags', bags)
        this.gambleboard.data.set('scores', scores)
    }
    
    public resetMatch():void
    {
        this.match.events.off('cardSeleted')
        this.match.events.off('cardSeletedOver')
        this.match.events.off('cardSeletedOut')

        this.match.scene.restart()

        this.time.delayedCall(1000, () => this.setupCards())
    }
}