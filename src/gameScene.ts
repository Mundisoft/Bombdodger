import 'phaser';
import { WelcomeScene } from './welcomeScene';

export class GameScene extends Phaser.Scene {
    score: number;
    scoreText: Phaser.GameObjects.Text;
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver:boolean;
    gameOverText: Phaser.GameObjects.Text;
    gameOverHintText: Phaser.GameObjects.Text;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(){
        super({
            key: 'GameScene'
        });
    }

    init(params): void {
        this.score = 0;
    }

    preload():void {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bomb', '/assets/bomb.png');
        this.load.spritesheet('dude', '/assets/dude.png', {
            frameWidth: 32, frameHeight: 48
        });
    }

    create():void {
        this.add.image(400, 300, 'sky');

        //find cleaner way
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.bombs = this.physics.add.group();
        this.score = 0;
        this.gameOver = false;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000', });

        this.player.setCollideWorldBounds(true);

        this.createAnims();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar , null, this);
    
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update():void {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-460);
        }
    
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(450);
        }

        if (this.gameOver === true) {
            if (this.cursors.space.isDown) {
                this.scene.start("GameScene");
            }
        }
    }

    private hitBomb(player: Phaser.Physics.Arcade.Sprite):void {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOverText = this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#000'}).setOrigin(0.5);
        this.time.delayedCall(1000, function (){
            this.gameOver = true;
            this.gameOverHintText = this.add.text(400, 345, 'Press Space to Continue', { fontSize: '32px', fill: '#000'}).setOrigin(0.5);
        },[],this);
    }

    private collectStar(player, star):void {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function(child:Phaser.Physics.Arcade.Sprite){
                child.enableBody(true, child.x, 0, true, true);
            });
    
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0,400);
    
            let bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    private createAnims():void {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }
    
};