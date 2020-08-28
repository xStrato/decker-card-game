import { Scene, Geom, GameObjects } from "phaser";
const { Rectangle } = GameObjects



export default class InfoBar<T extends GameObjects.Rectangle> extends GameObjects.Group
{
    //refObject:<T extends GameObjects> porque todo obj q estende dessa classe possui por padrão Width and Height
    constructor(public scene:Scene, private refObject: T, private color:number,private alpha:number)
    {
        super(scene)
        this.create()
    }

    public create(): void
    {
        const infoBar = new Rectangle(this.scene, -Math.floor(this.refObject.width*.118), 0, this.refObject.width*.35, this.refObject.height*.4, 0xff6699, .2)

        this.add(infoBar)
    }
}