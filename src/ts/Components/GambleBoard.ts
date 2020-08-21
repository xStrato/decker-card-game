import { GameObjects, Scene } from "phaser";
import Coin from "../Coin";

const { Rectangle} = GameObjects

export type Score = {
    player1: number, 
    player2: number
}

export default class GambleBoard extends GameObjects.Container
{
    constructor(public scene: Scene, public width:number, public height:number, public scores:Score)
    {
        super(scene)
        this.scores = scores

        this.scene.add.existing(this)
        this.create()
    }

    public create(): void
    {
        const centralBanner = new Rectangle(this.scene, 0 , 0, this.width*.8 , this.height*.3, 0xff6699, .2)
        this.add([centralBanner])

        const colors = [0x356EA3, 0x856093, 0xEF7D9C, 0xFFAFA7, 0x7AABB0,0xF0CCC4]

        for (let i = 0; i < 20; i+=5)
        {
            const coinPLayer1 = new Coin(this.scene, colors[Phaser.Math.Between(0, colors.length-1)], this.width, this.width, -220+i, -10+i, "$10000")
            const coinPlayer2 = new Coin(this.scene, colors[Phaser.Math.Between(0, colors.length-1)], this.width, this.width, 100-i, i, "$10000")

            this.add([...coinPLayer1.getChildren(), ...coinPlayer2.getChildren()])
        }

        const panel = new Rectangle(this.scene, -60, 0, centralBanner.width*.35, centralBanner.height*.4, 0xff6699, .2)
        this.add(panel)

        this.setPosition(this.width*.5, this.height*.5)
    }
}
