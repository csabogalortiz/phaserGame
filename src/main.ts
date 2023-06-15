import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 600,
	physics: {
		default: 'matter',
		matter: {
			debug: true
		}
	},
	scene: [Game, UI]
}

export default new Phaser.Game(config)


// This is the main TypeScript file where the Phaser game instance is created and configured.
//  It imports the Phaser module and the Game class from the./ scenes / Game file. 
// It also defines a game configuration object and creates a new Phaser game using that configuration.