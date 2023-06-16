import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {

    constructor() {
        super('game-over');
    }


    create() {
        const { width, height } = this.scale
        this.add.text(width * 0.5, height * 0.3, 'Game Over', {
            fontSize: '52px',
            color: '#8A00FF',
            font: 'bold 52px Arial'


        })

            .setOrigin(0.5)
        const button = this.add.rectangle(width * 0.5, height * 0.55, 150, 75, 0x8AFFC1)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.scene.start('game')
            })

        this.add.text(button.x, button.y, 'Restart', {
            fontSize: '52px',
            color: '2A4D4E'
        }
        )
            .setOrigin(0.5)

    }



}