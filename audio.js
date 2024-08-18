const INIT_AUDIO = [
    {
        key : 'gameover',
        path : 'assets/sound/music/gameover.mp3'
    }, 
    {
        key : 'goomba-stomp',
        path : 'assets/sound/effects/goomba-stomp.wav'
    },
    {
        key : 'coin-pickup',
        path : 'assets/sound/effects/coin.mp3'
    },
    {
        key : 'power-up',
        path : 'assets/sound/effects/consume-powerup.mp3'
    }

]

export const initAudio = ({ load }) => {
    INIT_AUDIO.forEach(({key, path})=> {
        load.audio(key, path);
    })
}

export const playAudio = (id, {sound}, {volumen = 1} = {}) => {
    try {
        return sound.add(id, {volumen}).play()
    } catch (error) {
        console.error(e)
    }
}