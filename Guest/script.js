const guestForm = document.getElementById("guestForm");

const generateBtn = document.getElementById("generateBtn");
const backBtn = document.getElementById('backBtn');

const toast1 = document.getElementById("guestToast");
const toast2 = document.getElementById("btnToast");

const usernameInput = document.getElementById("username");
const fullNameInput = document.getElementById("fullName");

const offlineBanner = document.getElementById('offlineBanner');
const onlineBanner = document.getElementById('onlineBanner');

const languageSwitcher = document.getElementById("languageSwitcher");
const langTrigger = document.getElementById("langTrigger");
const langOptions = document.querySelectorAll(".lang-option");
const i18nElements = document.querySelectorAll("[data-i18n]");

const successOverlay = document.getElementById('successOverlay');
const btnOverlay = document.getElementById('btnOverlay');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const goNowBtn = document.getElementById('goNowBtn');
const stayBtn = document.getElementById('stayBtn');
const summaryName = document.getElementById('summaryName');
const summaryUsername = document.getElementById('summaryUsername');
const summaryLevel = document.getElementById('summaryLevel');
const summaryCountry = document.getElementById('summaryCountry');

let progressTimeout = null;

const translations = {
    en: {
        FrlangCH: "French",
        EnlangCH: "English",
        langDropdownTx: "Switch language",
        
        BackOffTitle: "Network issues",
        BackOffText: "You are offline — but miTEST still works!",
        
        BackOnTitle: "Back online",
        BackOnText: "Your connection has been restored!",
        
        guestHead: "GUEST",

        // Toasts
        enterName: "Please enter your full name first",
        invalidName: "Invalid name.",
        guestSuccess: "🎉 Guest account created successfully!",
        redirecting: "🚀 Redirecting to dashboard...",

        // Form
        guestTitle: "Continue as Guest",
        fullName: "Full Name",
        username: "Username",
        age: "Age",
        generate: "Generate",
        level: "Level",
        lvlBg: "Beginner",
        lvlInter: "Intermediate",
        lvlAdv: "Advanced",
        country: "Country",
        checkMsg: "I understand my guest data is stored locally.",
        guestBtn: "Confirm",
        descript: "Create a temporary profile and start improving your English instantly.",
        continueBtn: "Continue",
        successTitle: "Success!",
        successMessage: "Your guest profile has been created.",
        backToast: "⬅️ Going back...",
        Notfound: "No countries found!",
        search: "Search country...",
        usernameInput: "@username",
        NotfoundDescrip: "Try adjusting your search or filters to find what you're looking for.",

        // ---- Success overlay ----
        profileCreatedTitle: "Profile Created! 🎉",
        profileCreatedSubtitle: "Review your info before continuing",
        summaryName: "Name",
        summaryUsername: "Username",
        summaryLevel: "Level",
        summaryCountry: "Country",
        loadingSummary: "Loading summary...",
        preparingProfile: "Preparing your profile...",
        readyMessage: "Ready! You can review or continue.",
        goingDashboard: "Going to dashboard...",
        goDashboard: "Go to Home",
        editInfo: "Edit Info"
    },

    fr: {
        FrlangCH: "Français",
        EnlangCH: "Anglais",
        langDropdownTx: "Changer de langue",
        
        BackOffTitle: "Problèmes de réseau",
        BackOffText: "Vous êtes hors ligne — mais miTEST fonctionne toujours !",
        BackOnTitle: "De retour en ligne",
        BackOnText: "Votre connexion a été rétablie !",

        guestHead: "MODE INVITE",

        // Toasts
        enterName: "Veuillez d'abord entrer votre nom complet",
        invalidName: "Nom invalide.",
        guestSuccess: "🎉 Compte invité créé avec succès !",
        redirecting: "🚀 Redirection vers le tableau de bord...",

        // Form
        guestTitle: "Continuer en invité",
        fullName: "Nom complet",
        username: "Nom d'utilisateur",
        age: "Âge",
        generate: "Générer",
        level: "Niveau",
        lvlBg: "Débutant",
        lvlInter: "Intermédiaire",
        lvlAdv: "Avancé",
        country: "Pays",
        checkMsg: "Je comprends que mes données du mode invité sont stockées localement.",
        guestBtn: "Valider",
        descript: "Crée un profil temporaire et améliore ton anglais dès maintenant.",
        continueBtn: "Continuer",
        successTitle: "Succès !",
        successMessage: "Votre profil invité a été créé.",
        backToast: "⬅️ Retour...",
        Notfound: "Aucun pays trouvé!",
        search: "Rechercher un pays...",
        usernameInput: "@nomd'utilisateur",
        NotfoundDescrip: "Essayez d'ajuster votre recherche ou vos filtres pour trouver ce que vous cherchez.",

        // ---- Success overlay ----
        profileCreatedTitle: "Profil créé ! 🎉",
        profileCreatedSubtitle: "Vérifiez vos informations avant de continuer",
        summaryName: "Nom",
        summaryUsername: "Nom d'utilisateur",
        summaryLevel: "Niveau",
        summaryCountry: "Pays",
        loadingSummary: "Chargement du résumé...",
        preparingProfile: "Préparation de votre profil...",
        readyMessage: "Prêt ! Vous pouvez vérifier ou continuer.",
        goingDashboard: "Redirection vers le tableau de bord...",
        goDashboard: "Accueil",
        editInfo: "Modifier les infos"
    }
};

const DEFAULT_LANGUAGE = "en";

