import { GameObjects, Types, Display, Sound } from 'phaser'
import Main from '../scenes/Main'
import CardService from '../services/CardService'
import Card from '../shared/Card'
import { CardState } from '../shared/Enums'
import { CardBaseConfig, PokerCardInfo } from '../shared/Types'

const { Color, Graphics, Group, Text  } = {...Display, ...GameObjects}

export default class PokerCard extends Card
{
    public suit:number
    public number:number
    public color:string
    public textConfig:Types.GameObjects.Text.TextStyle
    public flipSound: Sound.BaseSound

    constructor(cardBaseConfig: CardBaseConfig, pokerCardInfo: PokerCardInfo)
    {
        const { scene, number, width, height, x, y, state } = cardBaseConfig
        const { suit, color, textConfig } = pokerCardInfo

        super(scene, number, width, height, x, y, state)
        
        this.suit = suit
        this.number = number
        this.color = color
        this.textConfig = textConfig

        this.flip(false)
    }

    public flip(animation:boolean=true): void 
    {
        if(animation)
        {
            const main = this.scene.game.scene.getScene('Main') as Main
            main.flipSound?.play()

            this.scene.tweens.add({
                onStart: () => this.removeInteractive(),
                targets: this,
                x: `+=${(this.width*0.08)}`,
                y: `+=${(this.width*0.08)}`,
                duration: 500,
                ease: 'Sine',
                yoyo: true,
                onComplete: () => CardService.setInteration(this),
            })
        }
        
        switch(this.state)
        {
            case CardState.BACK_SIDE: 
                this.drawBackSide();
                this.state = CardState.FRONT_SIDE
            break;

            case CardState.FRONT_SIDE: 
                this.drawFrontSide() 
                this.state = CardState.BACK_SIDE
            break;
        }
    }

    protected drawBackSide(): void
    {
        this.list = []
        const cellSize = this.width * 0.1
        const miniRectSize = this.scene.data.get('backPlateRectSize')

        const alignConfig:
        Types.Actions.GridAlignConfig = 
        {
            width: Math.ceil(this.width/cellSize),
            height: Math.floor(this.height/cellSize),
            cellWidth: cellSize,
            cellHeight: cellSize,
            x: miniRectSize,
            y: miniRectSize
        }
        
        const groupConfig: 
        Types.GameObjects.Group.GroupCreateConfig = 
        {
            key: this.color.includes("#000") ? "blackBackPlate" : "redBackPlate",
            frameQuantity: Math.floor(this.height/cellSize) * 10,
            gridAlign: alignConfig
        }

        const group = new Group(this.scene, groupConfig)

        this.add([CardService.generateLayout(this), ...group.getChildren()])

        group.destroy()
    }

    protected drawFrontSide(): void 
    {
        this.list = []

        const cardNumber = CardService.getCardNumber(this.number)
        const suit = CardService.getCardSuit(this.suit)

        const text1 = new Text(this.scene, 0, 0, cardNumber, this.textConfig)
        const text2 = new Text(this.scene, 0, 0, cardNumber, this.textConfig)
        const text3 = new Text(this.scene, 0, 0, cardNumber, this.textConfig).setAngle(180)
        const text4 = new Text(this.scene, 0, 0, cardNumber, this.textConfig).setAngle(180)

        const centerText = new Text(this.scene, 0,0, cardNumber, this.textConfig)
        .setFontSize(this.width/3)
        .setColor("#fff")
        .setShadowStroke(true)

        const textSuit1 = new Text(this.scene, 0, 0, suit, this.textConfig)
        const textSuit2 = new Text(this.scene, 0, 0, suit, this.textConfig)
        const textSuit3 = new Text(this.scene, 0, 0, suit, this.textConfig).setAngle(180)
        const textSuit4 = new Text(this.scene, 0, 0, suit, this.textConfig).setAngle(180)

        let centralSuit = new Text(this.scene, 0,0, suit, this.textConfig).setFontSize(this.width)

        CardService.standardizeTextDimensions(this, [centralSuit, textSuit1, textSuit2, textSuit3, textSuit4], "♦");
        CardService.standardizeTextDimensions(this, [text1, text2, text3, text4, centerText], "5");

        const layoutConfig = {
            paddingX: text1.displayWidth * .3,
            paddingY: text1.displayHeight * .3
        }

        text1.setPosition(layoutConfig.paddingX, 0)
        text2.setPosition(this.width - text2.displayWidth - layoutConfig.paddingX, 0)
        text3.setPosition(text2.displayWidth + layoutConfig.paddingX, this.height)
        text4.setPosition(this.width - layoutConfig.paddingX, this.height)
        centerText.setPosition(this.width/2 - centerText.displayWidth/2, this.height/2 - centerText.displayHeight/2)

        centralSuit.setPosition(this.width/2 - centralSuit.displayWidth/2, this.height/2 - centralSuit.displayHeight/2)
        textSuit1.setPosition(layoutConfig.paddingX, text1.displayHeight/2+layoutConfig.paddingY)
        textSuit2.setPosition(this.width - textSuit2.displayWidth - layoutConfig.paddingX, text2.displayHeight/2+layoutConfig.paddingY)
        textSuit3.setPosition(textSuit3.displayWidth + layoutConfig.paddingX, this.height-(text3.displayHeight/2+layoutConfig.paddingY))
        textSuit4.setPosition(this.width - layoutConfig.paddingX, this.height-(textSuit4.displayHeight/2+layoutConfig.paddingY))

        const centralRect = new Graphics(this.scene)
        .lineStyle(1, Color.HexStringToColor(this.color).color, 1)
        .strokeRect(this.width/6, this.height/6, this.width/1.5, this.height/1.5)

        this.add([CardService.generateLayout(this), text1, text2, text3, text4, textSuit1, textSuit2, textSuit3, textSuit4, centralSuit, centerText, centralRect])
        this.setPosition(this.x, this.y)
    }
}