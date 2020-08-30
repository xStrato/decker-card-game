import PokerCard from "../objects/PokerCard";
import { Scene, GameObjects, Types } from "phaser";
import { BoardServiceConfig } from "../shared/Types";
import { CardState } from "../shared/Enums";

const { Graphics, Group } = GameObjects

export default class BoardService
{
    public static mixUp(mixUpConfig: BoardServiceConfig): PokerCard[]
    {
        const player: PokerCard[] = []
        const { spreadNumber } = mixUpConfig

        for (let i = 0; i < spreadNumber; i++)
        {
            //Generates cards for player
            const cardDeck = this.requestNewCard(mixUpConfig)
            //Add card into array and setAngle to match the deck
            player.push(cardDeck.setAngle(90));
        }
        return player
    }

    public static requestNewCard(mixUpConfig: BoardServiceConfig): PokerCard
    {
        const { scope: {scene}, x, y, width, height } = mixUpConfig

        const baseConfig = {scene, number: Phaser.Math.Between(1, 13), x, y, width, height, state: CardState.BACK_SIDE}
        const color = this.getColor()
        const cardInfo = {
            suit: Phaser.Math.Between(1, 4),
            color,
            textConfig: { 
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', 
                color, 
                fontSize: `${Math.floor(width * .2)}px`
            }
        }
        return new PokerCard(baseConfig, cardInfo)
    }

    public static placeholderAt(boardServiceConfig: BoardServiceConfig):GameObjects.Sprite[]
    {
        const { scope, x, y, width, height, spreadNumber } = boardServiceConfig

        this.drawCardStroke(scope.scene, 0, 0, width, height)
        .generateTexture("blankCard")
        
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

    private static getColor = (): string => Phaser.Math.Between(0,1) === 1 ? '#FF0000' : '#000'
}