import 'phaser';
export class GameScene extends Phaser.Scene {
    score: number;
    best: number;
    scoreText: Phaser.GameObjects.Text;
    bestScoreText: Phaser.GameObjects.Text;
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver:boolean;
    firstGame:boolean;
    gameOverText: Phaser.GameObjects.Text;
    gameOverHintText: Phaser.GameObjects.Text;
    players: Phaser.Physics.Arcade.Group;
    playerOne: Phaser.Physics.Arcade.Sprite;
    playerTwo: Phaser.Physics.Arcade.Sprite;
    singleplayer: boolean;
    movespeed: number;
    jumpspeed: number;
  
    W: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
    UP: Phaser.Input.Keyboard.Key;
    DOWN: Phaser.Input.Keyboard.Key;
    LEFT: Phaser.Input.Keyboard.Key;
    RIGHT: Phaser.Input.Keyboard.Key;

    constructor(){
        super({
            key: 'GameScene'
        });
    }

    init(params): void {
        this.singleplayer = params.singleplayer;
        this.score = 0;
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

        //find cleaner way
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.players = this.physics.add.group();
        this.players.create(100,450,'dude');

        if (!this.singleplayer) {
            this.players.create(700,450,'dudeTwo');
        }

        this.bombs = this.physics.add.group();

        if (this.best == null) {
            this.best = 0;
            this.firstGame = true;
        } else {
            this.bestScoreText = this.add.text(16, 48, 'Best : ' + this.best, { fontSize: '32px', fill: '#000'});
            this.firstGame = false;
        }
        this.gameOver = false;
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#000'});
        this.players.children.iterate(function (player: Phaser.Physics.Arcade.Sprite) {
            player.setCollideWorldBounds(true);
        });
        this.createAnims();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        this.physics.add.collider(this.players, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.players, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.players, this.stars, this.collectStar , null, this);
    

        // I hate this implementation, but I can't figure out how to type the addKeys object correctly
        this.UP = this.input.keyboard.addKey('up');
        this.DOWN = this.input.keyboard.addKey('down');
        this.LEFT = this.input.keyboard.addKey('left');
        this.RIGHT = this.input.keyboard.addKey('right');
        this.SPACE = this.input.keyboard.addKey('space');
        this.W = this.input.keyboard.addKey('W');
        this.S = this.input.keyboard.addKey('S');
        this.A = this.input.keyboard.addKey('A');
        this.D = this.input.keyboard.addKey('D');
         
    }
    
    update():void {
        const playerOne = this.players.getFirst(true);

        if (this.LEFT.isDown) {
            playerOne.setVelocityX(-this.movespeed);
            playerOne.anims.play('playerOneLeft', true);
        }
        else if (this.RIGHT.isDown) {
            playerOne.setVelocityX(this.movespeed);
            playerOne.anims.play('playerOneRight', true);
        }
        else {
            playerOne.setVelocityX(0);
            playerOne.anims.play('playerOneTurn');
        }
        if (this.UP.isDown && playerOne.body.touching.down) {
            playerOne.setVelocityY(-this.jumpspeed);
        }
    
        if (this.DOWN.isDown) {
            playerOne.setVelocityY(this.jumpspeed);
        }

        if(!this.singleplayer){
            const playerTwo = this.players.getLast(true);
            if (this.A.isDown) {
                playerTwo.setVelocityX(-this.movespeed);
                playerTwo.anims.play('playerTwoLeft', true);
            }
            else if (this.D.isDown) {
                playerTwo.setVelocityX(this.movespeed);
                playerTwo.anims.play('playerTwoRight', true);
            }
            else {
                playerTwo.setVelocityX(0);
                playerTwo.anims.play('playerTwoTurn');
            }
            if (this.W.isDown && playerTwo.body.touching.down) {
                playerTwo.setVelocityY(-this.jumpspeed);
            }
        
            if (this.S.isDown) {
                playerTwo.setVelocityY(this.jumpspeed);
            }
        }

        if (this.gameOver === true) {
            if (this.SPACE.isDown) {
                this.scene.start("GameScene", {singleplayer: this.singleplayer});                
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

        if (this.best < this.score) {
            this.best = this.score;
            if (this.firstGame != true) {
                this.bestScoreText.setText('Best : ' + this.best);
                this.bestScoreText.setColor('Green');
                this.bestScoreText.setFontSize(40);
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

    private setupPlayerTwo():void {
        this.playerTwo = this.physics.add.sprite(100, 450, 'dudeTwo');
    }

    private createAnims():void {
        this.anims.create({
            key: 'playerOneLeft',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'playerOneTurn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'playerOneRight',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'playerTwoLeft',
            frames: this.anims.generateFrameNumbers('dudeTwo', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'playerTwoTurn',
            frames: [ { key: 'dudeTwo', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'playerTwoRight',
            frames: this.anims.generateFrameNumbers('dudeTwo', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }
    
};