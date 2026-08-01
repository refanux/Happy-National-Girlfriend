// =========================================================
// ATUR KALIBRASI KETEPATAN WAKTU (OFFSET)
// =========================================================
// - Jika lirik KETINGGALAN (lagu duluan, lirik lambat): Tambah angkanya (misal: 1, 1.5, 2)
// - Jika lirik KECEPATAN (lirik duluan, lagu belum nyanyi): Kurangi angkanya (misal: -1, -2, -2.5)
const lyricOffset = -1.5; 


// =========================================================
// LYRICS DATA (Timings Presisi dalam Detik)
// =========================================================
const lyricsData = [
    { time: 0, text: "🎵 (Intro)" },
    { time: 5.4, text: "Yeah, yeah" },
    { time: 8.3, text: "Baby, please try to forgive me" },
    { time: 17.9, text: "Stay here don't put out the glow" },
    { time: 28.3, text: "Hold me now don't bother" },
    { time: 32.6, text: "If every minute it makes me weaker" },
    { time: 36.9, text: "You can save me from the man that I've become, oh yeah" },
    { time: 46.8, text: "Looking back on the things I've done" },
    { time: 51.8, text: "I was trying to be someone" },
    { time: 56.0, text: "I played my part, kept you in the dark" },
    { time: 63.0, text: "Now let me show you the shape of my heart" },
    { time: 65.5, text: "Sadness is beautiful, loneliness that's tragical" },
    { time: 74.5, text: "So help me I can't win this war, oh no" },
    { time: 79.2, text: "Touch me now, don't bother" },
    { time: 83.5, text: "If every second it makes me weaker" },
    { time: 88.0, text: "You can save me from the man I've become" },
    { time: 98.2, text: "Looking back on the things I've done" },
    { time: 103.0, text: "I was trying to be someone (trying to be)" },
    { time: 107.2, text: "I played my part, kept you in the dark (in the dark)" },
    { time: 112.0, text: "Now let me show you the shape of my heart" },
    { time: 122.2, text: "I'm here with my confession" },
    { time: 126.5, text: "Got nothing to hide no more" },
    { time: 131.0, text: "I don't know where to start" },
    { time: 134.5, text: "But to show you the shape of my heart" },
    { time: 142.2, text: "I'm lookin' back on things I've done" },
    { time: 146.5, text: "I never wanna play the same old part" },
    { time: 151.0, text: "I'll keep you in the dark (keep you in the dark)" },
    { time: 155.2, text: "Now let me show you the shape of my heart" },
    { time: 165.2, text: "Looking back on the things I've done" },
    { time: 169.8, text: "I was trying to be someone (trying to be someone)" },
    { time: 174.2, text: "I played my part, kept you in the dark" },
    { time: 179.0, text: "Now let me show you the shape of my heart" },
    { time: 184.2, text: "(Now let me show you the true shape of my heart)" },
    { time: 189.0, text: "Looking back on the things I've done" },
    { time: 194.0, text: "I was trying to be someone" },
    { time: 198.5, text: "I played my part, kept you in the dark" },
    { time: 203.0, text: "Now let me show you the shape of" },
    { time: 207.0, text: "Show you the shape of my heart 🤍" }
];

// =========================================================
// MUSIC PLAYER & SYNCED LYRICS CONTROL
// =========================================================
const music = document.getElementById('music');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const lyricsWrapper = document.getElementById('lyricsWrapper');

let currentLyricIndex = -1;

// 1. Render Elemen Lirik ke DOM
function renderLyrics() {
    if (!lyricsWrapper) return;
    lyricsWrapper.innerHTML = '';
    lyricsData.forEach((item, index) => {
        const p = document.createElement('p');
        p.classList.add('lyric-line');
        p.innerText = item.text;
        p.setAttribute('data-index', index);
        p.addEventListener('click', () => {
            // Klik baris lirik untuk pindah ke detik tersebut
            music.currentTime = Math.max(0, item.time - lyricOffset);
        });
        lyricsWrapper.appendChild(p);
    });
}

