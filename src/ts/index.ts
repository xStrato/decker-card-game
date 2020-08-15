import GameTemplate from './GameTemplate';
import Phaser from 'phaser'
import Main from './Main';


const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  backgroundColor: "#00AA37",
  title: "Template",
  scene: [Main]
}

new GameTemplate(config)