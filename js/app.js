/* TÜRKİYE ŞEHİRLERİ LİSTESİ */
const CITIES = [
    { id: "TR01", name: "Adana" }, { id: "TR02", name: "Adıyaman" }, { id: "TR03", name: "Afyonkarahisar" },
    { id: "TR04", name: "Ağrı" }, { id: "TR05", name: "Amasya" }, { id: "TR06", name: "Ankara" },
    { id: "TR07", name: "Antalya" }, { id: "TR08", name: "Artvin" }, { id: "TR09", name: "Aydın" },
    { id: "TR10", name: "Balıkesir" }, { id: "TR11", name: "Bilecik" }, { id: "TR12", name: "Bingöl" },
    { id: "TR13", name: "Bitlis" }, { id: "TR14", name: "Bolu" }, { id: "TR15", name: "Burdur" },
    { id: "TR16", name: "Bursa" }, { id: "TR17", name: "Çanakkale" }, { id: "TR18", name: "Çankırı" },
    { id: "TR19", name: "Çorum" }, { id: "TR20", name: "Denizli" }, { id: "TR21", name: "Diyarbakır" },
    { id: "TR22", name: "Edirne" }, { id: "TR23", name: "Elazığ" }, { id: "TR24", name: "Erzincan" },
    { id: "TR25", name: "Erzurum" }, { id: "TR26", name: "Eskişehir" }, { id: "TR27", name: "Gaziantep" },
    { id: "TR28", name: "Giresun" }, { id: "TR29", name: "Gümüşhane" }, { id: "TR30", name: "Hakkari" },
    { id: "TR31", name: "Hatay" }, { id: "TR32", name: "Isparta" }, { id: "TR33", name: "Mersin" },
    { id: "TR34", name: "İstanbul" }, { id: "TR35", name: "İzmir" }, { id: "TR36", name: "Kars" },
    { id: "TR37", name: "Kastamonu" }, { id: "TR38", name: "Kayseri" }, { id: "TR39", name: "Kırklareli" },
    { id: "TR40", name: "Kırşehir" }, { id: "TR41", name: "Kocaeli" }, { id: "TR42", name: "Konya" },
    { id: "TR43", name: "Kütahya" }, { id: "TR44", name: "Malatya" }, { id: "TR45", name: "Manisa" },
    { id: "TR46", name: "Kahramanmaraş" }, { id: "TR47", name: "Mardin" }, { id: "TR48", name: "Muğla" },
    { id: "TR49", name: "Muş" }, { id: "TR50", name: "Nevşehir" }, { id: "TR51", name: "Niğde" },
    { id: "TR52", name: "Ordu" }, { id: "TR53", name: "Rize" }, { id: "TR54", name: "Sakarya" },
    { id: "TR55", name: "Samsun" }, { id: "TR56", name: "Siirt" }, { id: "TR57", name: "Sinop" },
    { id: "TR58", name: "Sivas" }, { id: "TR59", name: "Tekirdağ" }, { id: "TR60", name: "Tokat" },
    { id: "TR61", name: "Trabzon" }, { id: "TR62", name: "Tunceli" }, { id: "TR63", name: "Şanlıurfa" },
    { id: "TR64", name: "Uşak" }, { id: "TR65", name: "Van" }, { id: "TR66", name: "Yozgat" },
    { id: "TR67", name: "Zonguldak" }, { id: "TR68", name: "Aksaray" }, { id: "TR69", name: "Bayburt" },
    { id: "TR70", name: "Karaman" }, { id: "TR71", name: "Kırıkkale" }, { id: "TR72", name: "Batman" },
    { id: "TR73", name: "Şırnak" }, { id: "TR74", name: "Bartın" }, { id: "TR75", name: "Ardahan" },
    { id: "TR76", name: "Iğdır" }, { id: "TR77", name: "Yalova" }, { id: "TR78", name: "Karabük" },
    { id: "TR79", name: "Kilis" }, { id: "TR80", name: "Osmaniye" }, { id: "TR81", name: "Düzce" }
];

/* DURUM DEĞİŞKENLERİ */
let remainingCities = [], currentTargetCity = null, correctCount = 0, wrongCount = 0;
let isClickable = true, cityErrors = {}, currentCityWrongAttempts = 0;
let timerInterval = null, secondsElapsed = 0, toastTimeout = null;

