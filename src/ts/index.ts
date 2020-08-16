import GameTemplate from './GameTemplate';
import Phaser from 'phaser'
import Test from './test';


const config = {
  type: Phaser.AUTO,
  width: 640*1,
  height: 360*1,
  backgroundColor: "#00AA37",
  title: "Template",
  scene: [Test]
}

new GameTemplate(config)