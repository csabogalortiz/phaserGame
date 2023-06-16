import Phaser from 'phaser';
import { sharedInstance as events } from "./EventCenter";


export default class UI extends Phaser.Scene {

    private starLabel!: Phaser.GameObjects.Text
    private starsCollected = 0
    private graphics!: Phaser.GameObjects.Graphics
    private lastHealth = 100


    constructor() {
        super({
            key: 'ui'
        })
    }

    init() {
        this.starsCollected = 0
    }

    create() {
        // this, this.healthBar = this.add.text(10, 10, 'Health Points: 100', {
        //     fontSize: '32px',
        //     color: '#7C91FA',
        //     backgroundColor: '#FFDB00'

        // })

        this.graphics = this.add.graphics()
        this.setHealthBar(100)


        this, this.starLabel = this.add.text(450, 10, '☆: 0', {
            fontSize: '32px',
            color: '#7C91FA',
            backgroundColor: '#FFDB00'

        })
        events.on('health-changed', this.handleHealthChanged, this)
        events.on('star-collected', this.handleStarCollected, this)
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('star-collected', this.handleStarCollected, this)
        })


    }
    private handleHealthChanged(value: number) {
        this.tweens.addCounter({
            from: this.lastHealth,
            to: value,
            duration: 200,
            onUpdate: tween => {
                const value = tween.getValue()
                console.log(value)
            }
        })
        this.setHealthBar(value)
        this.lastHealth = value

    }
    private handleStarCollected() {
        this.starsCollected += 1
        this.starLabel.text = `Stars: ${this.starsCollected}`
    }

    private setHealthBar(value: number) {
        const width = 200
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100
        this.graphics.clear()
        this.graphics.fillStyle(0xA6FFFF)
        this.graphics.fillRoundedRect(10, 10, width, 20, 5)

        if (percent > 0) {
            this.graphics.fillStyle(0xFF7BFF)
            this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5)
        }

    }
}