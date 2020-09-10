'use strict';

const game = document.querySelector('.game');
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');

car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speedMove: 3,
    speed: 5,
    traffic: 3
};

function getQuantityElements(heightElement) {
    return gameArea.clientHeight / heightElement + 1;
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame () {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = '125px';
    car.style.top = '';
    car.style.bottom = '10px';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = `${i*100}px`;
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.top = `${enemy.y}px`;
        enemy.style.left = `${(gameArea.offsetWidth - enemy.clientWidth)*Math.random()}px`;
        gameArea.appendChild(enemy);
    }

    setting.start = true;
    setting.score = 0;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame () {
    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = `SCORE: ${setting.score}`;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speedMove;
        }
        if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
            setting.x += setting.speedMove;
        }
        if (keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight) {
            setting.y += setting.speedMove;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speedMove;
        }
        car.style.left = `${setting.x}px`;
        car.style.top = `${setting.y}px`;
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}


function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad () {
    const lines = gameArea.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = `${line.y}px`;

        if (line.y > gameArea.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy () {
    const enemies = gameArea.querySelectorAll('.enemy');

    enemies.forEach(function(enemy) {
        const carRect = car.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (
            carRect.top <= enemyRect.bottom &&
            carRect.bottom >= enemyRect.top &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right
        ) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.clientHeight;
        }

        enemy.y += setting.speed / 1.25;
        enemy.style.top = `${enemy.y}px`;

        if (enemy.y > gameArea.clientHeight) {
            enemy.y = -100 * setting.traffic;
            enemy.style.left = `${(gameArea.offsetWidth - enemy.clientWidth)*Math.random()}px`;
        }

    });
}
