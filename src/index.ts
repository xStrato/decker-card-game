import Phaser, { Game, Scene } from 'phaser'
import Base from './scenes/Base';

const config = {
  type: Phaser.WEBGL,
  width: 640*2,
  height: 360*2,
  backgroundColor: "#00AA55",
  title: "Template",
  loader: { path: "assets" },
  scene: [Base]
}

new Game(config)