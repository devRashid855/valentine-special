/* ==========================================
   TESTING OPTIONS (Choose one):

   Option 1: Set TEST_DATE below
   - "2026-02-14" = Bypass date lock (shows main app)
   - "2026-02-10" = Shows countdown
   - null = Use real current date

   Option 2: Add ?preview=true to URL
   - Example: file:///path/to/index.html?preview=true
   - This will always bypass the date lock
   ========================================== */
const TEST_DATE =  ""; // Set to null to use real current date "2026-02-14T23:59:00" for testing, or "2026-02-10T12:00:00" to test countdown

const loveMessage = "Boss, from the day you came into my life... everything changed ❤️ You make every moment special, Srial. I never want to imagine a future without you, my Khroos. Your MR Noyan will always be here, loving you endlessly! 💕";
/* COLOR THEME SYSTEM */
let currentTheme = 'valentine'; // Default theme
 const themes = {
    'valentine': {
         bodyGradient: 'linear-gradient(-45deg, #ff758c, #ff7eb3, #ff4b5c, #ff9a9e)',
          cardFront: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBack: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
           specialCardFront: 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)',
           specialCardBack: 'linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%)'
           },
           'black': {
            bodyGradient: 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #404040)',
            cardFront: 'linear-gradient(135deg, #2c2c2c 0%, #000000 100%)',
            cardBack: 'linear-gradient(135deg, #404040 0%, #1a1a1a 100%)',
            specialCardFront: 'linear-gradient(135deg, #4a4a4a 0%, #000000 100%)',
            specialCardBack: 'linear-gradient(135deg, #000000 0%, #4a4a4a 100%)'
           },
           'royal-blue': {
            bodyGradient: 'linear-gradient(-45deg, #1e3a8a, #3b82f6, #1e40af, #60a5fa)',
            cardFront: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            cardBack: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            specialCardFront: 'linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%)',
            specialCardBack: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)'
           }
        }
function changeTheme(themeName) {
    currentTheme = themeName;
    const theme = themes[themeName];

    // Update body background
    document.body.style.background = theme.bodyGradient;
    document.body.style.backgroundSize = '400% 400%';

    // Update color option active state
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');

    // Apply theme to existing promise cards if they exist
    updateCardThemes(themeName);

    // Store theme choice
    localStorage.setItem('selectedTheme', themeName);

    // Hide color chooser after selection
    const colorChooser = document.querySelector('.color-chooser');
    if (colorChooser) {
        colorChooser.style.display = 'none';
    }
}

function updateCardThemes(themeName) {
    const theme = themes[themeName];

    // Update regular cards
    document.querySelectorAll('.promise-card:not(.special-card) .card-front').forEach(cardFront => {
        cardFront.style.background = theme.cardFront;
    });

    document.querySelectorAll('.promise-card:not(.special-card) .card-back').forEach(cardBack => {
        cardBack.style.background = theme.cardBack;
    });

    // Update special card
    const specialCardFront = document.querySelector('.special-card .card-front');
    if (specialCardFront) {
        specialCardFront.style.background = theme.specialCardFront;
    }

    const specialCardBack = document.querySelector('.special-card .card-back');
    if (specialCardBack) {
        specialCardBack.style.background = theme.specialCardBack;
    }
}
/* DATE LOCK CHECK */
function checkDate() {
    // Use TEST_DATE if set, otherwise use real current date
    const now = TEST_DATE ? new Date(TEST_DATE) : new Date();
    const valentinesDay = new Date(now.getFullYear(), 1, 14); // Feb 14 (month is 0-indexed)

    // Secret bypass for testing: add ?preview=true to URL
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    console.log(now, '===== ', now.getDate())
    // Check if today is Feb 14 or later, or if preview mode is enabled
    if ((now.getMonth() === 1 && now.getDate() >= 14) || isPreview) {
        document.getElementById("dateLock").classList.add("hidden");
        document.getElementById("mainContainer").classList.remove("hidden");
    } else {
        startCountdown(valentinesDay);
    }
}

/* COUNTDOWN TIMER */
let simulatedTime = null;

