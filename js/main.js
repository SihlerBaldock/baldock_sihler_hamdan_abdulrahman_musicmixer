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

let draggedItem = null;
let hasStarted = false;
let activeAudios = new Set();

// FUNCTIONS
volumeFill.style.width = "100%";

function handleDragStart() {
    draggedItem = this;
}

function handleZoneDrop() {
    handleDrop(this);
}

function startAllAudio() {
    activeAudios.forEach(audio => {
        audio.loop = true;
    });
    hasStarted = true;
}

function handleDrop(zone) {
    if (!draggedItem) return;

    zone.innerHTML = "";
    const clone = draggedItem.cloneNode(true);
    const altSrc = draggedItem.dataset.alt;
    if (altSrc) clone.src = altSrc;

    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.objectFit = "cover";
    clone.removeAttribute("draggable");
    zone.appendChild(clone);

    const audioId = draggedItem.dataset.audio;
    const audio = document.querySelector(`#${audioId}`);
    if (!audio) return;

    const wasPlaying = [...activeAudios].some(a => !a.paused);

    activeAudios.add(audio);
    audio.loop = true;

    const currentVolume = volumeFill.offsetWidth / volumeBar.offsetWidth || 1;
    audio.volume = currentVolume;

    if (wasPlaying || activeAudios.size === 1) {
        activeAudios.forEach(a => {
            a.currentTime = 0;
            a.play();
            const img = document.querySelector(`.circle-img[data-audio="${a.id}"]`);
            if (img) img.classList.add("active");
        });
    } else {
        audio.currentTime = 0;
        audio.play();
        draggedItem.classList.add("active");
    }

    hasStarted = true;
}

function stopAllAudio() {
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
    });

    activeAudios.clear();
    hasStarted = false;

    draggables.forEach(item => {
        item.classList.remove("active");
    });
}

function playAllAudio() {
    activeAudios.forEach(audio => {
        audio.play();
    });

    draggables.forEach(item => {
        const audioId = item.dataset.audio;
        const audio = document.querySelector(`#${audioId}`);
    
    if (activeAudios.has(audio)) {
        item.classList.add("active");
    }
});
    hasStarted = true;
}

function pauseAllAudio() {
    allAudio.forEach(audio => {
        audio.pause();
    });

    draggables.forEach(item => {
        item.classList.remove("active");
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

function handleDragOver(e) {
    e.preventDefault();
}

// EVENT LISTENERS

draggables.forEach(item => {
    item.addEventListener(`dragstart`, handleDragStart);
});

dropZones.forEach(zone => {
    zone.addEventListener(`dragover`, handleDragOver);
    zone.addEventListener(`drop`, handleZoneDrop);
});

stopBtn.addEventListener(`click`, stopAllAudio);
playBtn.addEventListener(`click`, playAllAudio);
pauseBtn.addEventListener(`click`, pauseAllAudio);
volumeBar.addEventListener(`click`, setVolume);
