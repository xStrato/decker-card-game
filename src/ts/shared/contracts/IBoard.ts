import Card from "../Card";

export interface IBoard<T extends Card>
{
    playCards(player:string, setIteration:boolean, reveal:boolean): this
    requestADeal(name:string): T
    shuffleAndCut(): this
    setupCardDeck(): void
}