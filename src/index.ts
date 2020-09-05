 /**
 * @author       xStrato <stratoxlive01@gmail.com>
 * @copyright    2020 xStrato
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Phaser, { Game } from 'phaser'
import Base from './scenes/Base';

const config = {
  type: Phaser.WEBGL,
  width: 640*2,
  height: 360*2,
  backgroundColor: "#00AA55",
  title: "Decker - The Card Game",
  loader: { path: "assets" },
  scene: [Base]
}

new Game(config)