import Phaser, { Game, Scene } from 'phaser'
import Base from './scenes/Base';
import Main from './scenes/Main';
import Match from './scenes/Match';

const config = {
  type: Phaser.WEBGL,
  width: 640*1,
  height: 360*1,
  backgroundColor: "#00AA55",
  title: "Template",
  scene: [Base]
}

new Game(config)