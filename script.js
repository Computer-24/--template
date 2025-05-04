const words = [
    "flamenco", "buzzing", "spacecraft", "rainforest", "windmill", "carousel",
    "circus", "harmony", "symphony", "orchestra", "conductor", "composer",
    "poetess", "novelist", "storyteller", "fable", "mythology", "legend",
    "fantasy", "adventure", "quest", "journey", "destination", "map",
    "compass", "navigation", "explore", "discover", "secret", "hidden",
    "treasure", "pirate", "shipwreck", "beachcomber", "seashell", "driftwood",
    "wave", "tide", "ocean", "sea", "deepblue", "aquatic", "marine",
    "weather", "stormy", "sunny", "cloudy", "rainy", "windy", "breezy",
    "whispering", "murmuring", "rustling", "chirping", "songbird", "trill",
    "melody", "harmony", "music", "rhythm", "beat", "pulse", "vibe",
    "cosmic", "galactic", "stellar", "planetary", "astral", "etheral",
    "dreamy", "ethereal", "misty", "foggy", "hazy", "gauzy", "transparent"
];

const textContainer = document.getElementById("text-container");
const timerElement = document.getElementById("timer");
const finalScoreElement = document.getElementById("final-score");
const tryAgainButton = document.getElementById("try-again");

let totalTyped = '';
let currentCharIndex = 0;
let errors = 0;
let timeLeft = 60;
let timeInterval;
let typingStarted = false;
let longText = generateLongText();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateLongText() {
    const shuffledWords = shuffleArray([...words]);
    return shuffledWords.join(' ');
}

function startTimer() {
    if(!typingStarted) {
        typingStarted = true;
        timeInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time left: ${timeLeft}s`;
            if (timeLeft === 0) {
                clearInterval(timeInterval);
                endTest()
            }
        }, 1000)
    }
}

document.addEventListener("keydown", (event) => {
    startTimer();
    if (event.key === 'Backspace') {
        if (totalTyped.length > 0) {
            currentCharIndex = Math.max(currentCharIndex - 1, 0);
            totalTyped = totalTyped.slice(0, -1);
        } 
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        totalTyped += event.key;
        currentCharIndex++;
    }
    const textArray = longText.split('');
    textContainer.innerText = ""
    errors = 0;

    for (let i = 0; i < textArray.length; i++) {
        const span = document.createElement('span');
        if (i < totalTyped.length) {
            if (textArray[i] === totalTyped[i]) {
                span.classList.add('correct');
            } else {
                span.classList.add('error');
                errors++;
            }
        }
        span.textContent = textArray[i];
        textContainer.appendChild(span);
    }

    if(totalTyped.length >=20) {
        const scrollAmount = (totalTyped.length - 20) * 14;
        textContainer.scrollLeft = scrollAmount
    }
})

function calculateWPM() {
    const wordsTyped = totalTyped.trim().split(/\s+/).length;
    const baseWPM = Math.round((wordsTyped / 60) * 60);
    const adjustedWPM = Math.max(baseWPM - errors, 0);
    return adjustedWPM;
}

function endTest() {
   timerElement.textContent = "Time's up!";
   finalScoreElement.textContent = `Final WPM: ${calculateWPM()}`;
   textContainer.style.display = "none";
   tryAgainButton.style.display = "block";
}

function resetTest () {
    clearInterval(timeInterval);
    timeLeft = 6;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    finalScoreElement.textContent = "";
    textContainer.style.display = "block";
    tryAgainButton.style.display = "none";
    totalTyped = '';
    typingStarted = false;
    currentCharIndex = 0;
    errors = 0;
    textContainer.scrollLeft = 0;
    longText = generateLongText();
    init();
}

function init() {
    if(isMobileDevice()) {
        showMessageForMobileUsers();
        return;
    }
    textContainer.innerText = longText; 
    timerElement.textContent = `Time left: ${timeLeft}s`;
}

tryAgainButton.addEventListener("click", resetTest);

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800
}

function showMessageForMobileUsers() {
    textContainer.innerText = "This game is not supported on mobile devices😔";
}

init();
