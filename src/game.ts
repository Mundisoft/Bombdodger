import 'phaser';
import { GameScene } from './gameScene';
import { WelcomeScene } from './welcomeScene';

const config: Phaser.Types.Core.GameConfig = {
    title: 'BombDodge',
    width: 800,
    height: 600,
    parent: 'game',
    scene: [WelcomeScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 3000},
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