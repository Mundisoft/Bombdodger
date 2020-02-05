import * as Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint1: Phaser.GameObjects.Text;
  hint2: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'WelcomeScene',
    });
  }

  create(): void {
    const titleText: string = 'Bomb Dodger';
    this.title = this.add.text(100, 100, titleText, {
      font: '42px Arial Bold',
      fill: '#FBFBAC',
    });
    const hint1Text: string = 'Press 1 for Single Player';
    this.hint1 = this.add.text(150, 150, hint1Text, {
      font: '24px Arial Bold',
      fill: '#FBFBAC',
    });
    const hint2Text: string = 'Press 2 for Multiplayer';
    this.hint2 = this.add.text(150, 180, hint2Text, {
      font: '24px Arial Bold',
      fill: '#FBFBAC',
    });
    this.input.keyboard.on(
      'keydown-ONE',
      function() {
        this.scene.start('GameScene', { singleplayer: true });
      },
      this
    );
    this.input.keyboard.on(
      'keydown-TWO',
      function() {
        this.scene.start('GameScene', { singleplayer: false });
      },
      this
    );
  }
}
