(function () {

    // ─── DOM References ────────────────────────
    const startTestBtn = document.getElementById('startTestBtn');
    const backBtn = document.getElementById('backBtn');
    const signInBtn = document.getElementById('signInBtn');
    const guestBtn = document.getElementById('guestBtn');

    const progressBar = document.getElementById('progressBar');
    const cefrB1 = document.getElementById('cefrB1');
    
    const simpleToast = document.getElementById('toast');

    const offlineBanner = document.getElementById('offlineBanner');
    const onlineBanner = document.getElementById('onlineBanner');

    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const closeInstallPrompt = document.getElementById('closeInstallPrompt');
        
    // Drag state
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentDragX = 0;
    let currentDragY = 0;
    let autoRemoveTimer = null;
    
    let deferredPrompt = null;
    let toastTimer = null;

    // Determine which page we're on
    const isIndexPage = !!startTestBtn;
    const isAuthPage = !!signInBtn;

    // ─── Language System ────────────────────────
    const languageSwitcher = document.getElementById("languageSwitcher");
    const langTrigger = document.getElementById("langTrigger");
    const langOptions = document.querySelectorAll(".lang-option");
    const i18nElements = document.querySelectorAll("[data-i18n]");

    const translations = {
        en: {
          
          FrlangCH: "French",
          EnlangCH: "English",
          langDropdownTx: "Switch language",
          
            // Toasts
            startToast: "🚀 Starting your test...",
            backToast: "⬅️ Going back...",
            signToast: "🔐 Redirecting to sign in...",
            guestToast: "👋 Continuing as guest...",
            installSuccess: "🎉 Thanks for installing miTEST!",

            // Auth page
            welcome: "Welcome 👋",
            continueChoice: "Choose how you want to continue",
            saveProgress: "Sign in to save your progress and access your results later.",
            signMsg: "Sign In",
            guestMsg: "Continue as Guest",
            back: "Back",

            // Home page
            tagline: "Discover your strengths, improve your skills, and track your progress.",
            start: "START",
            signin: "Sign In",
            guest: "Continue as Guest",
            communityGrowth: "👥 Our Growing Community",
            milestoneGoal: "1M Goal",
            benefits: "What you'll get:",
            smartLearning: "Smart Learning",
            listening: "Listening",
            writing: "Writing",
            speaking: "Speaking",
            fast: "Fast",
            fastDesc: "Quick assessment in minutes",
            accurate: "Accurate",
            accurateDesc: "CEFR-aligned A1–C2",
            personalized: "Personalized",
            personalizedDesc: "Tailored learning tips",
            personalizedLevel: "Personalized English level",
            instantFeedback: "Instant feedback on your results",
            tailoredSuggestions: "Tailored learning suggestions",
            offlineTitle: "Works Offline & On-the-Go",
            offlineDesc: "Mobile-friendly design • Offline access • Auto-saves your progress",
            testimonial: "\"miTEST helped me understand my real English level. The instant feedback and CEFR alignment made all the difference!\"",
            author: "— Maria K., English learner",
            installPrompt: "📲 Install miTEST for quick access",
            installBtn: "Install",
            offlineBanner: "You're offline — but miTEST still works!",
            onlineBanner: "You're back online!"
        },
        fr: {
          
          FrlangCH: "Français",
          EnlangCH: "Anglais",
          langDropdownTx: "Changer de langue",
          
            // Toasts
            startToast: "🚀 Démarrage de votre test...",
            backToast: "⬅️ Retour...",
            signToast: "🔐 Redirection vers la connexion...",
            guestToast: "👋 Continuer en mode invité...",
            installSuccess: "🎉 Merci d'avoir installé miTEST !",

            // Auth page
            welcome: "Bienvenue 👋",
            continueChoice: "Choisissez comment vous souhaitez continuer",
            saveProgress: "Connectez-vous pour sauvegarder votre progression et accéder à vos résultats plus tard.",
            signMsg: "Se connecter",
            guestMsg: "Mode invité",
            back: "Retour",

            // Home page
            tagline: "Découvrez vos points forts, améliorez vos compétences et suivez vos progrès.",
            start: "COMMENCER",
            signin: "Se connecter",
            guest: "Continuer en invité",
            communityGrowth: "👥 Notre communauté grandissante",
            milestoneGoal: "Objectif 1M",
            benefits: "Ce que vous obtiendrez :",
            smartLearning: "Smart Learning",
            listening: "Listening",
            writing: "Writing",
            speaking: "Speaking",
            fast: "Rapide",
            fastDesc: "Évaluation rapide en quelques minutes",
            accurate: "Précis",
            accurateDesc: "Aligné CECRL A1–C2",
            personalized: "Personnalisé",
            personalizedDesc: "Conseils d'apprentissage adaptés",
            personalizedLevel: "Niveau d'anglais personnalisé",
            instantFeedback: "Retour instantané sur vos résultats",
            tailoredSuggestions: "Suggestions d'apprentissage adaptées",
            offlineTitle: "Fonctionne hors ligne et partout",
            offlineDesc: "Design mobile • Accès hors ligne • Sauvegarde automatique",
            testimonial: "\"miTEST m'a aidée à comprendre mon vrai niveau d'anglais. Les retours instantanés et l'alignement CECRL ont fait toute la différence !\"",
            author: "— Maria K., apprenante d'anglais",
            installPrompt: "📲 Installez miTEST pour un accès rapide",
            installBtn: "Installer",
            offlineBanner: "Vous êtes hors ligne — mais miTEST fonctionne toujours !",
            onlineBanner: "Vous êtes de retour en ligne !"
        }
    };

    // ─── Helpers ───────────────────────────────
    function getCurrentLanguage() {
        return localStorage.getItem("mitest-language") || "en";
    }

    function closeDropdown() {
        if (!languageSwitcher) return;
        languageSwitcher.classList.remove("open");
        if (langTrigger) {
            langTrigger.setAttribute("aria-expanded", "false");
        }
    }

    function applyLanguage(lang) {
        if (!i18nElements.length) return;
        i18nElements.forEach(element => {
            const key = element.dataset.i18n;
            const value = translations[lang]?.[key];
            if (value) {
                element.textContent = value;
            }
        });

        if (langTrigger) {
            const langLabel = langTrigger.querySelector(".lang-label");
            if (langLabel) {
                langLabel.textContent = lang === "en" ? "EN" : "FR";
            }
        }

        if (langOptions.length) {
            langOptions.forEach(option => {
                option.classList.toggle("active", option.dataset.lang === lang);
            });
        }

        localStorage.setItem("mitest-language", lang);
        setTimeout(() => {
            closeDropdown();
        }, 120);
    }

    // Load saved language
    const savedLanguage = localStorage.getItem("mitest-language") || "en";
    applyLanguage(savedLanguage);

    // ─── Language Switcher Events ──────────────
    if (langTrigger) {
        langTrigger.addEventListener("click", () => {
            if (!languageSwitcher) return;
            const isOpen = languageSwitcher.classList.toggle("open");
            langTrigger.setAttribute("aria-expanded", isOpen);
        });

        langTrigger.addEventListener("keydown", (e) => {
            if (!languageSwitcher) return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const isOpen = languageSwitcher.classList.toggle("open");
                langTrigger.setAttribute("aria-expanded", isOpen);
            }
            if (e.key === "Escape") {
                closeDropdown();
            }
        });
    }

    if (langOptions.length) {
        langOptions.forEach(option => {
            option.addEventListener("click", () => {
                applyLanguage(option.dataset.lang);
            });
        });
    }

    document.addEventListener("click", (event) => {
        if (languageSwitcher && !languageSwitcher.contains(event.target)) {
            closeDropdown();
        }
    });

    // ─── Simple Toast Helper ─────────────────────
    function showToast(message, duration = 2500) {
        if (!simpleToast) return;
        if (toastTimer) {
            clearTimeout(toastTimer);
        }
        simpleToast.textContent = message;
        simpleToast.classList.add('show');
        toastTimer = setTimeout(() => {
            simpleToast.classList.remove('show');
        }, duration);
    }

    // ─── Progress Bar Animation ───────────────
    function animateProgressBar() {
        if (!progressBar) return;
        progressBar.classList.add('animating');
        progressBar.setAttribute('aria-valuenow', '60');
        setTimeout(() => {
            if (cefrB1) {
                cefrB1.classList.add('highlight');
            }
        }, 600);
    }

    if (progressBar) {
        setTimeout(animateProgressBar, 800);

        const levelBarWrap = document.querySelector('.level-bar-wrap');
        if (levelBarWrap) {
            levelBarWrap.addEventListener('click', () => {
                progressBar.classList.remove('animating');
                if (cefrB1) {
                    cefrB1.classList.remove('highlight');
                }
                progressBar.setAttribute('aria-valuenow', '0');
                void progressBar.offsetWidth;
                setTimeout(() => {
                    progressBar.classList.add('animating');
                    progressBar.setAttribute('aria-valuenow', '68');
                    setTimeout(() => {
                        if (cefrB1) {
                            cefrB1.classList.add('highlight');
                        }
                    }, 600);
                }, 50);
            });
        }
    }

    // ─── Button Handlers ──────────────────────
    if (startTestBtn) {
        startTestBtn.addEventListener('click', () => {
            showToast(translations[getCurrentLanguage()].startToast);
            setTimeout(() => {
                window.location.href = "auth.html";
            }, 800);
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showToast(translations[getCurrentLanguage()].backToast);
            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        });
    }

    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            showToast(translations[getCurrentLanguage()].signToast);
            setTimeout(() => {
                window.location.href = "signin.html";
            }, 700);
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            showToast(translations[getCurrentLanguage()].guestToast);
            setTimeout(() => {
                window.location.href = "guest.html";
            }, 700);
        });
    }

