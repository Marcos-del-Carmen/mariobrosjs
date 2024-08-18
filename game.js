import { createAnimations } from "./animations.js";
import { initAudio, playAudio } from "./audio.js";
import { checkControls } from "./controls.js";
import { initSpritesheet } from "./spritesheet.js";

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

    this.load.image(
        'supermushroom',
        'assets/collectibles/super-mushroom.png'
    )

    initSpritesheet(this)
    initAudio(this)
    
} // se estan cargando los recurso del juego

function create() {
    createAnimations(this)

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

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setGravityY(300)
        .setCollideWorldBounds(true)

    this.enemy = this.physics.add.sprite(120, config.height - 64, 'goomba')
        .setOrigin(0, 1)
        .setGravityY(300)
        .setGravityX(-50)

    this.enemy.anims.play('goomba-walk', true);
    this.keys = this.input.keyboard.createCursorKeys();   

    this.collectibes = this.physics.add.staticGroup()
    this.collectibes.create(120, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(140, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(160, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(180, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(220, config.height -40, 'supermushroom').anims.play('supermushroom-idle', true)

    this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this)

    this.physics.world.setBounds(0, 0, 2000, config.height);
    this.physics.add.collider(this.mario, this.flooar);
    this.physics.add.collider(this.enemy, this.flooar);
    this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this);

    this.cameras.main.setBounds(0, 0,2000, config.height);
    this.cameras.main.startFollow(this.mario);    

}

function update() {
    const { mario } = this
    checkControls(this)

    if(mario.y >= config.height) {
        killMario(this)
    }
}

// acciones que se tiene en juego
function onHitEnemy(mario, enemy) {
    const isMarioTouchingEnemy = mario.body.touching.down
    const isEnemyTouchingMario = enemy.body.touching.up

    if(isMarioTouchingEnemy && isEnemyTouchingMario) {
        enemy.anims.play('goomba-dead', true);
        enemy.setVelocityX(0);
        mario.setVelocityY(-200);
        playAudio('goomba-stomp', this)
        addToScore(200, enemy, this)

        setTimeout(()=>{
            enemy.destroy();
        }, 500)
    } else  {
        // mario se muere
        killMario(this)
    }
}

function killMario (game) {

    const {mario, scene} = game

    if(mario.isDead) return
    
    mario.isDead = true;
    mario.anims.play('mario-dead');
    mario.setCollideWorldBounds(false);
    mario.setVelocityX(0)

    // playAudio('gameover', game, {volumen: 0.1 })
    mario.body.checkCollision.none = true;

    setTimeout(()=>{
        mario.setVelocityY(-250)
    }, 100)

    setTimeout(()=>{
        scene.restart()
    }, 2000)

}

function collectItem(mario, item) {
    const {texture : {key}} = item
    item.destroy()

    if(key === 'coin') {
        playAudio('coin-pickup', this,  {volume : 0.2})    
        addToScore(100, item, this);
    } else if(key === 'supermushroom') {
        this.physics.world.pause();
        this.anims.pauseAll();

        // playAudio('power-up', this, {volumen: 0.1 });
        
        let i = 0
        const interval = setInterval(()=> {
            i++
            mario.anims.play(i % 2 === 0 ? 
                'mario-grown-idle' : 
                'mario-idle'
            ) 
        }, 100)

        mario.isBlocked = true;
        mario.isGrown = true;

        setTimeout(()=>{
            mario.setDisplaySize(18, 32);
            mario.body.setSize(18, 32);
            this.anims.resumeAll()
            mario.isBlocked = false;
            clearInterval(interval)
            this.physics.world.resume()
        }, 500)
        

        mario.anims.play('mario-grown-idle', true)
    }
}

function addToScore(scoreToAdd, origin, game) {
    const scoreText = game.add.text(
        origin.x,
        origin.y, 
        scoreToAdd, {
            fontFamily :'SuperMario',
            fontSize : config.width / 40
        }
    )

    game.tweens.add({
        targets: scoreText,
        duration: 500, 
        y : scoreText.y - 20, 
        onComplete : () => {
            game.tweens.add({
                targets: scoreText,
                duration: 100,
                alpha: 0, 
                onComplete: ()=>{
                    scoreText.destroy()
                }
            })
        }
    })
}