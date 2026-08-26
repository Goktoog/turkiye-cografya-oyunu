/*
|--------------------------------------------------------------------------
| TÜRKİYE ŞEHİRLERİ LİSTESİ (81 İL)
|--------------------------------------------------------------------------
*/
const CITIES = [
    { id: "TR01", name: "Adana" }, { id: "TR02", name: "Adıyaman" },
    { id: "TR03", name: "Afyonkarahisar" }, { id: "TR04", name: "Ağrı" },
    { id: "TR05", name: "Amasya" }, { id: "TR06", name: "Ankara" },
    { id: "TR07", name: "Antalya" }, { id: "TR08", name: "Artvin" },
    { id: "TR09", name: "Aydın" }, { id: "TR10", name: "Balıkesir" },
    { id: "TR11", name: "Bilecik" }, { id: "TR12", name: "Bingöl" },
    { id: "TR13", name: "Bitlis" }, { id: "TR14", name: "Bolu" },
    { id: "TR15", name: "Burdur" }, { id: "TR16", name: "Bursa" },
    { id: "TR17", name: "Çanakkale" }, { id: "TR18", name: "Çankırı" },
    { id: "TR19", name: "Çorum" }, { id: "TR20", name: "Denizli" },
    { id: "TR21", name: "Diyarbakır" }, { id: "TR22", name: "Edirne" },
    { id: "TR23", name: "Elazığ" }, { id: "TR24", name: "Erzincan" },
    { id: "TR25", name: "Erzurum" }, { id: "TR26", name: "Eskişehir" },
    { id: "TR27", name: "Gaziantep" }, { id: "TR28", name: "Giresun" },
    { id: "TR29", name: "Gümüşhane" }, { id: "TR30", name: "Hakkari" },
    { id: "TR31", name: "Hatay" }, { id: "TR32", name: "Isparta" },
    { id: "TR33", name: "Mersin" }, { id: "TR34", name: "İstanbul" },
    { id: "TR35", name: "İzmir" }, { id: "TR36", name: "Kars" },
    { id: "TR37", name: "Kastamonu" }, { id: "TR38", name: "Kayseri" },
    { id: "TR39", name: "Kırklareli" }, { id: "TR40", name: "Kırşehir" },
    { id: "TR41", name: "Kocaeli" }, { id: "TR42", name: "Konya" },
    { id: "TR43", name: "Kütahya" }, { id: "TR44", name: "Malatya" },
    { id: "TR45", name: "Manisa" }, { id: "TR46", name: "Kahramanmaraş" },
    { id: "TR47", name: "Mardin" }, { id: "TR48", name: "Muğla" },
    { id: "TR49", name: "Muş" }, { id: "TR50", name: "Nevşehir" },
    { id: "TR51", name: "Niğde" }, { id: "TR52", name: "Ordu" },
    { id: "TR53", name: "Rize" }, { id: "TR54", name: "Sakarya" },
    { id: "TR55", name: "Samsun" }, { id: "TR56", name: "Siirt" },
    { id: "TR57", name: "Sinop" }, { id: "TR58", name: "Sivas" },
    { id: "TR59", name: "Tekirdağ" }, { id: "TR60", name: "Tokat" },
    { id: "TR61", name: "Trabzon" }, { id: "TR62", name: "Tunceli" },
    { id: "TR63", name: "Şanlıurfa" }, { id: "TR64", name: "Uşak" },
    { id: "TR65", name: "Van" }, { id: "TR66", name: "Yozgat" },
    { id: "TR67", name: "Zonguldak" }, { id: "TR68", name: "Aksaray" },
    { id: "TR69", name: "Bayburt" }, { id: "TR70", name: "Karaman" },
    { id: "TR71", name: "Kırıkkale" }, { id: "TR72", name: "Batman" },
    { id: "TR73", name: "Şırnak" }, { id: "TR74", name: "Bartın" },
    { id: "TR75", name: "Ardahan" }, { id: "TR76", name: "Iğdır" },
    { id: "TR77", name: "Yalova" }, { id: "TR78", name: "Karabük" },
    { id: "TR79", name: "Kilis" }, { id: "TR80", name: "Osmaniye" },
    { id: "TR81", name: "Düzce" }
];