// ─── Banner Helpers ──────────────────────────
function showBanner(element, duration = 2500, delay = 2000) {
    if (delay) {
        clearTimeout(element.showTimeout);
        element.showTimeout = setTimeout(() => {
            resetBanner(element);
            element.classList.add('visible');

            if (duration) {
                clearTimeout(element.hideTimeout);
                element.hideTimeout = setTimeout(() => {
                    hideBanner(element);
                }, duration);
            }
        }, delay);
    } else {
        resetBanner(element);
        element.classList.add('visible');

        if (duration) {
            clearTimeout(element.hideTimeout);
            element.hideTimeout = setTimeout(() => {
                hideBanner(element);
            }, duration);
        }
    }
}

function hideBanner(element) {
    element.classList.remove('visible');
    resetBanner(element);
}

function resetBanner(element) {
    element.style.opacity = '';
    element.style.transform = '';
    element.style.setProperty('--dragX', '0px');
    element.style.setProperty('--dragY', '0px');
    element.classList.remove('dragging', 'removing');
}
    
function enableSwipeDismiss(element) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let dragging = false;

    element.addEventListener('pointerdown', (e) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        currentX = 0;
        currentY = 0;
        element.classList.add('dragging');
        clearTimeout(element.hideTimeout);
    });

    window.addEventListener('pointermove', (e) => {
        if (!dragging) return;

        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        if (currentY > 0) {
          currentY = 0;
        }
        
        element.style.setProperty('--dragX', `${currentX}px`);
        element.style.setProperty('--dragY', `${currentY}px`);

        /* Dynamic fade */
        const distance = Math.max(Math.abs(currentX), Math.abs(currentY));
        const opacity = Math.max(1 - distance / 300, 0.25);
        element.style.opacity = opacity;
    });

    window.addEventListener('pointerup', () => {
        if (!dragging) return;

        dragging = false;
        element.classList.remove('dragging');

        const dismissDistance = 120;
        const shouldDismiss =
            Math.abs(currentX) > dismissDistance ||
            Math.abs(currentY) > dismissDistance;

        if (shouldDismiss) {
            dismissToast(element, currentX, currentY);
        } else {
            snapBack(element);
        }
    });
}
    
