import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    score: number;
    name: string;
    key: string;
    bestScore: number;
    dead: boolean;
    doublejumps: number;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    movespeed: number;
    jumpspeed: number;
    position: number;
    hint: Phaser.GameObjects.Image;
    scoreText: Phaser.GameObjects.BitmapText;
    bestScoreText: Phaser.GameObjects.BitmapText;

    public setControls(up: string, down: string, left: string, right: string): void {
        this.up = this.scene.input.keyboard.addKey(up);
        this.down = this.scene.input.keyboard.addKey(down);
        this.left = this.scene.input.keyboard.addKey(left);
        this.right = this.scene.input.keyboard.addKey(right);
    }

    public standIdle(): void {
        this.setVelocityX(0);
        this.anims.play(`${this.key}_idle`, true);
    }

    public moveLeft(movespeed = this.movespeed): void {
        this.setVelocityX(-movespeed);
        this.hint.destroy();
        if (this.body.blocked.down) {
            this.anims.play(`${this.key}_left`, true);
        }
        this.setFlipX(true);
    }

    public moveRight(movespeed = this.movespeed): void {
        this.setVelocityX(movespeed);
        this.hint.destroy();
        if (this.body.blocked.down) {
            this.anims.play(`${this.key}_right`, true);
        }
        this.setFlipX(false);
    }

    public die() {
        this.anims.play(`${this.key}_die`);
        this.dead = true;
        // this is really hacky and I hate it
        this.scene.time.delayedCall(500, function() {
            this.disableBody(true, true);
        });
    }

    public updateBestScore(display: boolean): void {
        if (this.bestScore < this.score) {
            this.bestScore = this.score;
            if (display) {
                this.bestScoreText.setText(`Best : ${this.bestScore}`);
            }
        }
    }

    private jump(jumpspeed): void {
        this.anims.play(`${this.key}_jump`, true);
        this.setVelocityY(-jumpspeed);
    }

    public handleJump(jumpspeed = this.jumpspeed): void {
        if (this.body.blocked.down) {
            this.hint.destroy();
        } else if (this.body.blocked.left) {
            this.setVelocityX(this.movespeed);
            this.setFlipX(true);
        } else if (this.body.blocked.right) {
            this.setVelocityX(-this.movespeed);
            this.setFlipX(false);
        } else if (this.doublejumps >= 1) {
            this.doublejumps--;
        } else {
            return;
        }
        this.jump(jumpspeed);
    }

    public setHitBoxes(offsetX = 9, offsetY = 7, sizeX = 13, sizeY = 25) {
        this.body.setOffset(offsetX, offsetY);
        this.body.setSize(sizeX, sizeY, false);
    }

    private setAnims(): void {
        this.scene.anims.create({
            key: `${this.key}_left`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture.key}_run`, {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: `${this.key}_right`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture.key}_run`, {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: `${this.key}_jump`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture.key}_jump`, {
                start: 0,
                end: 7,
            }),
            frameRate: 6,
        });

        this.scene.anims.create({
            key: `${this.key}_idle`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture.key}_idle`, {
                start: 0,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.scene.anims.create({
            key: `${this.key}_die`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture.key}_die`, {
                start: 0,
                end: 7,
            }),
            frameRate: 5,
            repeat: 0,
            hideOnComplete: true,
        });
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        {
            name,
            key,
            position,
            doublejumps,
            movespeed,
            jumpspeed,
        }: {
            name: string;
            key: string;
            position: number;
            doublejumps: number;
            movespeed: number;
            jumpspeed: number;
        }
    ) {
        super(scene, x, y, key);
        this.name = name;
        this.key = key;
        this.position = position;
        this.doublejumps = doublejumps;
        this.movespeed = movespeed;
        this.jumpspeed = jumpspeed;
        this.score = 0;
        this.bestScore = 0;
        this.dead = false;

        this.setAnims();
        this.setHitBoxes();
    }

    // controls: this.add.image(-20, -20, 'WSAD').setOrigin(0.2, 1),
}
