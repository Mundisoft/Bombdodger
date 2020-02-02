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
    doublejumps: number;

    playersleft: number;
 
    SPACE: Phaser.Input.Keyboard.Key;


    constructor(){
        super({
            key: 'GameScene'
        });
    }

    init(params: any): void {
        this.gameOver = false;
        this.singleplayer = params.singleplayer;
        this.movespeed = 300;
        this.jumpspeed = 800;
        this.playersleft = 1;
        //number of times a player can jump without touching down
        this.doublejumps = 1;
    }

    preload():void {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bomb', '/assets/bomb.png');
        this.load.image('Owl', '/assets/Owlet_Monster.png');
        this.load.image("Dude", '/assets/Dude_Monster.png');

        this.load.spritesheet('Owl_idle', '/assets/Owlet_Monster_Idle_4.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Owl_run', '/assets/Owlet_Monster_Run_6.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Owl_jump', '/assets/Owlet_Monster_Jump_8.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Owl_die', '/assets/Owlet_Monster_Death_8.png', {
            frameWidth: 32, frameHeight: 32
        });

        this.load.spritesheet('Dude_idle', '/assets/Dude_Monster_Idle_4.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_run', '/assets/Dude_Monster_Run_6.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_jump', '/assets/Dude_Monster_Jump_8.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_die', '/assets/Dude_Monster_Death_8.png', {
            frameWidth: 32, frameHeight: 32
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

        const playerOne: Phaser.Physics.Arcade.Sprite = this.players.create(100,450,'Owl').setData({
            name: 'Player 1',
            key: 'Owl',
            score: 0,
            scoreText: this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'}),
            dead: false,
            up: this.input.keyboard.addKey('w'),
            down: this.input.keyboard.addKey('s'),
            left: this.input.keyboard.addKey('a'),
            right: this.input.keyboard.addKey('d'),
            doublejumps: this.doublejumps
        });

        this.setAnims(playerOne);

        if (!this.singleplayer) {
            const playerTwo: Phaser.Physics.Arcade.Sprite = this.players.create(700,450,'Dude').setData({
                name: 'Player 2',
                key: 'Dude',
                score: 0,
                scoreText: this.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#000'}),
                dead: false,
                up: this.input.keyboard.addKey('up'),
                down: this.input.keyboard.addKey('down'),
                left: this.input.keyboard.addKey('left'),
                right: this.input.keyboard.addKey('right'),
                doublejumps: this.doublejumps
            });
            this.setAnims(playerTwo);
            this.playersleft ++;
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
        if (this.gameOver !== true) {
            this.players.children.iterate(function (player: Phaser.Physics.Arcade.Sprite){

                if (!player.getData('dead')) {
                    if (player.getData('left').isDown) {
                        player.setVelocityX(-this.movespeed);
                        player.anims.play(player.getData('key') + '_left', true);
                        player.setFlipX(true);
                    }
                    else if (player.getData('right').isDown) {
                        player.setVelocityX(this.movespeed);
                        player.anims.play(player.getData('key') + '_right', true);
                        player.setFlipX(false);
                    }
                    else {
                        player.setVelocityX(0);
                        if (player.body.touching.down) {
                            player.anims.play(player.getData('key') + '_idle', true);
                        }
                    }
                    if (player.getData('up').isDown && player.body.touching.down){
                        player.anims.play(player.getData('key') + '_jump', true);
                        player.setVelocityY(-this.jumpspeed);
                        this.time.delayedCall(200, function(){
                            player.data.values.doublejumps++;
                        });
                    } else if (player.getData('up').isDown && player.getData('doublejumps') > 1) {
                        player.setVelocityY(-this.jumpspeed);
                        player.data.values.doublejumps--;
                    }
                }
            },this);   
        }

       else if (this.SPACE.isDown) {
                this.scene.start("GameScene", {singleplayer: this.singleplayer});                
        } 
    }

    private hitBomb(player: Phaser.Physics.Arcade.Sprite):void {
        if (this.singleplayer) {
            player.anims.play(player.getData('key') + '_die');

            this.gameOverText = this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#000'}).setOrigin(0.5);
            this.gameOver = true;
            this.time.delayedCall(1000, function (){
                this.gameOverHintText = this.add.text(400, 345, 'Press Space to Continue', { fontSize: '32px', fill: '#000'}).setOrigin(0.5);
            },[],this);

        } else if (!player.getData('dead')){
            this.playersleft --;
            player.data.values.dead = true;
            player.anims.play(player.getData('key') + '_die');

            if (this.playersleft === 0) {
                if (this.players.getFirst(true).getData('score') > this.players.getLast(true).getData('score')) {
                    this.gameOverText = this.add.text(400, 300, 'PLAYER 1 WINS!', { fontSize: '64px', fill: '#000'}).setOrigin(0.5);
                } else if (this.players.getFirst(true).getData('score') < this.players.getLast(true).getData('score')) {
                    this.gameOverText = this.add.text(400, 300, 'PLAYER 2 WINS!', { fontSize: '64px', fill: '#000'}).setOrigin(0.5);
                } else {
                    this.gameOverText = this.add.text(400, 300,  player.getData('name') + ' WINS!', { fontSize: '64px', fill: '#000'}).setOrigin(0.5);
                }
                this.time.delayedCall(1000, function (){
                    this.gameOver = true;
                    this.gameOverHintText = this.add.text(400, 345, 'Press Space to Continue', { fontSize: '32px', fill: '#000'}).setOrigin(0.5);
                },[],this);
            } else {
                this.time.delayedCall(2000, function (){
                    player.setVisible(false);
                });
            }
        }
    }

    private collectStar(player, star):void {
        star.disableBody(true, true);

        player.data.values.score += 10;
        player.data.values.scoreText.setText('Score: ' + player.getData('score'));

        if(this.singleplayer){
            if (this.best < player.getData('score')) {
                this.best = player.getData('score');
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
    
            let bomb: Phaser.Physics.Arcade.Body = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1,1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    private setAnims(player: Phaser.Physics.Arcade.Sprite):void {

        this.anims.create({
            key: player.getData('key') + '_left',
            frames: this.anims.generateFrameNumbers(player.texture.key + '_run', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: player.getData('key') + '_right',
            frames: this.anims.generateFrameNumbers(player.texture.key + '_run', { start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: player.getData('key') + '_jump',
            frames: this.anims.generateFrameNumbers(player.texture.key + '_jump', { start: 0, end: 7}),
            frameRate: 20,
        });

        this.anims.create({
            key: player.getData('key') + '_die',
            frames: this.anims.generateFrameNumbers(player.texture.key + '_die', { start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: player.getData('key') + '_idle',
            frames: this.anims.generateFrameNumbers(player.texture.key + '_idle', { start: 0, end: 3}),
            frameRate: 5,
            repeat: -1,
        });       

        this.anims.create({
            key: player.getData('key') + '_die',
            frames: this.anims.generateFrameNumbers(player.texture.key + '_die', { start: 0, end: 7}),
            frameRate: 5,
            repeat:0,
            hideOnComplete: true
        });   
    }  
};