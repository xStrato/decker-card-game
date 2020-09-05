import { Scene, GameObjects } from "phaser";
import Main from "./Main";

export default class Base extends Scene
{
    public main: Main
    public width:number
    public height:number

    constructor()
    {
        super("Base")
    }

    public preload():void
    {
        this.width = +this.game.config.width
        this.height = +this.game.config.height

        this.main = this.scene.add("Main", Main, false) as Main

        const edges = new GameObjects.Graphics(this)
        .lineStyle(this.width*.03, 0x8D5D4B, 1)
        .strokeRoundedRect(0, 0, this.width, this.height, this.width*.08)

        this.children.add(edges)
    }

    public create(): void
    {
        const commandText = new GameObjects.Text(this, 0, 0, "Commands:", { fontSize: `${this.width*.07}px`})
        .setTintFill(0xFFF000, 0xFFF000, 0xFF2200, 0xFF2200)
        .setStroke("#FFF", 3)
        commandText.setPosition(this.width/2-commandText.width/2, this.height*.1)

        const commandPanel = new GameObjects.Graphics(this, {fillStyle: {color: 0x000, alpha: .5}})
        .fillRect(0, 0, this.width, this.height)
        
        const command1 = new GameObjects.Text(this, 0, 0, "L-Click (Deck of cards):", { fontSize: `${this.width*.04}px`, color: "#FFF000"})
        command1.setPosition(this.width/2-command1.width/2, this.height*.30)
        const command1Desc = new GameObjects.Text(this, 0, 0, "HOLD: stop betting, ends the turn", { fontSize: `${this.width*.035}px`, color: "#FFF"})
        command1Desc.setPosition(this.width/2-command1Desc.width/2, this.height*.38)

        const command2 = new GameObjects.Text(this, 0, 0, "L-Click (Rival card):", { fontSize: `${this.width*.04}px`, color: "#FFF000"})
        command2.setPosition(this.width/2-command2.width/2, this.height*.50)
        const command2Desc = new GameObjects.Text(this, 0, 0, "Raises the bet and reveals one of his cards", { fontSize: `${this.width*.035}px`, color: "#FFF"})
        command2Desc.setPosition(this.width/2-command2Desc.width/2, this.height*.58)

        const command3Desc = new GameObjects.Text(this, 0, 0, "...and cards with higher numbers wins!", { fontSize: `${this.width*.025}px`, color: "#FFF000"})
        command3Desc.setPosition(this.width/2-command3Desc.width/2, this.height*.90)

        const startPlayText = new GameObjects.Text(this, 0, 0, "CLICK HERE TO START!", { fontSize: `${this.width*.055}px`})
        .setTintFill(0xCC008F, 0x0CA5D2, 0xFF2161, 0xFFAD0C)
        .setStroke("#FFF", 1)
        .setInteractive()
        .on("pointerdown", () => 
        {
            command1.destroy()
            command1Desc.destroy()
            command2.destroy()
            command2Desc.destroy()
            command3Desc.destroy()
            commandPanel.destroy()
            commandText.destroy()
            startPlayText.destroy()
            this.main.scene.start()
        })
        const startTextX = this.width/2-startPlayText.width/2
        startPlayText.setPosition(startTextX, this.height*.73)

        this.tweens.add({
            targets: startPlayText,
            alpha: { from: .5, to: 1, duration: 1000, ease: "Back", repeat: -1, yoyo: true },
            x: {from: startTextX-20, to: startTextX+20, duration: 2000, ease: "Back.easeOut", repeat: -1, yoyo: true}
        })

        this.children.add(commandPanel)
        this.children.add(commandText)
        this.children.add(command1)
        this.children.add(command1Desc)
        this.children.add(command2)
        this.children.add(command2Desc)
        this.children.add(command3Desc)
        this.children.add(startPlayText)

        this.game.events.on("resetGame", () => 
        {
            this.game.scene.remove("Match")
            this.main.scene.restart()
        })
    }
}