/* OYUN DURUMU & İSTATİSTİKLER */
let remainingCities = [];
let currentTargetCity = null;
let correctCount = 0;
let wrongCount = 0;
let isClickable = true;
let cityErrors = {};

/* SÜREÇ SAYAÇLARI */
let timerInterval = null;
let secondsElapsed = 0;

/* DOM ELEMANLARI */
const mapContainer = document.getElementById("map-container");
const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const questionEl = document.getElementById("question");
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const remainingCountEl = document.getElementById("remainingCount");
const successRateEl = document.getElementById("successRate");
const gameMessageEl = document.getElementById("gameMessage");
const restartBtn = document.getElementById("restartBtn");
const timerDisplay = document.getElementById("timerDisplay");

/* MODAL DOM */
const gameEndModal = document.getElementById("gameEndModal");
const modalTime = document.getElementById("modalTime");
const modalWrong = document.getElementById("modalWrong");
const modalRate = document.getElementById("modalRate");
const userTitle = document.getElementById("userTitle");
const topErrorsList = document.getElementById("topErrorsList");
const modalRestartBtn = document.getElementById("modalRestartBtn");
const flagAnimationContainer = document.getElementById("flagAnimationContainer");

/* VARSAYILAN TEMA: DARK */
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");

function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

initTheme();

/* SIDEBAR KONTROLÜ */
menuButton.addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("open"); });
closeMenuButton.addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("open"); });
overlay.addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("open"); });
restartBtn.addEventListener("click", resetGame);
modalRestartBtn.addEventListener("click", () => {
    gameEndModal.classList.remove("open");
    resetGame();
});

