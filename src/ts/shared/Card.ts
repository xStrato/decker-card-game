import { Scene, GameObjects } from 'phaser'
import { CardState } from './Enums'

const { Container } = GameObjects

abstract class Card extends Container
{
    constructor(
        public scene: Scene,
        public width: number,
        public height: number,
        public x: number,
        public y: number,
        public state: CardState)
    {
        super(scene)
        this.scene.add.existing(this)
    }

    public abstract flip(animation:boolean): void
    protected abstract drawBackSide(): void
    protected abstract drawFrontSide(): void
}

export default Card

