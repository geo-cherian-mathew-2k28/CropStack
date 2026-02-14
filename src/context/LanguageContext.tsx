'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te' | 'ml' | 'ta' | 'kn';

const translations: any = {
    en: {
        // Common
        app_name: 'CropStack',
        search_placeholder: 'Search resources, lots, or nodes...',
        back_to: 'Back to',
        loading: 'Processing...',
        logout: 'Sign Out',
        settings: 'Settings',
        notifications: 'Notifications',
        roles: {
            buyer: 'Buyer Node',
            seller: 'Seller Node',
            organizer: 'Organizer Node'
        },
        // Sidebar
        dashboard: 'Analytics',
        catalog: 'Storage Exchange',
        orders: 'Active Stock',
        products: 'My Inventory',
        inventory: 'Add Stock',
        summary: 'Unit Summary',
        warehouse_queue: 'Audit Queue',
        pickups_pending: 'Logistics',
        // Dashboard
        welcome: 'Welcome back',
        stats: {
            active_orders: 'Active Pre-Orders',
            reservations: 'Stock Holds',
            completed: 'Volume Finalized',
            savings: 'Market Savings',
            pending_payments: 'Escrow Volume',
            available_balance: 'Withdrawable',
            monthly_sales: 'Monthly Yield',
            today_volume: 'Daily Flow'
        },
        market_trends: 'Live Market Trends',
        recent_activity: 'Recent Activity',
        view_all: 'View All',
        // Catalog
        buy: 'Secure Allocation',
        spot: 'Spot Market',
        futures: 'Futures',
        verified: 'Certified',
        available_qty: 'Available',
        price_per: 'per',
        unit_q: 'q',
        // Landing
        hero_title: 'Digital Warehouse Infrastructure',
        hero_subtitle: 'Secure institutional storage for India\'s bulk crop supply chain.',
        cta_start: 'Get Started',
        cta_login: 'Market Access',
        // UI Fixes
        action_finalize: 'Finalize Audit',
        action_reserve: 'INITIATE ALLOCATION',
        action_publish: 'PUBLISH LISTING',
        currency_symbol: '₹'
    },
    hi: {
        app_name: 'क्रॉपस्टैक',
        search_placeholder: 'संसाधन, लॉट या नोड्स खोजें...',
        back_to: 'वापस जाएं',
        loading: 'प्रसंस्करण...',
        logout: 'साइन आउट',
        settings: 'सेटिंग्स',
        notifications: 'सूचनाएं',
        roles: {
            buyer: 'खरीदार नोड',
            seller: 'विक्रेता नोड',
            organizer: 'आयोजक नोड'
        },
        dashboard: 'विश्लेषिकी',
        catalog: 'भंडारण विनिमय',
        orders: 'सक्रिय स्टॉक',
        products: 'मेरी इन्वेंट्री',
        inventory: 'स्टॉक जोड़ें',
        summary: 'इकाई सारांश',
        warehouse_queue: 'ऑडिट कतार',
        pickups_pending: 'रसद',
        welcome: 'स्वागत है',
        stats: {
            active_orders: 'सक्रिय ऑर्डर',
            reservations: 'स्टॉक होल्ड',
            completed: 'कुल मात्रा',
            savings: 'बाजार बचत',
            pending_payments: 'एस्क्रो वॉल्यूम',
            available_balance: 'निकासी योग्य',
            monthly_sales: 'मासिक उपज',
            today_volume: 'दैनिक प्रवाह'
        },
        market_trends: 'लाइव बाजार रुझान',
        recent_activity: 'हाल की गतिविधि',
        view_all: 'सभी देखें',
        buy: 'आवंटन सुरक्षित करें',
        spot: 'हाजिर बाजार',
        futures: 'वायदा',
        verified: 'प्रमाणित',
        available_qty: 'उपलब्ध',
        price_per: 'प्रति',
        unit_q: 'कुंतल',
        hero_title: 'डिजिटल वेयरहाउस इन्फ्रास्ट्रक्चर',
        hero_subtitle: 'भारत की थोक फसल आपूर्ति श्रृंखला के लिए सुरक्षित संस्थागत भंडारण।',
        cta_start: 'शुरू करें',
        cta_login: 'बाजार पहुंच',
        action_finalize: 'ऑडिट पूरा करें',
        action_reserve: 'आवंटन शुरू करें',
        action_publish: 'लिस्टिंग प्रकाशित करें',
        currency_symbol: '₹'
    },
    ml: {
        app_name: 'ക്രോപ്പ്സ്റ്റാക്ക്',
        search_placeholder: 'റിസോഴ്സുകൾ അല്ലെങ്കിൽ നോഡുകൾ തിരയുക...',
        back_to: 'തിരികെ',
        loading: 'പ്രോസസ്സിംഗ്...',
        logout: 'പുറത്തുകടക്കുക',
        settings: 'ക്രമീകരണങ്ങൾ',
        notifications: 'അറിയിപ്പുകൾ',
        roles: {
            buyer: 'ബയർ നോഡ്',
            seller: 'സെല്ലർ നോഡ്',
            organizer: 'ഓർഗനൈസർ നോഡ്'
        },
        dashboard: 'വിശകലനം',
        catalog: 'സംഭരണ വിനിമയം',
        orders: 'സജീവ സ്റ്റോക്ക്',
        products: 'ഇൻവെന്ററി',
        inventory: 'സ്റ്റോക്ക് ചേർക്കുക',
        summary: 'സംഗ്രഹം',
        warehouse_queue: 'ഓഡിറ്റ് ക്യൂ',
        pickups_pending: 'ലോജിസ്റ്റിക്സ്',
        welcome: 'സ്വാഗതം',
        stats: {
            active_orders: 'സജീവ ഓർഡറുകൾ',
            reservations: 'സ്റ്റോക്ക് ഹോൾഡ്',
            completed: 'പൂർത്തിയായവ',
            savings: 'ലാഭം',
            pending_payments: 'എസ്ക്രോ വോളിയം',
            available_balance: 'പിൻവലിക്കാവുന്നത്',
            monthly_sales: 'പ്രതിമാസ ആദായം',
            today_volume: 'പ്രതിദിന ഒഴുക്ക്'
        },
        market_trends: 'വിപണി പ്രവണതകൾ',
        recent_activity: 'സമീപകാല പ്രവർത്തനങ്ങൾ',
        view_all: 'എല്ലാം കാണുക',
        buy: 'അലോക്കേഷൻ ഉറപ്പാക്കുക',
        spot: 'സ്പോട്ട് മാർക്കറ്റ്',
        futures: 'ഫ്യൂച്ചേഴ്സ്',
        verified: 'സർട്ടിഫൈഡ്',
        available_qty: 'ലഭ്യം',
        price_per: 'വീതം',
        unit_q: 'ക്വിന്റൽ',
        hero_title: 'ഡിജിറ്റൽ വെയർഹൗസ് ഇൻഫ്രാസ്ട്രക്ചർ',
        hero_subtitle: 'ഇന്ത്യയുടെ ബൾക്ക് ക്രോപ്പ് സപ്ലൈ ചെയിനിനായി സുരക്ഷിത സംഭരണം.',
        cta_start: 'ആരംഭിക്കുക',
        cta_login: 'വിപണി പ്രവേശനം',
        action_finalize: 'ഓഡിറ്റ് പൂർത്തിയാക്കുക',
        action_reserve: 'അലോക്കേഷൻ തുടങ്ങുക',
        action_publish: 'ലിസ്റ്റിംഗ് പബ്ലിഷ് ചെയ്യുക',
        currency_symbol: '₹'
    },
    te: {
        app_name: 'క్రాప్‌స్టాక్',
        search_placeholder: 'వనరులు లేదా నోడ్‌లను శోధించండి...',
        back_to: 'తిరిగి',
        loading: 'ప్రాసెసింగ్...',
        logout: 'సైన్ అవుట్',
        settings: 'సెట్టింగ్లు',
        notifications: 'నోటిఫికేషన్లు',
        roles: {
            buyer: 'బయర్ నోడ్',
            seller: 'సెల్లర్ నోడ్',
            organizer: 'ఆర్గనైజర్ నోడ్'
        },
        dashboard: 'విశ్లేషణ',
        catalog: 'నిల్వ ఎక్స్ఛేంజ్',
        orders: 'యాక్టివ్ స్టాక్',
        products: 'ఇన్వెంటరీ',
        inventory: 'స్టాక్ జోడించు',
        summary: 'సారాంశం',
        warehouse_queue: 'ఆడిట్ క్యూ',
        pickups_pending: 'లాజిస్టిక్స్',
        welcome: 'స్వాగతం',
        stats: {
            active_orders: 'యాక్టివ్ ఆర్డర్లు',
            reservations: 'స్టాక్ హోల్డ్',
            completed: 'పూర్తయినవి',
            savings: 'పొదుపు',
            pending_payments: 'ఎస్క్రో వాల్యూమ్',
            available_balance: 'విత్‌డ్రా చేయదగినది',
            monthly_sales: 'నెలవారీ దిగుబడి',
            today_volume: 'రోజువారీ ప్రవాహం'
        },
        market_trends: 'మార్కెట్ ట్రెండ్స్',
        recent_activity: 'ఇటీవలి కార్యకలాపాలు',
        view_all: 'అన్నీ చూడండి',
        buy: 'కేటాయింపును భద్రపరచండి',
        spot: 'స్పాట్ మార్కెట్',
        futures: 'ఫ్యూచర్స్',
        verified: 'సర్టిఫైడ్',
        available_qty: 'అందుబాటులో ఉంది',
        price_per: 'ప్రతి',
        unit_q: 'క్వింటాల్',
        hero_title: 'డిజిటల్ వేర్‌హౌస్ ఇన్ఫ్రాస్ట్రక్చర్',
        hero_subtitle: 'బల్క్ క్రాప్ సరఫరా గొలుసు కోసం సురక్షిత నిల్వ.',
        cta_start: 'ప్రారంభించండి',
        cta_login: 'మార్కెట్ యాక్సెస్',
        action_finalize: 'ఆడిట్ పూర్తి చేయండి',
        action_reserve: 'కేటాయింపును ప్రారంభించండి',
        action_publish: 'లిస్టింగ్‌ను ప్రచురించండి',
        currency_symbol: '₹'
    },
    ta: {
        app_name: 'க்ராப்ஸ்டாக்',
        search_placeholder: 'தளங்களை தேடுக...',
        back_to: 'பின்னால்',
        loading: 'செயலாக்கப்படுகின்றன...',
        logout: 'வெளியேறு',
        settings: 'அமைப்புகள்',
        notifications: 'அறிவிப்புகள்',
        roles: {
            buyer: 'வாங்குபவர் நோட்',
            seller: 'விற்பனையாளர் நோட்',
            organizer: 'ஒருங்கிணைப்பாளர் நோட்'
        },
        dashboard: 'பகுப்பாய்வு',
        catalog: 'சேமிப்பு பரிமாற்றம்',
        orders: 'இருப்பு',
        products: 'பட்டியல்',
        inventory: 'இருப்பு சேர்க்க',
        summary: 'சுருக்கம்',
        warehouse_queue: 'ஆய்வு வரிசை',
        pickups_pending: 'தளவாடங்கள்',
        welcome: 'வரவேற்கிறோம்',
        stats: {
            active_orders: 'செயலில் உள்ள ஆர்டர்கள்',
            reservations: 'இருப்பு வைப்பு',
            completed: 'முடிந்தவை',
            savings: 'சேமிப்பு',
            pending_payments: 'எஸ்க்ரோ அளவு',
            available_balance: 'எடுக்கக்கூடியது',
            monthly_sales: 'மாதாந்திர விளைச்சல்',
            today_volume: 'தினசரி ஓட்டம்'
        },
        market_trends: 'சந்தை போக்குகள்',
        recent_activity: 'சமீபத்திய நடவடிக்கைகள்',
        view_all: 'அனைத்தையும் பார்',
        buy: 'ஒதுக்கீட்டை உறுதி செய்',
        spot: 'உடனடி சந்தை',
        futures: 'எதிர்கால சந்தை',
        verified: 'சான்றளிக்கப்பட்டது',
        available_qty: 'கிடைக்கக்கூடியது',
        price_per: 'ஒன்றுக்கு',
        unit_q: 'குவிண்டால்',
        hero_title: 'டிஜితல் கிடங்கு உள்கட்டமைப்பு',
        hero_subtitle: 'மொத்த பயிர் விநியோகச் சங்கிலிக்கான பாதுகாப்பான சேமிப்பு.',
        cta_start: 'தொடங்கு',
        cta_login: 'சந்தை அணுகல்',
        action_finalize: 'ஆய்வை முடி',
        action_reserve: 'ஒதுக்கீட்டைத் தொடங்கு',
        action_publish: 'பதிவேற்று',
        currency_symbol: '₹'
    },
    kn: {
        app_name: 'ಕ್ರಾಪ್‌ಸ್ಟಾಕ್',
        search_placeholder: 'ಹುಡುಕಿ...',
        back_to: 'ಹಿಂದಕ್ಕೆ',
        loading: 'ತೆಗೆದುಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...',
        logout: 'ಸೈನ್ ಔಟ್',
        settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        notifications: 'ಅಧಿಸೂಚನೆಗಳು',
        roles: {
            buyer: 'ಖರೀದಿದಾರ ನೋಡ್',
            seller: 'ಮಾರಾಟಗಾರ ನೋಡ್',
            organizer: 'ಸಂಘಟಕ ನೋಡ್'
        },
        dashboard: 'ವಿಶ್ಲೇಷಣೆ',
        catalog: 'ದಾಸ್ತಾನು ವಿನಿಮయ',
        orders: 'ಸಕ್ರಿಯ ಸ್ಟಾಕ್',
        products: 'ದಾಸ್ತಾನು ಪಟ್ಟಿ',
        inventory: 'ಸ್ಟಾಕ್ ಸೇರಿಸಿ',
        summary: 'ಸಾರಾಂಶ',
        warehouse_queue: 'ಆಡಿಟ್ ಸರತಿ ಸಾಲು',
        pickups_pending: 'ಸಾಗಾಣಿಕೆ',
        welcome: 'ಸ್ವಾಗತ',
        stats: {
            active_orders: 'ಸಕ್ರಿಯ ಆದೇಶಗಳು',
            reservations: 'ತಡೆಹಿಡಿದ ಸ್ಟಾಕ್',
            completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
            savings: 'ಉಳಿತಾಯ',
            pending_payments: 'ಎಸ್ಕ್ರೋ ಮೊತ್ತ',
            available_balance: 'ಹಿಂಪಡೆಯಬಹುದಾದ',
            monthly_sales: 'ಮಾಸಿಕ ಇಳುವರಿ',
            today_volume: 'ದೈನಂದಿನ ಹರಿವು'
        },
        market_trends: 'ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು',
        recent_activity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು',
        view_all: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
        buy: 'ಹಂಚಿಕೆಯನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಿ',
        spot: 'ತಕ್ಷಣದ ಮಾರುಕಟ್ಟೆ',
        futures: 'ಭವಿష్యತ್ ಮಾರುಕಟ್ಟೆ',
        verified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
        available_qty: 'ಲಭ್ಯವಿದೆ',
        price_per: 'ಪ್ರತಿ',
        unit_q: 'ಕ್ವಿಂಟಲ್',
        hero_title: 'ಡಿಜಿಟಲ್ ವೇರ್ಹೌಸ್ ಮೂಲಸೌಕರ್ಯ',
        hero_subtitle: 'ಭಾರತದ ಸಗಟು ಬೆಳೆ ಸರಬರಾಜು ಸರಪಳಿಗಾಗಿ ಸುರಕ್ಷಿತ ದಾಸ್ತಾನು.',
        cta_start: 'ಪ್ರಾರಂಭಿಸಿ',
        cta_login: 'ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶ',
        action_finalize: 'ಆಡಿಟ್ ಪೂರ್ಣಗೊಳಿಸಿ',
        action_reserve: 'ಹಂಚಿಕೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
        action_publish: 'ಪ್ರಕಟಿಸಿ',
        currency_symbol: '₹'
    }
};

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('cropstack_lang') as Language;
        if (savedLang) setLanguage(savedLang);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('cropstack_lang', lang);
    };

    const t = (key: string) => {
        const keys = key.split('.');
        let val = translations[language];
        for (const k of keys) {
            val = val?.[k];
        }
        if (val) return val;

        let fallback = translations['en'];
        for (const k of keys) {
            fallback = fallback?.[k];
        }
        return fallback || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
