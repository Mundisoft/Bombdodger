import 'phaser';
// eslint-disable-next-line no-unused-vars
import GameScene from './gameScene';

export default class AlignGrid {
    scene: GameScene;
    h: any;
    w: any;
    rows: number;
    cols: number;
    cw: number;
    ch: number;
    graphics: Phaser.GameObjects.Graphics;

    public show(a = 1) {
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(1, 0xff0000, a);

        for (let i = 0; i < this.w; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.h);
        }
        for (let i = 0; i < this.h; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.w, i);
        }
        this.graphics.strokePath();
    }

    public showNumbers(a = 1) {
        this.show(a);
        for (let i = 0; i < this.rows; i++) {
            const numText = this.scene.add.text(0, 0, i.toString(), {
                color: 'red',
                fontSize: '8px',
            });
            numText.setOrigin(0.5, 0.5);
            this.placeAt(0, i, numText);
        }

        for (let j = 0; j < this.cols; j++) {
            const numText = this.scene.add.text(0, 0, j.toString(), {
                color: 'red',
                fontSize: '8px',
            });
            numText.setOrigin(0.5, 0.5);
            this.placeAt(j, 0, numText);
        }
    }
    public placeAt(
        xx: number,
        yy: number,
        obj:
            | Phaser.GameObjects.Text
            | Phaser.Physics.Arcade.Sprite
            | Phaser.GameObjects.BitmapText
            | Phaser.GameObjects.Image
    ) {
        const x2 = this.cw * xx + this.cw / 2;
        const y2 = this.ch * yy + this.ch / 2;
        obj.x = x2;
        obj.y = y2;
    }

    constructor({ scene, rows, cols }: { scene: GameScene; rows: number; cols: number }) {
        this.scene = scene;
        this.h = scene.game.config.height;
        this.w = scene.game.config.width;
        this.rows = rows;
        this.cols = cols;
        this.cw = this.w / this.cols;
        this.ch = this.h / this.rows;
    }
}