/* TIMER FONKSİYONLARI */
function startTimer() {
    stopTimer();
    secondsElapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const secs = (secondsElapsed % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

/* HARİTA YÜKLEME */
async function loadMap() {
    try {
        const response = await fetch("assets/turkey.svg");
        if (!response.ok) throw new Error("SVG yüklenemedi.");

        const svgText = await response.text();
        mapContainer.innerHTML = svgText;

        const svg = mapContainer.querySelector("svg");
        if (!svg) throw new Error("SVG bulunamadı.");

        svg.classList.add("turkey-map");
        initGame();

    } catch (error) {
        console.error(error);
        mapContainer.innerHTML = `<div style="text-align:center; padding:50px; color:red;">Harita yüklenemedi.</div>`;
    }
}

function initGame() {
    remainingCities = [...CITIES];
    correctCount = 0;
    wrongCount = 0;
    cityErrors = {};
    updateStats();
    bindMapEvents();
    startTimer();
    nextQuestion();
}

function resetGame() {
    const svg = mapContainer.querySelector("svg");
    if (svg) {
        const svgPaths = mapContainer.querySelectorAll("path, g");
        svgPaths.forEach(el => el.classList.remove("correct", "wrong"));

        const addedLabels = svg.querySelectorAll(".city-label-text");
        addedLabels.forEach(lbl => lbl.remove());
    }

    initGame();
    showMessage("Oyun sıfırlandı!", "correct-toast");
}

function bindMapEvents() {
    const paths = mapContainer.querySelectorAll("path, g");

    paths.forEach(element => {
        const elementId = element.getAttribute("id") || "";
        const dataName = element.getAttribute("data-name") || element.getAttribute("title") || "";

        let matchedCity = CITIES.find(c =>
            c.id.toLowerCase() === elementId.toLowerCase() ||
            turkishSlug(c.name) === turkishSlug(dataName) ||
            turkishSlug(c.name) === turkishSlug(elementId)
        );

        if (matchedCity) {
            element.setAttribute("data-city-id", matchedCity.id);
            element.setAttribute("data-city-name", matchedCity.name);
            element.addEventListener("click", () => handleCityClick(element, matchedCity));
        }
    });
}

function nextQuestion() {
    if (remainingCities.length === 0) {
        stopTimer();
        questionEl.textContent = "🎉 TÜM İLLERİ BİLDİNİZ!";
        currentTargetCity = null;
        showGameEndModal();
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingCities.length);
    currentTargetCity = remainingCities[randomIndex];
    questionEl.textContent = currentTargetCity.name;
    isClickable = true;
}

function handleCityClick(element, clickedCity) {
    if (!currentTargetCity || !isClickable) return;
    if (element.classList.contains("correct")) return;

    if (clickedCity.id === currentTargetCity.id) {
        // DOĞRU CEVAP
        isClickable = false;
        correctCount++;
        element.classList.add("correct");

        addCityLabelToMap(element, clickedCity.name);

        remainingCities = remainingCities.filter(c => c.id !== currentTargetCity.id);
        showMessage(`Doğru: ${clickedCity.name} 👏`, "correct-toast");
        updateStats();

        setTimeout(() => { nextQuestion(); }, 400);

    } else {
        // YANLIŞ CEVAP
        isClickable = false;
        wrongCount++;

        // Hangi şehirde yanlış yapıldığını kaydet
        cityErrors[currentTargetCity.name] = (cityErrors[currentTargetCity.name] || 0) + 1;

        element.classList.add("wrong");
        showMessage(`Yanlış! (${clickedCity.name}) ❌`, "wrong-toast");
        updateStats();

        setTimeout(() => {
            element.classList.remove("wrong");
            isClickable = true;
        }, 300);
    }
}

function addCityLabelToMap(element, cityName) {
    try {
        const svg = mapContainer.querySelector("svg");
        const bbox = element.getBBox();

        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textNode.setAttribute("x", centerX);
        textNode.setAttribute("y", centerY);
        textNode.setAttribute("class", "city-label-text");
        textNode.textContent = cityName;

        svg.appendChild(textNode);
    } catch (e) {
        console.log("Metin ekleme hatası:", e);
    }
}

function updateStats() {
    correctCountEl.textContent = correctCount;
    wrongCountEl.textContent = wrongCount;
    remainingCountEl.textContent = remainingCities.length;
    const total = correctCount + wrongCount;
    const rate = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    successRateEl.textContent = `${rate}%`;
}

/* OYUN SONU EKRANI, ÖZEL UNVAN VE AY-YILDIZ EFEKTİ */
function showGameEndModal() {
    const total = correctCount + wrongCount;
    const rate = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    modalTime.textContent = timerDisplay.textContent;
    modalWrong.textContent = wrongCount;
    modalRate.textContent = `%${rate}`;

    // Özel Unvan Tanımlama
    let title = "Coğrafya Çaylağı";
    if (wrongCount === 0) title = "🏆 Coğrafya Profesörü (Kusursuz)";
    else if (wrongCount <= 5) title = "🥇 Harita Kurdu";
    else if (wrongCount <= 15) title = "🥈 Şehir Muhtarı";
    else if (wrongCount <= 30) title = "🥉 Yolda Yürüyen Gezgin";
    userTitle.textContent = title;

    // En Çok Hata Yapılan 5 Şehir
    topErrorsList.innerHTML = "";
    const sortedErrors = Object.entries(cityErrors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedErrors.length === 0) {
        topErrorsList.innerHTML = "<li>Hatasız tamamladınız, tebrikler!</li>";
    } else {
        sortedErrors.forEach(([city, count]) => {
            const li = document.createElement("li");
            li.textContent = `${city}: ${count} Yanlış Tıklama`;
            topErrorsList.appendChild(li);
        });
    }

    gameEndModal.classList.add("open");

    // Ay-Yıldız Yumuşak Geçiş Animasyonu
    flagAnimationContainer.classList.remove("active");
    setTimeout(() => {
        flagAnimationContainer.classList.add("active");
    }, 100);

    // Konfeti Efekti (Canvas Confetti)
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

let toastTimeout;
function showMessage(msg, typeClass) {
    clearTimeout(toastTimeout);
    gameMessageEl.textContent = msg;
    gameMessageEl.className = `game-message show ${typeClass}`;
    toastTimeout = setTimeout(() => { gameMessageEl.classList.remove("show"); }, 1500);
}

function turkishSlug(str) {
    if (!str) return "";
    return str.toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-0]/g, "");
}

loadMap();