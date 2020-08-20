import { GameObjects, Scene, Geom } from "phaser";

const { Group, Rectangle, Graphics } = GameObjects

export type Score = {
    player1: number, 
    player2: number
}

export default class ScoreBoard extends GameObjects.Container
{
    public scores: Score

    constructor(scene: Scene, scores: Score)
    {
        super(scene)
        this.scores = scores

        this.scene.add.existing(this)
    }

    public create(): void
    {
        const width = +this.scene.game.config.width
        const height = +this.scene.game.config.height

        const coins = new Rectangle(this.scene, 0 , 0, width*.8 , height*.3, 0xff6699, .2)

        this.setPosition(width *.5, height *.5)
        this.add([coins])
    }
}
