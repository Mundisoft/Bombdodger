import 'phaser';
export class GameScene extends Phaser.Scene {
    best: number;
    bestScoreText: Phaser.GameObjects.Text;
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver:boolean;
    firstGame:boolean;
    gameOverText: Phaser.GameObjects.Text;
    gameOverHintText: Phaser.GameObjects.Text;
    players: Phaser.Physics.Arcade.Group;

    singleplayer: boolean;
    movespeed: number;
    jumpspeed: number;
  
    SPACE: Phaser.Input.Keyboard.Key;


    constructor(){
        super({
            key: 'GameScene'
        });
    }

    init(params: any): void {
        this.gameOver = false;
        this.singleplayer = params.singleplayer;
        this.movespeed = 200;
        this.jumpspeed = 460;
    }

    preload():void {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bomb', '/assets/bomb.png');
        this.load.spritesheet('dude', '/assets/dude.png', {
            frameWidth: 32, frameHeight: 48
        });
        this.load.spritesheet('dudeTwo', '/assets/dude2.png', {
            frameWidth: 32, frameHeight: 48
        });
    }

    create():void {
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.players = this.physics.add.group();

        const playerOne: Phaser.Physics.Arcade.Sprite = this.players.create(100,450,'dude').setData({
            score: 0,
            scoreText: this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'}),
            dead: false,
            up: this.input.keyboard.addKey('w'),
            down: this.input.keyboard.addKey('s'),
            left: this.input.keyboard.addKey('a'),
            right: this.input.keyboard.addKey('d')
        });

        this.setAnims(playerOne);



        if (!this.singleplayer) {
            const playerTwo: Phaser.Physics.Arcade.Sprite = this.players.create(700,450,'dudeTwo').setData({
                score: 0,
                scoreText: this.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#000'}),
                dead: false,
                up: this.input.keyboard.addKey('up'),
                down: this.input.keyboard.addKey('down'),
                left: this.input.keyboard.addKey('left'),
                right: this.input.keyboard.addKey('right'),
            });
            this.setAnims(playerTwo);
        }
        else {
            if (this.best == null) {
                this.best = 0;
                this.firstGame = true;
            }
            else {
                this.bestScoreText = this.add.text(16, 48, 'Best : ' + this.best, { fontSize: '32px', fill: '#000'});
                this.firstGame = false;
            }
        }
        this.players.children.iterate(function (player: Phaser.Physics.Arcade.Sprite) {
            player.setCollideWorldBounds(true);
        });

        this.bombs = this.physics.add.group();
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        this.physics.add.collider(this.players, this.platforms);
        // remove player collisions until bug resolved
        // bug - falls through terrain when jumped on
        //this.physics.add.collider(this.players, this.players);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.players, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.players, this.stars, this.collectStar , null, this);

        this.SPACE = this.input.keyboard.addKey('space');
    }
    
    update():void {        
        this.players.children.iterate(function (player: Phaser.Physics.Arcade.Sprite){
            if (player.getData('left').isDown) {
                player.setVelocityX(-this.movespeed);
                player.anims.play(player.texture.key + 'left', true);
            }
            else if (player.getData('right').isDown) {
                player.setVelocityX(this.movespeed);
                player.anims.play(player.texture.key + 'right', true);
            }
            else {
                player.setVelocityX(0);
                player.anims.play(player.texture.key + 'turn');
            }
            if (player.getData('up').isDown && player.body.touching.down){
                player.setVelocityY(-this.jumpspeed);
            } else if (player.getData('down').isDown) {
                player.setVelocityY(this.jumpspeed);
            }


        },this);   
        if (this.gameOver === true) {
            if (this.SPACE.isDown) {
                this.scene.start("GameScene", {singleplayer: this.singleplayer});                
            }
        }
    }

    private hitBomb(player: Phaser.Physics.Arcade.Sprite):void {
        if (this.singleplayer) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            this.gameOverText = this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#000'}).setOrigin(0.5);
            this.time.delayedCall(1000, function (){
                this.gameOver = true;
                this.gameOverHintText = this.add.text(400, 345, 'Press Space to Continue', { fontSize: '32px', fill: '#000'}).setOrigin(0.5);
            },[],this);

        }
    }

    private collectStar(player, star):void {
        star.disableBody(true, true);

        player.data.values.score += 10;
        player.data.values.scoreText.setText('Score: ' + player.getData('score'));

        if(this.singleplayer){
            if (player.getData('data') < player.getData('score')) {
                player.data.values.best = player.getData('score');
                if (this.firstGame != true) {
                    this.bestScoreText.setText('Best : ' + this.best);
                    this.bestScoreText.setColor('Green');
                    this.bestScoreText.setFontSize(40);
                }
            }
        }
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

    private setAnims(player: Phaser.Physics.Arcade.Sprite):void {

        this.anims.create({
            key: player.texture.key + 'left',
            frames: this.anims.generateFrameNumbers(player.texture.key, { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: player.texture.key + 'right',
            frames: this.anims.generateFrameNumbers(player.texture.key, { start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: player.texture.key + 'turn',
            frames: [ { key: player.texture.key, frame: 4 } ],
            frameRate: 20
        });
    }  
};