import { Scene } from "phaser";
import Board from "./Board";

export default class Test extends Scene
{
    constructor()
    {
        super("Test")
    }
    public create(): void
    {
        const board = new Board(this, 5).shuffleAndCut()
        board.playCards("player1")
        board.playCards("player2", true)
    }
}