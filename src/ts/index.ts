import Phaser, { Game } from 'phaser'
import Main from './scenes/Main';

const config = {
  type: Phaser.WEBGL,
  width: 640*1,
  height: 360*1,
  backgroundColor: "#00AA55", //007F55
  title: "Template",
  scene: [Main]
}

new Game(config)