/* LANGUAGE HELPERS */
function getCurrentLanguage() {
    return localStorage.getItem("mitest-language") || DEFAULT_LANGUAGE;
}

// Global translation helper
function t(key, fallback = '') {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || fallback || key;
}

function closeDropdown() {
    if (!languageSwitcher) return;

    languageSwitcher.classList.remove("open");

    langTrigger?.setAttribute("aria-expanded", "false");
}

function applyLanguage(lang = DEFAULT_LANGUAGE) {
    // Fallback safety
    if (!translations[lang]) {
        lang = DEFAULT_LANGUAGE;
    }

    /* =========================
       TEXT TRANSLATIONS
    ========================= */
    i18nElements.forEach((element) => {
        const key = element.dataset.i18n;
        const translation = translations[lang]?.[key];

        if (translation) {
            element.textContent = translation;
        }
    });

    /* =========================
       PLACEHOLDER TRANSLATIONS
    ========================= */
    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach((element) => {
            const key = element.dataset.i18nPlaceholder;
            const translation = translations[lang]?.[key];

            if (translation) {
                element.placeholder = translation;
            }
        });

    /* =========================
       OPTIONAL ATTRIBUTE SUPPORT
       (future-proof)
    ========================= */
    document
        .querySelectorAll("[data-i18n-title]")
        .forEach((element) => {
            const key = element.dataset.i18nTitle;
            const translation = translations[lang]?.[key];

            if (translation) {
                element.title = translation;
            }
        });

    /* =========================
       LANGUAGE LABEL
    ========================= */
    const langLabel = langTrigger?.querySelector(".lang-label");

    if (langLabel) {
        langLabel.textContent = lang.toUpperCase();
    }

    /* =========================
       ACTIVE BUTTON STATE
    ========================= */
    langOptions.forEach((option) => {
        option.classList.toggle(
            "active",
            option.dataset.lang === lang
        );
    });

    /* =========================
       UPDATE HTML LANG ATTRIBUTE
    ========================= */
    document.documentElement.lang = lang;

    /* =========================
       DISPATCH LANGUAGE CHANGE EVENT
       (for country select updates)
    ========================= */
    window.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: { lang }
        })
    );

    /* =========================
       SAVE LANGUAGE
    ========================= */
    localStorage.setItem("mitest-language", lang);

    closeDropdown();
}

/* LOAD SAVED LANGUAGE */
const savedLanguage = localStorage.getItem("mitest-language") || "en";
applyLanguage(savedLanguage);

