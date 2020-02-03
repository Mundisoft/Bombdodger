import 'phaser';
import { GameScene } from './gameScene';
import { WelcomeScene } from './welcomeScene';

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
            gravity: {y: 1000},
            debug: false
        }
    }
};

export class BombDodgeGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = () => {
    let game = new BombDodgeGame(config);
}