/* DOM SEÇİCİLERİ */
const $ = id => document.getElementById(id);
const mapContainer = $("map-container"), questionEl = $("question");
const centerFeedback = $("centerFeedback"), feedbackIcon = $("feedbackIcon"), feedbackText = $("feedbackText");
const gameEndModal = $("gameEndModal");

/* SES ÜRETECİ (WEB AUDIO API) */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);

    if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.setValueAtTime(120, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

/* TEMA & SIDEBAR */
function initTheme() {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    $("themeIcon").textContent = saved === "dark" ? "☀️" : "🌙";
}
$("themeToggleBtn").onclick = () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    $("themeIcon").textContent = next === "dark" ? "☀️" : "🌙";
};
initTheme();

$("menuButton").onclick = () => { $("sidebar").classList.add("open"); $("overlay").classList.add("open"); };
$("closeMenuButton").onclick = $("overlay").onclick = () => { $("sidebar").classList.remove("open"); $("overlay").classList.remove("open"); };
$("restartBtn").onclick = resetGame;
$("modalRestartBtn").onclick = () => { gameEndModal.classList.remove("open"); resetGame(); };

/* ZAMANLAYICI */
function startTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        $("timerDisplay").textContent = `${Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:${(secondsElapsed % 60).toString().padStart(2, '0')}`;
    }, 1000);
}

/* HARİTA YÜKLEME VE YÖNETİMİ */
async function loadMap() {
    try {
        const res = await fetch("assets/turkey.svg");
        if (!res.ok) throw new Error();
        mapContainer.innerHTML = await res.text();
        const svg = mapContainer.querySelector("svg");
        if (svg) {
            svg.classList.add("turkey-map");
            bindMapEvents();       // 1. Tıklamaları bellek nesnelerine bağla
            sanitizeMapDOM(svg);   // 2. DevTools'ta görünen tüm IPUÇLARI ve ID'leri sil
        }
        initGame();
    } catch (e) {
        mapContainer.innerHTML = `<div style="text-align:center;padding:40px;color:red">Harita yüklenemedi.</div>`;
    }
}

function bindMapEvents() {
    mapContainer.querySelectorAll("path, g").forEach(el => {
        const id = el.getAttribute("id") || "";
        const name = el.getAttribute("data-name") || el.getAttribute("title") || el.getAttribute("name") || "";

        const city = CITIES.find(c =>
            c.id.toLowerCase() === id.toLowerCase() ||
            turkishSlug(c.name) === turkishSlug(name) ||
            turkishSlug(c.name) === turkishSlug(id)
        );

        if (city) {
            // Şehir verisini HTML özniteliğine değil, doğrudan JS bellek nesnesine gömüyoruz.
            // İncele (F12) yapan biri bunu DOM üzerinde göremez.
            el._cityData = city;
            el.onclick = () => handleCityClick(el, el._cityData);
        }
    });
}

function sanitizeMapDOM(svgElement) {
    svgElement.querySelectorAll("path, g").forEach((el, index) => {
        // İncele (DevTools) tarafında ipucu verebilecek her şeyi DOM'dan uçur
        el.removeAttribute("name");
        el.removeAttribute("data-name");
        el.removeAttribute("title");
        el.removeAttribute("aria-label");
        el.removeAttribute("data-city-id");

        // Plaka kodlarını (TR16 vb.) anlamsız isimlerle değiştir
        el.setAttribute("id", `geo_node_${index}`);

        // SVG Tooltip veren alt <title> elemanları varsa sil
        const titleNode = el.querySelector("title");
        if (titleNode) titleNode.remove();
    });
}

function initGame() {
    remainingCities = [...CITIES];
    correctCount = wrongCount = currentCityWrongAttempts = 0;
    cityErrors = {};
    updateStats();
    startTimer();
    nextQuestion();
}

function resetGame() {
    const svg = mapContainer.querySelector("svg");
    if (svg) {
        mapContainer.querySelectorAll("path, g").forEach(el => el.classList.remove("correct", "wrong"));
        svg.querySelectorAll(".city-label-text").forEach(lbl => lbl.remove());
    }
    initGame();
    showMessage("Oyun Sıfırlandı 🔄", "correct-pop");
}

