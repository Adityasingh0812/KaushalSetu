import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Layout
    "nav.dashboard": "Dashboard",
    "nav.candidates": "Candidates",
    "nav.analytics": "Analytics",
    "nav.reports": "Reports",
    "nav.profile": "Profile",
    "nav.training": "Training",
    "nav.employment": "Employment",
    "nav.followups": "Follow-ups",
    "nav.interventions": "Interventions",
    "nav.jobs": "Jobs",
    "nav.employers": "Employers",
    "menu.title": "Menu",
    "app.name": "KaushalSetu",
    "button.logout": "Logout",
    "button.login": "Sign in",
    "button.register": "Sign up",
    "button.create": "Create Programme",
    "button.filter": "Filter",
    "button.reset": "Reset",
    "button.clear": "Clear All Filters",
    "button.retry": "Retry",
    "button.save": "Update Profile",
    "button.saving": "Saving...",
    "button.view": "View Details →",
    "button.view_profile": "View Profile →",
    "button.previous": "Previous",
    "button.next": "Next",
    "label.per_page": "Per page:",
    "label.search": "Search",
    "label.skill": "Skill/Course Area",
    "label.location": "Location",
    "label.page": "Page {current} of {total}",

    // Dashboard
    "dashboard.title": "Dashboard Overview",
    "dashboard.total_candidates": "Total Candidates",
    "dashboard.verified_employment": "Verified Employment",
    "dashboard.active_interventions": "Active Interventions",
    "dashboard.followups_completed": "Follow-ups Completed",
    "dashboard.loading": "Loading…",
    "dashboard.error": "Failed to load data",
    "dashboard.unauthorized": "Unauthorized",
    "dashboard.access_restricted": "Access restricted",
    "dashboard.data_not_available": "Data not available",
    "dashboard.employment_trends": "Employment Trends",
    "dashboard.employment_trends_desc": "This chart shows verified employment trends over time.",
    "dashboard.intervention_effectiveness": "Intervention Effectiveness",
    "dashboard.intervention_desc": "This chart shows the effectiveness of different intervention types.",
    "dashboard.chart_placeholder": "[Employment Trend Chart - Synthetic Data for Demo]",
    "dashboard.chart_note": "Note: This chart uses clearly labeled synthetic data for demonstration purposes only.",

    // Profile
    "profile.title": "My Profile",
    "profile.date_of_birth": "Date of Birth",
    "profile.gender": "Gender",
    "profile.education": "Education Background",
    "profile.skills": "Skills (comma-separated)",
    "profile.preferred_location": "Preferred Location",
    "profile.current_saved": "Current Saved Profile",
    "profile.update_success": "Profile updated successfully!",
    "profile.update_error": "Failed to update profile",
    "profile.load_error": "Failed to load profile",
    "profile.loading": "Loading profile...",
    "profile.gender_placeholder": "e.g. Female, Male, Non-binary, Prefer not to say",
    "profile.education_placeholder": "e.g. Higher Secondary, Diploma, B.Tech",
    "profile.skills_placeholder": "e.g. Python, SQL, Web Development",
    "profile.location_placeholder": "e.g. Jaipur, Delhi NCR, Remote",
    "profile.not_set": "Not set",
    "profile.logout": "Logout",

    // Training
    "training.title": "Training Programmes",
    "training.subtitle": "Browse and manage training programmes offered by institutes.",
    "training.search_placeholder": "Programme name or provider...",
    "training.skill_placeholder": "e.g. Python, Electrical Work...",
    "training.provider": "Provider",
    "training.skill_course": "Skill/Course",
    "training.dates": "Dates",
    "training.status": "Status",
    "training.institute": "Institute",
    "training.action": "Action",
    "training.no_results": "No training programmes found",
    "training.no_results_filter": "No training programme matches the current filter criteria. Try adjusting or clearing your filters.",
    "training.no_results_empty": "No training programme records are currently available.",
    "training.loading": "Loading training programmes...",
    "training.showing": "Showing {start} to {end} of {total} training programmes",
    "training.status.draft": "Draft",
    "training.status.active": "Active",
    "training.status.completed": "Completed",
    "training.status.cancelled": "Cancelled",
    "training.unassigned": "Unassigned",
    "training.not_specified": "Not specified",
    "training.synthetic_data_badge": "Synthetic Demonstration Data",

    // Candidates
    "candidates.title": "Candidates Directory",
    "candidates.subtitle": "Browse and manage registered candidates, training profiles, and skill credentials.",
    "candidates.search_placeholder": "Name or email...",
    "candidates.skill_placeholder": "e.g. Python, Electrician...",
    "candidates.location_placeholder": "e.g. Jaipur, Delhi...",
    "candidates.candidate": "Candidate",
    "candidates.contact": "Contact",
    "candidates.institute": "Institute",
    "candidates.skills": "Skills",
    "candidates.preferred_location": "Location",
    "candidates.no_results": "No candidates found",
    "candidates.no_results_filter": "No candidate matches the current filter criteria. Try adjusting or clearing your filters.",
    "candidates.no_results_empty": "No candidate records are currently available.",
    "candidates.loading": "Loading candidates directory...",
    "candidates.showing": "Showing {start} to {end} of {total} candidates",
    "candidates.none_listed": "None listed",
    "candidates.access_restricted": "Access restricted. Only government administrators and institute officers are authorized to view candidate records.",

    // Auth
    "auth.sign_in": "Sign in to KaushalSetu",
    "auth.use_account": "Use your institute account to access the system",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.remember_me": "Remember me",
    "auth.forgot_password": "Forgot password?",
    "auth.signing_in": "Signing in...",
    "auth.no_account": "Don't have an account? ",
    "auth.create_account": "Create your KaushalSetu account",
    "auth.register_as": "Register as a trainee or employer to access the system",
    "auth.full_name": "Full Name",
    "auth.phone": "Phone (optional)",
    "auth.confirm_password": "Confirm Password",
    "auth.creating_account": "Creating account...",
    "auth.already_have_account": "Already have an account? ",
    "auth.terms": "By creating an account, you agree to our Terms of Service and Privacy Policy.",
    "auth.password_min": "Password must be at least 8 characters",
    "auth.passwords_mismatch": "Passwords do not match",
    "auth.invalid_email": "Please enter a valid email address",
    "auth.name_min": "Full name must be at least 2 characters",
    "auth.email_exists": "This email is already registered. Please use a different email or sign in.",
    "auth.validation_error": "Please check your input and try again.",
    "auth.server_error": "Server error. Please try again later.",
    "auth.registered_success": "Registered successfully! Please sign in.",

    // Coming Soon
    "coming_soon.title": "{module}Coming Soon",
    "coming_soon.desc": "This module is currently under development and will be available in a future update. Please check back later.",

    // Errors
    "error.loading": "Loading...",
    "error.unauthorized": "Unauthorized",
    "error.access_denied": "Access denied",
    "error.not_found": "Not found",
    "error.try_again": "Please try again later.",

    // Language
    "language.english": "EN",
    "language.hindi": "हिंदी",
  },
  hi: {
    // Navigation & Layout
    "nav.dashboard": "डैशबोर्ड",
    "nav.candidates": "उम्मीदवार",
    "nav.analytics": "विश्लेषण",
    "nav.reports": "रिपोर्ट",
    "nav.profile": "प्रोफाइल",
    "nav.training": "प्रशिक्षण",
    "nav.employment": "रोजगार",
    "nav.followups": "अनुवर्ती कार्रवाई",
    "nav.interventions": "हस्तक्षेप",
    "nav.jobs": "नौकरियां",
    "nav.employers": "नियोक्ता",
    "menu.title": "मेनू",
    "app.name": "कौशलसेतु",
    "button.logout": "लॉगआउट",
    "button.login": "साइन इन",
    "button.register": "साइन अप",
    "button.create": "कार्यक्रम बनाएं",
    "button.filter": "फ़िल्टर",
    "button.reset": "रीसेट",
    "button.clear": "सभी फ़िल्टर साफ़ करें",
    "button.retry": "पुनः प्रयास करें",
    "button.save": "प्रोफाइल अपडेट करें",
    "button.saving": "सेव हो रहा है...",
    "button.view": "विवरण देखें →",
    "button.view_profile": "प्रोफाइल देखें →",
    "button.previous": "पिछला",
    "button.next": "अगला",
    "label.per_page": "प्रति पृष्ठ:",
    "label.search": "खोजें",
    "label.skill": "कौशल/कोर्स क्षेत्र",
    "label.location": "स्थान",
    "label.page": "पृष्ठ {current} / {total}",

    // Dashboard
    "dashboard.title": "डैशबोर्ड अवलोकन",
    "dashboard.total_candidates": "कुल उम्मीदवार",
    "dashboard.verified_employment": "सत्यापित रोजगार",
    "dashboard.active_interventions": "सक्रिय हस्तक्षेप",
    "dashboard.followups_completed": "पूर्ण अनुवर्ती",
    "dashboard.loading": "लोड हो रहा है...",
    "dashboard.error": "डेटा लोड करने में विफल",
    "dashboard.unauthorized": "अनधिकृत",
    "dashboard.access_restricted": "पहुंच प्रतिबंधित",
    "dashboard.data_not_available": "डेटा उपलब्ध नहीं",
    "dashboard.employment_trends": "रोजगार रुझान",
    "dashboard.employment_trends_desc": "यह चार्ट समय के साथ सत्यापित रोजगार रुझान दिखाता है।",
    "dashboard.intervention_effectiveness": "हस्तक्षेप प्रभावशीलता",
    "dashboard.intervention_desc": "यह चार्ट विभिन्न हस्तक्षेप प्रकारों की प्रभावशीलता दिखाता है।",
    "dashboard.chart_placeholder": "[रोजगार रुझान चार्ट - डेमो के लिए सिंथेटिक डेटा]",
    "dashboard.chart_note": "नोट: यह चार्ट केवल प्रदर्शन उद्देश्यों के लिए स्पष्ट रूप से लेबल किए गए सिंथेटिक डेटा का उपयोग करता है।",

    // Profile
    "profile.title": "मेरा प्रोफाइल",
    "profile.date_of_birth": "जन्म तिथि",
    "profile.gender": "लिंग",
    "profile.education": "शैक्षिक पृष्ठभूमि",
    "profile.skills": "कौशल (कॉमा से अलग करें)",
    "profile.preferred_location": "पसंदीदा स्थान",
    "profile.current_saved": "वर्तमान सहेजा गया प्रोफाइल",
    "profile.update_success": "प्रोफाइल सफलतापूर्वक अपडेट हो गया!",
    "profile.update_error": "प्रोफाइल अपडेट करने में विफल",
    "profile.load_error": "प्रोफाइल लोड करने में विफल",
    "profile.loading": "प्रोफाइल लोड हो रहा है...",
    "profile.gender_placeholder": "जैसे: महिला, पुरुष, नॉन-बाइनरी, कहना पसंद नहीं",
    "profile.education_placeholder": "जैसे: उच्च माध्यमिक, डिप्लोमा, बी.टेक",
    "profile.skills_placeholder": "जैसे: पायथन, SQL, वेब डेवलपमेंट",
    "profile.location_placeholder": "जैसे: जयपुर, दिल्ली NCR, रिमोट",
    "profile.not_set": "सेट नहीं",
    "profile.logout": "लॉगआउट",

    // Training
    "training.title": "प्रशिक्षण कार्यक्रम",
    "training.subtitle": "संस्थानों द्वारा प्रस्तावित प्रशिक्षण कार्यक्रमों को ब्राउज़ और प्रबंधित करें।",
    "training.search_placeholder": "कार्यक्रम का नाम या प्रदाता...",
    "training.skill_placeholder": "जैसे: पायथन, इलेक्ट्रिकल कार्य...",
    "training.provider": "प्रदाता",
    "training.skill_course": "कौशल/कोर्स",
    "training.dates": "तिथियां",
    "training.status": "स्थिति",
    "training.institute": "संस्थान",
    "training.action": "कार्रवाई",
    "training.no_results": "कोई प्रशिक्षण कार्यक्रम नहीं मिला",
    "training.no_results_filter": "वर्तमान फ़िल्टर मानदंडों से कोई प्रशिक्षण कार्यक्रम मेल नहीं खाता। फ़िल्टर समायोजित या साफ़ करने का प्रयास करें।",
    "training.no_results_empty": "वर्तमान में कोई प्रशिक्षण कार्यक्रम रिकॉर्ड उपलब्ध नहीं हैं।",
    "training.loading": "प्रशिक्षण कार्यक्रम लोड हो रहे हैं...",
    "training.showing": "{start} से {end} तक {total} प्रशिक्षण कार्यक्रम दिखा रहा है",
    "training.status.draft": "मसौदा",
    "training.status.active": "सक्रिय",
    "training.status.completed": "पूर्ण",
    "training.status.cancelled": "रद्द",
    "training.unassigned": "असाइन नहीं",
    "training.not_specified": "निर्दिष्ट नहीं",
    "training.synthetic_data_badge": "सिंथेटिक प्रदर्शन डेटा",

    // Candidates
    "candidates.title": "उम्मीदवार निर्देशिका",
    "candidates.subtitle": "पंजीकृत उम्मीदवारों, प्रशिक्षण प्रोफाइल और कौशल प्रमाणपत्रों को ब्राउज़ और प्रबंधित करें।",
    "candidates.search_placeholder": "नाम या ईमेल...",
    "candidates.skill_placeholder": "जैसे: पायथन, इलेक्ट्रीशियन...",
    "candidates.location_placeholder": "जैसे: जयपुर, दिल्ली...",
    "candidates.candidate": "उम्मीदवार",
    "candidates.contact": "संपर्क",
    "candidates.institute": "संस्थान",
    "candidates.skills": "कौशल",
    "candidates.preferred_location": "स्थान",
    "candidates.no_results": "कोई उम्मीदवार नहीं मिला",
    "candidates.no_results_filter": "वर्तमान फ़िल्टर मानदंडों से कोई उम्मीदवार मेल नहीं खाता। फ़िल्टर समायोजित या साफ़ करने का प्रयास करें।",
    "candidates.no_results_empty": "वर्तमान में कोई उम्मीदवार रिकॉर्ड उपलब्ध नहीं हैं।",
    "candidates.loading": "उम्मीदवार निर्देशिका लोड हो रही है...",
    "candidates.showing": "{start} से {end} तक {total} उम्मीदवार दिखा रहा है",
    "candidates.none_listed": "कोई सूचीबद्ध नहीं",
    "candidates.access_restricted": "पहुंच प्रतिबंधित। केवल सरकारी प्रशासक और संस्थान अधिकारी उम्मीदवार रिकॉर्ड देखने के लिए अधिकृत हैं।",

    // Auth
    "auth.sign_in": "कौशलसेतु में साइन इन करें",
    "auth.use_account": "सिस्टम तक पहुंचने के लिए अपने संस्थान खाते का उपयोग करें",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.remember_me": "मुझे याद रखें",
    "auth.forgot_password": "पासवर्ड भूल गए?",
    "auth.signing_in": "साइन इन हो रहा है...",
    "auth.no_account": "खाता नहीं है? ",
    "auth.create_account": "अपना कौशलसेतु खाता बनाएं",
    "auth.register_as": "सिस्टम तक पहुंचने के लिए प्रशिक्षु या नियोक्ता के रूप में पंजीकरण करें",
    "auth.full_name": "पूरा नाम",
    "auth.phone": "फोन (वैकल्पिक)",
    "auth.confirm_password": "पासवर्ड की पुष्टि करें",
    "auth.creating_account": "खाता बनाया जा रहा है...",
    "auth.already_have_account": "पहले से खाता है? ",
    "auth.terms": "खाता बनाकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।",
    "auth.password_min": "पासवर्ड कम से कम 8 वर्णों का होना चाहिए",
    "auth.passwords_mismatch": "पासवर्ड मेल नहीं खाते",
    "auth.invalid_email": "कृपया एक वैध ईमेल पता दर्ज करें",
    "auth.name_min": "पूरा नाम कम से कम 2 वर्णों का होना चाहिए",
    "auth.email_exists": "यह ईमेल पहले से पंजीकृत है। कृपया एक अलग ईमेल का उपयोग करें या साइन इन करें।",
    "auth.validation_error": "कृपया अपना इनपुट जांचें और पुनः प्रयास करें।",
    "auth.server_error": "सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।",
    "auth.registered_success": "सफलतापूर्वक पंजीकृत! कृपया साइन इन करें।",

    // Coming Soon
    "coming_soon.title": "{module}जल्द आ रहा है",
    "coming_soon.desc": "यह मॉड्यूल वर्तमान में विकास के अधीन है और भविष्य के अपडेट में उपलब्ध होगा। कृपया बाद में वापस देखें।",

    // Errors
    "error.loading": "लोड हो रहा है...",
    "error.unauthorized": "अनधिकृत",
    "error.access_denied": "पहुंच अस्वीकृत",
    "error.not_found": "नहीं मिला",
    "error.try_again": "कृपया बाद में पुनः प्रयास करें।",

    // Language
    "language.english": "EN",
    "language.hindi": "हिंदी",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kaushalsetu-language");
      if (stored === "en" || stored === "hi") {
        return stored;
      }
    }
    return "en";
  });

  // Persist language changes to localStorage
  useEffect(() => {
    localStorage.setItem("kaushalsetu-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function with simple parameter substitution
  const t = (key: string, params?: Record<string, string | number>) => {
    const dict = translations[language];
    let translation = dict[key] || translations.en[key] || key;

    // Simple parameter substitution: {param} -> value
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};