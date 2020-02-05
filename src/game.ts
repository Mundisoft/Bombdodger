import * as Phaser from 'phaser';
import GameScene from './gameScene';
import WelcomeScene from './welcomeScene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'BombDodge',
  width: 512,
  height: 320,
  parent: 'game',
  pixelArt: true,
  zoom: 3,
  scene: [WelcomeScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false,
    },
  },
};

export default class BombDodgeGame extends Phaser.Game {}

window.onload = () => {
  // eslint-disable-next-line no-unused-vars
  const game = new BombDodgeGame(config);
};
