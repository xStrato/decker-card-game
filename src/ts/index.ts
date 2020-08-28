import GameTemplate from './GameTemplate';
import Phaser from 'phaser'
import Main from './Main';
import Main2 from './Main2';


const config = {
  type: Phaser.AUTO,
  width: 640*1,
  height: 360*1,
  backgroundColor: "#00AA37",
  title: "Template",
  scene: [Main2]
}

new GameTemplate(config)