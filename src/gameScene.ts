import 'phaser';
import { AlignGrid } from './AlignGrid';
export class GameScene extends Phaser.Scene {
    best: number;
    bestScoreText: Phaser.GameObjects.BitmapText;
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver:boolean;
    firstGame:boolean;
    gameOverText: Phaser.GameObjects.BitmapText;
    gameOverHintText: Phaser.GameObjects.BitmapText;
    players: Phaser.Physics.Arcade.Group;
    singleplayer: boolean;
    movespeed: number;
    jumpspeed: number;
    doublejumps: number;
    playersleft: number;
    gridConfig: {scene: GameScene, cols: number, rows: number}
    agrid: AlignGrid;
    SPACE: Phaser.Input.Keyboard.Key;
    gameWidth: number;
    gameHeight: any;

    constructor(){
        super({
            key: 'GameScene'
        });
    }
    init(params: any): void {
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);
        this.gameOver = false;
        this.singleplayer = params.singleplayer;
        this.movespeed = 150;
        this.jumpspeed = 320;
        this.playersleft = 1;
        //number of times a player can jump without touching down
        this.doublejumps = 1;
        this.gridConfig = {
            'scene': this,
            'cols': 32,
            'rows': 20,
        }
    }

    preload():void {
        this.load.bitmapFont('scorefont', './assets/fonts/font.png', './assets/fonts/font.fnt');
        this.load.bitmapFont('yellowfont', './assets/fonts/yellowfont.png', './assets/fonts/yellowfont.fnt');
        this.load.image('tiles', './assets/tileset.png');
        this.load.image('background', './assets/back.png');
        this.load.tilemapTiledJSON('map', './assets/Map1.json');
        this.load.image('star', './assets/star.png');
        this.load.image('bomb', './assets/bomb.png');
        this.load.image('Owl', './assets/Owlet_Monster.png');
        this.load.image("Dude", './assets/Dude_Monster.png');
        this.load.image("tiles", './assets/tileset.png');
        this.load.image('WSAD', './assets/WSADBubble.png');
        this.load.image('arrows', './assets/ArrowsBubble.png');

        this.load.spritesheet('Owl_idle', './assets/Owlet_Monster_Idle_4.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Owl_run', './assets/Owlet_Monster_Run_6.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Owl_jump', './assets/Owlet_Monster_Jump_8.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Owl_die', './assets/Owlet_Monster_Death_8.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_idle', './assets/Dude_Monster_Idle_4.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_run', './assets/Dude_Monster_Run_6.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_jump', './assets/Dude_Monster_Jump_8.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('Dude_die', './assets/Dude_Monster_Death_8.png', {
            frameWidth: 32, frameHeight: 32
        });
    }

    create():void {
        this.add.image(256, 160, 'background').setScale(1.35);
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('tileset','tiles');       
        const world = map.createStaticLayer('Tiles', tileset, 0, 0);
        world.setCollisionByProperty({collision: true});
        this.players = this.physics.add.group();



        this.agrid = new AlignGrid(this.gridConfig);
        //this.agrid.showNumbers();
        if (this.firstGame == null) {
            this.firstGame = true;
            this.best = 0;
        } else {
            this.firstGame = false;
            if (this.singleplayer) {
                this.bestScoreText = this.add.bitmapText(0,0, 'scorefont', 'Best: ' + this.best, 32).setOrigin(1,0);
                this.agrid.placeAt(31,0,this.bestScoreText);
            }
        }

        const playerOne: Phaser.Physics.Arcade.Sprite = this.players.create(0,0,'Owl').setData({
            name: 'Player 1',
            key: 'Owl',
            score: 0,
            scoreText: this.add.bitmapText(0,0, 'scorefont', 'Score: 0', 32).setOrigin(0,0),
            dead: false,
            up: this.input.keyboard.addKey('w'),
            down: this.input.keyboard.addKey('s'),
            left: this.input.keyboard.addKey('a'),
            right: this.input.keyboard.addKey('d'),
            doublejumps: this.doublejumps,
            controls: this.add.image(-20,-20,'WSAD').setOrigin(0.2,1)
        });
        this.agrid.placeAt(4, 13, playerOne);
        this.agrid.placeAt(0,0,playerOne.getData('scoreText'));

        if (this.firstGame){
            this.agrid.placeAt(5,14, playerOne.getData('controls'));
        }

        this.setAnims(playerOne);
        playerOne.body.setOffset(9,7);
        playerOne.body.setSize(13,25,false);

        if (!this.singleplayer) {
            const playerTwo: Phaser.Physics.Arcade.Sprite = this.players.create(0,0,'Dude').setData({
                name: 'Player 2',
                key: 'Dude',
                score: 0,
                scoreText: this.add.bitmapText(0,0, 'scorefont', 'Score: 0', 32).setOrigin(1,0),
                dead: false,
                up: this.input.keyboard.addKey('up'),
                down: this.input.keyboard.addKey('down'),
                left: this.input.keyboard.addKey('left'),
                right: this.input.keyboard.addKey('right'),
                doublejumps: this.doublejumps,
                controls: this.add.image(0,0,'arrows').setOrigin(0.8,1)
            });
            this.agrid.placeAt(27,13,playerTwo);
            this.agrid.placeAt(31,0,playerTwo.getData('scoreText'));
            this.agrid.placeAt(26,14, playerTwo.getData('controls'));

            this.setAnims(playerTwo);
            playerTwo.body.setOffset(9,7);
            playerTwo.body.setSize(13,25,false);
            this.playersleft ++;
        }
        this.players.children.iterate(function (player: Phaser.Physics.Arcade.Sprite) {
            player.setCollideWorldBounds(true);
        });

        this.bombs = this.physics.add.group();
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 7,
            setXY: { x: 32, y: 0, stepX: 64 }
        });
        
        this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
            child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
        });
    
        this.physics.add.collider(this.players, world);
        // remove player collisions until bug resolved
        // bug - falls through terrain when jumped on
        // this.physics.add.collider(this.players, this.players);
        this.physics.add.collider(this.stars, world);
        this.physics.add.collider(this.bombs, world);
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
                        player.data.values.controls.destroy();
                        if (player.body.blocked.down) {
                            player.anims.play(player.getData('key') + '_left', true);
                        }
                        player.setFlipX(true);
                    }
                    else if (player.getData('right').isDown) {
                        player.setVelocityX(this.movespeed);
                        player.data.values.controls.destroy();
                        if (player.body.blocked.down) {
                            player.anims.play(player.getData('key') + '_right', true);
                        }
                        player.setFlipX(false);
                    }
                    else {
                        player.setVelocityX(0);
                        if (player.body.blocked.down) {
                            player.anims.play(player.getData('key') + '_idle', true);
                        }
                    }
                    if (player.getData('up').isDown && player.body.blocked.down){
                        player.anims.play(player.getData('key') + '_jump', true);
                        player.setVelocityY(-this.jumpspeed);
                        player.data.values.controls.destroy();
                        this.time.delayedCall(200, function(){
                            player.data.values.doublejumps++;
                        });
                    } else if (player.getData('up').isDown && player.getData('doublejumps') > 1) {
                        player.setVelocityY(-this.jumpspeed);
                        player.anims.play(player.getData('key') + '_jump', false);
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
        if (this.singleplayer && !this.gameOver == true) {
            player.anims.play(player.getData('key') + '_die');

            // this is really hacky and I hate it
            this.time.delayedCall(500, function (){
                player.disableBody(true,true);
            });
            this.gameOverText = this.add.bitmapText(0, 0, 'yellowfont', 'GAME OVER!', 64).setOrigin(0.5, 0.5);
            this.agrid.placeAt(16,4,this.gameOverText);
            this.gameOver = true;
            this.time.delayedCall(1000, function (){
                this.gameOverHintText = this.add.bitmapText(0, 0, 'yellowfont', 'Press Space to Continue', 32).setOrigin(0.5, 0.5);
                this.agrid.placeAt(16,14,this.gameOverHintText);
            },[],this);

        } else if (!this.singleplayer && !player.getData('dead')){
            this.playersleft --;
            player.data.values.dead = true;
            player.anims.play(player.getData('key') + '_die');

            if (this.playersleft === 0) {

                if (this.players.getFirst(true).getData('score') > this.players.getLast(true).getData('score')) {
                    this.gameOverText = this.add.bitmapText(0, 0, 'yellowfont', 'PLAYER 1 WINS!', 58).setOrigin(0.5, 0.5);
                } else if (this.players.getFirst(true).getData('score') < this.players.getLast(true).getData('score')) {
                    this.gameOverText = this.add.bitmapText(0, 0, 'yellowfont', 'PLAYER 2 WINS!', 58).setOrigin(0.5, 0.5);
                } else {
                    this.gameOverText = this.add.bitmapText(0, 0, 'yellowfont',  player.getData('name') + ' WINS!', 58).setOrigin(0.5, 0.5);
                }
                this.agrid.placeAt(16,3,this.gameOverText);
                this.time.delayedCall(1000, function (){
                    this.gameOver = true;
                    this.gameOverHintText = this.add.bitmapText(0, 0, 'yellowfont', 'Press Space to Continue', 32).setOrigin(0.5, 0.5);
                    this.agrid.placeAt(16, 14, this.gameOverHintText);
                },[],this);
            } 
            this.time.delayedCall(500, function (){
                player.disableBody(false,true);
            });
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
                   // this.bestScoreText.setColor('Green');
                    this.bestScoreText.setFontSize(36);
                }
            }
        }
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function(child:Phaser.Physics.Arcade.Sprite){
                child.enableBody(true, child.x, 0, true, true);
            });
            let x = (player.x < this.gameWidth / 2) ? Phaser.Math.Between(this.gameWidth/2, this.gameWidth) : Phaser.Math.Between(0,this.gameWidth/2);
    
            let bomb: Phaser.Physics.Arcade.Body = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1,1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-100, 100), 10);
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
            frameRate: 6,
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