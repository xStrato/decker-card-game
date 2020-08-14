import { Scene } from "phaser";
import Card from './Card'

export default class Main extends Scene
{
    constructor()
    {
      super("Main")
    }

    public preload(): void
    {
    }

    public create(): void
    {
        new Card(this, {x: 50, y:50, width:150, height:200}, {naipe: "copas", cardNumber: 10, color: 'red' })
    }

    public update(): void
    {
    }
  }