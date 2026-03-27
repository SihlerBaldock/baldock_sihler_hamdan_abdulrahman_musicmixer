console.log("JS File is connected")

// VARIABLES

const draggables = document.querySelectorAll(`.circle-img`);
const dropZones = document.querySelectorAll(`.drop-zone`);
const allAudio = document.querySelectorAll(`audio`);

const buttons = document.querySelectorAll(`.music-btn`);
const stopBtn = buttons[0];
const playBtn = buttons[1];
const pauseBtn = buttons[2];

const volumeBar = document.querySelector(`.volume-bar`);
const volumeFill = document.querySelector(`.volume-color`);

volumeFill.style.width = "100%";

let draggedItem = null;
let hasStarted = false;
let activeAudios = new Set();

// FUNCTIONS

function startAllAudio() {
    allAudio.forEach(audio => {
        audio.loop = true;
    });
    hasStarted = true;
}

function handleDrop(zone) {
    if (!draggedItem) return;

    zone.innerHTML = "";

    const clone = draggedItem.cloneNode(true);

    const altSrc = draggedItem.dataset.alt;
    if (altSrc) {
        clone.src = altSrc;
    }
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.objectFit = "cover";

    clone.removeAttribute("draggable");

    zone.appendChild(clone);

    const audioId = draggedItem.dataset.audio;
    const audio = document.querySelector(`#${audioId}`);
    if (!audio) return;

    activeAudios.add(audio);
    activeAudios.forEach(a => {
        a.currentTime = 0;
        a.play();
    });

    const currentVolume = volumeFill.offsetWidth / volumeBar.offsetWidth || 1;
    audio.volume = currentVolume;
    audio.play();

    if (!hasStarted) {
        startAllAudio();
    }
}

function stopAllAudio() {
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
    });

    activeAudios.clear();
    hasStarted = false;
}

function playAllAudio() {
    if (!hasStarted) {
        startAllAudio();
    } else {
        allAudio.forEach(audio => {
            audio.play();
        });
    }
}

function pauseAllAudio() {
    allAudio.forEach(audio => {
        audio.pause();
    });
}

function setVolume(e) {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    let volume = clickX / width;
    volume = Math.max(0, Math.min(1, volume));

    volumeFill.style.width = `${volume * 100}%`;

    activeAudios.forEach(audio => {
        audio.volume = volume;
    });
}

// EVENT LISTENERS

draggables.forEach(item => {
    item.addEventListener(`dragstart`, function () {
        draggedItem = this;
    });
});

dropZones.forEach(zone => {
    zone.addEventListener(`dragover`, function (e) {
        e.preventDefault();
    });

    zone.addEventListener(`drop`, function () {
        handleDrop(zone);
    });
});

stopBtn.addEventListener(`click`, stopAllAudio);
playBtn.addEventListener(`click`, playAllAudio);
pauseBtn.addEventListener(`click`, pauseAllAudio);

volumeBar.addEventListener(`click`, setVolume);