/* LANGUAGE SWITCHER EVENTS */
if (langTrigger) {
    langTrigger.addEventListener("click", () => {
        const isOpen = languageSwitcher.classList.toggle("open");
        langTrigger.setAttribute("aria-expanded", isOpen);
    });

    langTrigger.addEventListener("keydown", (e) => {
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

langOptions.forEach((option) => {
    option.addEventListener("click", () => {
        applyLanguage(option.dataset.lang);
    });
});

document.addEventListener("click", (event) => {
    if (languageSwitcher && !languageSwitcher.contains(event.target)) {
        closeDropdown();
    }
});

/* TOASTS */
let toastTimer = null;

function showToast(message, target, duration = 2500) {
    if (!target) return;
    // clear any existing timeout to avoid conflicts
    if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
    }
    
    // update text and show
    target.textContent = message;
    target.classList.add("show");
    
    // set timer to hide
    toastTimer = setTimeout(() => {
        target.classList.remove("show");
        toastTimer = null;
    }, duration);
}

// Helper to easily call with translation key & target
function showTranslatedToast(key, target, fallbackMessage = '') {
    const lang = getCurrentLanguage();
    const msg = translations[lang]?.[key] || fallbackMessage || key;
    showToast(msg, target);
}

/* ADVANCED USERNAME GENERATOR */
generateBtn.addEventListener("click", () => {
    const fullName = fullNameInput.value.trim();

    // Validation
    if (fullName === "") {
        showTranslatedToast("enterName", toast2);
        
        fullNameInput.focus();
        fullNameInput.classList.add("error");
        setTimeout(() => {
            fullNameInput.classList.remove("error");
        }, 100);
        return;
    }

    // Clean & split full name
    const nameParts = fullName
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(" ")
        .filter(part => part !== "");

    // Safety check
    if (nameParts.length === 0) {
        showTranslatedToast("invalidName", toast2);
        return;
    }

    // First & last names
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    // Random generators
    const random3Digits = Math.floor(100 + Math.random() * 900);
    const random4Digits = Math.floor(1000 + Math.random() * 9000);
    const randomYear = Math.floor(1990 + Math.random() * 35);
    const separators = ["", "_", ".", "-"];
    const randomSeparator = separators[Math.floor(Math.random() * separators.length)];

    // Username styles
    const usernameStyles = [
        () => `${firstName}${lastName}${random3Digits}`,
        () => `${firstName}${randomSeparator}${lastName}${random3Digits}`,
        () => `${firstName.charAt(0)}${lastName}${random3Digits}`,
        () => `${firstName}${lastName.charAt(0)}${random3Digits}`,
        () => `${lastName}${firstName}${randomYear}`,
        () => `real_${firstName}${lastName}`,
        () => `the${firstName}${random4Digits}`,
        () => `official_${firstName}`,
        () => `${firstName}x${lastName}${random3Digits}`,
        () => `${firstName}_pro${random3Digits}`,
        () => `${firstName}${lastName}_official`,
        () => `${firstName}.dev`,
        () => `mr_${firstName}${lastName}`,
        () => `${lastName}.${firstName}`,
        () => `${firstName}playz${random3Digits}`
    ];

    // Pick random style
    const randomStyle = usernameStyles[Math.floor(Math.random() * usernameStyles.length)];

    // Generate username
    let generatedUsername = randomStyle();

    // Remove accidental spaces
    generatedUsername = generatedUsername.replace(/\s+/g, "");

    // Set username input
    usernameInput.value = generatedUsername;

    // Small success animation
    usernameInput.classList.add("generated");
    setTimeout(() => {
        usernameInput.classList.remove("generated");
    }, 600);
});

function showSuccessOverlay(guestData) {
    // Populate summary
    summaryName.textContent = guestData.fullName || '—';
    summaryUsername.textContent = guestData.username || '—';
    
    const levelMap = {
        beginner: t('lvlBg'),
        intermediate: t('lvlInter'),
        advanced: t('lvlAdv')
    };
    summaryLevel.textContent = levelMap[guestData.level] || guestData.level || '—';
    summaryCountry.textContent = guestData.country || '—';

    // Reset state
    progressFill.classList.remove('running');
    progressFill.style.width = '0%';
    progressText.textContent = t('loadingSummary');
    goNowBtn.classList.remove('revealed');
    clearTimeout(progressTimeout);

    // Show overlay
    successOverlay.classList.add('active');
    btnOverlay.classList.add('active');

    // Start progress bar animation after a tiny delay (lets the card entrance complete)
    setTimeout(() => {
        progressText.textContent = t('preparingProfile');
        progressFill.classList.add('running');
    }, 400);

    // Reveal the "Go to Dashboard" button when progress bar finishes (2.5s animation)
    progressTimeout = setTimeout(() => {
        progressText.textContent = t('readyMessage');
        goNowBtn.classList.add('revealed');
    }, 2900); // slightly after the 2.5s fill animation
}

// ============================================================
// HIDE SUCCESS OVERLAY (for "Edit Info")
// ============================================================
function hideSuccessOverlay() {
  clearTimeout(progressTimeout);
  successOverlay.classList.remove('active');
  btnOverlay.classList.remove('active');
  progressFill.classList.remove('running');
  progressFill.style.width = '0%';
  goNowBtn.classList.remove('revealed');
}

// ============================================================
// BUTTON HANDLERS
// ============================================================
goNowBtn.addEventListener('click', () => {
  // Only proceed if the button is revealed
  if (!goNowBtn.classList.contains('revealed')) return;
  
  progressText.textContent = t('goingDashboard');
  setTimeout(() => {
    window.location.href = 'welcome.html';
  }, 300);
});

stayBtn.addEventListener('click', () => {
  hideSuccessOverlay();
});

// ============================================================
// FORM SUBMIT — integrated with your existing logic
// ============================================================
guestForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const fullName = fullNameInput.value.trim();
  const username = usernameInput.value.trim();

  const selectedLevel =
    document.querySelector('.advanced-select-wrapper .hidden-input')?.value || 'beginner';

  const selectedCountry =
    document.querySelector('.advanced-country-select-wrapper .hidden-input')?.value || 'Unknown';

  const ageInput = document.querySelector('input[type="number"]');

  const guestData = {
    fullName,
    username,
    age: ageInput?.value || '',
    level: selectedLevel,
    country: selectedCountry,
    language: typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en'
  };

  // Save locally
  localStorage.setItem('mitest-guest', JSON.stringify(guestData));

  // Show the success overlay
  showSuccessOverlay(guestData);

  // Optional toast notifications (if your toast system is available)
 /* if (typeof showTranslatedToast === 'function') {
    const guestToast = document.getElementById('guestToast');
    showTranslatedToast('guestSuccess', guestToast); } */
});

/* =========================================
   INPUT ANIMATION
========================================= */

const inputs = document.querySelectorAll(".input-field");
inputs.forEach((input) => {
    input.addEventListener("focus", () => {
        input.parentElement.style.transform = "translateY(-2px)";
        input.parentElement.style.transition = "0.3s ease";
    });

    input.addEventListener("blur", () => {
        input.parentElement.style.transform = "translateY(0px)";
    });
});

/* =========================================
   ACCESSIBILITY
========================================= */

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement === generateBtn) {
        e.preventDefault();
        generateBtn.click();
    }
});

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
window.addEventListener('DOMContentLoaded', () => {
    if (!navigator.onLine) {
        wasOffline = true;
        setTimeout(() => {
            hideBanner(onlineBanner);
            showBanner(offlineBanner, null);
        }, 300);
    }
});

/* BACK BUTTON */
if (backBtn) {
    backBtn.addEventListener('click', () => {
        const backMsg = t('backToast');
        showToast(backMsg, toast1, 2000);
        setTimeout(() => {
            window.location.href = "auth.html";
        }, 800);
    });
}

// ─── AdvancedSelect Class ────────────────────
class AdvancedSelect {
    constructor(element) {
        this.wrapper = element;
        this.select = element.querySelector('.advanced-select');
        this.selectedText = element.querySelector('.selected-text');
        this.options = element.querySelectorAll('.select-option');
        this.hiddenInput = element.querySelector('.hidden-input');
        this.currentValue = this.hiddenInput ? this.hiddenInput.value : '';
        
        this.isOpen = false;
        
        this._outsideClickHandler = (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.closeDropdown();
            }
        };
        
