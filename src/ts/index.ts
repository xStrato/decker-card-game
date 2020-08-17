import GameTemplate from './GameTemplate';
import Phaser from 'phaser'
import Match from './Match';


const config = {
  type: Phaser.AUTO,
  width: 640*1,
  height: 360*1,
  backgroundColor: "#00AA37",
  title: "Template",
  scene: [Match]
}

new GameTemplate(config)