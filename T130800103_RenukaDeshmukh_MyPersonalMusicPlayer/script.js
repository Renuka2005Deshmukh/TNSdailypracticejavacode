// Song Data
const songs = [
    { title: "Deewani Mastani", artist: "Shreya Ghoshal", src: "Audio/Deewani Mastani.mp3", cover: "images/dm1.jpeg" },
    { title: "Malhari", artist: "Vishal Dadlani", src: "Audio/Malhari.mp3", cover: "images/m1.jpeg" },
    { title: "Pinga", artist: "Shreya Ghoshal", src: "Audio/Pinga.mp3", cover: "images/pinga.jpeg" },
    { title: "Gajanana", artist: "Sukhwinder Singh", src: "Audio/Gajanana.mp3", cover: "images/gajanan.jpeg" },
    { title: "Tum Prem Ho", artist: "Aishwarya Anand", src: "Audio/Tum Prem Ho Tum Preet Ho_64.mp3", cover: "images/tum prem1.jpeg" },
     { title: "Aayat", artist: "Arijit Singh", src: "Audio/Aayat.mp3", cover: "images/a1.jpeg" },
     { title: "Shiv Tandav Stotram", artist: "Raghavendra Rajkumar", src: "Audio/Shiv Tandav Stotram in Female Voice-(Mr-Jat.in).mp3", cover: "images/s1.jpeg" }
     

];

let currentSongIndex = 0;
let isPlaying = false;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// Elements
const songList = document.getElementById("song-list");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const likeBtn = document.getElementById("like-btn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const currentCover = document.getElementById("current-cover");
const currentTitle = document.getElementById("current-title");
const currentArtist = document.getElementById("current-artist");
const volumeSlider = document.getElementById("volume");

// Audio
let audio = new Audio(songs[currentSongIndex].src);

// Load Songs into List
function loadSongs(list) {
    songList.innerHTML = "";
    list.forEach((song, index) => {
        const div = document.createElement("div");
        div.classList.add("song-item");
        div.innerHTML = `<img src="${song.cover}" alt="">
                         <div>${song.title} - ${song.artist}</div>`;
        div.addEventListener("click", () => loadSong(index));
        songList.appendChild(div);
    });
}
loadSongs(songs);

// Load Song
function loadSong(index) {
    currentSongIndex = index;
    audio.src = songs[index].src;
    currentCover.src = songs[index].cover;
    currentTitle.textContent = songs[index].title;
    currentArtist.textContent = songs[index].artist;
    if (isPlaying) audio.play();
    updateLikeButton();
}

// Play / Pause Toggle
playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.textContent = "▶";
    } else {
        audio.play();
        playPauseBtn.textContent = "⏸";
    }
    isPlaying = !isPlaying;
});

// Next / Previous
nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
});

prevBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
});

// Like / Favourites
function updateLikeButton() {
    likeBtn.textContent = favourites.includes(currentSongIndex) ? "❤️" : "♡";
}
likeBtn.addEventListener("click", () => {
    if (favourites.includes(currentSongIndex)) {
        favourites = favourites.filter(i => i !== currentSongIndex);
    } else {
        favourites.push(currentSongIndex);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
    updateLikeButton();
});

// Time & Progress
audio.addEventListener("timeupdate", () => {
    progress.max = audio.duration || 0;
    progress.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});
progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
});
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Volume Control
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

// Search
document.getElementById("search").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = songs.filter(s => s.title.toLowerCase().includes(value) || s.artist.toLowerCase().includes(value));
    loadSongs(filtered);
});

// Show All Songs
document.getElementById("all-songs-btn").addEventListener("click", () => loadSongs(songs));

// Show Favourites
document.getElementById("favourites-btn").addEventListener("click", () => {
    const favSongs = favourites.map(i => songs[i]);
    loadSongs(favSongs);
});

// Init
loadSong(currentSongIndex);
