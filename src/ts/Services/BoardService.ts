import Card from "../Card";
import { Scene, GameObjects, Types } from "phaser";
import Board from "../Board";

const { Graphics, Group } = GameObjects

export default class BoardService
{
    public static mixUp(mixUpConfig: BoardServiceConfig): Array<Card>
    {
        const player: Array<Card> = []
        const { scope, spreadNumber, x, y, width, height } = mixUpConfig

        for (let i = 0; i < spreadNumber; i++)
        {
            //Generates cards for player
            const cardDeck = new Card(
                scope.scene,
                {
                    x, 
                    y, 
                    width, 
                    height
                }, 
                {
                    naipe: `${Phaser.Math.Between(1, 4)}`, 
                    cardNumber: `${Phaser.Math.Between(1, 13)}`, 
                    color: this.setColor() 
                })
            //Add card into array and setAngle to match the deck
            player.push(cardDeck.setAngle(90));
        }
        return player
    }

    public static placeholderAt(scope:Board, spreadNumber:number, x:number, y:number, width:number, height:number): Array<GameObjects.Sprite>
    {

        const blankCard = this.drawCardStroke(scope.scene, 0, 0, width, height)

        blankCard.generateTexture("blankCard")

        const alignConfig:
        Types.Actions.GridAlignConfig = 
        {
            width,
            height,
            cellWidth: width + (width * .5),
            cellHeight: height + (height * .2),
            x: x+width/2.7,
            y: y+height/1.7,
        }

        const groupConfig: 
        Types.GameObjects.Group.GroupCreateConfig = 
        {
            key: "blankCard",
            frameQuantity: spreadNumber,
            gridAlign: alignConfig
        }

        
        const group = new Group(scope.scene, groupConfig)
        scope.add([...group.getChildren()])

        return (group.getChildren() as GameObjects.Sprite[])
    }

    private static drawCardStroke(scene:Scene, x:number, y:number, w:number, h:number): GameObjects.Graphics
    {
      return new Graphics(scene).lineStyle(1, 0x000, 1).strokeRect(x, y, w, h)
    }

    private static setColor = (): string => Phaser.Math.Between(0,1) === 1 ? '#FF0000' : '#000'

    private static placeChairAlt(scope:Board, spreadNumber:number, x:number, y:number, width:number, height:number)
    {
        for (let i = 0; i < spreadNumber; i++)
        {
            //Draw card strokes in the boardGroup
            const blanckCard = this.drawCardStroke(scope.scene, x*i, y, width, height)
            scope.add(blanckCard)
        }
    }
}

export type BoardServiceConfig = {
    scope: Board
    spreadNumber:number
    x:number
    y:number
    width:number
    height:number
}