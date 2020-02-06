import * as Phaser from 'phaser';
import AlignGrid from './AlignGrid';
import Player from './Player';

export default class GameScene extends Phaser.Scene {
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver: boolean;
    firstGame: boolean;
    gameOverText: Phaser.GameObjects.BitmapText;
    gameOverHintText: Phaser.GameObjects.BitmapText;
    players: Phaser.Physics.Arcade.Group;
    singleplayer: boolean;
    movespeed: number;
    jumpspeed: number;
    doublejumps: number;
    playersleft: number;
    gridConfig: { scene: GameScene; cols: number; rows: number };
    agrid: AlignGrid;
    SPACE: Phaser.Input.Keyboard.Key;
    gameWidth: number;
    gameHeight: any;
    testText: any;
    startingBest: number;

    constructor() {
        super({
            key: 'GameScene',
        });
    }
    init(params: any): void {
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);
        this.gameOver = false;
        this.singleplayer = params.singleplayer;
        this.startingBest = 0;
        this.movespeed = 150;
        this.jumpspeed = 320;
        this.playersleft = 1;
        // number of times a player can jump without touching down
        this.doublejumps = 1;
        this.gridConfig = {
            scene: this,
            cols: 32,
            rows: 20,
        };
    }

    preload(): void {
        this.load.bitmapFont('scorefont', './assets/fonts/font.png', './assets/fonts/font.fnt');
        this.load.bitmapFont(
            'yellowfont',
            './assets/fonts/yellowfont.png',
            './assets/fonts/yellowfont.fnt'
        );
        this.load.image('tiles', './assets/tileset.png');
        this.load.image('background', './assets/back.png');
        this.load.tilemapTiledJSON('map', './assets/Map1.json');
        this.load.image('star', './assets/star.png');
        this.load.image('bomb', './assets/bomb.png');
        this.load.image('Owl', './assets/Owlet_Monster.png');
        this.load.image('Dude', './assets/Dude_Monster.png');
        this.load.image('tiles', './assets/tileset.png');
        this.load.image('WSAD', './assets/WSADBubble.png');
        this.load.image('arrows', './assets/ArrowsBubble.png');

        this.load.spritesheet('pixel_bomb', './assets/pixelbomb.png', {
            frameWidth: 45,
            frameHeight: 45,
        });

        this.load.spritesheet('Owl_idle', './assets/Owlet_Monster_Idle_4.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Owl_run', './assets/Owlet_Monster_Run_6.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Owl_jump', './assets/Owlet_Monster_Jump_8.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Owl_die', './assets/Owlet_Monster_Death_8.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Dude_idle', './assets/Dude_Monster_Idle_4.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Dude_run', './assets/Dude_Monster_Run_6.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Dude_jump', './assets/Dude_Monster_Jump_8.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('Dude_die', './assets/Dude_Monster_Death_8.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create(): void {
        this.add.image(256, 160, 'background').setScale(1.35);
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');
        const world = map.createStaticLayer('Tiles', tileset, 0, 0);
        world.setCollisionByProperty({ collision: true });
        this.players = this.physics.add.group();

        this.agrid = new AlignGrid(this.gridConfig);
        // this.agrid.showNumbers();

        const playerOne = new Player(this, 0, 0, {
            name: 'Player 1',
            key: 'Owl',
            position: 1,
            bestScore: this.startingBest,
            doublejumps: this.doublejumps,
            movespeed: this.movespeed,
            jumpspeed: this.jumpspeed,
        });
        this.players.add(playerOne);
        playerOne.setHitBoxes();
        playerOne.setControls('w', 's', 'a', 'd');
        playerOne.scoreText = this.add
            .bitmapText(0, 0, 'scorefont', `score: ${playerOne.score}`, 32)
            .setOrigin(0, 0);
        this.agrid.placeAt(4, 13, playerOne);
        this.agrid.placeAt(0, 0, playerOne.scoreText);

        if (this.firstGame == null) {
            this.firstGame = true;
            playerOne.hint = this.add.image(-20, -20, 'WSAD').setOrigin(0.2, 1);
            this.agrid.placeAt(5, 14, playerOne.hint);
        } else {
            this.firstGame = false;
            if (this.singleplayer) {
                playerOne.bestScoreText = this.add
                    .bitmapText(0, 0, 'scorefont', `Best: ${playerOne.bestScore}`, 32)
                    .setOrigin(1, 0);
                this.agrid.placeAt(31, 0, playerOne.bestScoreText);
            }
        }
        if (!this.singleplayer) {
            const playerTwo = new Player(this, 0, 0, {
                name: 'Player 2',
                key: 'Dude',
                position: 2,
                bestScore: this.startingBest,
                doublejumps: this.doublejumps,
                movespeed: this.movespeed,
                jumpspeed: this.jumpspeed,
            });
            this.players.add(playerTwo);
            playerTwo.setHitBoxes();
            playerTwo.setControls('up', 'down', 'left', 'right');
            playerTwo.hint = this.add.image(0, 0, 'arrows').setOrigin(0.8, 1);
            playerTwo.scoreText = this.add
                .bitmapText(0, 0, 'scorefont', `score: ${playerTwo.score}`, 32)
                .setOrigin(1, 0);
            this.agrid.placeAt(27, 13, playerTwo);
            this.agrid.placeAt(31, 0, playerTwo.scoreText);
            if (this.firstGame) {
                this.agrid.placeAt(26, 14, playerTwo.hint);
            }
            this.playersleft++;
        }

        this.players.children.iterate(function(player: Player) {
            player.setCollideWorldBounds(true);
        });

        this.anims.create({
            key: 'pixel_bomb',
            frames: this.anims.generateFrameNumbers('pixel_bomb', {
                start: 0,
                end: 8,
            }),
            frameRate: 10,
            repeat: 0,
        });

        this.bombs = this.physics.add.group();
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 7,
            setXY: { x: 32, y: 0, stepX: 64 },
        });

        this.stars.children.iterate(function(child: Phaser.Physics.Arcade.Sprite) {
            child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
        });

        this.physics.add.collider(this.players, world);
        this.physics.add.collider(this.stars, world);
        this.physics.add.collider(this.bombs, world);
        this.physics.add.collider(this.players, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.players, this.stars, this.collectStar, null, this);
        this.spawnBomb();
        // this.testText = this.add.bitmapText(100, 100, 'scorefont', 'hello', 32);
        this.SPACE = this.input.keyboard.addKey('space');
    }
    update(): void {
        if (this.gameOver === true) {
            if (this.SPACE.isDown) {
                this.scene.start('GameScene', { singleplayer: this.singleplayer });
            }
        } else {
            this.players.children.iterate(function(player: Player) {
                if (!player.dead) {
                    if (player.body.blocked.down) {
                        if (player.doublejumps < this.doublejumps) {
                            player.doublejumps = this.doublejumps;
                        }
                    }
                    if (player.left.isDown) {
                        player.moveLeft();
                    } else if (player.right.isDown) {
                        player.moveRight();
                    } else if (player.body.blocked.down) {
                        player.standIdle();
                    }
                    if (Phaser.Input.Keyboard.JustDown(player.up)) {
                        player.handleJump();
                    }
                }
            }, this);
        }
    }
    private spawnBomb() {
        if (!this.gameOver) {
            // Randomly pick player 1 or player 2 - Will always return player 1 in case of single player
            const playerX = Math.floor(Math.random() * this.players.children.size);
            const player: Phaser.Physics.Arcade.Sprite = this.players.getFirstNth(playerX, true);

            const x =
                player.x < this.gameWidth / 2
                    ? Phaser.Math.Between(this.gameWidth / 2, this.gameWidth)
                    : Phaser.Math.Between(0, this.gameWidth / 2);

            const bomb: Phaser.Physics.Arcade.Body = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1, 1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-100, 100), 10);
        }
    }

    private hitBomb(player: Player, bomb: Phaser.Physics.Arcade.Sprite): void {
        if (player.body.touching.down) {
            player.jump();
            player.doublejumps = this.doublejumps;
            bomb.setVelocityY(800);
            this.time.delayedCall(
                500,
                function() {
                    bomb.body.stop();
                    bomb.disableBody();
                    bomb.anims.play('pixel_bomb', true);
                    bomb.on(
                        'animationcomplete',
                        function() {
                            bomb.once(
                                'destroy',
                                function() {
                                    this.time.delayedCall(
                                        7000,
                                        function() {
                                            this.spawnBomb();
                                        },
                                        null,
                                        this
                                    );
                                },
                                this
                            );
                            bomb.destroy();
                        },
                        this
                    );
                },
                null,
                this
            );
        } else if (this.singleplayer && !this.gameOver) {
            player.die();
            this.startingBest = player.bestScore;
            this.gameOver = true;
            this.gameOverText = this.add
                .bitmapText(0, 0, 'yellowfont', 'GAME OVER!', 64)
                .setOrigin(0.5, 0.5);
            this.agrid.placeAt(16, 4, this.gameOverText);
            this.time.delayedCall(
                1000,
                function() {
                    this.gameOverHintText = this.add
                        .bitmapText(0, 0, 'yellowfont', 'Press Space to Continue', 32)
                        .setOrigin(0.5, 0.5);
                    this.agrid.placeAt(16, 14, this.gameOverHintText);
                },
                [],
                this
            );
        } else if (!this.singleplayer && !player.dead) {
            player.die();
            this.playersleft--;
            if (this.playersleft === 0) {
                if (this.players.getFirst(true).score > this.players.getLast(true).score) {
                    this.startingBest = this.players.getFirst(true).bestScore;
                    this.gameOverText = this.add
                        .bitmapText(0, 0, 'yellowfont', 'PLAYER 1 WINS!', 58)
                        .setOrigin(0.5, 0.5);
                } else if (this.players.getFirst(true).score < this.players.getLast(true).score) {
                    this.startingBest = this.players.getLast(true).bestScore;
                    this.gameOverText = this.add
                        .bitmapText(0, 0, 'yellowfont', 'PLAYER 2 WINS!', 58)
                        .setOrigin(0.5, 0.5);
                } else {
                    this.startingBest = this.players.getFirst(true).bestScore;
                    this.gameOverText = this.add
                        .bitmapText(0, 0, 'yellowfont', `${player.name} WINS!`, 58)
                        .setOrigin(0.5, 0.5);
                }
                this.agrid.placeAt(16, 3, this.gameOverText);
                this.time.delayedCall(
                    1000,
                    function() {
                        this.gameOver = true;
                        this.gameOverHintText = this.add
                            .bitmapText(0, 0, 'yellowfont', 'Press Space to Continue', 32)
                            .setOrigin(0.5, 0.5);
                        this.agrid.placeAt(16, 14, this.gameOverHintText);
                    },
                    [],
                    this
                );
            }
        }
    }

    private collectStar(player: Player, star: Phaser.Physics.Arcade.Sprite): void {
        star.disableBody(true, true);
        player.score += 10;
        player.scoreText.setText(`Score: ${player.score}`);
        const shouldDisplayScore = this.singleplayer && !this.firstGame;
        player.updateBestScore(shouldDisplayScore);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function(child: Phaser.Physics.Arcade.Sprite) {
                child.enableBody(true, child.x, 0, true, true);
            });
            this.spawnBomb();
        }
    }
}
