import { Scene, GameObjects} from "phaser";
const {  Ellipse, Text } = GameObjects

export default class Coin extends GameObjects.Group
{
    private coinText: GameObjects.Text
    private coinSignalText: GameObjects.Text

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
        this.coinText = new Text(this.scene, 0, 0, this.text, { color: this.textColor, fontSize: `${ Math.floor(this.width*.023) }px`})
        this.coinText.setPosition(this.x-(this.coinText.width/2), this.y-(this.coinText.height/2))

        this.coinSignalText = new Text(this.scene, 0,0, "+", { color: this.textColor, fontSize: `${ Math.floor(this.width*.04) }px`})
        .setVisible(false)

        const coin1 = new Ellipse(this.scene, this.x,this.y, this.width * .1 + this.coinText.width*.2, this.height * .1 + this.coinText.width*.2, this.color)
        .setStrokeStyle(1, 0x000, .3)
        
        const coin2 = new Ellipse(this.scene, this.x, this.y, this.width * .075 + this.coinText.width*.2, this.height * .075 + this.coinText.width*.2, 0xE5E5E5)
        
        this.addMultiple([coin1, coin2, this.coinText, this.coinSignalText])
    }

    public updateText(text:string, signal:string): void
    {
        this.coinText.setText(text)
        .setColor(signal === "+" ? "#0000FF" : "#FF0000")

        this.coinSignalText
        .setText(signal)
        .setColor(signal === "+" ? "#0000FF" : "#FF0000")
        .setVisible(true)
        
        this.coinText.setPosition(this.x-(this.coinText.width/2), this.y-(this.coinText.height/2))
        this.coinSignalText.setPosition(this.x-(this.coinSignalText.width/2), this.y+(this.coinSignalText.height/8))

        this.scene.tweens.add({
            targets: [this.coinText, this.coinSignalText],
            alpha: { from: 1, to: 0 },
            repeat: 3,
            duration: 150,
            ease: "Back.easeInOut",
            yoyo: true,
            onComplete: () => {
                this.coinText.setColor(this.textColor)
                this.coinSignalText.setVisible(false)
            }
        })
    }
}