function nextQuestion() {
    if (!remainingCities.length) {
        clearInterval(timerInterval);
        questionEl.textContent = "🎉 TÜM İLLER BİTTİ!";
        currentTargetCity = null;
        showGameEndModal();
        return;
    }
    currentCityWrongAttempts = 0;
    currentTargetCity = remainingCities[Math.floor(Math.random() * remainingCities.length)];
    questionEl.textContent = currentTargetCity.name;
    isClickable = true;
}

function handleCityClick(el, clickedCity) {
    if (!currentTargetCity || !isClickable || el.classList.contains("correct")) return;

    if (clickedCity.id === currentTargetCity.id) {
        isClickable = false; correctCount++;
        playSound('correct');
        el.classList.add("correct");
        addCityLabelToMap(el, clickedCity.name);
        remainingCities = remainingCities.filter(c => c.id !== currentTargetCity.id);
        showMessage(`Doğru: ${clickedCity.name} 👏`, "correct-pop");
        updateStats();
        setTimeout(nextQuestion, 400);
    } else {
        isClickable = false; wrongCount++; currentCityWrongAttempts++;
        playSound('wrong');
        cityErrors[currentTargetCity.name] = (cityErrors[currentTargetCity.name] || 0) + 1;
        el.classList.add("wrong");
        updateStats();

        if (currentCityWrongAttempts >= 5) {
            const skipped = currentTargetCity;
            remainingCities = remainingCities.filter(c => c.id !== skipped.id);
            remainingCities.push(skipped);
            showMessage(`5 Yanlış! ${skipped.name} Pas Geçildi 🔄`, "wrong-pop");
            setTimeout(() => { el.classList.remove("wrong"); nextQuestion(); }, 900);
        } else {
            showMessage(`Yanlış! (${clickedCity.name}) ❌`, "wrong-pop");
            setTimeout(() => { el.classList.remove("wrong"); isClickable = true; }, 300);
        }
    }
}

function addCityLabelToMap(el, cityName) {
    try {
        const svg = mapContainer.querySelector("svg"), bbox = el.getBBox();
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", bbox.x + bbox.width / 2);
        text.setAttribute("y", bbox.y + bbox.height / 2);
        text.setAttribute("class", "city-label-text");
        text.textContent = cityName;
        svg.appendChild(text);
    } catch (e) { }
}

function updateStats() {
    $("correctCount").textContent = correctCount;
    $("wrongCount").textContent = wrongCount;
    $("remainingCount").textContent = remainingCities.length;
    const total = correctCount + wrongCount;
    $("successRate").textContent = `${total ? Math.round((correctCount / total) * 100) : 0}%`;
}

/* ENTEGRE EDİLMİŞ ŞIK OVERLAY FEEDBACK */
function showMessage(msg, typeClass = "correct-pop") {
    clearTimeout(toastTimeout);
    feedbackIcon.textContent = typeClass.includes("wrong") ? "❌" : "👏";
    feedbackText.textContent = msg;
    centerFeedback.className = `center-feedback show ${typeClass}`;
    toastTimeout = setTimeout(() => centerFeedback.classList.remove("show"), 1100);
}

/* TURKISH SLUG (1 SATIR) */
function turkishSlug(str) {
    return str ? str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/g/g, 'g').replace(/[^a-z0-9]/g, '') : '';
}

function showGameEndModal() {
    const total = correctCount + wrongCount;
    const rate = total ? Math.round((correctCount / total) * 100) : 0;
    $("modalTime").textContent = $("timerDisplay").textContent;
    $("modalWrong").textContent = wrongCount;
    $("modalRate").textContent = `%${rate}`;
    $("userTitle").textContent = wrongCount === 0 ? "🏆 Coğrafya Profesörü" : wrongCount <= 5 ? "🥇 Harita Kurdu" : wrongCount <= 15 ? "🥈 Şehir Muhtarı" : "🥉 Gezgin";

    const errList = $("topErrorsList");
    errList.innerHTML = "";
    const sorted = Object.entries(cityErrors).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!sorted.length) errList.innerHTML = "<li>Hatasız tamamladınız!</li>";
    else sorted.forEach(([city, count]) => errList.innerHTML += `<li>${city}: ${count} Yanlış</li>`);

    gameEndModal.classList.add("open");
    $("flagAnimationContainer").classList.remove("active");
    setTimeout(() => $("flagAnimationContainer").classList.add("active"), 100);

    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
}

loadMap();