import 'phaser';
import { GameScene } from './gameScene';

export class AlignGrid {
    scene: GameScene;
    h:any;
    w:any;
    rows:number;
    cols:number;
    cw:number;
    ch:number;
    graphics: Phaser.GameObjects.Graphics;

    public show (a = 1) {
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
        let n = 0;

        for (let i = 0; i < this.rows; i++) {
            let numText = this.scene.add.text(0, 0,i.toString(), {
                color: 'red',
                fontSize: '8px'
            });
            numText.setOrigin(0.5, 0.5);
            this.placeAt(0, i, numText);
        }

        for (let j = 0; j < this.cols; j++) {
            let numText = this.scene.add.text(0, 0, j.toString(), {
                color: 'red',
                fontSize: '8px'
            });
            numText.setOrigin(0.5, 0.5);
            this.placeAt(j, 0, numText);
        }
    }

    public placeAt(xx: number, yy: number, obj: Phaser.GameObjects.Text | Phaser.Physics.Arcade.Sprite){
        var x2 = this.cw * xx + this.cw / 2;
        var y2 = this.ch * yy + this.ch / 2;
        obj.x = x2;
        obj.y = y2;
    }

    constructor({scene, rows, cols} : {scene: GameScene, rows: number, cols: number}) {
        this.scene = scene;
        this.h = scene.game.config.height;
        this.w = scene.game.config.width;
        this.rows = rows;
        this.cols = cols;    
        this.cw = this.w / this.cols;
        this.ch = this.h / this.rows;    
    }
}