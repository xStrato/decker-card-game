import { Scene, Geom } from "phaser";
import Board from "./Board";

export default class Match extends Scene
{
    constructor()
    {
        super("Test")
    }

    public create(): void
    {
        const board = new Board(this).shuffleAndCut()
        board.playCards("player1")
        board.playCards("player2", true)

        //makes the central deck and attach events
        board.requestADeal()
        .setAngle(90)
        .addEvent()
        .on("pointerup", () => console.log(p, x, y, z))
    }
}