        this._escapeHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
                this.select.focus();
            }
        };
        
        this.init();
    }
    
    init() {
        this.select.addEventListener('click', (e) => {
            if (e.target.closest('.select-dropdown') && !e.target.closest('.select-option')) {
                return;
            }
            this.toggleDropdown();
        });
        
        document.addEventListener('mousedown', this._outsideClickHandler);
        
        this.options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(option);
            });
            
            option.addEventListener('mouseenter', () => {
                if (this.isOpen) {
                    this.options.forEach(opt => opt.classList.remove('hover'));
                    option.classList.add('hover');
                }
            });
        });
        
        this.select.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        document.addEventListener('keydown', this._escapeHandler);
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        document.querySelectorAll('.advanced-select.active').forEach(select => {
            if (select !== this.select) {
                select.classList.remove('active');
                const wrapper = select.closest('.advanced-select-wrapper');
                if (wrapper && wrapper._advancedSelectInstance) {
                    wrapper._advancedSelectInstance.isOpen = false;
                }
            }
        });
        
        this.select.classList.add('active');
        this.isOpen = true;
    }
    
    closeDropdown() {
        if (!this.isOpen) return;
        
        this.select.classList.remove('active');
        this.isOpen = false;
    }
    
    selectOption(option) {
        const value = option.dataset.value;
        const labelElement = option.querySelector('.option-label');
        
        if (!labelElement) return;
        
        const label = labelElement.textContent;
        const iconElement = option.querySelector('.option-icon');
        const icon = iconElement ? iconElement.textContent : '';
        
        if (this.currentValue === value && this.isOpen) {
            this.closeDropdown();
            return;
        }
        
        this.selectedText.textContent = icon ? `${icon} ${label}` : label;
        if (this.hiddenInput) {
            this.hiddenInput.value = value;
        }
        
        if (this.currentValue !== value) {
            this.currentValue = value;
            
            this.options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const changeEvent = new CustomEvent('levelChange', {
                detail: { value, label, icon },
                bubbles: true
            });
            this.wrapper.dispatchEvent(changeEvent);
        }
        
        this.closeDropdown();
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!this.isOpen) {
                    this.openDropdown();
                } else {
                    const activeOption = this.getActiveOption();
                    if (activeOption) {
                        this.selectOption(activeOption);
                    }
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.openDropdown();
                } else {
                    this.navigateOptions(1);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (this.isOpen) {
                    this.navigateOptions(-1);
                }
                break;
                
            case 'Tab':
                if (this.isOpen) {
                    e.preventDefault();
                    this.closeDropdown();
                }
                break;
        }
    }
    
    getActiveOption() {
        if (this.options.length === 0) return null;
        
        return Array.from(this.options).find(opt => opt.classList.contains('active')) || this.options[0];
    }
    
    navigateOptions(direction) {
        const optionsArray = Array.from(this.options);
        if (optionsArray.length === 0) return;
        
        const activeOption = optionsArray.find(opt => opt.classList.contains('active'));
        const currentIndex = activeOption ? optionsArray.indexOf(activeOption) : -1;
        let nextIndex;
        
        if (currentIndex === -1) {
            nextIndex = direction === 1 ? 0 : optionsArray.length - 1;
        } else {
            nextIndex = (currentIndex + direction + optionsArray.length) % optionsArray.length;
        }
        
        this.options.forEach(opt => opt.classList.remove('active'));
        optionsArray[nextIndex].classList.add('active');
        
        optionsArray[nextIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
        });
    }
    
    destroy() {
        document.removeEventListener('mousedown', this._outsideClickHandler);
        document.removeEventListener('keydown', this._escapeHandler);
    }
}

