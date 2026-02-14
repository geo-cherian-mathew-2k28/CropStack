'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te' | 'ml' | 'ta' | 'kn';

const translations: any = {
    en: {
        // Common
        app_name: 'CropStack',
        search_placeholder: 'Search crops, orders, or sellers...',
        back_to: 'Back to',
        loading: 'Loading...',
        logout: 'Sign Out',
        settings: 'Settings',
        notifications: 'Notifications',
        roles: {
            buyer: 'Buyer',
            seller: 'Seller',
            organizer: 'Manager'
        },
        // Sidebar
        dashboard: 'Dashboard',
        catalog: 'Buy Crops',
        orders: 'My Orders',
        products: 'My Crops',
        inventory: 'Add New Crop',
        summary: 'Stock Summary',
        warehouse_queue: 'Pending Pickups',
        pickups_pending: 'Delivery',
        // Dashboard
        welcome: 'Welcome back',
        stats: {
            active_orders: 'Active Orders',
            reservations: 'Reserved',
            completed: 'Completed',
            savings: 'Total Savings',
            pending_payments: 'Pending Payments',
            available_balance: 'Available Balance',
            monthly_sales: 'Monthly Sales',
            today_volume: "Today's Sales"
        },
        market_trends: 'Market Prices',
        recent_activity: 'Recent Activity',
        view_all: 'View All',
        // Catalog
        buy: 'Buy Now',
        spot: 'Buy Now',
        futures: 'Pre-Order',
        verified: 'Verified',
        available_qty: 'Available',
        price_per: 'per',
        unit_q: 'quintal',
        // Landing
        hero_title: 'Buy & Sell Crops Online',
        hero_subtitle: 'A trusted platform for Indian farmers to sell crops directly to buyers.',
        cta_start: 'Get Started',
        cta_login: 'Sign In',
        // UI Fixes
        action_finalize: 'Complete Pickup',
        action_reserve: 'Place Order',
        action_publish: 'Add to Shop',
        currency_symbol: '₹'
    },
    hi: {
        app_name: 'क्रॉपस्टैक',
        search_placeholder: 'फसल, ऑर्डर या विक्रेता खोजें...',
        back_to: 'वापस जाएं',
        loading: 'लोड हो रहा है...',
        logout: 'साइन आउट',
        settings: 'सेटिंग्स',
        notifications: 'सूचनाएं',
        roles: {
            buyer: 'खरीदार',
            seller: 'विक्रेता',
            organizer: 'प्रबंधक'
        },
        dashboard: 'डैशबोर्ड',
        catalog: 'फसल खरीदें',
        orders: 'मेरे ऑर्डर',
        products: 'मेरी फसलें',
        inventory: 'नई फसल जोड़ें',
        summary: 'स्टॉक सारांश',
        warehouse_queue: 'पिकअप लंबित',
        pickups_pending: 'डिलीवरी',
        welcome: 'स्वागत है',
        stats: {
            active_orders: 'चालू ऑर्डर',
            reservations: 'आरक्षित',
            completed: 'पूरे हुए',
            savings: 'कुल बचत',
            pending_payments: 'लंबित भुगतान',
            available_balance: 'उपलब्ध शेष',
            monthly_sales: 'मासिक बिक्री',
            today_volume: 'आज की बिक्री'
        },
        market_trends: 'बाजार भाव',
        recent_activity: 'हाल की गतिविधि',
        view_all: 'सभी देखें',
        buy: 'अभी खरीदें',
        spot: 'अभी खरीदें',
        futures: 'पूर्व-ऑर्डर',
        verified: 'सत्यापित',
        available_qty: 'उपलब्ध',
        price_per: 'प्रति',
        unit_q: 'कुंतल',
        hero_title: 'फसलें ऑनलाइन खरीदें और बेचें',
        hero_subtitle: 'किसानों के लिए सीधे खरीदारों को फसल बेचने का भरोसेमंद मंच।',
        cta_start: 'शुरू करें',
        cta_login: 'साइन इन',
        action_finalize: 'पिकअप पूरा करें',
        action_reserve: 'ऑर्डर करें',
        action_publish: 'दुकान में जोड़ें',
        currency_symbol: '₹'
    },
    ml: {
        app_name: 'ക്രോപ്പ്സ്റ്റാക്ക്',
        search_placeholder: 'വിളകൾ, ഓർഡറുകൾ അല്ലെങ്കിൽ വിൽപ്പനക്കാർ തിരയുക...',
        back_to: 'തിരികെ',
        loading: 'ലോഡ് ചെയ്യുന്നു...',
        logout: 'സൈൻ ഔട്ട്',
        settings: 'ക്രമീകരണങ്ങൾ',
        notifications: 'അറിയിപ്പുകൾ',
        roles: {
            buyer: 'വാങ്ങുന്നയാൾ',
            seller: 'വിൽപ്പനക്കാരൻ',
            organizer: 'മാനേജർ'
        },
        dashboard: 'ഡാഷ്ബോർഡ്',
        catalog: 'വിളകൾ വാങ്ങുക',
        orders: 'എന്റെ ഓർഡറുകൾ',
        products: 'എന്റെ വിളകൾ',
        inventory: 'പുതിയ വിള ചേർക്കുക',
        summary: 'സ്റ്റോക്ക് സംഗ്രഹം',
        warehouse_queue: 'പിക്കപ്പ് ബാക്കിയുള്ളവ',
        pickups_pending: 'ഡെലിവറി',
        welcome: 'സ്വാഗതം',
        stats: {
            active_orders: 'സജീവ ഓർഡറുകൾ',
            reservations: 'റിസർവ് ചെയ്തത്',
            completed: 'പൂർത്തിയായവ',
            savings: 'ആകെ ലാഭം',
            pending_payments: 'ബാക്കി പേയ്മെന്റുകൾ',
            available_balance: 'ലഭ്യമായ ബാലൻസ്',
            monthly_sales: 'മാസ വിൽപ്പന',
            today_volume: 'ഇന്നത്തെ വിൽപ്പന'
        },
        market_trends: 'വിപണി വില',
        recent_activity: 'സമീപകാല പ്രവർത്തനങ്ങൾ',
        view_all: 'എല്ലാം കാണുക',
        buy: 'ഇപ്പോൾ വാങ്ങുക',
        spot: 'ഇപ്പോൾ വാങ്ങുക',
        futures: 'പ്രീ-ഓർഡർ',
        verified: 'സ്ഥിരീകരിച്ചത്',
        available_qty: 'ലഭ്യം',
        price_per: 'വീതം',
        unit_q: 'ക്വിന്റൽ',
        hero_title: 'വിളകൾ ഓൺലൈൻ വിൽക്കുകയും വാങ്ങുകയും ചെയ്യുക',
        hero_subtitle: 'കർഷകർക്ക് വാങ്ങുന്നവരോട് നേരിട്ട് വിളകൾ വിൽക്കാനുള്ള വിശ്വസ്ത വേദി.',
        cta_start: 'ആരംഭിക്കുക',
        cta_login: 'സൈൻ ഇൻ',
        action_finalize: 'പിക്കപ്പ് പൂർത്തിയാക്കുക',
        action_reserve: 'ഓർഡർ ചെയ്യുക',
        action_publish: 'കടയിൽ ചേർക്കുക',
        currency_symbol: '₹'
    },
    te: {
        app_name: 'క్రాప్‌స్టాక్',
        search_placeholder: 'పంటలు, ఆర్డర్‌లు లేదా అమ్మకందారులను శోధించండి...',
        back_to: 'తిరిగి',
        loading: 'లోడ్ అవుతోంది...',
        logout: 'సైన్ అవుట్',
        settings: 'సెట్టింగ్లు',
        notifications: 'నోటిఫికేషన్లు',
        roles: {
            buyer: 'కొనుగోలుదారు',
            seller: 'అమ్మకందారు',
            organizer: 'మేనేజర్'
        },
        dashboard: 'డాష్‌బోర్డ్',
        catalog: 'పంటలు కొనండి',
        orders: 'నా ఆర్డర్‌లు',
        products: 'నా పంటలు',
        inventory: 'కొత్త పంట జోడించు',
        summary: 'స్టాక్ సారాంశం',
        warehouse_queue: 'పిక్‌అప్ పెండింగ్',
        pickups_pending: 'డెలివరీ',
        welcome: 'స్వాగతం',
        stats: {
            active_orders: 'యాక్టివ్ ఆర్డర్‌లు',
            reservations: 'రిజర్వ్ చేయబడినవి',
            completed: 'పూర్తయినవి',
            savings: 'మొత్తం పొదుపు',
            pending_payments: 'పెండింగ్ చెల్లింపులు',
            available_balance: 'అందుబాటులో ఉన్న బ్యాలెన్స్',
            monthly_sales: 'నెలవారీ అమ్మకాలు',
            today_volume: 'ఈ రోజు అమ్మకాలు'
        },
        market_trends: 'మార్కెట్ ధరలు',
        recent_activity: 'ఇటీవలి కార్యకలాపాలు',
        view_all: 'అన్నీ చూడండి',
        buy: 'ఇప్పుడు కొనండి',
        spot: 'ఇప్పుడు కొనండి',
        futures: 'ముందస్తు ఆర్డర్',
        verified: 'ధృవీకరించబడింది',
        available_qty: 'అందుబాటులో ఉంది',
        price_per: 'ప్రతి',
        unit_q: 'క్వింటాల్',
        hero_title: 'పంటలను ఆన్‌లైన్‌లో కొనండి & అమ్మండి',
        hero_subtitle: 'రైతులు నేరుగా కొనుగోలుదారులకు పంటలు అమ్మడానికి నమ్మకమైన వేదిక.',
        cta_start: 'ప్రారంభించండి',
        cta_login: 'సైన్ ఇన్',
        action_finalize: 'పిక్‌అప్ పూర్తి చేయండి',
        action_reserve: 'ఆర్డర్ ఇవ్వండి',
        action_publish: 'షాప్‌లో చేర్చండి',
        currency_symbol: '₹'
    },
    ta: {
        app_name: 'க்ராப்ஸ்டாக்',
        search_placeholder: 'பயிர்கள், ஆர்டர்கள் அல்லது விற்பனையாளர்களை தேடுங்கள்...',
        back_to: 'பின்னால்',
        loading: 'ஏற்றுகிறது...',
        logout: 'வெளியேறு',
        settings: 'அமைப்புகள்',
        notifications: 'அறிவிப்புகள்',
        roles: {
            buyer: 'வாங்குபவர்',
            seller: 'விற்பனையாளர்',
            organizer: 'மேலாளர்'
        },
        dashboard: 'டாஷ்போர்ட்',
        catalog: 'பயிர்களை வாங்கு',
        orders: 'எனது ஆர்டர்கள்',
        products: 'எனது பயிர்கள்',
        inventory: 'புதிய பயிர் சேர்',
        summary: 'இருப்பு சுருக்கம்',
        warehouse_queue: 'பிக்அப் நிலுவை',
        pickups_pending: 'விநியோகம்',
        welcome: 'வரவேற்கிறோம்',
        stats: {
            active_orders: 'செயலில் உள்ள ஆர்டர்கள்',
            reservations: 'முன்பதிவு செய்யப்பட்டது',
            completed: 'முடிந்தவை',
            savings: 'மொத்த சேமிப்பு',
            pending_payments: 'நிலுவை பணம்',
            available_balance: 'கிடைக்கும் இருப்பு',
            monthly_sales: 'மாத விற்பனை',
            today_volume: 'இன்றைய விற்பனை'
        },
        market_trends: 'சந்தை விலைகள்',
        recent_activity: 'சமீபத்திய நடவடிக்கைகள்',
        view_all: 'அனைத்தையும் பார்',
        buy: 'இப்போது வாங்கு',
        spot: 'இப்போது வாங்கு',
        futures: 'முன்கூட்டியே ஆர்டர்',
        verified: 'சரிபார்க்கப்பட்டது',
        available_qty: 'கிடைக்கக்கூடியது',
        price_per: 'ஒன்றுக்கு',
        unit_q: 'குவிண்டால்',
        hero_title: 'பயிர்களை ஆன்லைனில் வாங்கவும் விற்கவும்',
        hero_subtitle: 'விவசாயிகள் நேரடியாக வாங்குபவர்களுக்கு பயிர்களை விற்க நம்பகமான மேடை.',
        cta_start: 'தொடங்கு',
        cta_login: 'உள்நுழை',
        action_finalize: 'பிக்அப் முடி',
        action_reserve: 'ஆர்டர் செய்',
        action_publish: 'கடையில் சேர்',
        currency_symbol: '₹'
    },
    kn: {
        app_name: 'ಕ್ರಾಪ್‌ಸ್ಟಾಕ್',
        search_placeholder: 'ಬೆಳೆಗಳು, ಆದೇಶಗಳು ಅಥವಾ ಮಾರಾಟಗಾರರನ್ನು ಹುಡುಕಿ...',
        back_to: 'ಹಿಂದಕ್ಕೆ',
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        logout: 'ಸೈನ್ ಔಟ್',
        settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        notifications: 'ಅಧಿಸೂಚನೆಗಳು',
        roles: {
            buyer: 'ಖರೀದಿದಾರ',
            seller: 'ಮಾರಾಟಗಾರ',
            organizer: 'ಮ್ಯಾನೇಜರ್'
        },
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        catalog: 'ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸಿ',
        orders: 'ನನ್ನ ಆದೇಶಗಳು',
        products: 'ನನ್ನ ಬೆಳೆಗಳು',
        inventory: 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ',
        summary: 'ಸ್ಟಾಕ್ ಸಾರಾಂಶ',
        warehouse_queue: 'ಪಿಕಪ್ ಬಾಕಿ',
        pickups_pending: 'ವಿತರಣೆ',
        welcome: 'ಸ್ವಾಗತ',
        stats: {
            active_orders: 'ಸಕ್ರಿಯ ಆದೇಶಗಳು',
            reservations: 'ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
            completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
            savings: 'ಒಟ್ಟು ಉಳಿತಾಯ',
            pending_payments: 'ಬಾಕಿ ಪಾವತಿಗಳು',
            available_balance: 'ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್',
            monthly_sales: 'ಮಾಸಿಕ ಮಾರಾಟ',
            today_volume: 'ಇಂದಿನ ಮಾರಾಟ'
        },
        market_trends: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
        recent_activity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು',
        view_all: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
        buy: 'ಈಗ ಖರೀದಿಸಿ',
        spot: 'ಈಗ ಖರೀದಿಸಿ',
        futures: 'ಪೂರ್ವ-ಆದೇಶ',
        verified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
        available_qty: 'ಲಭ್ಯವಿದೆ',
        price_per: 'ಪ್ರತಿ',
        unit_q: 'ಕ್ವಿಂಟಲ್',
        hero_title: 'ಬೆಳೆಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ ಮತ್ತು ಮಾರಾಟ ಮಾಡಿ',
        hero_subtitle: 'ರೈತರು ನೇರವಾಗಿ ಖರೀದಿದಾರರಿಗೆ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಲು ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆ.',
        cta_start: 'ಪ್ರಾರಂಭಿಸಿ',
        cta_login: 'ಸೈನ್ ಇನ್',
        action_finalize: 'ಪಿಕಪ್ ಪೂರ್ಣಗೊಳಿಸಿ',
        action_reserve: 'ಆದೇಶ ನೀಡಿ',
        action_publish: 'ಅಂಗಡಿಗೆ ಸೇರಿಸಿ',
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
