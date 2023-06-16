import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import SnowmanController from './SnowmanController';

export default class Game extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private penguin?: Phaser.Physics.Matter.Sprite;
    private snowman?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController
    private obstacles!: ObstaclesController
    private snowmen: SnowmanController[] = []

    constructor() {
        super('game');
    }
    // super('game') calls the constructor of the parent class (Phaser.Scene), passing the string 'game' as an argument.

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacles = new ObstaclesController()
        this.snowmen = []

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.destroy()
        })

    }

    preload() {
        this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json');
        this.load.atlas('snowman', 'assets/snowman.png', 'assets/snowman.json')
        this.load.image('tiles', 'assets/sheet.png');
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json');
        this.load.image('star', 'assets/star.png')
        this.load.image('health', 'assets/health.png')
    }

    create() {
        // this.createPenguinAnimations();

        this.scene.launch('ui')
        const map = this.make.tilemap({ key: 'tilemap' });
        const tileset = map.addTilesetImage('iceworld', 'tiles');
        const ground = map.createLayer('ground', tileset);
        ground.debugShowBody = false;
        ground.setCollisionByProperty({ collides: true });
        map.createLayer('obstacles', tileset)

        const objectsLayer = map.getObjectLayer('objects');

        //  The objects property within this layer is an array that holds various objects placed on the map. 
        // The forEach method is used to iterate over each object within this array and execute a callback function for each object.

        objectsLayer.objects.forEach(objData => {

            const { x = 0, y = 0, name, width = 0, height = 0 } = objData;
            switch (name) {
                case 'penguin-spawn':
                    {
                        this.penguin = this.matter.add.sprite(x + (width + 0.5), y, 'penguin')
                            .setFixedRotation();
                        this.playerController = new PlayerController(
                            this,
                            this.penguin,
                            this.cursors,
                            this.obstacles)

                        this.cameras.main.startFollow(this.penguin, true);
                        // this.matter.add.sprite(x, y - 50, 'star')
                        break

                    }
                case 'snowman':
                    {
                        const snowman = this.matter.add.sprite(x, y, 'snowman')
                            .setFixedRotation();
                        this.snowmen.push(new SnowmanController(this, snowman))
                        this.obstacles.add('snowman', snowman.body as MatterJS.BodyType)

                        break

                    }
                case 'star': {
                    const star = this.matter.add.sprite(x, y, 'star', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    star.setData('type', 'star')
                    break
                }

                case 'health': {
                    const health = this.matter.add.sprite(x, y, 'health', undefined, {
                        isStatic: true,
                        isSensor: true
                    })
                    health.setData('type', 'health')
                    health.setData('healthPoints', 10)
                    break
                }
                case 'spikes': {
                    const spike = this.matter.add.rectangle(x + (width * 0.5), y + (height * 0.5), width, height, {
                        isStatic: true,
                    })
                    this.obstacles.add('spikes', spike)
                    break
                }
            }
        });

        this.cameras.main.startFollow(this.penguin!);
        this.matter.world.convertTilemapLayer(ground);

    }

    destroy() {
        this.scene.stop('ui')
        this.snowmen.forEach(snowman => snowman.destroy())
    }

    update(t: number, dt: number) {
        if (this.playerController) {
            this.playerController.update(dt)
        }
        this.snowmen.forEach(snowman => snowman.update(dt))
    }



    // {
    //     if (!this.penguin) {
    //         return
    //     }
    // }
    // const speed = 10;
    // if (this.cursors.left.isDown) {
    //     this.penguin!.flipX = true;
    //     this.penguin!.setVelocityX(-speed);
    //     this.penguin!.play('player-walk', true);
    // } else if (this.cursors.right.isDown) {
    //     this.penguin!.flipX = false;
    //     this.penguin!.setVelocityX(speed);
    //     this.penguin!.play('player-walk', true);
    // } else {
    //     this.penguin!.setVelocityX(0);
    //     this.penguin!.play('player-idle', true);
    // }

    // const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    // if (spaceJustPressed && this.isTouchingGround) {
    //     this.penguin!.setVelocityY(-12);
    //     this.isTouchingGround = false;
    // }
}

// private createAnimations() {
//     this.sprite.anims.create({
//         key: 'player-idle',
//         frames: [{ key: 'penguin', frame: 'penguin_walk01.png' }]
//     });

//     this.sprite.anims.create({
//         key: 'player-walk',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('penguin', {
//             start: 1,
//             end: 4,
//             prefix: 'penguin_walk0',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });
// }








// update() {
//     const speed = 10;
//     const isMouseClickDown = this.input.activePointer.isDown;

//     // The variable isMouseClickDown is assigned the value of true
//     // if the mouse click is currently being held down, and false otherwise.
//     // It uses this.input.activePointer.isDown to check the state of the mouse click.

//     if (isMouseClickDown) {
//         const mouseX = this.input.activePointer.worldX;
//         const penguinX = this.penguin.x;
//         // If the mouse click is held down (isMouseClickDown is true), we proceed inside this condition.
//         // We store the current x - coordinate of the mouse pointer in the mouseX variable using this.input.activePointer.worldX.
//         // The penguinX variable is assigned the current x - coordinate of the penguin sprite(this.penguin.x).

//         if (mouseX < penguinX) {
//             this.penguin.setVelocityX(-speed);
//             this.penguin.play('player-walk', true);
//         } else if (mouseX > penguinX) {
//             this.penguin.setVelocityX(speed);
//             this.penguin.play('player-walk', true);
//         }
//     } else {
//         this.penguin.setVelocityX(0);
//         this.penguin.play('player-idle', true);
//     }
// }







// // ************
// This is a TypeScript file that defines the Game class. It extends the Phaser.Scene class, making it a Phaser scene.It contains the implementation of various methods, such as init, preload, create, and update, as well as additional class properties and methods.

// The Game class is then exported as the default export of the file, making it available for import in other files.