// ─── Country Translations ────────────────────
const countryTranslations = {
    en: {
        "Côte d'Ivoire": "Ivory Coast",
        "United States": "United States",
        "France": "France",
        "Canada": "Canada",
        "United Kingdom": "United Kingdom",
        "Germany": "Germany",
        "Italy": "Italy",
        "Spain": "Spain",
        "Portugal": "Portugal",
        "Brazil": "Brazil",
        "Argentina": "Argentina",
        "Mexico": "Mexico",
        "Nigeria": "Nigeria",
        "Ghana": "Ghana",
        "Senegal": "Senegal",
        "South Africa": "South Africa",
        "Kenya": "Kenya",
        "Morocco": "Morocco",
        "Egypt": "Egypt",
        "Japan": "Japan",
        "China": "China",
        "India": "India",
        "South Korea": "South Korea",
        "Thailand": "Thailand",
        "Australia": "Australia",
        "New Zealand": "New Zealand",
        "Russia": "Russia",
        "Turkey": "Turkey",
        "Saudi Arabia": "Saudi Arabia",
        "United Arab Emirates": "United Arab Emirates",
        "Belgium": "Belgium",
        "Netherlands": "Netherlands",
        "Switzerland": "Switzerland",
        "Sweden": "Sweden",
        "Norway": "Norway",
        "Denmark": "Denmark",
        "Finland": "Finland",
        "Ireland": "Ireland",
        "Austria": "Austria",
        "Poland": "Poland",
        "Ukraine": "Ukraine",
        "Czech Republic": "Czech Republic",
        "Romania": "Romania",
        "Greece": "Greece",
        "Hungary": "Hungary",
        "Colombia": "Colombia",
        "Chile": "Chile",
        "Peru": "Peru",
        "Venezuela": "Venezuela",
        "Cuba": "Cuba",
        "Dominican Republic": "Dominican Republic",
        "Guatemala": "Guatemala",
        "Honduras": "Honduras",
        "El Salvador": "El Salvador",
        "Panama": "Panama",
        "Costa Rica": "Costa Rica",
        "Jamaica": "Jamaica",
        "Ethiopia": "Ethiopia",
        "Tanzania": "Tanzania",
        "Uganda": "Uganda",
        "Algeria": "Algeria",
        "Tunisia": "Tunisia",
        "Libya": "Libya",
        "Cameroon": "Cameroon",
        "Mali": "Mali",
        "Burkina Faso": "Burkina Faso",
        "Benin": "Benin",
        "Togo": "Togo",
        "Guinea": "Guinea",
        "Rwanda": "Rwanda",
        "Madagascar": "Madagascar",
        "Angola": "Angola",
        "Mozambique": "Mozambique",
        "Zambia": "Zambia",
        "Zimbabwe": "Zimbabwe",
        "Botswana": "Botswana",
        "Namibia": "Namibia",
        "Indonesia": "Indonesia",
        "Malaysia": "Malaysia",
        "Philippines": "Philippines",
        "Vietnam": "Vietnam",
        "Singapore": "Singapore",
        "Bangladesh": "Bangladesh",
        "Pakistan": "Pakistan",
        "Iran": "Iran",
        "Iraq": "Iraq",
        "Israel": "Israel",
        "Jordan": "Jordan",
        "Lebanon": "Lebanon",
        "Qatar": "Qatar",
        "Kuwait": "Kuwait",
        "Oman": "Oman",
        "Bahrain": "Bahrain",
        "Yemen": "Yemen",
        "Taiwan": "Taiwan",
        "Hong Kong": "Hong Kong",
        "Myanmar": "Myanmar",
        "Cambodia": "Cambodia",
        "Laos": "Laos",
        "Nepal": "Nepal",
        "Sri Lanka": "Sri Lanka",
        "Mongolia": "Mongolia",
        "Kazakhstan": "Kazakhstan",
        "Uzbekistan": "Uzbekistan",
        "Azerbaijan": "Azerbaijan",
        "Georgia": "Georgia",
        "Armenia": "Armenia"
    },
    fr: {
        "Côte d'Ivoire": "Côte d'Ivoire",
        "United States": "États-Unis",
        "France": "France",
        "Canada": "Canada",
        "United Kingdom": "Royaume-Uni",
        "Germany": "Allemagne",
        "Italy": "Italie",
        "Spain": "Espagne",
        "Portugal": "Portugal",
        "Brazil": "Brésil",
        "Argentina": "Argentine",
        "Mexico": "Mexique",
        "Nigeria": "Nigeria",
        "Ghana": "Ghana",
        "Senegal": "Sénégal",
        "South Africa": "Afrique du Sud",
        "Kenya": "Kenya",
        "Morocco": "Maroc",
        "Egypt": "Égypte",
        "Japan": "Japon",
        "China": "Chine",
        "India": "Inde",
        "South Korea": "Corée du Sud",
        "Thailand": "Thaïlande",
        "Australia": "Australie",
        "New Zealand": "Nouvelle-Zélande",
        "Russia": "Russie",
        "Turkey": "Turquie",
        "Saudi Arabia": "Arabie Saoudite",
        "United Arab Emirates": "Émirats Arabes Unis",
        "Belgium": "Belgique",
        "Netherlands": "Pays-Bas",
        "Switzerland": "Suisse",
        "Sweden": "Suède",
        "Norway": "Norvège",
        "Denmark": "Danemark",
        "Finland": "Finlande",
        "Ireland": "Irlande",
        "Austria": "Autriche",
        "Poland": "Pologne",
        "Ukraine": "Ukraine",
        "Czech Republic": "République Tchèque",
        "Romania": "Roumanie",
        "Greece": "Grèce",
        "Hungary": "Hongrie",
        "Colombia": "Colombie",
        "Chile": "Chili",
        "Peru": "Pérou",
        "Venezuela": "Venezuela",
        "Cuba": "Cuba",
        "Dominican Republic": "République Dominicaine",
        "Guatemala": "Guatemala",
        "Honduras": "Honduras",
        "El Salvador": "Salvador",
        "Panama": "Panama",
        "Costa Rica": "Costa Rica",
        "Jamaica": "Jamaïque",
        "Ethiopia": "Éthiopie",
        "Tanzania": "Tanzanie",
        "Uganda": "Ouganda",
        "Algeria": "Algérie",
        "Tunisia": "Tunisie",
        "Libya": "Libye",
        "Cameroon": "Cameroun",
        "Mali": "Mali",
        "Burkina Faso": "Burkina Faso",
        "Benin": "Bénin",
        "Togo": "Togo",
        "Guinea": "Guinée",
        "Rwanda": "Rwanda",
        "Madagascar": "Madagascar",
        "Angola": "Angola",
        "Mozambique": "Mozambique",
        "Zambia": "Zambie",
        "Zimbabwe": "Zimbabwe",
        "Botswana": "Botswana",
        "Namibia": "Namibie",
        "Indonesia": "Indonésie",
        "Malaysia": "Malaisie",
        "Philippines": "Philippines",
        "Vietnam": "Vietnam",
        "Singapore": "Singapour",
        "Bangladesh": "Bangladesh",
        "Pakistan": "Pakistan",
        "Iran": "Iran",
        "Iraq": "Irak",
        "Israel": "Israël",
        "Jordan": "Jordanie",
        "Lebanon": "Liban",
        "Qatar": "Qatar",
        "Kuwait": "Koweït",
        "Oman": "Oman",
        "Bahrain": "Bahreïn",
        "Yemen": "Yémen",
        "Taiwan": "Taïwan",
        "Hong Kong": "Hong Kong",
        "Myanmar": "Myanmar",
        "Cambodia": "Cambodge",
        "Laos": "Laos",
        "Nepal": "Népal",
        "Sri Lanka": "Sri Lanka",
        "Mongolia": "Mongolie",
        "Kazakhstan": "Kazakhstan",
        "Uzbekistan": "Ouzbékistan",
        "Azerbaijan": "Azerbaïdjan",
        "Georgia": "Géorgie",
        "Armenia": "Arménie"
    }
};

