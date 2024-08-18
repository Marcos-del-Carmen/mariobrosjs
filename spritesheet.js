const INIT_SPRITESHEETS = [
    {
        key : 'mario',
        path : 'assets/entities/mario.png',
        frameWidth: 18,
        frameHeight: 16
    },
    {
        key : 'mario-grown',
        path : 'assets/entities/mario-grown.png',
        frameHeight: 32,
        frameWidth: 18,
    },
    {
        key : 'goomba',
        path : 'assets/entities/overworld/goomba.png',
        frameWidth: 16,
        frameHeight: 16
    },
    {
        key : 'coin',
        path : 'assets/collectibles/coin.png',
        frameWidth: 16,
        frameHeight: 16
    }
]

export const initSpritesheet = ({load})=> {
    INIT_SPRITESHEETS.forEach(({ key, path, frameWidth, frameHeight})=> {
        load.spritesheet(key, path, {frameWidth, frameHeight})
    })
}