const time = {
    startTime: null,
    timerId: null,
    prevLapTime: null,
    lapCount: 0,
    pausedTime: null
}

const MAX_LAP_COUNT = 5;
const timerView = document.querySelector('.timer-view');
const lapField = document.querySelector('.lap-field');

/* 
    vanila js 로 구현한 타이머(스톱워치)
    <기능>
    - start
    - *lap
        - lap을 누른 시간 사이의 차 (처음 눌렀을 경우 시작시간과의 차)
        - 오른쪽 DIV.lap-field에 최신 5개의 lap 기록만 보여준다
    - pause
    - restart
    - reset

    - 시간 포맷은 "{초 2자리}: {밀리초 3자리}"로 맞춘다
*/

/**
 * 
 * @param {string} shownId 보여질 div의 id. 그 외의 형제 div는 모두 숨겨지게 된다
 */
function handleControlBoundary (shownId) {
    const parent = document.querySelector('.control-field');
    for(let child of parent.children) {
        child.classList = `control-boundary hidden`;
    }
    document.getElementById(shownId).classList.remove('hidden');
}

function getTime(currentTime) {
    return currentTime - time.startTime;
}

function formatTime(time) {
    const seconds = parseInt(time / 1000).toString().padStart(2,'0');
    const miliseconds = time - (seconds * 1000).toString().padStart(3,'0');
    return `${seconds}:${miliseconds}`;
}

function start () {
    console.log('start');

    if (!time.startTime) {
        time.startTime = new Date();
        time.prevLapTime = new Date();
    }

    timerView.innerHTML = formatTime(getTime(new Date()));
    const timerId = requestAnimationFrame(start);
    time.timerId = timerId;
}

/**
 * 스톱워치를 멈추고 멈춘 시각 저장
 */
function pause () {
    if(!time.timerId) {
        throw new Error('timerId가 없음');
    }

    cancelAnimationFrame(time.timerId);
    time.pausedTime = new Date();
}

/**
 * 모든 변경 사항을 초기화
 */
function reset () {
    console.log('reset');

    pause();
    time.startTime = null;
    timerView.innerHTML = `00:000`;

    // lap 초기화
    while (lapField.firstChild) {
        lapField.removeChild(lapField.firstChild);
    }
}

/**
    멈춰져있던 시간만큼을 startTime, prevLapTime에 반영 한 후 start
*/
function lap () {
    console.log('lap');

    const curTime = new Date();
    const diff = curTime - time.prevLapTime;


    // *lap 갯수는 최신 5개까지만 보여줌
    if (time.lapCount >= MAX_LAP_COUNT) {
        lapField.removeChild(lapField.firstChild);
    } else {
        time.lapCount++;
    }

    lapField.innerHTML += `<div>${formatTime(diff)}</div>`
    time.prevLapTime = curTime;
}

/**
 * @param {Date} prevTime
 * @param {Date} pausedTime
 * @returns {Date} 
    멈춰져있던 동안의 시간을 반영해 startTime, prevLapTime을 만든다
    */ 
   function getPauseCalculatedTime(prevTime, pausedTime) {
       const now = new Date();
    // 1. 멈춰져있던만큼의 시간(pausedHour:현재 시각 - 멈춘 시각)을 구한다
    const pausedHour = now.getTime() - pausedTime;
    // 2. 이전 시작시각에서 pausedHour만큼을 더한 새로운 시작 시각을 구한다
    const newTime = new Date(prevTime.getTime() + pausedHour);

    // FIXME: 4~20 밀리초정도의 오차가 생긴다
    console.log('getPauseCalculatedTime:pausedHour',formatTime(pausedHour));
    console.log('getPauseCalculatedTime:newTime',formatTime(now.getTime() - newTime.getTime()));
    return newTime;
}

/**
    멈춰져있던 시간만큼을 startTime, prevLapTime에 반영 한 후 start
*/
function restart () {
    console.log('restart');

    time.startTime = getPauseCalculatedTime(time.startTime, time.pausedTime);
    time.prevLapTime = getPauseCalculatedTime(time.prevLapTime, time.pausedTime);
    start();
}

function handleStart() {
    start();
    handleControlBoundary('started');
}

function handlePause() {
    pause();
    handleControlBoundary('paused');
}

function handleReset() {
    reset();
    handleControlBoundary('initialized');
}
function handleRestart() {
    restart();
    handleControlBoundary('started');
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
            console.log('no action');
    }
}

const initialize = () => {
    const controlField = document.querySelector('.control-field');
    controlField.addEventListener('click', control);

}

// *dom이 다 그려진 후 스크립트가 시작되어야 한다
window.addEventListener("DOMContentLoaded", initialize);