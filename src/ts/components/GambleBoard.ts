import { GameObjects, Scene } from "phaser";
import Coin from "../objects/Coin";
import { Score } from "../shared/Types";

const { Rectangle, Text } = GameObjects

export default class GambleBoard extends GameObjects.Container
{
    private scorePlayer1Text: GameObjects.Text;
    private scorePlayer2Text: GameObjects.Text;
    private infoBar: GameObjects.Rectangle

    constructor(
        public scene: Scene, 
        public width:number, 
        public height:number, 
        public scores:Score, 
        public initialMoney:number=10000)
    {
        super(scene)

        this.scene.add.existing(this)
        this.create()
    }

    public create(): void
    {
        this.setDataEnabled()
        this.data.set('scores', this.scores)

        const panel = new Rectangle(this.scene, 0 , 0, this.width*.8 , this.height*.3, 0xff6699, .2)
        this.add(panel)

        const colors = [0x356EA3, 0x856093, 0xEF7D9C, 0xFFAFA7, 0x7AABB0,0xF0CCC4]
        
        this.createCoins(colors, `$${this.initialMoney}`)
        this.createInfoBar(panel);
        
        this.setPosition(this.width*.5, this.height*.5)
        this.data.events.on('changedata-scores', this.updateScore, this)
    }

    public updateScore(): void
    {
        const { player1, player2 } = this.data.get('scores')
        
        this.scorePlayer1Text.setText(`${this.data.get('scores')["player1"]}`)
        this.scorePlayer1Text.setX(`${player1}`.length > 1 ? -this.infoBar.width*.040: 0)
        this.scorePlayer2Text.setText(`${this.data.get('scores')["player2"]}`)
        this.scorePlayer2Text.setX(`${player2}`.length > 1 ? -this.infoBar.width*.80 : -this.infoBar.width*.75)
    }

    private createCoins(colors:number[], value:string): this
    {
        for (let i = 0; i < Math.ceil(this.width*.03); i+=Math.ceil(this.width*.0075))
        {
            const coinPLayer1 = new Coin(this.scene, colors[Phaser.Math.Between(0, colors.length-1)], this.width, this.width, -Math.floor(this.width*.345)+i, -Math.floor(this.width*.0157)+i, value)
            const coinPlayer2 = new Coin(this.scene, colors[Phaser.Math.Between(0, colors.length-1)], this.width, this.width, Math.floor(this.width*.157)-i, i, value)

            this.add([...coinPLayer1.getChildren(), ...coinPlayer2.getChildren()])
        }
        return this
    }

    private createInfoBar<T extends GameObjects.Rectangle | GameObjects.Ellipse>(refObject: T): this
    {
        this.infoBar = new Rectangle(this.scene, -Math.floor(refObject.width*.118), 0, refObject.width*.35, refObject.height*.4, 0x000, .5)
        const infoBarPanel = new Rectangle(this.scene, 0, 0, this.infoBar.width*.5, refObject.height*.4, 0xfffffff, .1)
        infoBarPanel.setPosition((-this.infoBar.width/2)+(infoBarPanel.width*.315), 0)
        
        const { player1, player2 } = this.data.get('scores')
        
        const fontSize = `${Math.ceil(this.infoBar.width*.13)}px`

        this.scorePlayer1Text = new Text(this.scene, 0, -this.infoBar.height*.26,`${player1}`, {fontSize:fontSize, color: "#c3c3c3"})
        this.scorePlayer1Text.setX(`${player1}`.length > 1 ? -this.infoBar.width*.040: 0)
        
        this.scorePlayer2Text = new Text(this.scene, -this.infoBar.width*.75, -this.infoBar.height*.26,`${player2}`, {fontSize:fontSize, color: "#c3c3c3"})
        this.scorePlayer2Text.setX(`${player2}`.length > 1 ? -this.infoBar.width*.80 : -this.infoBar.width*.75)

        this.add([this.infoBar, infoBarPanel, this.scorePlayer1Text, this.scorePlayer2Text])
        return this
    }
}