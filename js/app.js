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

/*
|--------------------------------------------------------------------------
| OYUN DURUMU (STATE)
|--------------------------------------------------------------------------
*/
let remainingCities = [];
let currentTargetCity = null;
let correctCount = 0;
let wrongCount = 0;
let isClickable = true;

/*
|--------------------------------------------------------------------------
| DOM ELEMANLARI
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| SIDEBAR KONTROLÜ
|--------------------------------------------------------------------------
*/
function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
}
function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
}

menuButton.addEventListener("click", openMenu);
closeMenuButton.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
restartBtn.addEventListener("click", resetGame);

/*
|--------------------------------------------------------------------------
| HARİTA YÜKLEME VE KURULUM
|--------------------------------------------------------------------------
*/
async function loadMap() {
    try {
        const response = await fetch("assets/turkey.svg");
        if (!response.ok) throw new Error("SVG dosyası yüklenemedi.");

        const svgText = await response.text();
        mapContainer.innerHTML = svgText;

        const svg = mapContainer.querySelector("svg");
        if (!svg) throw new Error("SVG formatı hatalı.");

        svg.classList.add("turkey-map");

        // Şehir tıklamalarını hazırla ve oyunu başlat
        initGame();

    } catch (error) {
        console.error(error);
        mapContainer.innerHTML = `<div class="map-error">❌ Harita yüklenirken hata oluştu! "assets/turkey.svg" dosyasını kontrol edin.</div>`;
    }
}

/*
|--------------------------------------------------------------------------
| OYUN MANTIĞI
|--------------------------------------------------------------------------
*/
function initGame() {
    remainingCities = [...CITIES];
    correctCount = 0;
    wrongCount = 0;
    updateStats();

    // Haritadaki path'lere isim ve olay dinleyicisi ekle
    bindMapEvents();

    // İlk soruyu sor
    nextQuestion();
}

function resetGame() {
    // Haritada yeşil kalan tüm illeri sıfırla
    const svgPaths = mapContainer.querySelectorAll("path, g");
    svgPaths.forEach(el => {
        el.classList.remove("correct", "wrong");
    });

    initGame();
    showMessage("Oyun sıfırlandı. Başarılar!", "correct-toast");
}

function bindMapEvents() {
    const paths = mapContainer.querySelectorAll("path, g");

    paths.forEach(element => {
        // Element'in ID veya isim özelliklerini yakala
        const elementId = element.getAttribute("id") || "";
        const dataName = element.getAttribute("data-name") || element.getAttribute("title") || "";

        // Şehir nesnemizi bulalım
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
        questionEl.textContent = "🎉 TEBRİKLER! TÜM İLLERİ BİLDİNİZ!";
        showMessage("Tebrikler, haritadaki tüm illeri tamamladınız!", "correct-toast");
        currentTargetCity = null;
        return;
    }

    // Rastgele bir şehir seç
    const randomIndex = Math.floor(Math.random() * remainingCities.length);
    currentTargetCity = remainingCities[randomIndex];
    questionEl.textContent = currentTargetCity.name;
    isClickable = true;
}

function handleCityClick(element, clickedCity) {
    if (!currentTargetCity || !isClickable) return;

    // Şehir zaten önceden bilindiyse tıklamayı pas geç
    if (element.classList.contains("correct")) return;

    if (clickedCity.id === currentTargetCity.id) {
        // DOĞRU CEVAP
        isClickable = false;
        correctCount++;
        element.classList.add("correct");

        // Doğru bilinen şehri listeden çıkar
        remainingCities = remainingCities.filter(c => c.id !== currentTargetCity.id);

        showMessage(`Harika! Doğru cevap: ${clickedCity.name} 👏`, "correct-toast");
        updateStats();

        setTimeout(() => {
            nextQuestion();
        }, 1000);

    } else {
        // YANLIŞ CEVAP
        isClickable = false;
        wrongCount++;
        element.classList.add("wrong");

        showMessage(`Yanlış! Tıkladığınız yer: ${clickedCity.name} ❌`, "wrong-toast");
        updateStats();

        // Yanlış efekti kaldır (Kırmızı yanıp söner ve silinir)
        setTimeout(() => {
            element.classList.remove("wrong");
            isClickable = true;
        }, 1200);
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

/*
|--------------------------------------------------------------------------
| BİLDİRİM KUTUSU (TOAST)
|--------------------------------------------------------------------------
*/
let toastTimeout;
function showMessage(msg, typeClass) {
    clearTimeout(toastTimeout);
    gameMessageEl.textContent = msg;
    gameMessageEl.className = `game-message show ${typeClass}`;

    toastTimeout = setTimeout(() => {
        gameMessageEl.classList.remove("show");
    }, 2500);
}

/*
|--------------------------------------------------------------------------
| YARDIMCI METİNLER (Türkçe karakter eşleme)
|--------------------------------------------------------------------------
*/
function turkishSlug(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-0]/g, "");
}

// Oyunu Başlat
loadMap();