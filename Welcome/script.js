(function() {
    // ==================== DOM ELEMENTS ====================
    const offlineBanner = document.getElementById('offlineBanner');
    const onlineBanner = document.getElementById('onlineBanner');
    const toast = document.getElementById('toast');
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const closeInstallPrompt = document.getElementById('closeInstallPrompt');
    const langSwitcher = document.getElementById('languageSwitcher');
    const langTrigger = document.getElementById('langTrigger');
    const langOptions = document.querySelectorAll('.lang-option');
    const startTestBtn = document.getElementById('startTestBtn');
    const progressBar = document.getElementById('progressBar');
    const navItems = document.querySelectorAll('.nav-item');
    const navPill = document.querySelector('.nav-pill');
    const cefrMarkers = document.querySelectorAll('.cefr-markers span');
    const levelIcon = document.getElementById('levelIcon');
    const levelHeading = document.getElementById('level-heading');
    const levelDescription = document.getElementById('levelDescription');
    const userRank = document.getElementById('userRank');
    const userProgressText = document.getElementById('userProgressText');
    const guestNameEl = document.getElementById('guestName');
    const goalLevelName = document.getElementById('goalLevelName');
    const goalLevelValue = document.getElementById('goalLevelValue');
    const dashboardTab = document.getElementById('dashboardTab');
    const dashboardPanel = document.getElementById('dashboardPanel');
    const profilePanel = document.getElementById('profilePanel');
    const dashboardLocked = document.getElementById('dashboardLocked');
    const dashboardContent = document.getElementById('dashboardContent');
    
    // ==================== STATE ====================
    let currentLang = 'en';
    let deferredPrompt = null;
    let networkToastTimer = null;
    let isDragging = false;
    let dragOffsetX = 0, dragOffsetY = 0;
    let activeNetworkToast = null;
    let testCompleted = false;
    let userData = {
        name: 'Alex',
        email: 'alex@mitest.app',
        level: 'A1',
        rank: 'Starter Learner',
        progress: 10,
        goalLevel: 'B1',
        goalLevelName: 'Intermediate'
    };

    // ==================== TRANSLATIONS ====================
    const i18n = {
        en: {
            // Network toasts
            networkOfflineTitle: 'Network issues',
            networkOfflineDesc: 'You are offline — but miTEST still works!',
            networkOnlineTitle: 'Back online',
            networkOnlineDesc: 'Your connection has been restored!',
            // Install prompt
            installPromptText: '📲 Install miTEST for quick access',
            installBtn: 'Install',
            installCloseAria: 'Close install prompt',
            // Dashboard panel
            dashboardTitle: 'Dashboard',
            dashboardLockedTitle: 'Unavailable!',
            dashboardLockedDesc: 'Please complete your first test before consulting the dashboard.',
            dashboardUnlockedDesc: 'Your detailed performance analytics will appear here.',
            // Profile panel
            profileTitle: 'Profile',
            profileLevelLabel: 'Level',
            profileProgressLabel: 'Progress',
            profileRankLabel: 'Rank',
            profileEditBtn: 'Edit Profile',
            profileLogoutBtn: 'Logout',
            // Back button aria
            backToHome: 'Back to home',
            // Language switcher
            langChoose: 'Choose language',
            langEnglish: 'English',
            langFrench: 'Français',
            // Welcome card
            welcomeBadge: 'AI English Assessment',
            welcomeDesc: 'Your personalized English evaluation is ready. The assessment adapts dynamically to your answers to provide a precise and fast understanding of your current communication level.',
            // Level journey
            levelJourney: '🏆 Your Level Journey',
            // Level highlight
            metaRank: 'Current Rank',
            metaProgress: 'Progress',
            // Test overview
            overviewBadge: 'Assessment Preview',
            overviewTitle: 'Everything you need before starting',
            overviewSubtitle: 'Quick insights about the evaluation experience.',
            cardTimeLabel: 'Estimated Time',
            cardTimeValue: '18 Minutes',
            cardTimeMeta: 'Flexible pace • Auto-save enabled',
            cardQuestionsLabel: 'Question Format',
            cardQuestionsValue: '24 Interactive Tasks',
            cardQuestionsMeta: 'Adaptive difficulty • Mixed formats',
            cardResultLabel: 'Final Results',
            cardResultValue: 'Instant Score Report',
            cardResultMeta: 'Skills breakdown • Personalized feedback',
            // Goal section
            goalBadge: 'Placement Assessment',
            goalMainTitle: 'Verify your real English proficiency',
            goalMainDesc: 'This is your first adaptive English placement test. Based on the level you selected during registration, miTEST will verify whether you are truly an <strong>Intermediate (B1)</strong> learner. The assessment adapts dynamically to your answers in real time to accurately determine your real communication and comprehension level.',
            goalSelectedLabel: 'Your Selected Level',
            goalChangeNote: "Don't worry if your final result changes. This evaluation is designed to discover your real English proficiency, which may be higher or lower than your selected level.",
            goalAvgDuration: '10 min',
            goalAvgDurationLabel: 'Average duration',
            goalAccuracy: '95%',
            goalAccuracyLabel: 'Evaluation accuracy',
            // CTA
            ctaReady: 'I AM READY',
            ctaPreparing: 'Preparing test...',
            // Nav
            navHome: 'Home',
            navDashboard: 'Dashboard',
            navProfile: 'Profile',
            // Toasts
            testCompleted: '✅ Test completed! Dashboard is now unlocked.',
            langChangedEN: '🇬🇧 Language set to English',
            langChangedFR: '🇫🇷 Langue changée en Français',
            installThanks: '✅ Thanks for installing!',
            editProfileSoon: 'Edit profile feature coming soon!',
            logoutDemo: 'Logout successful (demo)',
            dashboardLoaded: 'Dashboard loaded!'
        },
        fr: {
            networkOfflineTitle: 'Problèmes de réseau',
            networkOfflineDesc: 'Vous êtes hors ligne — mais miTEST fonctionne toujours !',
            networkOnlineTitle: 'De retour en ligne',
            networkOnlineDesc: 'Votre connexion a été rétablie !',
            installPromptText: '📲 Installez miTEST pour un accès rapide',
            installBtn: 'Installer',
            installCloseAria: 'Fermer l\'invite d\'installation',
            dashboardTitle: 'Tableau de bord',
            dashboardLockedTitle: 'Indisponible !',
            dashboardLockedDesc: 'Veuillez d\'abord terminer votre premier test avant de consulter le tableau de bord.',
            dashboardUnlockedDesc: 'Vos analyses de performance détaillées apparaîtront ici.',
            profileTitle: 'Profil',
            profileLevelLabel: 'Niveau',
            profileProgressLabel: 'Progrès',
            profileRankLabel: 'Rang',
            profileEditBtn: 'Modifier le profil',
            profileLogoutBtn: 'Déconnexion',
            backToHome: 'Retour à l\'accueil',
            langChoose: 'Choisir la langue',
            langEnglish: 'Anglais',
            langFrench: 'Français',
            welcomeBadge: 'Évaluation d\'anglais IA',
            welcomeDesc: 'Votre évaluation personnalisée en anglais est prête. L\'évaluation s\'adapte dynamiquement à vos réponses pour fournir une compréhension précise et rapide de votre niveau de communication actuel.',
            levelJourney: '🏆 Votre parcours de niveau',
            metaRank: 'Rang actuel',
            metaProgress: 'Progrès',
            overviewBadge: 'Aperçu de l\'évaluation',
            overviewTitle: 'Tout ce que vous devez savoir avant de commencer',
            overviewSubtitle: 'Informations rapides sur l\'expérience d\'évaluation.',
            cardTimeLabel: 'Temps estimé',
            cardTimeValue: '18 Minutes',
            cardTimeMeta: 'Rythme flexible • Sauvegarde automatique',
            cardQuestionsLabel: 'Format des questions',
            cardQuestionsValue: '24 Tâches interactives',
            cardQuestionsMeta: 'Difficulté adaptative • Formats mixtes',
            cardResultLabel: 'Résultats finaux',
            cardResultValue: 'Rapport de score instantané',
            cardResultMeta: 'Analyse des compétences • Feedback personnalisé',
            goalBadge: 'Test de placement',
            goalMainTitle: 'Vérifiez votre vrai niveau d\'anglais',
            goalMainDesc: 'Ceci est votre premier test de placement adaptatif en anglais. Selon le niveau que vous avez sélectionné lors de l\'inscription, miTEST vérifiera si vous êtes vraiment un apprenant <strong>Intermédiaire (B1)</strong>. L\'évaluation s\'adapte dynamiquement à vos réponses en temps réel.',
            goalSelectedLabel: 'Votre niveau sélectionné',
            goalChangeNote: 'Ne vous inquiétez pas si votre résultat final change. Cette évaluation est conçue pour découvrir votre véritable niveau d\'anglais, qui peut être supérieur ou inférieur au niveau sélectionné.',
            goalAvgDuration: '10 min',
            goalAvgDurationLabel: 'Durée moyenne',
            goalAccuracy: '95%',
            goalAccuracyLabel: 'Précision de l\'évaluation',
            ctaReady: 'JE SUIS PRÊT',
            ctaPreparing: 'Préparation du test...',
            navHome: 'Accueil',
            navDashboard: 'Tableau de bord',
            navProfile: 'Profil',
            testCompleted: '✅ Test terminé ! Le tableau de bord est maintenant débloqué.',
            langChangedEN: '🇬🇧 Language set to English',
            langChangedFR: '🇫🇷 Langue changée en Français',
            installThanks: '✅ Merci pour l\'installation !',
            editProfileSoon: 'Fonctionnalité d\'édition de profil à venir !',
            logoutDemo: 'Déconnexion réussie (démo)',
            dashboardLoaded: 'Tableau de bord chargé !'
        }
    };

    function t(key) {
        return i18n[currentLang]?.[key] || i18n['en'][key] || key;
    }

    // Apply translations to all elements with data-i18n
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[currentLang]?.[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = i18n[currentLang][key];
                } else {
                    // For goal description with HTML, handle separately
                    if (key === 'goalMainDesc') {
                        el.innerHTML = i18n[currentLang][key]; // Allows <strong>
                    } else {
                        el.textContent = i18n[currentLang][key];
                    }
                }
            }
        });
        // Update aria labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (i18n[currentLang]?.[key]) {
                el.setAttribute('aria-label', i18n[currentLang][key]);
            }
        });
        // Update dynamic goal level display
        if (goalLevelValue) {
            goalLevelValue.textContent = currentLang === 'fr' ? 'B1 • Intermédiaire' : 'B1 • Intermediate';
        }
        if (goalLevelName) {
            goalLevelName.textContent = currentLang === 'fr' ? 'Intermédiaire (B1)' : 'Intermediate (B1)';
        }
    }

    // ==================== NETWORK DETECTION ====================
    function showNetworkToast(banner) {
        [offlineBanner, onlineBanner].forEach(b => b.classList.remove('visible', 'dragging', 'removing'));
        clearTimeout(networkToastTimer);
        dragOffsetX = 0;
        dragOffsetY = 0;
        banner.style.setProperty('--dragX', '0px');
        banner.style.setProperty('--dragY', '0px');
        activeNetworkToast = banner;
        banner.classList.add('visible');
        networkToastTimer = setTimeout(() => hideNetworkToast(banner), 4000);
    }

    function hideNetworkToast(banner) {
        banner.classList.remove('visible');
        if (activeNetworkToast === banner) activeNetworkToast = null;
    }

    function setupNetworkToastDrag(banner) {
        let startX, startY, initialDragX, initialDragY;
        banner.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialDragX = dragOffsetX;
            initialDragY = dragOffsetY;
            banner.classList.add('dragging');
            banner.setPointerCapture(e.pointerId);
            clearTimeout(networkToastTimer);
        });
        banner.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            dragOffsetX = initialDragX + (e.clientX - startX);
            dragOffsetY = initialDragY + (e.clientY - startY);
            banner.style.setProperty('--dragX', dragOffsetX + 'px');
            banner.style.setProperty('--dragY', dragOffsetY + 'px');
        });
        banner.addEventListener('pointerup', () => {
            if (!isDragging) return;
            isDragging = false;
            banner.classList.remove('dragging');
            const distance = Math.sqrt(dragOffsetX ** 2 + dragOffsetY ** 2);
            if (distance > 80) {
                banner.classList.add('removing');
                banner.style.setProperty('--dragX', dragOffsetX + 'px');
                banner.style.setProperty('--dragY', dragOffsetY + (dragOffsetY > 0 ? 100 : -100) + 'px');
                banner.style.opacity = '0';
                setTimeout(() => {
                    banner.classList.remove('visible', 'removing');
                    banner.style.opacity = '';
                    banner.style.setProperty('--dragX', '0px');
                    banner.style.setProperty('--dragY', '0px');
                    dragOffsetX = 0;
                    dragOffsetY = 0;
                    if (activeNetworkToast === banner) activeNetworkToast = null;
                }, 300);
            } else {
                dragOffsetX = 0;
                dragOffsetY = 0;
                banner.style.setProperty('--dragX', '0px');
                banner.style.setProperty('--dragY', '0px');
                networkToastTimer = setTimeout(() => hideNetworkToast(banner), 3000);
            }
        });
        banner.addEventListener('pointercancel', () => {
            isDragging = false;
            banner.classList.remove('dragging');
            dragOffsetX = 0;
            dragOffsetY = 0;
            banner.style.setProperty('--dragX', '0px');
            banner.style.setProperty('--dragY', '0px');
        });
    }

    setupNetworkToastDrag(offlineBanner);
    setupNetworkToastDrag(onlineBanner);

    window.addEventListener('online', () => {
        hideNetworkToast(offlineBanner);
        showNetworkToast(onlineBanner);
    });
    window.addEventListener('offline', () => {
        hideNetworkToast(onlineBanner);
        showNetworkToast(offlineBanner);
    });
    if (!navigator.onLine) setTimeout(() => showNetworkToast(offlineBanner), 500);

    // ==================== TOAST SYSTEM ====================
    function showToast(message, duration = 2500) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
    }

    // ==================== INSTALL PROMPT ====================
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installPrompt.classList.add('show');
    });
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
        }
        installPrompt.classList.remove('show');
        showToast(t('installThanks'));
    });
    closeInstallPrompt.addEventListener('click', () => installPrompt.classList.remove('show'));
    if (window.matchMedia('(display-mode: standalone)').matches) installPrompt.classList.remove('show');

    // ==================== LANGUAGE SWITCHER ====================
    langTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langSwitcher.classList.contains('open');
        langSwitcher.classList.toggle('open');
        langTrigger.setAttribute('aria-expanded', !isOpen);
    });
    document.addEventListener('click', (e) => {
        if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
            langTrigger.setAttribute('aria-expanded', 'false');
        }
    });
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            if (lang && lang !== currentLang) {
                currentLang = lang;
                langOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                document.querySelector('.lang-label').textContent = lang.toUpperCase();
                applyTranslations();
                showToast(lang === 'fr' ? t('langChangedFR') : t('langChangedEN'));
            }
            langSwitcher.classList.remove('open');
            langTrigger.setAttribute('aria-expanded', 'false');
        });
    });

    // ==================== PANEL MANAGEMENT ====================
    const panels = {
        home: document.querySelector('.app-container'),
        dashboard: dashboardPanel,
        profile: profilePanel
    };

    function showPanel(panelName) {
        // Hide all panels
        Object.values(panels).forEach(p => {
            if (p) p.classList.remove('active');
        });
        if (panelName === 'home') {
            document.body.classList.remove('panel-open');
        } else {
            const panel = panels[panelName];
            if (panel) {
                panel.classList.add('active');
                document.body.classList.add('panel-open');
            }
        }
        // Update navigation active state
        navItems.forEach(item => {
            const tab = item.getAttribute('data-tab');
            item.classList.remove('active');
            item.removeAttribute('aria-current');
            if (tab === panelName) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
                updateNavPill(item);
            }
        });
    }

    // ==================== NAVIGATION PILL ====================
    function updateNavPill(activeItem) {
        const navRect = document.querySelector('.bottom-nav').getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const pillWidth = navPill.offsetWidth;
        const left = itemRect.left - navRect.left + itemRect.width / 2 - pillWidth / 2;
        navPill.style.left = left + 'px';
    }

    const initialActiveNav = document.querySelector('.nav-item.active');
    if (initialActiveNav) setTimeout(() => updateNavPill(initialActiveNav), 100);
    window.addEventListener('resize', () => {
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav) updateNavPill(activeNav);
    });

    // ==================== NAVIGATION CLICK HANDLER ====================
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            if (item.classList.contains('disabled')) return;
            if (item.classList.contains('active') && tab !== 'home') return; // prevent re‑opening same panel

            // Dashboard logic (always allow opening, content determined by testCompleted)
            if (tab === 'dashboard') {
                // Update dashboard content visibility
                if (testCompleted) {
                    dashboardLocked.style.display = 'none';
                    dashboardContent.style.display = 'block';
                } else {
                    dashboardLocked.style.display = 'block';
                    dashboardContent.style.display = 'none';
                }
                showPanel('dashboard');
            } else if (tab === 'profile') {
                updateProfilePanelData();
                showPanel('profile');
            } else if (tab === 'home') {
                showPanel('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // ==================== PROFILE PANEL DATA ====================
    function updateProfilePanelData() {
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileEmail').textContent = userData.email;
        document.getElementById('profileLevel').textContent = userData.level;
        document.getElementById('profileProgress').textContent = userData.progress + '%';
        document.getElementById('profileRank').textContent = userData.rank;
        document.getElementById('profileAvatar').textContent = userData.name.charAt(0).toUpperCase();
    }

    // Profile action buttons
    document.getElementById('profileEditBtn').addEventListener('click', () => showToast(t('editProfileSoon')));
    document.getElementById('profileLogoutBtn').addEventListener('click', () => {
        showToast(t('logoutDemo'));
        showPanel('home');
    });

    // ==================== PROGRESS BAR & LEVEL ====================
    function setProgress(percentage) {
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', percentage);
        const markers = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const index = Math.min(Math.floor(percentage / (100 / markers.length)), markers.length - 1);
        cefrMarkers.forEach((m, i) => m.classList.toggle('highlight', i === index));
        if (userProgressText) userProgressText.textContent = percentage + '%';
        userData.progress = percentage;
        updateProfilePanelData();
    }

    function updateLevelInfo(levelData) {
        if (levelIcon && levelData.icon) levelIcon.textContent = levelData.icon;
        if (levelHeading && levelData.heading) levelHeading.textContent = levelData.heading;
        if (levelDescription && levelData.description) levelDescription.textContent = levelData.description;
        if (userRank && levelData.rank) userRank.textContent = levelData.rank;
        if (levelData.progress !== undefined) setProgress(levelData.progress);
        userData.level = levelData.heading?.split(' – ')[0] || userData.level;
        userData.rank = levelData.rank || userData.rank;
        updateProfilePanelData();
    }

    setTimeout(() => {
        setProgress(10);
        updateLevelInfo({
            icon: '🌱',
            heading: 'Beginner – A1 Level',
            description: 'Can use simple words and phrases for everyday needs.',
            rank: 'Starter Learner',
            progress: 10
        });
    }, 300);

    // ==================== TEST COMPLETION ====================
    function completeTest() {
        testCompleted = true;
        dashboardTab.classList.remove('disabled');
        showToast(t('testCompleted'));
        // If dashboard panel is open, update it immediately
        if (dashboardPanel.classList.contains('active')) {
            dashboardLocked.style.display = 'none';
            dashboardContent.style.display = 'block';
        }
        setProgress(65);
        updateLevelInfo({
            icon: '🚀',
            heading: 'Intermediate – B1 Level',
            description: 'Can deal with most situations likely to arise while traveling in an English-speaking area.',
            rank: 'Active Learner',
            progress: 65
        });
    }

    // CTA button starts test and completes it (demo)
    startTestBtn.addEventListener('click', () => {
        if (startTestBtn.classList.contains('loading')) return;
        startTestBtn.classList.add('loading');
        setTimeout(() => {
            startTestBtn.classList.remove('loading');
            completeTest();
        }, 2000);
    });

    // ==================== INITIALIZATION ====================
    applyTranslations();
    console.log('✅ miTEST ready — panel navigation active');
    console.log('   Home: active | Dashboard:', testCompleted ? 'unlocked' : 'locked', '| Profile: panel');

    // Expose API
    window.miTEST = {
        setProgress,
        updateLevelInfo,
        setGuestName(name) {
            userData.name = name;
            if (guestNameEl) guestNameEl.textContent = name;
            updateProfilePanelData();
        },
        updateGoalLevel(levelCode, levelName) {
            if (goalLevelValue) goalLevelValue.textContent = levelCode + ' • ' + levelName;
            if (goalLevelName) goalLevelName.textContent = levelName + ' (' + levelCode + ')';
        },
        showToast,
        setLanguage(lang) {
            if (i18n[lang]) {
                currentLang = lang;
                document.querySelector('.lang-label').textContent = lang.toUpperCase();
                langOptions.forEach(o => o.classList.toggle('active', o.getAttribute('data-lang') === lang));
                applyTranslations();
            }
        },
        getLanguage: () => currentLang,
        getProgress: () => parseInt(progressBar.style.width) || 0,
        getTestCompleted: () => testCompleted,
        setTestCompleted(val) {
            testCompleted = val;
            if (val) dashboardTab.classList.remove('disabled');
            else dashboardTab.classList.add('disabled');
        },
        getUserData: () => ({ ...userData }),
    };
})();