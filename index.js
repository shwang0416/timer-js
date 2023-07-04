const time = {
    startTime: null,
    timerId: null,
}   

const timerView = document.querySelector('.timer-view');

function handleControlBoundary (initializedShow, startedShow, pausedShow) {
    const initialized = document.getElementById('initialized');
    const started = document.getElementById('started');
    const paused = document.getElementById('paused');

    initialized.className = `control-boundary ${initializedShow ? '' : 'hidden'}`
    started.className = `control-boundary ${startedShow ? '' : 'hidden'}`
    paused.className = `control-boundary ${pausedShow ? '' : 'hidden'}`

}

function getTime(currentTime) {
    return currentTime - time.startTime
}

function formatTime(time) {
    const minutes = parseInt(time / 3600).toString().padStart(2,'0');
    const seconds = time - (minutes * 3600).toString().padStart(3,'0');
    return `${minutes}:${seconds}`;
}

function start () {
    console.log('start');
    time.startTime = new Date();

    const timerId = setInterval(()=>{
        timerView.innerHTML = formatTime(getTime(new Date()));
    }, 1);

    time.timerId = timerId;
}

function pause () {
    if(!time.timerId) {
        throw new Error('timerId가 없음');
    }
    clearTimeout(time.timerId);

}

function reset () {
    console.log('reset');
    pause();
    time.startTime = new Date();
    timerView.innerHTML = `00:000`;


}
function lap () {
    console.log('lap');
}

function restart () {
    reset();
    start();
    console.log('restart');

}


function handleStart() {
    start();
    handleControlBoundary(false, true, false);
}

function handlePause() {
    pause();
    handleControlBoundary(false, false, true);
}

function handleReset() {
    reset();
    handleControlBoundary(true, false, false);
}
function handleRestart() {
    restart();
    handleControlBoundary(false, true, false);
}
function control (event) {
    const action = event.target.dataset.action;

    switch(action) {
        case 'start':
            handleStart();
            break;
        case 'pause':
            handlePause();
            break;
        case 'reset':
            handleReset();
            break;
        case 'lap':
            lap();
            break;
        case 'restart':
            handleRestart();
            break;
        default:
            alert('no action');
    }
}


// document와 window의 차이?
const initialize = () => {
    const controlField = document.querySelector('.control-field');
    controlField.addEventListener('click', control);

}
// dom이 다 그려진 뒤부터 스크립트가 시작되어야 한다
window.addEventListener("DOMContentLoaded", initialize);