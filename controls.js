const MARIO_ANIMATIONS = {
    grown : {
        idle: 'mario-grown-idle',
        walk: 'mario-grown-walk',
        jump: 'mario-grown-jump'
    },
    normal : {
        idle: 'mario-idle',
        walk: 'mario-walk',
        jump: 'mario-jump'
    }
}

export function checkControls ({mario, keys}) {
    const isMarioTouchingFloor = mario.body.touching.down

    const isLeftkeyDown = keys.left.isDown
    const isRightkeyDown = keys.right.isDown
    const isUpkeyDown = keys.up.isDown

    if(mario.isDead) return
    if(mario.isBlocked) return
    
    const marioAnimations = mario.isGrown ? MARIO_ANIMATIONS.grown : MARIO_ANIMATIONS.normal;

    if(isLeftkeyDown) {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true);
        mario.x -= 2;
        mario.flipX = true;
    } else if(isRightkeyDown) {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true);
        mario.x += 2;
        mario.flipX = false;
    } else if (isMarioTouchingFloor) {
        mario.anims.play(marioAnimations.idle, true);
    }

    if(isUpkeyDown && isMarioTouchingFloor) {
        mario.setVelocityY(-300)
        mario.anims.play('mario-jump', true);
    }
}