function dismissToast(element, x, y) {
    element.classList.add('removing');

    const finalX = x * 6;
    const finalY = y * 6;

    requestAnimationFrame(() => {
        element.style.transform = `
            translateX(-50%)
            translate(${finalX}px, ${finalY}px)
        `;
        element.style.opacity = '0';
    });

    setTimeout(() => {
        element.classList.remove('visible', 'dragging', 'removing');
        resetBanner(element);
    }, 300);
}
    
function snapBack(element) {
    element.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    element.style.setProperty('--dragX', '0px');
    element.style.setProperty('--dragY', '0px');
    element.style.opacity = '1';

    setTimeout(() => {
        element.style.transition = '';
    }, 250);
}

enableSwipeDismiss(offlineBanner);
enableSwipeDismiss(onlineBanner);
    
let wasOffline = !navigator.onLine;

function updateOfflineStatus() {
    if (!navigator.onLine) {
        wasOffline = true;
        hideBanner(onlineBanner);
        showBanner(offlineBanner, null);
    } else {
        hideBanner(offlineBanner);
        if (wasOffline) {
            showBanner(onlineBanner, 2500);
            wasOffline = false;
        }
    }
}

window.addEventListener('online', updateOfflineStatus);
window.addEventListener('offline', updateOfflineStatus);
// Show offline banner on page load if user is offline
window.addEventListener('DOMContentLoaded', () => {
    if (!navigator.onLine) {
        wasOffline = true;
        setTimeout(() => {
            hideBanner(onlineBanner);
            showBanner(offlineBanner, null);
        }, 300);
    }
});

    // ─── PWA Install Prompt ─────────────────────
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (installPrompt) {
            installPrompt.classList.add('visible');
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                showToast(translations[getCurrentLanguage()].installSuccess);
            }
            
            deferredPrompt = null;
            
            if (installPrompt) {
                installPrompt.classList.remove('visible');
            }
        });
    }

    if (closeInstallPrompt) {
        closeInstallPrompt.addEventListener('click', () => {
            if (installPrompt) {
                installPrompt.classList.remove('visible');
            }
        });
    }

    window.addEventListener('appinstalled', () => {
        if (installPrompt) {
            installPrompt.classList.remove('visible');
        }
        deferredPrompt = null;
    });

    console.log('🚀 miTEST PWA ready!');
    console.log('Features: Offline support, Installable, CEFR A1–C2 aligned');

})();