function startCountdown(targetDate) {
    // Initialize simulated time if TEST_DATE is set
    if (TEST_DATE) {
        simulatedTime = new Date(TEST_DATE);
    }

    function updateCountdown() {
        let now;

        // If we're in test mode, increment simulated time
        if (TEST_DATE && simulatedTime) {
            now = simulatedTime;
            // Increment by 1 second for simulation
            simulatedTime = new Date(simulatedTime.getTime() + 1000);
        } else {
            now = new Date();
        }

        const valentinesDay = new Date(now.getFullYear(), 1, 14);

        // If we're past Feb 14 this year, target next year
        // if (now > valentinesDay) {
        //     valentinesDay.setFullYear(valentinesDay.getFullYear() + 1);
        // }

        const diff = valentinesDay - now;

        if (diff <= 0) {
            // Countdown finished! Automatically transition to main screen
            setTimeout(() => {
                document.getElementById("dateLock").classList.add("hidden");
                document.getElementById("mainContainer").classList.remove("hidden");
            }, 1000);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000      * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days > 9 ? days : "0" + days;
        document.getElementById("hours").textContent = hours > 9 ? hours : "0" + hours;
        document.getElementById("minutes").textContent = minutes > 9 ? minutes : "0" + minutes;
        document.getElementById("seconds").textContent = seconds > 9 ? seconds : "0" + seconds;
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
}

// Initialize on page load
window.onload = function() {
    checkDate();
};

/* START PROPOSAL */
function startProposal() {
    const music = document.getElementById("bgMusic");
    music.volume = 0.4;
    music.play();

    document.getElementById("mainBtn").style.display = "none";

    // Hide flowers and color chooser
    const flowerBouquet = document.querySelector(".flower-bouquet");
    if (flowerBouquet) {
        flowerBouquet.style.display = "none";
    }

    const colorChooser = document.querySelector(".color-chooser");
    if (colorChooser) {
        colorChooser.style.display = "none";
    }

    const secretBtn = document.querySelector(".secret-btn");
    if (secretBtn) {
        secretBtn.style.display = "none";
    }

    const proposal = document.getElementById("proposal");
    proposal.classList.remove("hidden");
    proposal.classList.add("fade-in");

    // Initialize NO button position - start with static (side by side)
    const noBtn = document.getElementById("noBtn");
    if (noBtn) {
        noBtn.classList.remove("running");
        noBtn.style.left = "";
        noBtn.style.top = "";
    }

    typeWriter();
}

/* TYPEWRITER EFFECT */
function typeWriter() {
    let i = 0;
    const speed = 50;
    const loveText = document.getElementById("loveText");
    loveText.innerHTML = "";

    function typing() {
        if (i < loveMessage.length) {
            loveText.innerHTML += loveMessage.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

/* YES BUTTON MAGIC */
function sayYes() {
    document.querySelector(".no-btn").style.display = "none";

    const proposal = document.getElementById("proposal");
    const theme = themes[currentTheme];

    proposal.innerHTML = `
        <div class="final-screen fade-in">
            <!-- Song Selection Buttons at Top -->
            <div style="margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3)); backdrop-filter: blur(15px); border-radius: 20px; border: 2px solid rgba(255, 255, 255, 0.4); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);">
                <p style="font-size: 18px; font-weight: 600; color: #ffeb3b; margin-bottom: 15px;">🎵 Choose Your Song 🎵</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="playSong(1)" id="songBtn1" style="padding: 12px 25px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, #ff4b5c, #ff758c); color: white; border: 3px solid white; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 75, 92, 0.4);">
                        🎵 Chalo Door Kahin
                    </button>
                    <button onclick="playSong(2)" id="songBtn2" style="padding: 12px 25px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)); color: white; border: 3px solid rgba(255, 255, 255, 0.5); border-radius: 25px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
                        💕 Family Di Member
                    </button>
                </div>
            </div>

            <h1 class="glow">My Boss ❤️</h1>
            <h2>You are my today and all of my tomorrows.</h2>
            <h2>With you, life feels complete.</h2>

            <h2 style="margin-top: 30px; color: #ffeb3b;">My Promises to You, Srial:</h2>
            <p style="font-size: 16px; margin: 10px 0 20px 0;">Click each card to reveal my promise 💕</p>

            <div class="promise-cards-container">
                <div class="promise-card" onclick="revealCard(this, 1)">
                    <div class="card-inner">
                        <div class="card-front" style="background: ${theme.cardFront};">
                            <h2>💌</h2>
                            <p>Promise #1</p>
                        </div>
                        <div class="card-back" style="background: ${theme.cardBack};">
                            <h3 style="color: #ffeb3b;">I Promise</h3>
                            <p>I'll annoy you every single day 😌</p>
                            <p>I will disturb you even when you're busy,</p>
                            <p>because I want your attention all the time.</p>
                        </div>
                    </div>
                </div>

                <div class="promise-card" onclick="revealCard(this, 2)">
                    <div class="card-inner">
                        <div class="card-front" style="background: ${theme.cardFront};">
                            <h2>💋</h2>
                            <p>Promise #2</p>
                        </div>
                        <div class="card-back" style="background: ${theme.cardBack};">
                            <h3 style="color: #ffeb3b;">I Promise</h3>
                            <p>I'll fight with you over the dumbest reasons</p>
                            <p>just because I feel like fighting…</p>
                            <p>and then I'll kiss you…</p>
                            <p>and maybe do something even more than that 😏❤️</p>
                        </div>
                    </div>
                </div>

                <div class="promise-card" onclick="revealCard(this, 3)">
                    <div class="card-inner">
                        <div class="card-front" style="background: ${theme.cardFront};">
                            <h2>🍤</h2>
                            <p>Promise #3</p>
                        </div>
                        <div class="card-back" style="background: ${theme.cardBack};">
                            <h3 style="color: #ffeb3b;">I Promise</h3>
                            <p>I'll steal your prawns from your plate 🍤</p>
                            <p>and if my drink doesn't taste good…</p>
                            <p>I'll take yours without shame 🥤😂</p>
                        </div>
                    </div>
                </div>

                <div class="promise-card" onclick="revealCard(this, 4)">
                    <div class="card-inner">
                        <div class="card-front" style="background: ${theme.cardFront};">
                            <h2>👑</h2>
                            <p>Promise #4</p>
                        </div>
                        <div class="card-back" style="background: ${theme.cardBack};">
                            <h3 style="color: #ffeb3b;">I Promise</h3>
                            <p>I'll be dramatic sometimes,</p>
                            <p>and act like I'm upset</p>
                            <p>just so you pamper me even more</p>
                        </div>
                    </div>
                </div>

                <div class="promise-card" onclick="revealCard(this, 5)">
                    <div class="card-inner">
                        <div class="card-front" style="background: ${theme.cardFront};">
                            <h2>💕</h2>
                            <p>Promise #5</p>
                        </div>
                        <div class="card-back" style="background: ${theme.cardBack};">
                            <h3 style="color: #ffeb3b;">I Promise</h3>
                            <p>I'll be your biggest headache…</p>
                            <p>but also your happiest habit.</p>
                        </div>
                    </div>
                </div>

                <div class="promise-card special-card" onclick="revealCard(this, 6)">
                    <div class="card-inner">
                        <div class="card-front" style="background: ${theme.specialCardFront};">
                            <h2>💖</h2>
                            <p>Most Important</p>
                        </div>
                        <div class="card-back" style="background: ${theme.specialCardBack};">
                            <p style="font-size: 18px; color: #ffeb3b; margin-bottom: 10px;">And most importantly…</p>
                            <p style="font-size: 18px;">I will always choose you.</p>
                            <p style="font-size: 18px;">I will always love you crazily… forever.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="final-message-card" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)); backdrop-filter: blur(15px); padding: 30px; border-radius: 25px; margin: 30px auto; max-width: 600px; border: 3px solid rgba(255, 255, 255, 0.4); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);">
                <h2 class="valentine glow" style="font-size: 32px; animation: glowPulse 2s ease-in-out infinite; margin-bottom: 20px;">Happy Valentine's Day, Misha ❤️</h2>
                <p style="font-size: 22px; font-weight: bold; color: #ffeb3b; text-shadow: 0 2px 8px rgba(0,0,0,0.3); margin: 15px 0;">You're stuck with me forever, Khroos! 😘</p>
                <div style="margin-top: 25px; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 15px; border-left: 5px solid #ffeb3b;">
                    <p style="font-size: 19px; font-weight: 600; margin-bottom: 12px;">You call me <strong style="color: #ffeb3b; font-size: 21px;">MR Noyan, Changez Khan, Hitler, Halaaku Khan</strong>...</p>
                    <p style="font-size: 20px; font-weight: bold; color: #ff6b6b; margin-top: 10px;">All these powerful names... 👑</p>
                    <p style="font-size: 22px; font-weight: bold; color: #ffeb3b; margin-top: 8px;">But the truth is... I'm completely YOURS! 💕</p>
                    <p style="font-size: 18px; font-style: italic; margin-top: 10px; opacity: 0.9;">You own my heart, my soul, everything, Boss! 🥰</p>
                </div>

                <!-- Prayer & Belief Highlight -->
                <div style="margin-top: 35px; padding: 30px; background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 107, 107, 0.25)); backdrop-filter: blur(20px); border-radius: 25px; border: 3px solid #ffeb3b; box-shadow: 0 0 30px rgba(255, 235, 59, 0.5), 0 10px 40px rgba(0, 0, 0, 0.3);">
                    <h3 style="font-size: 26px; font-weight: 700; color: #ffeb3b; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);">My Prayer for You, Boss 🙏✨</h3>
                    <p style="font-size: 19px; line-height: 1.8; font-weight: 600; margin: 15px 0;">
                        I pray that you <strong style="color: #ffeb3b; font-size: 21px;">win in your life</strong>, achieve all your dreams.
                    </p>
                    <p style="font-size: 19px; line-height: 1.8; font-weight: 600; margin: 15px 0;">
                        I really wanna see you <strong style="color: #ffeb3b; font-size: 21px;">on top</strong>, and become the person you wanted to.
                    </p>
                    <p style="font-size: 23px; line-height: 1.8; font-weight: 700; color: #ffeb3b; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); margin-top: 20px;">
                        I believe in you, Misha! 💪❤️
                    </p>
                </div>

                <!-- Dedicated Songs Section -->
                <div style="margin-top: 40px; padding: 35px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3)); backdrop-filter: blur(20px); border-radius: 25px; border: 3px solid rgba(255, 255, 255, 0.5); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);">
                    <h3 style="font-size: 28px; font-weight: 700; color: #ffeb3b; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);">🎵 Now Playing 🎵</h3>

                    <!-- Current Song Title -->
                    <p id="currentSongTitle" style="font-size: 20px; margin-bottom: 20px; font-weight: 600; color: #ffeb3b;">"Chalo Door Kahin" - Samar Jafri</p>

                    <!-- Video Player -->
                    <div style="position: relative; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); margin: 20px 0;">
                        <video id="dedicatedSongVideo" controls autoplay style="width: 100%; height: auto; display: block; border-radius: 15px; background: #000;">
                            <source id="videoSource" src="Samar Jafri - Chalo Door Kahin (Lyrics).mp4" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <p style="font-size: 17px; margin-top: 20px; line-height: 1.7; color: white;">These songs are for you, Srial. Every word, every note... it's all for you! 🎶💕</p>
                </div>
            </div>
        </div>
    `;

    startFireworks();
    createHearts();

    // Start the dedicated song video after a short delay
    setTimeout(() => {
        const video = document.getElementById('dedicatedSongVideo');
        if (video) {
            video.play().catch(err => {
                console.log('Video autoplay prevented:', err);
                // Autoplay was prevented, user will need to click play
            });
        }
    }, 1000);
}

/* REVEAL PROMISE CARD */
let revealedCards = 0;
function revealCard(card, cardNumber) {
    if (!card.classList.contains('revealed')) {
        card.classList.add('revealed');
        revealedCards++;

        // Add a little celebration for each card
        createMiniHearts(card);

        // Special effect when all cards are revealed
        if (revealedCards === 6) {
            setTimeout(() => {
                alert("You've unlocked all my promises, Boss! 💕\nI love you more than words can say! 🥰");
            }, 1000);
        }
    }
}

/* MINI HEARTS FOR CARD REVEAL */
function createMiniHearts(card) {
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";
        heart.style.left = rect.left + rect.width / 2 + "px";
        heart.style.bottom = window.innerHeight - rect.top + "px";
        heart.style.animationDuration = (2 + Math.random() * 2) + "s";
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 4000);
    }
}

/* RUNNING NO BUTTON */
document.addEventListener("mousemove", function(e) {
    const noBtn = document.getElementById("noBtn");
    if (!noBtn) return;
    if (noBtn.style.display === "none") return;

    const rect = noBtn.getBoundingClientRect();
    const distance = Math.hypot(
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2)
    );

    if (distance < 150) {
        // Make button absolute positioned when it starts running
        if (!noBtn.classList.contains('running')) {
            noBtn.classList.add('running');
        }

        // Get the buttons container boundaries (not proposal)
        const buttonsContainer = document.querySelector('.buttons');
        if (!buttonsContainer) return;

        const containerRect = buttonsContainer.getBoundingClientRect();
        const btnWidth = rect.width;
        const btnHeight = rect.height;

        // Calculate safe boundaries within the buttons container (with padding)
        const padding = 10;
        const maxX = containerRect.width - btnWidth - padding;
        const maxY = containerRect.height - btnHeight - padding;
        const minX = padding;
        const minY = padding;

        // Generate random position within buttons container boundaries
        let randomX = Math.random() * (maxX - minX) + minX;
        let randomY = Math.random() * (maxY - minY) + minY;

        // Ensure button stays within buttons container
        randomX = Math.max(minX, Math.min(randomX, maxX));
        randomY = Math.max(minY, Math.min(randomY, maxY));

        // Set position relative to buttons container
        noBtn.style.left = randomX + "px";
        noBtn.style.top = randomY + "px";
    }
});

/* FIREWORKS */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startFireworks() {
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            drawCircle(x, y);
        }, i * 15);
    }
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 6, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random()*360},100%,70%)`;
    ctx.fill();
}

/* FLOATING HEARTS */
function createHearts() {
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (4 + Math.random() * 4) + "s";
        document.body.appendChild(heart);
    }
}

/* SECRET MESSAGE POPUP - Simple version */
window.showSecret = function() {
    const secretMsg = document.getElementById("secretMessage");
    if (secretMsg) {
        secretMsg.classList.remove("hidden");
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('selectedTheme') || 'valentine';
    currentTheme = savedTheme;

    // Apply saved theme to body
    const theme = themes[savedTheme];
    document.body.style.background = theme.bodyGradient;
    document.body.style.backgroundSize = '400% 400%';

    // Set active color option
    const activeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }

    // Ensure secret message is hidden on page load
    const secretMsg = document.getElementById("secretMessage");
    if (secretMsg) {
        secretMsg.classList.add("hidden");
    }

    // Add double-click Easter egg on the title
    setTimeout(() => {
        const message = document.getElementById("message");
        if (message) {
            message.addEventListener("dblclick", function(e) {
                e.preventDefault();
                window.showSecret();
            });
        }

        // Also add to body as fallback - double-click anywhere to open
        document.body.addEventListener("dblclick", function(e) {
            // Don't trigger on buttons or the secret popup itself
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('.secret-popup')) {
                window.showSecret();
            }
        });
    }, 1000);
});

/* SPECIAL KONAMI CODE EASTER EGG */
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-8);

    if (konamiCode.join('') === konamiSequence.join('')) {
        triggerSuperLove();
    }
});

function triggerSuperLove() {
    // Create massive heart explosion
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = "❤️";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.fontSize = (20 + Math.random() * 30) + "px";
            heart.style.animationDuration = (2 + Math.random() * 3) + "s";
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 5000);
        }, i * 20);
    }

    alert("💖 SUPER LOVE MODE ACTIVATED! 💖\nBoss, you found the secret! You're amazing! 🥰");
}

/* SONG PLAYER FUNCTIONS */
function playSong(songNumber) {
    const video = document.getElementById('dedicatedSongVideo');
    const videoSource = document.getElementById('videoSource');
    const songTitle = document.getElementById('currentSongTitle');
    const btn1 = document.getElementById('songBtn1');
    const btn2 = document.getElementById('songBtn2');

    if (songNumber === 1) {
        // Chalo Door Kahin
        videoSource.src = "Samar Jafri - Chalo Door Kahin (Lyrics).mp4";
        songTitle.textContent = '"Chalo Door Kahin" - Samar Jafri';

        // Update button styles
        btn1.style.background = 'linear-gradient(135deg, #ff4b5c, #ff758c)';
        btn1.style.border = '3px solid white';
        btn1.style.boxShadow = '0 4px 15px rgba(255, 75, 92, 0.4)';

        btn2.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
        btn2.style.border = '3px solid rgba(255, 255, 255, 0.5)';
        btn2.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    } else if (songNumber === 2) {
        // Family Di Member
        videoSource.src = "Family Di Member _ Parahuna 2 _ Ranjit Bawa _ Tara Sumner _ Ajay Hooda _ Romantic Punjabi Song.mp4";
        songTitle.textContent = '"Family Di Member" - Ranjit Bawa';

        // Update button styles
        btn2.style.background = 'linear-gradient(135deg, #ff4b5c, #ff758c)';
        btn2.style.border = '3px solid white';
        btn2.style.boxShadow = '0 4px 15px rgba(255, 75, 92, 0.4)';

        btn1.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
        btn1.style.border = '3px solid rgba(255, 255, 255, 0.5)';
        btn1.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    }

    // Reload and play the new video
    video.load();
    video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
    });
}

