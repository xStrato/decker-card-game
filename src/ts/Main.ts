// import { Scene } from "phaser";
// import Card, { CardState } from "./Card";

// export default class Main extends Scene
// {
//   private height: number
//   private width: number
//   public deck1: Array<Card> = [];
//   public deck2: Array<Card> = [];
//   public paddingX = 120;
//   public paddingLeft = 25;
//   public paddingY = 20;
//   public widthCard = 70
//   public heightCard = 100
//   public spreadNumber: number

//     constructor(spreadNumber: number)
//     {
//       super("Main")
//       this.spreadNumber = 5
//     }

//     public preload(): void
//     {
//       this.width = +this.game.config.width
//       this.height = +this.game.config.height
//       this.initSetup(this.spreadNumber)
//     }

//     public create(): void
//     {
//       const card = new Card(this, {x: this.width-this.widthCard, y: this.height/2 - this.heightCard/2+this.paddingY, width:this.widthCard, height:this.heightCard}, {naipe: `${Phaser.Math.Between(1, 4)}`, cardNumber: `${Phaser.Math.Between(1, 13)}`, color: this.setColor() }, false)
//       card.setAngle(90)

//       this.spreadCards(this.deck1, this.paddingX, this.height-this.heightCard-this.paddingY, (card: Card) => card.flip())
//       this.spreadCards(this.deck2, this.paddingX, this.paddingY)

//       this.time.delayedCall(8000, () => this.deck2[Phaser.Math.Between(0, 4)].flip())
//     }

//     private initSetup(spreadNumber: number): void
//     {
//       // this.setupCardBoardStrokes(spreadNumber)
//       // this.setupCardForPlayers(spreadNumber)
//     }

//     private spreadCards(deck: Card[], x: number, y: number, callback?: any): void
//     {
//       //Starts the spread for players with hang out animation
//       deck.forEach((card, index) => {

//         this.tweens.add({
//           targets: card,
//           x: this.paddingLeft+x*index,
//           y,
//           duration: 2000,
//           ease: 'Power2',
//           angle: 0,
//           delay: 1000*index,
//           onComplete: () => this.time.delayedCall(50*index, callback, [card]),
//         })
//       })
//     }

//     private setupCardForPlayers(spreadNumber: number)
//     {
//       for (let i = 0; i < spreadNumber; i++)
//       {
//         //Generates cards for both players
//         const cardDeck1 = new Card(this, {x:this.width-this.widthCard, y:this.height/2 - this.heightCard/2+this.paddingY, width:this.widthCard, height:this.heightCard}, {naipe: `${Phaser.Math.Between(1, 4)}`, cardNumber: `${Phaser.Math.Between(1, 13)}`, color: this.setColor() }).setAngle(90)
        
//         const cardDeck2 = new Card(this, {x:this.width-this.widthCard, y:this.height/2 - this.heightCard/2+this.paddingY, width:this.widthCard, height:this.heightCard}, {naipe: `${Phaser.Math.Between(1, 4)}`, cardNumber: `${Phaser.Math.Between(1, 13)}`, color: this.setColor() }).setAngle(90)

//         //Add cards into array
//         this.deck1.push(cardDeck1);
//         this.deck2.push(cardDeck2);
//       }
//     }

//     private setupCardBoardStrokes(spreadNumber: number)
//     {
//       for (let i = 0; i < spreadNumber; i++)
//       {
//         //Draw card strokes in the board
//         this.drawCardStroke(this.paddingLeft+this.paddingX*i, this.height-this.heightCard-this.paddingY, this.widthCard, this.heightCard)

//         this.drawCardStroke(this.paddingLeft+this.paddingX*i, this.paddingY, this.widthCard, this.heightCard)
//       }
//     }

//     private setColor = (): string => Phaser.Math.Between(0,1) === 1 ? '#FF0000' : '#000'

//     private drawCardStroke(x: number, y: number, w: number, h:number): void
//     {
//       this.add.graphics().lineStyle(1, 0x000, 1).strokeRect(x, y, w, h)
//     }

//     public update(): void
//     {
//     }
//   }