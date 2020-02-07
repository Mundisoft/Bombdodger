import * as Phaser from 'phaser';

export default class Bomb extends Phaser.Physics.Arcade.Sprite {
    public explode() {
        this.body.stop();
        this.disableBody();
        this.anims.play('pixel_bomb', true);
        this.on('animationcomplete', function() {
            this.destroy();
        });
    }

    constructor(
        scene: Phaser.Scene,
        group: Phaser.Physics.Arcade.Group,
        x: number,
        y: number,
        key: string,
        velocityX?: number,
        velocityY: number = 10,
        bounceX: number = 1,
        bounceY: number = 1
    ) {
        super(scene, x, y, key);
        group.add(this, true);
        this.setBounce(bounceX, bounceY);
        this.setCollideWorldBounds(true);

        if (velocityX === undefined) {
            velocityX = Phaser.Math.Between(-100, 100);
        }
        this.setVelocity(velocityX, velocityY);
    }
}
