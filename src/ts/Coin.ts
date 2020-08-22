import { Scene, Geom, GameObjects, Input } from "phaser";
import { type } from "os";
const { Group, Rectangle, Graphics, Ellipse, Text } = GameObjects

type CoinConfig = {
    scene:Scene, 
    colors: number[],
    width: number,
    height: number,
    x:number,
    y:number
}

export default class Coin extends GameObjects.Group
{
    constructor(
        public scene:Scene, 
        private color: number,
        public width: number,
        public height: number,
        public x:number,
        public y:number,
        public text:string="",
        public textColor:string="#000",
        public fontSize:number=14
        )
    {
        super(scene)
        this.create()
    }

    public create(): void
    {
        const text = new Text(this.scene, 0, 0, this.text, { color: this.textColor, fontSize: `${ Math.floor(this.width*.023) }px`})
        text.setPosition(this.x-(text.width/2), this.y-(text.height/2))

        const coin1 = new Ellipse(this.scene, this.x,this.y, this.width * .1 + text.width*.2, this.height * .1 + text.width*.2, this.color).setStrokeStyle(1, 0x000, .3)
        const coin2 = new Ellipse(this.scene, this.x, this.y, this.width * .075 + text.width*.2, this.height * .075 + text.width*.2, 0xE5E5E5)
        
        this.addMultiple([coin1, coin2, text])
    }
}