// ─── Country Data ────────────────────────────
const countries = [
    { name: "Côte d'Ivoire", flag: "🇨🇮", region: "West Africa" },
    { name: "United States", flag: "🇺🇸", region: "North America" },
    { name: "France", flag: "🇫🇷", region: "Europe" },
    { name: "Canada", flag: "🇨🇦", region: "North America" },
    { name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
    { name: "Germany", flag: "🇩🇪", region: "Europe" },
    { name: "Italy", flag: "🇮🇹", region: "Europe" },
    { name: "Spain", flag: "🇪🇸", region: "Europe" },
    { name: "Portugal", flag: "🇵🇹", region: "Europe" },
    { name: "Brazil", flag: "🇧🇷", region: "South America" },
    { name: "Argentina", flag: "🇦🇷", region: "South America" },
    { name: "Mexico", flag: "🇲🇽", region: "North America" },
    { name: "Nigeria", flag: "🇳🇬", region: "West Africa" },
    { name: "Ghana", flag: "🇬🇭", region: "West Africa" },
    { name: "Senegal", flag: "🇸🇳", region: "West Africa" },
    { name: "South Africa", flag: "🇿🇦", region: "Southern Africa" },
    { name: "Kenya", flag: "🇰🇪", region: "East Africa" },
    { name: "Morocco", flag: "🇲🇦", region: "North Africa" },
    { name: "Egypt", flag: "🇪🇬", region: "North Africa" },
    { name: "Japan", flag: "🇯🇵", region: "East Asia" },
    { name: "China", flag: "🇨🇳", region: "East Asia" },
    { name: "India", flag: "🇮🇳", region: "South Asia" },
    { name: "South Korea", flag: "🇰🇷", region: "East Asia" },
    { name: "Thailand", flag: "🇹🇭", region: "Southeast Asia" },
    { name: "Australia", flag: "🇦🇺", region: "Oceania" },
    { name: "New Zealand", flag: "🇳🇿", region: "Oceania" },
    { name: "Russia", flag: "🇷🇺", region: "Europe / Asia" },
    { name: "Turkey", flag: "🇹🇷", region: "Europe / Asia" },
    { name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East" },
    { name: "United Arab Emirates", flag: "🇦🇪", region: "Middle East" },
    { name: "Belgium", flag: "🇧🇪", region: "Europe" },
    { name: "Netherlands", flag: "🇳🇱", region: "Europe" },
    { name: "Switzerland", flag: "🇨🇭", region: "Europe" },
    { name: "Sweden", flag: "🇸🇪", region: "Europe" },
    { name: "Norway", flag: "🇳🇴", region: "Europe" },
    { name: "Denmark", flag: "🇩🇰", region: "Europe" },
    { name: "Finland", flag: "🇫🇮", region: "Europe" },
    { name: "Ireland", flag: "🇮🇪", region: "Europe" },
    { name: "Austria", flag: "🇦🇹", region: "Europe" },
    { name: "Poland", flag: "🇵🇱", region: "Europe" },
    { name: "Ukraine", flag: "🇺🇦", region: "Europe" },
    { name: "Czech Republic", flag: "🇨🇿", region: "Europe" },
    { name: "Romania", flag: "🇷🇴", region: "Europe" },
    { name: "Greece", flag: "🇬🇷", region: "Europe" },
    { name: "Hungary", flag: "🇭🇺", region: "Europe" },
    { name: "Colombia", flag: "🇨🇴", region: "South America" },
    { name: "Chile", flag: "🇨🇱", region: "South America" },
    { name: "Peru", flag: "🇵🇪", region: "South America" },
    { name: "Venezuela", flag: "🇻🇪", region: "South America" },
    { name: "Cuba", flag: "🇨🇺", region: "Caribbean" },
    { name: "Dominican Republic", flag: "🇩🇴", region: "Caribbean" },
    { name: "Guatemala", flag: "🇬🇹", region: "Central America" },
    { name: "Honduras", flag: "🇭🇳", region: "Central America" },
    { name: "El Salvador", flag: "🇸🇻", region: "Central America" },
    { name: "Panama", flag: "🇵🇦", region: "Central America" },
    { name: "Costa Rica", flag: "🇨🇷", region: "Central America" },
    { name: "Jamaica", flag: "🇯🇲", region: "Caribbean" },
    { name: "Ethiopia", flag: "🇪🇹", region: "East Africa" },
    { name: "Tanzania", flag: "🇹🇿", region: "East Africa" },
    { name: "Uganda", flag: "🇺🇬", region: "East Africa" },
    { name: "Algeria", flag: "🇩🇿", region: "North Africa" },
    { name: "Tunisia", flag: "🇹🇳", region: "North Africa" },
    { name: "Libya", flag: "🇱🇾", region: "North Africa" },
    { name: "Cameroon", flag: "🇨🇲", region: "Central Africa" },
    { name: "Mali", flag: "🇲🇱", region: "West Africa" },
    { name: "Burkina Faso", flag: "🇧🇫", region: "West Africa" },
    { name: "Benin", flag: "🇧🇯", region: "West Africa" },
    { name: "Togo", flag: "🇹🇬", region: "West Africa" },
    { name: "Guinea", flag: "🇬🇳", region: "West Africa" },
    { name: "Rwanda", flag: "🇷🇼", region: "East Africa" },
    { name: "Madagascar", flag: "🇲🇬", region: "Southern Africa" },
    { name: "Angola", flag: "🇦🇴", region: "Southern Africa" },
    { name: "Mozambique", flag: "🇲🇿", region: "Southern Africa" },
    { name: "Zambia", flag: "🇿🇲", region: "Southern Africa" },
    { name: "Zimbabwe", flag: "🇿🇼", region: "Southern Africa" },
    { name: "Botswana", flag: "🇧🇼", region: "Southern Africa" },
    { name: "Namibia", flag: "🇳🇦", region: "Southern Africa" },
    { name: "Indonesia", flag: "🇮🇩", region: "Southeast Asia" },
    { name: "Malaysia", flag: "🇲🇾", region: "Southeast Asia" },
    { name: "Philippines", flag: "🇵🇭", region: "Southeast Asia" },
    { name: "Vietnam", flag: "🇻🇳", region: "Southeast Asia" },
    { name: "Singapore", flag: "🇸🇬", region: "Southeast Asia" },
    { name: "Bangladesh", flag: "🇧🇩", region: "South Asia" },
    { name: "Pakistan", flag: "🇵🇰", region: "South Asia" },
    { name: "Iran", flag: "🇮🇷", region: "Middle East" },
    { name: "Iraq", flag: "🇮🇶", region: "Middle East" },
    { name: "Israel", flag: "🇮🇱", region: "Middle East" },
    { name: "Jordan", flag: "🇯🇴", region: "Middle East" },
    { name: "Lebanon", flag: "🇱🇧", region: "Middle East" },
    { name: "Qatar", flag: "🇶🇦", region: "Middle East" },
    { name: "Kuwait", flag: "🇰🇼", region: "Middle East" },
    { name: "Oman", flag: "🇴🇲", region: "Middle East" },
    { name: "Bahrain", flag: "🇧🇭", region: "Middle East" },
    { name: "Yemen", flag: "🇾🇪", region: "Middle East" },
    { name: "Taiwan", flag: "🇹🇼", region: "East Asia" },
    { name: "Hong Kong", flag: "🇭🇰", region: "East Asia" },
    { name: "Myanmar", flag: "🇲🇲", region: "Southeast Asia" },
    { name: "Cambodia", flag: "🇰🇭", region: "Southeast Asia" },
    { name: "Laos", flag: "🇱🇦", region: "Southeast Asia" },
    { name: "Nepal", flag: "🇳🇵", region: "South Asia" },
    { name: "Sri Lanka", flag: "🇱🇰", region: "South Asia" },
    { name: "Mongolia", flag: "🇲🇳", region: "East Asia" },
    { name: "Kazakhstan", flag: "🇰🇿", region: "Central Asia" },
    { name: "Uzbekistan", flag: "🇺🇿", region: "Central Asia" },
    { name: "Azerbaijan", flag: "🇦🇿", region: "Europe / Asia" },
    { name: "Georgia", flag: "🇬🇪", region: "Europe / Asia" },
    { name: "Armenia", flag: "🇦🇲", region: "Europe / Asia" }
];

// ─── Helper: Get translated country name ────
function getTranslatedCountryName(countryName) {
    const lang = getCurrentLanguage();
    return countryTranslations[lang]?.[countryName] || countryName;
}

// ─── AdvancedCountrySelect Class ─────────────
class AdvancedCountrySelect {
    constructor(element) {
        this.wrapper = element;
        this.select = element.querySelector('.advanced-country-select');
        this.selectedText = element.querySelector('.selected-text');
        this.hiddenInput = element.querySelector('.hidden-input');
        this.currentValue = this.hiddenInput ? this.hiddenInput.value : '';
        
        this.searchInput = element.querySelector('.search-input');
        this.optionsContainer = element.querySelector('.select-options');
        this.noResults = element.querySelector('.no-results');
        
        this.isOpen = false;
        this.options = [];
        
        this.init();
        this.renderCountries(countries);
        
        window.addEventListener('languageChanged', () => {
            this.updateDisplay();
            this.renderCountries(countries);
        });
    }
    
    init() {
        this.select.addEventListener('click', (e) => {
            if (e.target.closest('.select-dropdown') && !e.target.closest('.select-option')) {
                return;
            }
            this.toggleDropdown();
        });
        
        document.addEventListener('mousedown', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterOptions(e.target.value);
            });
            
            this.searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        this.select.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
                this.select.focus();
            }
        });
    }
    
    renderCountries(countryList) {
        if (!this.optionsContainer) return;
        
        this.optionsContainer.innerHTML = '';
        
        if (!countryList || countryList.length === 0) {
            if (this.noResults) this.noResults.style.display = 'flex';
            this.options = [];
            return;
        }
        
        if (this.noResults) this.noResults.style.display = 'none';
        
        countryList.forEach(country => {
            const translatedName = getTranslatedCountryName(country.name);
            const isActive = this.currentValue === country.name;
            
            const option = document.createElement('div');
            option.className = `select-option${isActive ? ' active' : ''}`;
            option.dataset.value = country.name;
            
            option.innerHTML = `
                <span class="option-flag">${country.flag}</span>
                <div class="option-content">
                    <span class="option-label">${translatedName}</span>
                    <span class="option-desc">${country.region}</span>
                </div>
                <svg class="check-icon" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            `;
            
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(option);
            });
            
            option.addEventListener('mouseenter', () => {
                if (this.isOpen) {
                    this.options.forEach(opt => opt.classList.remove('hover'));
                    option.classList.add('hover');
                }
            });
            
            this.optionsContainer.appendChild(option);
        });
        
        this.options = this.optionsContainer.querySelectorAll('.select-option');
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        document.querySelectorAll('.advanced-country-select.active').forEach(select => {
            if (select !== this.select) {
                select.classList.remove('active');
                const wrapper = select.closest('.advanced-country-select-wrapper');
                if (wrapper && wrapper._countrySelectInstance) {
                    wrapper._countrySelectInstance.isOpen = false;
                }
            }
        });
        
        this.select.classList.add('active');
        this.isOpen = true;
        
        if (this.searchInput) {
            this.searchInput.value = '';
            this.filterOptions('');
        }
    }
    
    closeDropdown() {
        if (!this.isOpen) return;
        
        this.select.classList.remove('active');
        this.isOpen = false;
        
        if (this.searchInput) {
            this.searchInput.value = '';
            this.filterOptions('');
        }
    }
    
    selectOption(option) {
        const value = option.dataset.value;
        const label = option.querySelector('.option-label').textContent;
        const flag = option.querySelector('.option-flag').textContent;
        
        if (this.currentValue === value && this.isOpen) {
            this.closeDropdown();
            return;
        }
        
        this.selectedText.textContent = `${flag} ${label}`;
        if (this.hiddenInput) {
            this.hiddenInput.value = value;
        }
        
        if (this.currentValue !== value) {
            this.currentValue = value;
            
            this.options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const changeEvent = new CustomEvent('countryChange', {
                detail: { value, label, flag },
                bubbles: true
            });
            this.wrapper.dispatchEvent(changeEvent);
        }
        
        this.closeDropdown();
    }
    
    updateDisplay() {
        if (!this.currentValue) return;
        
        const translatedName = getTranslatedCountryName(this.currentValue);
        const country = countries.find(c => c.name === this.currentValue);
        
        if (country && this.selectedText) {
            this.selectedText.textContent = `${country.flag} ${translatedName}`;
        }
    }
    
    filterOptions(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.renderCountries(countries);
            return;
        }
        
        const filtered = countries.filter(country => {
            const translatedName = getTranslatedCountryName(country.name);
            return (
                country.name.toLowerCase().includes(searchTerm) ||
                translatedName.toLowerCase().includes(searchTerm) ||
                country.region.toLowerCase().includes(searchTerm)
            );
        });
        
        this.renderCountries(filtered);
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!this.isOpen) {
                    this.openDropdown();
                } else {
                    const activeOption = this.getActiveOption();
                    if (activeOption && !activeOption.classList.contains('hidden')) {
                        this.selectOption(activeOption);
                    }
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.openDropdown();
                } else {
                    this.navigateOptions(1);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (this.isOpen) {
                    this.navigateOptions(-1);
                }
                break;
                
            case 'Tab':
                if (this.isOpen) {
                    e.preventDefault();
                    this.closeDropdown();
                }
                break;
        }
    }
    
    getActiveOption() {
        const visibleOptions = this.getVisibleOptions();
        if (visibleOptions.length === 0) return null;
        
        return Array.from(visibleOptions).find(opt => opt.classList.contains('active')) || visibleOptions[0];
    }
    
    getVisibleOptions() {
        return Array.from(this.options).filter(opt => !opt.classList.contains('hidden'));
    }
    
    navigateOptions(direction) {
        const visibleOptions = this.getVisibleOptions();
        if (visibleOptions.length === 0) return;
        
        const optionsArray = Array.from(visibleOptions);
        const activeOption = optionsArray.find(opt => opt.classList.contains('active'));
        const currentIndex = activeOption ? optionsArray.indexOf(activeOption) : -1;
        let nextIndex;
        
        if (currentIndex === -1) {
            nextIndex = direction === 1 ? 0 : optionsArray.length - 1;
        } else {
            nextIndex = (currentIndex + direction + optionsArray.length) % optionsArray.length;
        }
        
        this.options.forEach(opt => opt.classList.remove('active'));
        optionsArray[nextIndex].classList.add('active');
        
        optionsArray[nextIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
        });
    }
}

// ─── Initialize on DOM Ready ────────────────
document.addEventListener('DOMContentLoaded', function() {
    // Initialize country selects
    document.querySelectorAll('.advanced-country-select-wrapper').forEach(wrapper => {
        const instance = new AdvancedCountrySelect(wrapper);
        wrapper._countrySelectInstance = instance;
        instance.updateDisplay();
    });
    
    // Initialize regular advanced selects
    if (typeof AdvancedSelect === 'function') {
        document.querySelectorAll('.advanced-select-wrapper').forEach(wrapper => {
            const instance = new AdvancedSelect(wrapper);
            wrapper._advancedSelectInstance = instance;
        });
    }
});

console.log("🚀 Guest page ready with i18n support!");