// 2. Control Play / Pause
playBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play().then(() => {
            playIcon.className = "fa-solid fa-pause";
        }).catch(err => console.log("Gagal memutar audio:", err));
    } else {
        music.pause();
        playIcon.className = "fa-solid fa-play";
    }
});

// 3. Update Progress Bar & Synchronized Lyrics dengan Offset
music.addEventListener('timeupdate', () => {
    const { currentTime, duration } = music;
    
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    // Hitung waktu riil ditambah offset penyesuaian
    const adjustedTime = currentTime + lyricOffset;

    let index = lyricsData.findIndex((lyric, i) => {
        const nextLyric = lyricsData[i + 1];
        return adjustedTime >= lyric.time && (!nextLyric || adjustedTime < nextLyric.time);
    });

    if (index !== -1 && index !== currentLyricIndex) {
        currentLyricIndex = index;
        updateLyricsPosition(index);
    }
});

// 4. Perbarui Tampilan Lirik Aktif & Scroll
function updateLyricsPosition(index) {
    const lines = document.querySelectorAll('.lyric-line');
    lines.forEach((line, i) => {
        if (i === index) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });

    const lineHeight = 28; // Sesuai line-height di CSS
    const offset = -(index * lineHeight);
    if (lyricsWrapper) {
        lyricsWrapper.style.transform = `translateY(${offset}px)`;
    }
}

// 5. Seek / Klik Baris Durasi Progress
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = music.duration;
    if (duration) {
        music.currentTime = (clickX / width) * duration;
    }
});

music.addEventListener('ended', () => {
    playIcon.className = "fa-solid fa-play";
    progressBar.style.width = "0%";
    currentLyricIndex = 0;
    updateLyricsPosition(0);
});

// Inisialisasi awal
renderLyrics();


// =========================================================
// POPUP & TYPING LETTER
// =========================================================
const popup = document.getElementById("popup");
const openLetter = document.getElementById("openLetter");
const closePopup = document.getElementById("closePopup");
const typing = document.getElementById("typing");

const letterText = `haiii sayangggkuu Araa cintaaakuuu 🥺🤍.

happyyy national girlfriend dayyy yaaa sayangggg. harii inii akuu cumaa mauu bilanggg makasii banyakk bangett samaa tamuuu. makasii karenaa udahh hadirr di hidupp akuu, makasii karenaa udahh mauu jadii pacarr akuu, makasii karenaa udahh sayanggg samaa akuu, dan makasii karenaa sampaii harii inii tamuuu masiihh bertahann samaa akuuu 🥺🫶.

jujurr yaaa sayanggg, akuu ngerasaa jadii cowokk yangg palingg beruntungg karenaa bisaa punyaaa tamuuu. tamuuu ituu bukann cumaa pacarr akuu, tapiii tamuuu jugaa jadii tempattt akuu pulangg, tempattt akuu ceritaa, tempattt akuu ngerasaa tenangg, dan orangg yangg selaluu bikin akuu pengenn jadii lebihh baikk setiappp harinyaa 🤍.

maaff yaaa kalauu selamaa inii akuu masiihh seringg banyakk salaahh, masiihh kurangg perhatian, kadangg kurangg pekaa, dan belumm bisaa bahagiainn tamuuu sepenuhnyaa. tapiii percayaa yaaa sayanggg, akuu ndaakk pernahh berhentii belajarrr buat jadii laki-lakii yangg lebihh baikk buatt kamuuu. akuu pengenn suatuu harrii nanti tamuuu bisaa banggaa karenaa pernahh milihh akuu 🥺.

teruss satuu hall yangg pengenn bangett akuu bilanggg... makasii yaaa karenaa udahh mauu mencintaii akuu dengan semuaa kurangg akuu. akuu tauuu akuu belumm sempurnaa, tapiii tamuuu tetaptt nerimaa akuu apa adanya. ituu yangg bikin akuu semakin yakin kalauu tamuuu ituu anugerahh terindahh yangg pernahh Tuhan kasihh buatt akuuu 🤍.

akuu janjii bakal terusss jagaa kamuuu, terusss belajarrr ngertiin kamuuu, dan terusss milihh kamuuu setiappp harii. karenaa buattt akuu, cintaa ituu bukann cumaa soal bilangg "i love you", tapiii soal tetaptt bertahann, salingg jagaa, dan salingg memperjuanginn satuu samaa lainn 🥺.

happyyy national girlfriend dayyy sekalii lagii yaaa sayangggkuu. makasii udahh jadii bagian terindahh di hidup akuu. akuu sayangggg, cintaaa, dan bersyukurr bangett bisaa punyaaa tamuuu. semogaaa harii inii bukann cumaa jadii harii pacarr nasionall, tapiii jadii salahh satuu pengingett kalauu akuu bakal terusss milihh tamuuu, harii inii, besokk, dan semogaaa sampaii selamanyaa 🤍💋

**i loveee youuu foreverrr, Araa 🤍🥺**

I Love You Forever ❤️`;

