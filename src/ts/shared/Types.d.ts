import { Scene, Types } from "phaser";
import { CardState } from "./Enums";

declare type BoardElement<T> = 
{
  [player:string]: T[]
}

declare type CardBaseConfig = {
    scene: Scene
    x: number
    y: number
    width: number
    height: number
    state: CardState
}

declare type PokerCardInfo = {
    suit: string
    number: number
    color: string
    textConfig: Types.GameObjects.Text.TextStyle
}