import { Scene, GameObjects, Sound } from "phaser";
import Match from "../scenes/Match";
import GambleBoard from "../components/GambleBoard";
import Card from "../shared/Card";
import { CardState } from "../shared/Enums";

const { Graphics } = {...GameObjects }

export default class Main extends Scene
{
    public width: number
    public height: number
    public match: Match
    public gambleboard: GambleBoard
    public coinSound: Sound.BaseSound
    public music: Sound.BaseSound
    public flipSound: Sound.BaseSound
    public shuffleSound: Sound.BaseSound

    constructor()
    {
        super("Main")
    }

    public preload(): void
    {

        this.load.audio('coin', ['audio/coin.ogg', 'audio/coin.mp3'])
        this.load.audio('music', ['audio/music.mp3'])
        this.load.audio('card_flip', ['audio/card_flip.ogg', 'audio/card_flip.mp3'])
        this.load.audio('shuffle', ['audio/shuffle.ogg', 'audio/shuffle.mp3'])

        this.width = +this.game.config.width
        this.height = +this.game.config.height

        this.match = this.scene.add("Match", Match, true) as Match
        this.gambleboard = new GambleBoard(this, this.width, this.height, {player1: 0, player2: 0}, 10000).create()
    }

    public create(): void
    {  
        this.coinSound = this.sound.add('coin', { volume: 2 })
        this.flipSound = this.sound.add('card_flip', { volume: 2 })
        this.shuffleSound = this.sound.add('shuffle', { volume: 1 })
        this.sound.add('music', { volume: .4 }).play()

        this.match.data.events.on("changedata-counter", this.endTurn, this)
        this.match.data.events.on("endTurn", this.endTurn, this)
        this.match.data.events.on("updateInfoBar", this.updateInfoBar, this)
        
        this.tweens.add({
            onStart: () => this.coinSound?.play(),
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
                this.coinSound.play()
                this.gambleboard.data.set('potBet', potBet)
                return
            }
            this.gambleboard.data.set('potBet', potBet+amount)
            this.gambleboard.data.set('potInc', 0)
        }
    }

    public endTurn(card:Card, currentValue:number): void
    {
        this.updateGameComponents(card, currentValue)

        const { player1, player2 } = this.gambleboard.data.get('bags')

        if(player1 <= 0 || player2 <= 0)
        {
            const graph = new Graphics(this, {fillStyle: {color: 0x000, alpha: .3}})
            .fillRect(0, 0, this.width, this.height)
        
            this.children.add(graph)
            
            this.match.scene.pause()

            const cardsPlayer1 = this.match.board.players['player1']
            const cardsPlayer2 = this.match.board.players['player2']

            this.tweens.add({
                targets: [...cardsPlayer1, ...cardsPlayer2],
                alpha: { from: 1, to: 0 },
                repeat: 5,
                duration: 1000,
                ease: "Back",
                onComplete: () => {
                    const reset = new GameObjects.Text(this, 0, 0, "Play Again!", { fontSize: `${this.width*.07}px`})
                    .setTintFill(0xFFF000, 0xFFF000, 0xFF2200, 0xFF2200)
                    .setStroke("#FFF", 3)
                    .setInteractive()
                    .on("pointerdown", () => this.game.events.emit("resetGame", this))

                    reset.setPosition(this.width/2-reset.width/2, this.height/2-reset.height/2)
                    this.children.add(reset)

                    this.tweens.add({
                        targets: [reset],
                        alpha: { from: 0.01, to: 1, ease: "Linear", repeat: -1, duration: 1000, yoyo: true }
                    })
                }
            })

            const textPlayer = this.add.text(0, 0, "WINNER", { fontSize: this.width*.11 })
            .setTintFill(0xCC008F, 0x0CA5D2, 0xFF2161, 0xFFAD0C)
            .setStroke("#FFF", 5)

            const textWinner = this.add.text(0, 0, `${player2 <= 0 ? 'CPU' : 'PLAYER'}`, { fontSize: this.width*.11 })
            .setTintFill(0xCC008F, 0x0CA5D2, 0xFF2161, 0xFFAD0C)
            .setStroke("#FFF", 5)

            textWinner.setPosition(this.width/2-textWinner.width/2, textWinner.height*.5)
            textPlayer. setPosition(this.width/2-textPlayer.width/2, (this.height*.8)-textPlayer.height*.5)

            this.tweens.add({
                targets: [textPlayer, textWinner],
                scaleY: { from: 0.1, to: 1, ease: "Bounce", repeat: -1, duration: 5000, yoyo: true },
                scaleX: { from: 0.1, to: 1, ease: "Back", repeat: -1, duration: 5000, yoyo: true },
                angle: { from: 10, to: 0, ease: "Back", repeat: -1, duration: 5000, yoyo: true }
            })

            return
        }
    }

    private setupCards(): void
    {
        this.match.board.playCards("player1", true)
        this.match.board.playCards("player2", false, true)
    }

    public updateGameComponents(card:Card, currentValue:number): void
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
            this.shuffleSound?.play()
            
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
        const potBet = this.gambleboard.data.get('potBet')

        scores[winner]++
        bags[winner] += potBet
        bags[loser] -= potBet

        this.gambleboard.data.set('potBet', potBet)
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