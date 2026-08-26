// 81 Türkiye Şehri Listesi
const CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
    "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla",
    "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt",
    "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
    "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman",
    "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

// Oyun Durum Değişkenleri
let remainingCities = [];
let currentTargetCity = "";
let score = 0;
let mistakeCount = 0;
let mistakeTracker = {}; // Örn: { "Bilecik": 4, "Zonguldak": 2 }
let timerInterval = null;
let secondsElapsed = 0;
let gameActive = false;

// DOM Elementleri
const themeToggleBtn = document.getElementById("theme-toggle");
const targetCityEl = document.getElementById("target-city-name");
const scoreCounterEl = document.getElementById("score-counter");
const mistakeCounterEl = document.getElementById("mistake-counter");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restart-btn");
const modalRestartBtn = document.getElementById("modal-restart-btn");
const gameOverModal = document.getElementById("game-over-modal");
const playerTitleEl = document.getElementById("player-title");
const finalTimeEl = document.getElementById("final-time");
const finalMistakesEl = document.getElementById("final-mistakes");
const finalAccuracyEl = document.getElementById("final-accuracy");
const topMistakesListEl = document.getElementById("top-mistakes-list");

// Tema Başlatma (Varsayılan Koyu Tema)
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
    } else {
        document.body.classList.add("dark-theme");
    }
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Sayaç İşlevleri
function startTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerEl.textContent = "00:00";
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const secs = (secondsElapsed % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Oyunu Başlat / Sıfırla (F5 Atmadan)
function resetGame() {
    stopTimer();
    score = 0;
    mistakeCount = 0;
    mistakeTracker = {};
    remainingCities = [...CITIES];
    gameActive = true;

    scoreCounterEl.textContent = "0 / 81";
    mistakeCounterEl.textContent = "0";
    timerEl.textContent = "00:00";
    gameOverModal.classList.add("hidden");

    // Harita Renklerini Temizle
    const cityPaths = document.querySelectorAll("#map-container path");
    cityPaths.forEach(path => {
        path.classList.remove("correct", "wrong");
    });

    startTimer();
    nextTurn();
}

// Yeni Hedef Şehir Seçimi
function nextTurn() {
    if (remainingCities.length === 0) {
        endGame();
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingCities.length);
    currentTargetCity = remainingCities[randomIndex];
    targetCityEl.textContent = currentTargetCity;
}

// Şehir Tıklama Mantığı
function handleCityClick(cityName, pathElement) {
    if (!gameActive) return;

    if (cityName === currentTargetCity) {
        // Doğru Şehir
        pathElement.classList.add("correct");
        score++;
        scoreCounterEl.textContent = `${score} / 81`;

        remainingCities = remainingCities.filter(c => c !== currentTargetCity);
        nextTurn();
    } else {
        // Yanlış Şehir
        pathElement.classList.add("wrong");
        mistakeCount++;
        mistakeCounterEl.textContent = mistakeCount;

        // Yanlış Yapılan Şehri Kaydet
        mistakeTracker[currentTargetCity] = (mistakeTracker[currentTargetCity] || 0) + 1;

        // Kırmızı Kırpışma Efekti
        setTimeout(() => {
            if (!pathElement.classList.contains("correct")) {
                pathElement.classList.remove("wrong");
            }
        }, 600);
    }
}

// Oyun Sonu Kartı & Konfeti
function endGame() {
    gameActive = false;
    stopTimer();

    // Konfeti Yağmuru
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    // İstatistikler
    const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const secs = (secondsElapsed % 60).toString().padStart(2, '0');
    finalTimeEl.textContent = `${mins}:${secs}`;
    finalMistakesEl.textContent = mistakeCount;

    const totalClicks = 81 + mistakeCount;
    const accuracy = Math.round((81 / totalClicks) * 100);
    finalAccuracyEl.textContent = `%${accuracy}`;

    // Unvan Hesaplama
    let title = "Coğrafya Canavarı 🦁";
    if (mistakeCount <= 3) title = "Harita Üstadı 🧙‍♂️";
    else if (mistakeCount <= 10) title = "KPSS Coğrafya Derecesi 🎓";
    else if (mistakeCount <= 20) title = "Pusula Rehberi 🧭";
    else title = "Coğrafya Öğrencisi 📚";
    playerTitleEl.textContent = title;

    // En Çok Hata Yapılan Şehirler Listesi
    topMistakesListEl.innerHTML = "";
    const sortedMistakes = Object.entries(mistakeTracker)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedMistakes.length === 0) {
        topMistakesListEl.innerHTML = "<li>Hatasız tamamladın! Mükemmelsin! 🎉</li>";
    } else {
        sortedMistakes.forEach(([city, count]) => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${city}</span> <span class="badge">${count} hata</span>`;
            topMistakesListEl.appendChild(li);
        });
    }

    gameOverModal.classList.remove("hidden");
}

// Event Listeners
restartBtn.addEventListener("click", resetGame);
modalRestartBtn.addEventListener("click", resetGame);

// Harita Tıklama Dinleyicisi
document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    const mapContainer = document.getElementById("map-container");
    mapContainer.addEventListener("click", (e) => {
        const path = e.target.closest("path");
        if (path) {
            const cityName = path.getAttribute("data-city-name") || path.getAttribute("id") || path.getAttribute("title");
            if (cityName) {
                handleCityClick(cityName, path);
            }
        }
    });

    resetGame();
});