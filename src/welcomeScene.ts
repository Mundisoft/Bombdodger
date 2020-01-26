import "phaser";
export class WelcomeScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
constructor() {
    super({
      key: "WelcomeScene"
    });
  }
create(): void {
    var titleText: string = "Bomb Dodger";
    this.title = this.add.text(150, 200, titleText,
      { font: '100px Arial Bold', fill: '#FBFBAC' });
var hintText: string = "Any Key to Start";
    this.hint = this.add.text(300, 350, hintText,
      { font: '24px Arial Bold', fill: '#FBFBAC' });
this.input.keyboard.on('keydown', function () {
      this.scene.start("GameScene");
    }, this);
  }
};