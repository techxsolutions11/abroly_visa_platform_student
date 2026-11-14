import { useEffect, useState } from "react";

/**
 * Small translation helper for the student portal (students and their parents).
 * t("key", { n: 3 }) -> text in the chosen language, {n} replaced. Unknown keys fall back to English.
 */
export const LANGUAGES = [
    { key: "en", label: "English", short: "EN" },
    { key: "hi", label: "हिन्दी", short: "हिं" },
    { key: "gu", label: "ગુજરાતી", short: "ગુ" },
] as const;
export type Lang = typeof LANGUAGES[number]["key"];

const T: Record<string, Record<Lang, string>> = {
    my_progress: { en: "My visa progress", hi: "मेरी वीज़ा प्रगति", gu: "મારી વિઝા પ્રગતિ" },
    services: { en: "Services", hi: "सेवाएं", gu: "સેવાઓ" },
    services_intro: { en: "Extra help from {agency}. Pay online and get your invoice instantly.", hi: "{agency} से अतिरिक्त सहायता। ऑनलाइन भुगतान करें और तुरंत रसीद पाएं।", gu: "{agency} તરફથી વધારાની મદદ. ઓનલાઇન ચૂકવો અને તરત જ ઇન્વૉઇસ મેળવો." },
    buy_now: { en: "Buy now", hi: "अभी खरीदें", gu: "હમણાં ખરીદો" },
    incl_gst: { en: "incl. {n}% GST", hi: "{n}% GST सहित", gu: "{n}% GST સહિત" },
    no_services: { en: "No services are available right now.", hi: "अभी कोई सेवा उपलब्ध नहीं है।", gu: "અત્યારે કોઈ સેવા ઉપલબ્ધ નથી." },
    pay_not_ready: { en: "Online payment is not set up yet - please contact your counsellor to buy.", hi: "ऑनलाइन भुगतान अभी सेट नहीं है - खरीदने के लिए अपने काउंसलर से संपर्क करें।", gu: "ઓનલાઇન ચુકવણી હજી સેટ નથી - ખરીદવા માટે તમારા કાઉન્સેલરનો સંપર્ક કરો." },
    payment_done: { en: "Payment received", hi: "भुगतान प्राप्त हुआ", gu: "ચુકવણી મળી ગઈ" },
    payment_done_text: { en: "Thank you! Invoice {n} is in My fees. Your counsellor has been told.", hi: "धन्यवाद! इनवॉइस {n} मेरी फीस में है। आपके काउंसलर को सूचना दे दी गई है।", gu: "આભાર! ઇન્વૉઇસ {n} મારી ફીમાં છે. તમારા કાઉન્સેલરને જાણ કરવામાં આવી છે." },
    view_invoice: { en: "View in My fees", hi: "मेरी फीस में देखें", gu: "મારી ફીમાં જુઓ" },
    my_purchases: { en: "Bought by you", hi: "आपकी खरीदारी", gu: "તમારી ખરીદી" },
    secure_payment: { en: "Secure payment by Razorpay - UPI, cards, net banking", hi: "Razorpay द्वारा सुरक्षित भुगतान - UPI, कार्ड, नेट बैंकिंग", gu: "Razorpay દ્વારા સુરક્ષિત ચુકવણી - UPI, કાર્ડ, નેટ બેંકિંગ" },
    my_fees: { en: "My fees", hi: "मेरी फीस", gu: "મારી ફી" },
    chat_with_us: { en: "Chat with us", hi: "हमसे बात करें", gu: "અમારી સાથે વાત કરો" },
    not_started: { en: "Your visa process has not started yet. Your consultant will open it for you.", hi: "आपकी वीज़ा प्रक्रिया अभी शुरू नहीं हुई है। आपके सलाहकार इसे शुरू करेंगे।", gu: "તમારી વિઝા પ્રક્રિયા હજી શરૂ થઈ નથી. તમારા કન્સલ્ટન્ટ તેને શરૂ કરશે." },
    visa_application: { en: "Visa application", hi: "वीज़ा आवेदन", gu: "વિઝા અરજી" },
    visa_approved: { en: "Visa approved", hi: "वीज़ा स्वीकृत", gu: "વિઝા મંજૂર" },
    visa_not_approved: { en: "Visa not approved - talk to your consultant", hi: "वीज़ा स्वीकृत नहीं - अपने सलाहकार से बात करें", gu: "વિઝા મંજૂર નથી - તમારા કન્સલ્ટન્ટ સાથે વાત કરો" },
    step_of: { en: "Step {n} of {total}", hi: "चरण {n} / {total}", gu: "પગલું {n} / {total}" },
    all_steps_done: { en: "All {total} steps done", hi: "सभी {total} चरण पूरे", gu: "બધા {total} પગલાં પૂરાં" },
    preparing_steps: { en: "Your consultant is preparing your steps.", hi: "आपके सलाहकार आपके चरण तैयार कर रहे हैं।", gu: "તમારા કન્સલ્ટન્ટ તમારાં પગલાં તૈયાર કરી રહ્યા છે." },
    now: { en: "Now", hi: "अभी", gu: "હાલ" },
    next: { en: "next", hi: "अगला", gu: "આગળ" },
    stage_documents: { en: "Documents", hi: "दस्तावेज़", gu: "દસ્તાવેજો" },
    stage_application: { en: "Application", hi: "आवेदन", gu: "અરજી" },
    stage_offer: { en: "Offer", hi: "ऑफ़र", gu: "ઓફર" },
    stage_funds: { en: "Fees & funds", hi: "फीस और फंड", gu: "ફી અને ફંડ" },
    stage_visa_filed: { en: "Visa filed", hi: "वीज़ा फ़ाइल", gu: "વિઝા ફાઇલ" },
    stage_decision: { en: "Decision", hi: "निर्णय", gu: "નિર્ણય" },
    next_thing: { en: "Next thing to do", hi: "अगला काम", gu: "હવે શું કરવું" },
    please_redo: { en: "Please redo this", hi: "कृपया फिर से करें", gu: "કૃપા કરી ફરી કરો" },
    redo_reason: { en: "Please redo: {reason}", hi: "कृपया फिर से करें: {reason}", gu: "કૃપા કરી ફરી કરો: {reason}" },
    not_accepted: { en: "not accepted", hi: "स्वीकार नहीं", gu: "સ્વીકાર્યું નથી" },
    due: { en: "Due", hi: "अंतिम तिथि", gu: "છેલ્લી તારીખ" },
    was_due: { en: "Was due", hi: "तिथि बीत गई", gu: "તારીખ વીતી ગઈ" },
    what_we_need: { en: "What we need from you ({n})", hi: "हमें आपसे क्या चाहिए ({n})", gu: "અમને તમારી પાસેથી શું જોઈએ ({n})" },
    upload: { en: "Upload", hi: "अपलोड", gu: "અપલોડ" },
    answer: { en: "Answer", hi: "जवाब दें", gu: "જવાબ આપો" },
    see_all: { en: "See all {n}", hi: "सभी {n} देखें", gu: "બધા {n} જુઓ" },
    nothing_needed_checking: { en: "Nothing needed right now. We are checking {n} item(s) you sent.", hi: "अभी कुछ नहीं चाहिए। हम आपके भेजे {n} दस्तावेज़ जाँच रहे हैं।", gu: "હમણાં કંઈ જોઈતું નથી. તમે મોકલેલ {n} દસ્તાવેજ અમે તપાસી રહ્યા છીએ." },
    nothing_needed: { en: "Nothing needed from you right now.", hi: "अभी आपसे कुछ नहीं चाहिए।", gu: "હમણાં તમારી પાસેથી કંઈ જોઈતું નથી." },
    no_invoices: { en: "You have no invoices yet.", hi: "अभी आपका कोई बिल नहीं है।", gu: "હજી તમારું કોઈ બિલ નથી." },
    total_due: { en: "Total due", hi: "कुल बकाया", gu: "કુલ બાકી" },
    overdue: { en: "Overdue", hi: "बकाया (देर)", gu: "મુદત વીતી" },
    total: { en: "Total", hi: "कुल", gu: "કુલ" },
    paid: { en: "Paid", hi: "भुगतान", gu: "ચૂકવેલ" },
    balance: { en: "Balance", hi: "बाकी", gu: "બાકી" },
    pay_online: { en: "Pay online", hi: "ऑनलाइन भुगतान करें", gu: "ઓનલાઇન ચૂકવો" },
    other_ways: { en: "Other ways to pay", hi: "भुगतान के अन्य तरीके", gu: "ચૂકવણીની અન્ય રીતો" },
    send_screenshot: { en: "After paying, send the screenshot to your consultant so they can record it.", hi: "भुगतान के बाद स्क्रीनशॉट अपने सलाहकार को भेजें।", gu: "ચૂકવણી પછી સ્ક્રીનશૉટ તમારા કન્સલ્ટન્ટને મોકલો." },
    next_payment: { en: "Next payment", hi: "अगला भुगतान", gu: "આગલી ચૂકવણી" },
    by: { en: "by", hi: "तक", gu: "સુધી" },
    take_photo: { en: "Take photo", hi: "फ़ोटो लें", gu: "ફોટો લો" },
    choose_file: { en: "Choose file", hi: "फ़ाइल चुनें", gu: "ફાઇલ પસંદ કરો" },
    checking_photo: { en: "Checking the photo...", hi: "फ़ोटो जाँच रहे हैं...", gu: "ફોટો તપાસી રહ્યા છીએ..." },
    retake: { en: "Retake", hi: "फिर से लें", gu: "ફરી લો" },
    photo_blurry: { en: "The photo looks blurry. Hold the phone steady and retake it, so the text is easy to read.", hi: "फ़ोटो धुंधली है। फ़ोन स्थिर रखकर फिर से लें ताकि लिखा साफ़ पढ़ा जा सके।", gu: "ફોટો ઝાંખો છે. ફોન સ્થિર રાખી ફરી લો જેથી લખાણ સ્પષ્ટ વંચાય." },
    photo_dark: { en: "The photo looks dark. Try again in better light.", hi: "फ़ोटो अंधेरी है। अच्छी रोशनी में फिर से लें।", gu: "ફોટો અંધારો છે. સારા પ્રકાશમાં ફરી લો." },
    photo_small: { en: "The photo is small - the text may not be readable.", hi: "फ़ोटो छोटी है - लिखा पढ़ने में नहीं आ सकता।", gu: "ફોટો નાનો છે - લખાણ વંચાય નહીં." },
    file_big: { en: "This file is bigger than 20 MB - it may fail to upload. Try a smaller copy.", hi: "यह फ़ाइल 20 MB से बड़ी है - अपलोड न हो। छोटी कॉपी आज़माएँ।", gu: "આ ફાઇલ 20 MB થી મોટી છે - અપલોડ ન થાય. નાની કૉપી અજમાવો." },
    add_to_phone: { en: "Add {name} to your phone", hi: "{name} को अपने फ़ोन में जोड़ें", gu: "{name} તમારા ફોનમાં ઉમેરો" },
    install_ios: { en: "Tap Share, then Add to Home Screen. Open your visa progress in one tap.", hi: "Share दबाएँ, फिर Add to Home Screen। एक टैप में अपनी प्रगति देखें।", gu: "Share દબાવો, પછી Add to Home Screen. એક ટૅપમાં તમારી પ્રગતિ જુઓ." },
    install_android: { en: "Open your visa progress and fees in one tap, like an app.", hi: "ऐप की तरह एक टैप में प्रगति और फीस देखें।", gu: "એપની જેમ એક ટૅપમાં પ્રગતિ અને ફી જુઓ." },
    install_app: { en: "Install app", hi: "ऐप इंस्टॉल करें", gu: "એપ ઇન્સ્ટોલ કરો" },
    this_portal: { en: "this portal", hi: "यह पोर्टल", gu: "આ પોર્ટલ" },
};

const KEY = "portal_lang";
let current: Lang = (() => { try { const v = localStorage.getItem(KEY) as Lang; return LANGUAGES.some((l) => l.key === v) ? v : "en"; } catch { return "en"; } })();
const listeners = new Set<(l: Lang) => void>();

export const getLang = () => current;
export const setLang = (l: Lang) => {
    current = l;
    try { localStorage.setItem(KEY, l); } catch { /* private mode */ }
    document.documentElement.lang = l;
    listeners.forEach((fn) => fn(l));
};

export const translate = (key: string, vars?: Record<string, any>, lang: Lang = current) => {
    let s = T[key]?.[lang] || T[key]?.en || key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    return s;
};

/** Re-renders the component when the language changes. */
export const useT = () => {
    const [lang, setL] = useState<Lang>(current);
    useEffect(() => { listeners.add(setL); return () => { listeners.delete(setL); }; }, []);
    return { lang, t: (key: string, vars?: Record<string, any>) => translate(key, vars, lang) };
};
