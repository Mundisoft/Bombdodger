import * as Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  score: number;
  result: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  constructor() {
    super({
      key: 'ScoreScene',
    });
  }
  init(params: any): void {
    this.score = params.starsCaught;
  }
  create(): void {
    const resultText: string = `Your score is ${this.score}!`;
    this.result = this.add.text(200, 250, resultText, {
      font: '48px Arial Bold',
      fill: '#FBFBAC',
    });
    const hintText: string = 'Any Key to Restart';
    this.hint = this.add.text(300, 350, hintText, {
      font: '24px Arial Bold',
      fill: '#FBFBAC',
    });
    this.input.keyboard.on(
      'keydown',
      function(/* pointer */) {
        this.scene.start('WelcomeScene');
      },
      this
    );
  }
}
