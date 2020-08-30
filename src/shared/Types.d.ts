import { Scene, Types } from "phaser";
import Board from "../objects/Board";
import { CardState } from "./Enums";

declare type BoardElement<T> = 
{
  [player:string]: T[]
}

declare type CardBaseConfig = {
    scene: Scene
    number: number
    x: number
    y: number
    width: number
    height: number
    state: CardState
}

declare type PokerCardInfo = {
    suit: number
    color: string
    textConfig: Types.GameObjects.Text.TextStyle
}

declare type BoardServiceConfig = {
  scope: Board
  x:number
  y:number
  width:number
  height:number
  spreadNumber:number
}


declare type Score = {
  player1: number, 
  player2: number
}

declare type CoinConfig = {
  scene:Scene, 
  colors: number[],
  width: number,
  height: number,
  x:number,
  y:number
}