let letterIndex = 0;
let typingTimeout;

function typeLetter() {
    if (letterIndex < letterText.length) {
        typing.innerHTML += letterText.charAt(letterIndex);
        letterIndex++;
        typingTimeout = setTimeout(typeLetter, 40);
    }
}

if (openLetter) {
    openLetter.onclick = () => {
        popup.classList.add("show");
        typing.innerHTML = "";
        letterIndex = 0;
        clearTimeout(typingTimeout);
        typeLetter();
    };
}

if (closePopup) {
    closePopup.onclick = () => {
        popup.classList.remove("show");
        clearTimeout(typingTimeout);
    };
}

if (popup) {
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("show");
            clearTimeout(typingTimeout);
        }
    });
}


// =========================================================
// FLOATING HEARTS & PETALS EFFECTS
// =========================================================
function createHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "🤍";
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = "-40px";
    heart.style.fontSize = Math.random() * 18 + 14 + "px";
    heart.style.opacity = "0.7";
    heart.style.pointerEvents = "none";
    heart.style.transition = "transform 6s linear, opacity 6s linear";
    heart.style.zIndex = "999";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.transform = `translateY(110vh) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = "0";
    }, 100);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}
setInterval(createHeart, 800);

function createGlowingPetal() {
    const petals = ["🌸", "🌹", "✨", "💖"];
    const petal = document.createElement("div");
    
    petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
    petal.style.position = "fixed";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.top = "-40px";
    petal.style.fontSize = Math.random() * 12 + 16 + "px";
    petal.style.opacity = "0.85";
    petal.style.filter = "drop-shadow(0 0 8px rgba(255, 182, 193, 0.8))";
    petal.style.pointerEvents = "none";
    petal.style.transition = "transform 7s linear, opacity 7s linear";
    petal.style.zIndex = "998";

    document.body.appendChild(petal);

    setTimeout(() => {
        petal.style.transform = `translateY(105vh) translateX(${(Math.random() - 0.5) * 180}px) rotate(${Math.random() * 360}deg)`;
        petal.style.opacity = "0";
    }, 100);

    setTimeout(() => {
        petal.remove();
    }, 7000);
}
setInterval(createGlowingPetal, 1000);


// =========================================================
// IMAGE LIGHTBOX
// =========================================================
const photos = document.querySelectorAll(".photo img");

const viewer = document.createElement("div");
viewer.style.position = "fixed";
viewer.style.inset = "0";
viewer.style.background = "rgba(0,0,0,0.85)";
viewer.style.display = "none";
viewer.style.justifyContent = "center";
viewer.style.alignItems = "center";
viewer.style.zIndex = "9999";
viewer.style.cursor = "pointer";
viewer.innerHTML = `<img style="max-width:90%; max-height:90%; border-radius:20px; box-shadow: 0 0 30px rgba(255,105,180,0.5);">`;

document.body.appendChild(viewer);

const viewImg = viewer.querySelector("img");

photos.forEach((img) => {
    img.onclick = () => {
        viewImg.src = img.src;
        viewer.style.display = "flex";
    };
});

viewer.onclick = () => {
    viewer.style.display = "none";
};


// =========================================================
// HEADER FADE ON SCROLL
// =========================================================
window.addEventListener("scroll", () => {
    const header = document.querySelector(".hero");
    if (header) {
        header.style.opacity = 1 - window.scrollY / 400;
    }
});
