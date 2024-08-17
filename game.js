import { createAnimations } from "./animations.js";

const config = { // configuraciones para el video juego
    autoFocus: false,
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
}

new Phaser.Game(config); // este el objeto para cargar el juego

function preload() {
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    ) //  se cargar la imagen de la nuebe

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )
    
    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        { frameWidth: 18, frameHeight: 16 }
    )

    this.load.audio(
        'gameover',
        'assets/sound/music/gameover.mp3'
    )
}

function create() {

    this.add.image(100, 50, 'cloud1')
        .setOrigin(0, 0)
        .setScale(0.15)

    this.flooar = this.physics.add.staticGroup();

    this.flooar
        .create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.flooar
        .create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()
        
    // this.mario = this.add.sprite(50, 200, 'mario')
    //     .setOrigin(0, 1)

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setGravityY(300)
        .setCollideWorldBounds(true)

    this.physics.world.setBounds(0, 0, 2000, config.height);
    this.physics.add.collider(this.mario, this.flooar);
    
    this.cameras.main.setBounds(0, 0,2000, config.height);
    this.cameras.main.startFollow(this.mario);

    createAnimations(this)

    this.keys = this.input.keyboard.createCursorKeys();
    
}

function update() {
    if(this.mario.isDead == true) return

    if(this.keys.left.isDown) {
        this.mario.anims.play('mario-walk', true);
        this.mario.x -= 2;
        this.mario.flipX = true;
    } else if(this.keys.right.isDown) {
        this.mario.anims.play('mario-walk', true);
        this.mario.x += 2;
        this.mario.flipX = false;
    } else if (this.mario){
        this.mario.anims.play('mario-idle', true);
    }

    if(this.keys.up.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(-300)
        this.mario.anims.play('mario-jump', true);
    }

    if(this.mario.y >= config.height) {
        this.mario.isDead = true;
        this.mario.anims.play('mario-dead');
        this.mario.setCollideWorldBounds(false);
        this.sound.add('gameover', { volumen: 0.1 }).play()

        setTimeout(()=>{
            this.mario.setVelocityY(-350)
        }, 100)

        setTimeout(()=>{
            this.scene.restart()
        }, 2000)
    }
}