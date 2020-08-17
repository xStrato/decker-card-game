import { GameObjects, Scene } from "phaser"
import Card from "../Card"
const { Text } = GameObjects

export default class CardService
{
    public static standardizeTextDimensions(scope:Card, textObjs:GameObjects.Text[], refSuit:string): void
    {
        textObjs.forEach(text => {

            const ref = new Text(scope.scene, 0,0, refSuit, text.style).setVisible(false)
            text.setDisplaySize(ref.displayWidth, ref.displayHeight)
            ref.destroy()
        })
    }
}