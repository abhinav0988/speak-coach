export interface CurriculumSentence {
  roman_hindi: string;
  hindi_script: string;
  english: string;
}

export interface CurriculumWord {
  word: string;
  language: "english" | "hindi";
  meaning: string;
  pronunciation: string;
  example: string;
}

export interface CurriculumParagraph {
  title: string;
  content: string;
  hindi_script: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface WeekCurriculum {
  theme: string;
  focus: string;
  sentences: CurriculumSentence[];
  vocabulary: CurriculumWord[];
  paragraph: CurriculumParagraph;
}

export const CURRICULUM_WEEKS: WeekCurriculum[] = [
  {
    theme: "Morning & Daily Routine",
    focus: "Wake up, breakfast, getting ready",
    sentences: [
      { roman_hindi: "Main subah jaldi uthta hoon.", hindi_script: "मैं सुबह जल्दी उठता हूँ।", english: "I wake up early in the morning." },
      { roman_hindi: "Mujhe chai pasand hai.", hindi_script: "मुझे चाय पसंद है।", english: "I like tea." },
      { roman_hindi: "Aaj mausam accha hai.", hindi_script: "आज मौसम अच्छा है।", english: "The weather is nice today." },
      { roman_hindi: "Main kaam kar raha hoon.", hindi_script: "मैं काम कर रहा हूँ।", english: "I am working." },
      { roman_hindi: "Tum kahan ja rahe ho?", hindi_script: "तुम कहाँ जा रहे हो?", english: "Where are you going?" },
      { roman_hindi: "Main thodi der mein pahunch jaunga.", hindi_script: "मैं थोड़ी देर में पहुँच जाऊँगा।", english: "I will reach in a little while." },
      { roman_hindi: "Kya tumne khana khaya?", hindi_script: "क्या तुमने खाना खाया?", english: "Did you eat?" },
      { roman_hindi: "Mujhe thakawat mehsoos ho rahi hai.", hindi_script: "मुझे थकावट महसूस हो रही है।", english: "I am feeling tired." },
      { roman_hindi: "Chalo baat karte hain.", hindi_script: "चलो बात करते हैं।", english: "Let us talk." },
      { roman_hindi: "Main seekh raha hoon.", hindi_script: "मैं सीख रहा हूँ।", english: "I am learning." },
    ],
    vocabulary: [
      { word: "reach", language: "english", meaning: "to arrive", pronunciation: "REECH", example: "I will reach at 5 PM." },
      { word: "clear", language: "english", meaning: "easy to understand", pronunciation: "KLEER", example: "Please speak clearly." },
      { word: "confident", language: "english", meaning: "sure and bold", pronunciation: "KON-fih-dent", example: "I want to sound confident." },
      { word: "practice", language: "english", meaning: "repeated training", pronunciation: "PRAK-tis", example: "I practice every day." },
      { word: "improve", language: "english", meaning: "become better", pronunciation: "im-PROOV", example: "I want to improve my Hindi." },
      { word: "pahunchna", language: "hindi", meaning: "to reach", pronunciation: "pah-HOONCH-na", example: "Main ghar pahunch gaya." },
      { word: "spasht", language: "hindi", meaning: "clear", pronunciation: "SPASHT", example: "Spasht bolo." },
      { word: "aatmavishwas", language: "hindi", meaning: "confidence", pronunciation: "aat-ma-VISH-waas", example: "Mujhe aatmavishwas chahiye." },
      { word: "abhyas", language: "hindi", meaning: "practice", pronunciation: "ab-HYAAS", example: "Roz abhyas karo." },
      { word: "sudhaar", language: "hindi", meaning: "improvement", pronunciation: "su-DHAAR", example: "Aaj sudhaar hua." },
    ],
    paragraph: {
      title: "My Morning",
      content: "Aaj main subah jaldi utha. Maine nashta kiya aur office ke liye nikla. Mausam bahut accha tha. Main samay par pahunch gaya.",
      hindi_script: "आज मैं सुबह जल्दी उठा। मैंने नाश्ता किया और ऑफिस के लिए निकला। मौसम बहुत अच्छा था। मैं समय पर पहुँच गया।",
      difficulty: "easy",
    },
  },
  {
    theme: "Work & Office",
    focus: "Meetings, deadlines, teamwork",
    sentences: [
      { roman_hindi: "Main office ja raha hoon.", hindi_script: "मैं ऑफिस जा रहा हूँ।", english: "I am going to the office." },
      { roman_hindi: "Aaj meeting hai.", hindi_script: "आज मीटिंग है।", english: "There is a meeting today." },
      { roman_hindi: "Mujhe report likhni hai.", hindi_script: "मुझे रिपोर्ट लिखनी है।", english: "I need to write a report." },
      { roman_hindi: "Kya aap madad kar sakte hain?", hindi_script: "क्या आप मदद कर सकते हैं?", english: "Can you help me?" },
      { roman_hindi: "Main samay par pahunchunga.", hindi_script: "मैं समय पर पहुँचूँगा।", english: "I will arrive on time." },
      { roman_hindi: "Yeh kaam zaroori hai.", hindi_script: "यह काम ज़रूरी है।", english: "This work is important." },
      { roman_hindi: "Main thoda busy hoon.", hindi_script: "मैं थोड़ा व्यस्त हूँ।", english: "I am a little busy." },
      { roman_hindi: "Baad mein baat karte hain.", hindi_script: "बाद में बात करते हैं।", english: "Let us talk later." },
      { roman_hindi: "Mujhe samajh aa gaya.", hindi_script: "मुझे समझ आ गया।", english: "I understood." },
      { roman_hindi: "Shukriya, bahut madad hui.", hindi_script: "शुक्रिया, बहुत मदद हुई।", english: "Thank you, it helped a lot." },
    ],
    vocabulary: [
      { word: "meeting", language: "english", meaning: "planned discussion", pronunciation: "MEE-ting", example: "We have a meeting at 10." },
      { word: "deadline", language: "english", meaning: "last date to finish", pronunciation: "DED-line", example: "The deadline is Friday." },
      { word: "report", language: "english", meaning: "written summary", pronunciation: "ri-PORT", example: "I finished the report." },
      { word: "busy", language: "english", meaning: "having much work", pronunciation: "BIZ-ee", example: "I am busy today." },
      { word: "team", language: "english", meaning: "group working together", pronunciation: "TEEM", example: "Our team is strong." },
      { word: "samay", language: "hindi", meaning: "time", pronunciation: "sa-MAY", example: "Samay par aao." },
      { word: "vyast", language: "hindi", meaning: "busy", pronunciation: "vy-AST", example: "Main vyast hoon." },
      { word: "madad", language: "hindi", meaning: "help", pronunciation: "ma-DAD", example: "Madad chahiye." },
      { word: "kaam", language: "hindi", meaning: "work", pronunciation: "KAAM", example: "Kaam khatam karo." },
      { word: "report", language: "hindi", meaning: "report", pronunciation: "ri-PORT", example: "Report submit karo." },
    ],
    paragraph: {
      title: "At Work",
      content: "Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.",
      hindi_script: "आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।",
      difficulty: "easy",
    },
  },
  {
    theme: "Shopping & Market",
    focus: "Buying, prices, bargaining",
    sentences: [
      { roman_hindi: "Main market ja raha hoon.", hindi_script: "मैं मार्केट जा रहा हूँ।", english: "I am going to the market." },
      { roman_hindi: "Kitne paise honge?", hindi_script: "कितने पैसे होंगे?", english: "How much will it cost?" },
      { roman_hindi: "Thoda sasta karo please.", hindi_script: "थोड़ा सस्ता करो प्लीज़।", english: "Please make it cheaper." },
      { roman_hindi: "Mujhe yeh chahiye.", hindi_script: "मुझे यह चाहिए।", english: "I want this." },
      { roman_hindi: "Kya yeh fresh hai?", hindi_script: "क्या यह ताज़ा है?", english: "Is this fresh?" },
      { roman_hindi: "Bill de dijiye.", hindi_script: "बिल दे दीजिए।", english: "Please give the bill." },
      { roman_hindi: "Main card se dunga.", hindi_script: "मैं कार्ड से दूँगा।", english: "I will pay by card." },
      { roman_hindi: "Ghar le jaana hai.", hindi_script: "घर ले जाना है।", english: "Need to take it home." },
      { roman_hindi: "Bahut accha maal hai.", hindi_script: "बहुत अच्छा माल है।", english: "Very good quality." },
      { roman_hindi: "Phir milenge.", hindi_script: "फिर मिलेंगे।", english: "See you again." },
    ],
    vocabulary: [
      { word: "price", language: "english", meaning: "cost", pronunciation: "PRYS", example: "What is the price?" },
      { word: "fresh", language: "english", meaning: "new, not old", pronunciation: "FRESH", example: "Is it fresh?" },
      { word: "cheap", language: "english", meaning: "low cost", pronunciation: "CHEEP", example: "Make it cheaper." },
      { word: "bill", language: "english", meaning: "payment receipt", pronunciation: "BIL", example: "Give me the bill." },
      { word: "quality", language: "english", meaning: "how good something is", pronunciation: "KWOL-i-tee", example: "Good quality." },
      { word: "daam", language: "hindi", meaning: "price", pronunciation: "DAAM", example: "Daam kya hai?" },
      { word: "taza", language: "hindi", meaning: "fresh", pronunciation: "ta-ZA", example: "Sabzi tazi hai." },
      { word: "sasta", language: "hindi", meaning: "cheap", pronunciation: "SAS-ta", example: "Thoda sasta karo." },
      { word: "khareedna", language: "hindi", meaning: "to buy", pronunciation: "kha-REED-na", example: "Yeh khareed lo." },
      { word: "maal", language: "hindi", meaning: "goods", pronunciation: "MAAL", example: "Accha maal hai." },
    ],
    paragraph: {
      title: "Shopping",
      content: "Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.",
      hindi_script: "मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।",
      difficulty: "easy",
    },
  },
  {
    theme: "Travel & Directions",
    focus: "Trains, hotels, asking directions",
    sentences: [
      { roman_hindi: "Main travel kar raha hoon.", hindi_script: "मैं ट्रैवल कर रहा हूँ।", english: "I am traveling." },
      { roman_hindi: "Ticket kahan milegi?", hindi_script: "टिकट कहाँ मिलेगी?", english: "Where will I get the ticket?" },
      { roman_hindi: "Train kitne baje hai?", hindi_script: "ट्रेन कितने बजे है?", english: "What time is the train?" },
      { roman_hindi: "Platform number kya hai?", hindi_script: "प्लेटफ़ॉर्म नंबर क्या है?", english: "What is the platform number?" },
      { roman_hindi: "Mera seat kahan hai?", hindi_script: "मेरा सीट कहाँ है?", english: "Where is my seat?" },
      { roman_hindi: "Station par utarna hai.", hindi_script: "स्टेशन पर उतरना है।", english: "I need to get off at the station." },
      { roman_hindi: "Rasta batayiye please.", hindi_script: "रास्ता बताइए प्लीज़।", english: "Please show the way." },
      { roman_hindi: "Hotel kahan hai?", hindi_script: "होटल कहाँ है?", english: "Where is the hotel?" },
      { roman_hindi: "Main kho gaya hoon.", hindi_script: "मैं खो गया हूँ।", english: "I am lost." },
      { roman_hindi: "Madad ke liye dhanyavaad.", hindi_script: "मदद के लिए धन्यवाद।", english: "Thanks for the help." },
    ],
    vocabulary: [
      { word: "ticket", language: "english", meaning: "travel pass", pronunciation: "TIK-et", example: "Buy a ticket." },
      { word: "platform", language: "english", meaning: "train boarding area", pronunciation: "PLAT-form", example: "Which platform?" },
      { word: "station", language: "english", meaning: "train stop", pronunciation: "STAY-shun", example: "Get off at the station." },
      { word: "hotel", language: "english", meaning: "place to stay", pronunciation: "ho-TEL", example: "Book a hotel." },
      { word: "direction", language: "english", meaning: "way to go", pronunciation: "di-REK-shun", example: "Show direction." },
      { word: "rasta", language: "hindi", meaning: "path/way", pronunciation: "RAS-ta", example: "Rasta batayo." },
      { word: "safar", language: "hindi", meaning: "journey", pronunciation: "sa-FAR", example: "Safar accha raha." },
      { word: "map", language: "hindi", meaning: "map", pronunciation: "MAP", example: "Map dekho." },
      { word: "booking", language: "hindi", meaning: "reservation", pronunciation: "BOOK-ing", example: "Booking confirm hai." },
      { word: "station", language: "hindi", meaning: "station", pronunciation: "STAY-shun", example: "Station aa gaya." },
    ],
    paragraph: {
      title: "Travel Day",
      content: "Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.",
      hindi_script: "मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।",
      difficulty: "medium",
    },
  },
  {
    theme: "Interview & Career",
    focus: "Job interviews, skills, goals",
    sentences: [
      { roman_hindi: "Main interview ke liye gaya.", hindi_script: "मैं इंटरव्यू के लिए गया।", english: "I went for an interview." },
      { roman_hindi: "Apna introduction dijiye.", hindi_script: "अपना इंट्रोडक्शन दीजिए।", english: "Please give your introduction." },
      { roman_hindi: "Mera naam hai...", hindi_script: "मेरा नाम है...", english: "My name is..." },
      { roman_hindi: "Main engineer hoon.", hindi_script: "मैं इंजीनियर हूँ।", english: "I am an engineer." },
      { roman_hindi: "Mere paas experience hai.", hindi_script: "मेरे पास अनुभव है।", english: "I have experience." },
      { roman_hindi: "Main team mein kaam karta hoon.", hindi_script: "मैं टीम में काम करता हूँ।", english: "I work in a team." },
      { roman_hindi: "Mujhe yeh role pasand hai.", hindi_script: "मुझे यह रोल पसंद है।", english: "I like this role." },
      { roman_hindi: "Main seekhne ke liye taiyar hoon.", hindi_script: "मैं सीखने के लिए तैयार हूँ।", english: "I am ready to learn." },
      { roman_hindi: "Aapka sawal accha hai.", hindi_script: "आपका सवाल अच्छा है।", english: "That is a good question." },
      { roman_hindi: "Mujhe umeed hai.", hindi_script: "मुझे उम्मीद है।", english: "I am hopeful." },
    ],
    vocabulary: [
      { word: "interview", language: "english", meaning: "job Q&A meeting", pronunciation: "IN-ter-vyoo", example: "I have an interview." },
      { word: "experience", language: "english", meaning: "past work knowledge", pronunciation: "ik-SPEER-ee-ens", example: "I have 3 years experience." },
      { word: "skill", language: "english", meaning: "ability", pronunciation: "SKIL", example: "I have good skills." },
      { word: "goal", language: "english", meaning: "target", pronunciation: "GOHL", example: "My goal is to grow." },
      { word: "resume", language: "english", meaning: "CV document", pronunciation: "REZ-oo-may", example: "I sent my resume." },
      { word: "anubhav", language: "hindi", meaning: "experience", pronunciation: "a-nu-BHAV", example: "Mera anubhav hai." },
      { word: "umeed", language: "hindi", meaning: "hope", pronunciation: "u-MEED", example: "Mujhe umeed hai." },
      { word: "sawal", language: "hindi", meaning: "question", pronunciation: "sa-WAL", example: "Sawal pucho." },
      { word: "jawab", language: "hindi", meaning: "answer", pronunciation: "ja-WAB", example: "Jawab do." },
      { word: "naukri", language: "hindi", meaning: "job", pronunciation: "NAUK-ri", example: "Naukri mil gayi." },
    ],
    paragraph: {
      title: "Interview",
      content: "Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.",
      hindi_script: "आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।",
      difficulty: "medium",
    },
  },
  {
    theme: "Friends & Social",
    focus: "Casual chat, plans, feelings",
    sentences: [
      { roman_hindi: "Dost se baat kar raha hoon.", hindi_script: "दोस्त से बात कर रहा हूँ।", english: "Talking with a friend." },
      { roman_hindi: "Kya haal hai?", hindi_script: "क्या हाल है?", english: "How are you?" },
      { roman_hindi: "Main theek hoon.", hindi_script: "मैं ठीक हूँ।", english: "I am fine." },
      { roman_hindi: "Aaj kya plan hai?", hindi_script: "आज क्या प्लान है?", english: "What is the plan today?" },
      { roman_hindi: "Chalo kahin ghoomte hain.", hindi_script: "चलो कहीं घूमते हैं।", english: "Let us go somewhere." },
      { roman_hindi: "Bahut maza aaya.", hindi_script: "बहुत मज़ा आया।", english: "Had a lot of fun." },
      { roman_hindi: "Tum bahut acche ho.", hindi_script: "तुम बहुत अच्छे हो।", english: "You are very nice." },
      { roman_hindi: "Kal milte hain.", hindi_script: "कल मिलते हैं।", english: "See you tomorrow." },
      { roman_hindi: "Apna khayal rakho.", hindi_script: "अपना ख्याल रखो।", english: "Take care." },
      { roman_hindi: "Tumhari yaad aati hai.", hindi_script: "तुम्हारी याद आती है।", english: "I miss you." },
    ],
    vocabulary: [
      { word: "friend", language: "english", meaning: "close person", pronunciation: "FREND", example: "He is my friend." },
      { word: "plan", language: "english", meaning: "arrangement", pronunciation: "PLAN", example: "What is the plan?" },
      { word: "fun", language: "english", meaning: "enjoyment", pronunciation: "FUN", example: "We had fun." },
      { word: "miss", language: "english", meaning: "feel absence of", pronunciation: "MIS", example: "I miss you." },
      { word: "together", language: "english", meaning: "with each other", pronunciation: "tuh-GEH-ther", example: "Let us go together." },
      { word: "dost", language: "hindi", meaning: "friend", pronunciation: "DOST", example: "Mera dost hai." },
      { word: "maza", language: "hindi", meaning: "fun", pronunciation: "MA-za", example: "Bahut maza aaya." },
      { word: "yaad", language: "hindi", meaning: "memory/miss", pronunciation: "YAAD", example: "Tumhari yaad aati hai." },
      { word: "khayal", language: "hindi", meaning: "care", pronunciation: "kha-YAL", example: "Apna khayal rakho." },
      { word: "ghoomna", language: "hindi", meaning: "to roam", pronunciation: "GHOOM-na", example: "Chalo ghoomte hain." },
    ],
    paragraph: {
      title: "With Friends",
      content: "Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.",
      hindi_script: "आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।",
      difficulty: "easy",
    },
  },
  {
    theme: "Week 1 Review",
    focus: "Progress, confidence, habits",
    sentences: [
      { roman_hindi: "Ek hafta ho gaya practice karte.", hindi_script: "एक हफ़्ता हो गया प्रैक्टिस करते।", english: "One week of practice done." },
      { roman_hindi: "Main behtar bol raha hoon.", hindi_script: "मैं बेहतर बोल रहा हूँ।", english: "I am speaking better." },
      { roman_hindi: "Mistakes kam ho rahi hain.", hindi_script: "मिस्टेक्स कम हो रही हैं।", english: "Mistakes are reducing." },
      { roman_hindi: "Awaaz zyada clear hai.", hindi_script: "आवाज़ ज़्यादा क्लियर है।", english: "Voice is clearer." },
      { roman_hindi: "Main confident mehsoos kar raha hoon.", hindi_script: "मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।", english: "I feel confident." },
      { roman_hindi: "Roz thoda practice karo.", hindi_script: "रोज़ थोड़ा प्रैक्टिस करो।", english: "Practice a little every day." },
      { roman_hindi: "Galtiyan seekhne ka hissa hain.", hindi_script: "गलतियाँ सीखने का हिस्सा हैं।", english: "Mistakes are part of learning." },
      { roman_hindi: "Agle hafte aur strong.", hindi_script: "अगले हफ़्ते और स्ट्रॉन्ग।", english: "Next week even stronger." },
      { roman_hindi: "Main proud hoon apne aap par.", hindi_script: "मैं प्राउड हूँ अपने आप पर।", english: "I am proud of myself." },
      { roman_hindi: "Chalo aage badhte hain.", hindi_script: "चलो आगे बढ़ते हैं।", english: "Let us move forward." },
    ],
    vocabulary: [
      { word: "progress", language: "english", meaning: "improvement over time", pronunciation: "PROG-res", example: "Good progress!" },
      { word: "habit", language: "english", meaning: "regular behavior", pronunciation: "HAB-it", example: "Daily habit helps." },
      { word: "mistake", language: "english", meaning: "error", pronunciation: "mis-TAYK", example: "Learn from mistakes." },
      { word: "proud", language: "english", meaning: "happy with achievement", pronunciation: "PROWD", example: "I am proud." },
      { word: "consistent", language: "english", meaning: "steady, regular", pronunciation: "kun-SIS-tent", example: "Be consistent." },
      { word: "pragati", language: "hindi", meaning: "progress", pronunciation: "pra-ga-TI", example: "Pragati ho rahi hai." },
      { word: "galti", language: "hindi", meaning: "mistake", pronunciation: "GAL-ti", example: "Galti mat karo." },
      { word: "garv", language: "hindi", meaning: "pride", pronunciation: "GARV", example: "Mujhe garv hai." },
      { word: "aage", language: "hindi", meaning: "forward", pronunciation: "AA-ge", example: "Aage badho." },
      { word: "aadat", language: "hindi", meaning: "habit", pronunciation: "aa-DAT", example: "Acchi aadat banao." },
    ],
    paragraph: {
      title: "One Week Done",
      content: "Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.",
      hindi_script: "एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।",
      difficulty: "medium",
    },
  },
  {
    theme: "Health & Fitness",
    focus: "Exercise, diet, wellness",
    sentences: [
      { roman_hindi: "Main roz exercise karta hoon.", hindi_script: "मैं रोज़ एक्सरसाइज़ करता हूँ।", english: "I exercise every day." },
      { roman_hindi: "Paani zyada peena chahiye.", hindi_script: "पानी ज़्यादा पीना चाहिए।", english: "You should drink more water." },
      { roman_hindi: "Mujhe neend acchi nahi aayi.", hindi_script: "मुझे नींद अच्छी नहीं आई।", english: "I did not sleep well." },
      { roman_hindi: "Healthy khana khana zaroori hai.", hindi_script: "हेल्दी खाना खाना ज़रूरी है।", english: "Eating healthy is important." },
      { roman_hindi: "Doctor se milna chahiye.", hindi_script: "डॉक्टर से मिलना चाहिए।", english: "Should see a doctor." },
      { roman_hindi: "Main walk par ja raha hoon.", hindi_script: "मैं वॉक पर जा रहा हूँ।", english: "I am going for a walk." },
      { roman_hindi: "Tabiyat theek nahi hai.", hindi_script: "तबीयत ठीक नहीं है।", english: "Not feeling well." },
      { roman_hindi: "Dawa le li hai.", hindi_script: "दवा ले ली है।", english: "I took medicine." },
      { roman_hindi: "Stress kam karna hai.", hindi_script: "स्ट्रेस कम करना है।", english: "Need to reduce stress." },
      { roman_hindi: "Aaj main fresh mehsoos kar raha hoon.", hindi_script: "आज मैं फ्रेश महसूस कर रहा हूँ।", english: "I feel fresh today." },
    ],
    vocabulary: [
      { word: "exercise", language: "english", meaning: "physical activity", pronunciation: "EK-ser-syz", example: "I exercise daily." },
      { word: "healthy", language: "english", meaning: "good for body", pronunciation: "HEL-thee", example: "Eat healthy food." },
      { word: "sleep", language: "english", meaning: "rest at night", pronunciation: "SLEEP", example: "I need more sleep." },
      { word: "doctor", language: "english", meaning: "medical professional", pronunciation: "DOK-ter", example: "See a doctor." },
      { word: "stress", language: "english", meaning: "mental pressure", pronunciation: "STRES", example: "Reduce stress." },
      { word: "tabiyat", language: "hindi", meaning: "health/condition", pronunciation: "ta-bi-YAT", example: "Tabiyat kharab hai." },
      { word: "dawa", language: "hindi", meaning: "medicine", pronunciation: "da-WA", example: "Dawa le lo." },
      { word: "vyayam", language: "hindi", meaning: "exercise", pronunciation: "vy-A-yam", example: "Roz vyayam karo." },
      { word: "neend", language: "hindi", meaning: "sleep", pronunciation: "NEEND", example: "Neend acchi aayi." },
      { word: "tandarust", language: "hindi", meaning: "healthy", pronunciation: "tan-da-RUST", example: "Main tandarust hoon." },
    ],
    paragraph: {
      title: "Healthy Day",
      content: "Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.",
      hindi_script: "आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।",
      difficulty: "medium",
    },
  },
  {
    theme: "Family & Home",
    focus: "Parents, siblings, home life",
    sentences: [
      { roman_hindi: "Mera parivaar bahut accha hai.", hindi_script: "मेरा परिवार बहुत अच्छा है।", english: "My family is very nice." },
      { roman_hindi: "Maa ne khana banaya.", hindi_script: "माँ ने खाना बनाया।", english: "Mom cooked food." },
      { roman_hindi: "Papa office gaye hain.", hindi_script: "पापा ऑफिस गए हैं।", english: "Dad went to office." },
      { roman_hindi: "Bhai bahan se baat ki.", hindi_script: "भाई बहन से बात की।", english: "Talked with siblings." },
      { roman_hindi: "Ghar saaf karna hai.", hindi_script: "घर साफ़ करना है।", english: "Need to clean the house." },
      { roman_hindi: "Dada dadi se milne jao.", hindi_script: "दादा दादी से मिलने जाओ।", english: "Go meet grandparents." },
      { roman_hindi: "Parivaar ke saath khana khaya.", hindi_script: "परिवार के साथ खाना खाया।", english: "Ate with family." },
      { roman_hindi: "Ghar par shaant mahaul hai.", hindi_script: "घर पर शांत माहौल है।", english: "Peaceful atmosphere at home." },
      { roman_hindi: "Mujhe apne ghar se pyaar hai.", hindi_script: "मुझे अपने घर से प्यार है।", english: "I love my home." },
      { roman_hindi: "Sab log theek hain.", hindi_script: "सब लोग ठीक हैं।", english: "Everyone is fine." },
    ],
    vocabulary: [
      { word: "family", language: "english", meaning: "relatives at home", pronunciation: "FAM-i-lee", example: "I love my family." },
      { word: "parent", language: "english", meaning: "mother or father", pronunciation: "PAIR-ent", example: "My parents are kind." },
      { word: "home", language: "english", meaning: "where you live", pronunciation: "HOHM", example: "I am at home." },
      { word: "together", language: "english", meaning: "with each other", pronunciation: "tuh-GEH-ther", example: "We eat together." },
      { word: "love", language: "english", meaning: "deep affection", pronunciation: "LUV", example: "I love my family." },
      { word: "parivaar", language: "hindi", meaning: "family", pronunciation: "pa-ri-VAAR", example: "Mera parivaar accha hai." },
      { word: "ghar", language: "hindi", meaning: "home", pronunciation: "GHAR", example: "Ghar aa gaya." },
      { word: "maa", language: "hindi", meaning: "mother", pronunciation: "MAA", example: "Maa ne khana banaya." },
      { word: "pyaar", language: "hindi", meaning: "love", pronunciation: "py-AAR", example: "Bahut pyaar hai." },
      { word: "rishta", language: "hindi", meaning: "relationship", pronunciation: "RISH-ta", example: "Acche rishte rakho." },
    ],
    paragraph: {
      title: "At Home",
      content: "Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.",
      hindi_script: "आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।",
      difficulty: "easy",
    },
  },
  {
    theme: "Food & Cooking",
    focus: "Recipes, tastes, restaurants",
    sentences: [
      { roman_hindi: "Aaj kya pakana hai?", hindi_script: "आज क्या पकाना है?", english: "What to cook today?" },
      { roman_hindi: "Mujhe spicy khana pasand hai.", hindi_script: "मुझे स्पाइसी खाना पसंद है।", english: "I like spicy food." },
      { roman_hindi: "Recipe batayiye.", hindi_script: "रेसिपी बताइए।", english: "Tell me the recipe." },
      { roman_hindi: "Swad bahut accha hai.", hindi_script: "स्वाद बहुत अच्छा है।", english: "Taste is very good." },
      { roman_hindi: "Restaurant mein khana khaya.", hindi_script: "रेस्टोरेंट में खाना खाया।", english: "Ate at a restaurant." },
      { roman_hindi: "Chai bana do please.", hindi_script: "चाय बना दो प्लीज़।", english: "Please make tea." },
      { roman_hindi: "Mithai bahut meethi hai.", hindi_script: "मिठाई बहुत मीठी है।", english: "The sweet is very sweet." },
      { roman_hindi: "Bhook lagi hai.", hindi_script: "भूख लगी है।", english: "I am hungry." },
      { roman_hindi: "Khana taiyar ho gaya.", hindi_script: "खाना तैयार हो गया।", english: "Food is ready." },
      { roman_hindi: "Maza aa gaya khane mein.", hindi_script: "मज़ा आ गया खाने में।", english: "Enjoyed the meal." },
    ],
    vocabulary: [
      { word: "recipe", language: "english", meaning: "cooking instructions", pronunciation: "RES-i-pee", example: "Share the recipe." },
      { word: "taste", language: "english", meaning: "flavor", pronunciation: "TAYST", example: "Good taste." },
      { word: "spicy", language: "english", meaning: "hot flavor", pronunciation: "SPY-see", example: "I like spicy food." },
      { word: "hungry", language: "english", meaning: "wanting food", pronunciation: "HUN-gree", example: "I am hungry." },
      { word: "delicious", language: "english", meaning: "very tasty", pronunciation: "di-LISH-us", example: "Delicious food!" },
      { word: "swad", language: "hindi", meaning: "taste", pronunciation: "SWAD", example: "Swad accha hai." },
      { word: "bhook", language: "hindi", meaning: "hunger", pronunciation: "BHOOK", example: "Bhook lagi hai." },
      { word: "pakana", language: "hindi", meaning: "to cook", pronunciation: "pa-KA-na", example: "Khana pakao." },
      { word: "mithai", language: "hindi", meaning: "sweet", pronunciation: "mi-THAI", example: "Mithai lo." },
      { word: "nashta", language: "hindi", meaning: "breakfast", pronunciation: "NAS-ta", example: "Nashta karo." },
    ],
    paragraph: {
      title: "Cooking Day",
      content: "Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.",
      hindi_script: "आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।",
      difficulty: "medium",
    },
  },
  {
    theme: "Phone & Technology",
    focus: "Apps, internet, devices",
    sentences: [
      { roman_hindi: "Mera phone charge khatam ho gaya.", hindi_script: "मेरा फ़ोन चार्ज खत्म हो गया।", english: "My phone battery died." },
      { roman_hindi: "Internet slow hai aaj.", hindi_script: "इंटरनेट स्लो है आज।", english: "Internet is slow today." },
      { roman_hindi: "App download kar li.", hindi_script: "ऐप डाउनलोड कर ली।", english: "Downloaded the app." },
      { roman_hindi: "Video call karte hain.", hindi_script: "वीडियो कॉल करते हैं।", english: "Let us video call." },
      { roman_hindi: "Password yaad nahi hai.", hindi_script: "पासवर्ड याद नहीं है।", english: "I forgot the password." },
      { roman_hindi: "Laptop par kaam kar raha hoon.", hindi_script: "लैपटॉप पर काम कर रहा हूँ।", english: "Working on laptop." },
      { roman_hindi: "Message bhej diya.", hindi_script: "मैसेज भेज दिया।", english: "Sent the message." },
      { roman_hindi: "WiFi connect nahi ho raha.", hindi_script: "वाईफ़ाई कनेक्ट नहीं हो रहा।", english: "WiFi is not connecting." },
      { roman_hindi: "Naya phone lena hai.", hindi_script: "नया फ़ोन लेना है।", english: "Need to buy a new phone." },
      { roman_hindi: "Technology bahut tez badh rahi hai.", hindi_script: "टेक्नोलॉजी बहुत तेज़ बढ़ रही है।", english: "Technology is growing fast." },
    ],
    vocabulary: [
      { word: "download", language: "english", meaning: "get from internet", pronunciation: "DOWN-lohd", example: "Download the app." },
      { word: "password", language: "english", meaning: "secret login code", pronunciation: "PAS-werd", example: "Enter password." },
      { word: "message", language: "english", meaning: "text sent to someone", pronunciation: "MES-ij", example: "Send a message." },
      { word: "battery", language: "english", meaning: "phone power", pronunciation: "BAT-uh-ree", example: "Low battery." },
      { word: "connect", language: "english", meaning: "link together", pronunciation: "kuh-NEKT", example: "Connect to WiFi." },
      { word: "phone", language: "hindi", meaning: "phone", pronunciation: "FONE", example: "Phone charge karo." },
      { word: "internet", language: "hindi", meaning: "internet", pronunciation: "IN-ter-net", example: "Internet slow hai." },
      { word: "sandesh", language: "hindi", meaning: "message", pronunciation: "san-DESH", example: "Sandesh bhejo." },
      { word: "charge", language: "hindi", meaning: "battery charge", pronunciation: "CHAARJ", example: "Charge lagao." },
      { word: "app", language: "hindi", meaning: "application", pronunciation: "APP", example: "App kholo." },
    ],
    paragraph: {
      title: "Tech Day",
      content: "Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.",
      hindi_script: "आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।",
      difficulty: "medium",
    },
  },
  {
    theme: "Emotions & Confidence",
    focus: "Feelings, motivation, self-talk",
    sentences: [
      { roman_hindi: "Main khush hoon aaj.", hindi_script: "मैं खुश हूँ आज।", english: "I am happy today." },
      { roman_hindi: "Thoda nervous lag raha hai.", hindi_script: "थोड़ा नर्वस लग रहा है।", english: "Feeling a little nervous." },
      { roman_hindi: "Main himmat karunga.", hindi_script: "मैं हिम्मत करूँगा।", english: "I will be brave." },
      { roman_hindi: "Galti se seekha.", hindi_script: "गलती से सीखा।", english: "Learned from the mistake." },
      { roman_hindi: "Main apne aap par bharosa karta hoon.", hindi_script: "मैं अपने आप पर भरोसा करता हूँ।", english: "I trust myself." },
      { roman_hindi: "Aaj ka din accha gaya.", hindi_script: "आज का दिन अच्छा गया।", english: "Today went well." },
      { roman_hindi: "Mujhe motivation chahiye.", hindi_script: "मुझे मोटिवेशन चाहिए।", english: "I need motivation." },
      { roman_hindi: "Main strong hoon.", hindi_script: "मैं स्ट्रॉन्ग हूँ।", english: "I am strong." },
      { roman_hindi: "Kal se naya start.", hindi_script: "कल से नया स्टार्ट।", english: "Fresh start from tomorrow." },
      { roman_hindi: "Main jeetunga.", hindi_script: "मैं जीतूँगा।", english: "I will succeed." },
    ],
    vocabulary: [
      { word: "confident", language: "english", meaning: "self-assured", pronunciation: "KON-fih-dent", example: "Stay confident." },
      { word: "nervous", language: "english", meaning: "anxious", pronunciation: "NER-vus", example: "I feel nervous." },
      { word: "brave", language: "english", meaning: "courageous", pronunciation: "BRAYV", example: "Be brave." },
      { word: "motivation", language: "english", meaning: "drive to act", pronunciation: "moh-tih-VAY-shun", example: "I need motivation." },
      { word: "trust", language: "english", meaning: "believe in", pronunciation: "TRUST", example: "Trust yourself." },
      { word: "khushi", language: "hindi", meaning: "happiness", pronunciation: "khu-SHI", example: "Bahut khushi hai." },
      { word: "himmat", language: "hindi", meaning: "courage", pronunciation: "HIM-mat", example: "Himmat rakho." },
      { word: "bharosa", language: "hindi", meaning: "trust", pronunciation: "bha-RO-sa", example: "Apne par bharosa." },
      { word: "jeet", language: "hindi", meaning: "victory", pronunciation: "JEET", example: "Jeet tumhari hai." },
      { word: "tension", language: "hindi", meaning: "stress/worry", pronunciation: "TEN-shun", example: "Tension mat lo." },
    ],
    paragraph: {
      title: "Building Confidence",
      content: "Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.",
      hindi_script: "कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।",
      difficulty: "medium",
    },
  },
  {
    theme: "Month 1 Milestone",
    focus: "30-day review, goals, next steps",
    sentences: [
      { roman_hindi: "Tees din poore ho gaye.", hindi_script: "तीस दिन पूरे हो गए।", english: "Thirty days completed." },
      { roman_hindi: "Meri bolne ki speed badhi.", hindi_script: "मेरी बोलने की स्पीड बढ़ी।", english: "My speaking speed improved." },
      { roman_hindi: "Roman Hindi spelling behtar hai.", hindi_script: "रोमन हिंदी स्पेलिंग बेहतर है।", english: "Roman Hindi spelling is better." },
      { roman_hindi: "English sentences zyada natural hain.", hindi_script: "इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।", english: "English sentences are more natural." },
      { roman_hindi: "Main bina dare bol sakta hoon.", hindi_script: "मैं बिना डरे बोल सकता हूँ।", english: "I can speak without fear." },
      { roman_hindi: "Agle 30 din aur focus.", hindi_script: "अगले 30 दिन और फ़ोकस।", english: "Next 30 days more focus." },
      { roman_hindi: "Mera goal clear hai.", hindi_script: "मेरा गोल क्लियर है।", english: "My goal is clear." },
      { roman_hindi: "Practice band nahi karni.", hindi_script: "प्रैक्टिस बंद नहीं करनी।", english: "Do not stop practicing." },
      { roman_hindi: "Main apni journey enjoy kar raha hoon.", hindi_script: "मैं अपनी जर्नी एन्जॉय कर रहा हूँ।", english: "I am enjoying my journey." },
      { roman_hindi: "Day 90 tak fluent banunga.", hindi_script: "डे 90 तक फ्लूएंट बनूँगा।", english: "I will be fluent by Day 90." },
    ],
    vocabulary: [
      { word: "milestone", language: "english", meaning: "important achievement point", pronunciation: "MYL-stohn", example: "Day 30 milestone!" },
      { word: "fluent", language: "english", meaning: "speaking smoothly", pronunciation: "FLOO-ent", example: "I want to be fluent." },
      { word: "natural", language: "english", meaning: "not forced", pronunciation: "NACH-ur-ul", example: "Sound natural." },
      { word: "goal", language: "english", meaning: "target", pronunciation: "GOHL", example: "My goal is clear." },
      { word: "journey", language: "english", meaning: "long process", pronunciation: "JER-nee", example: "Enjoy the journey." },
      { word: "safalta", language: "hindi", meaning: "success", pronunciation: "sa-FAL-ta", example: "Safalta milegi." },
      { word: "lakshya", language: "hindi", meaning: "goal", pronunciation: "LAK-shya", example: "Lakshya clear hai." },
      { word: "yatra", language: "hindi", meaning: "journey", pronunciation: "ya-TRA", example: "Yatra acchi hai." },
      { word: "nirantar", language: "hindi", meaning: "continuous", pronunciation: "ni-RAN-tar", example: "Nirantar practice." },
      { word: "pakka", language: "hindi", meaning: "sure/definite", pronunciation: "PAK-ka", example: "Pakka banunga." },
    ],
    paragraph: {
      title: "30 Days Strong",
      content: "Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.",
      hindi_script: "तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।",
      difficulty: "hard",
    },
  },
  {
    theme: "Advanced Conversations",
    focus: "Opinions, debates, storytelling",
    sentences: [
      { roman_hindi: "Mere hisaab se yeh sahi hai.", hindi_script: "मेरे हिसाब से यह सही है।", english: "In my opinion, this is right." },
      { roman_hindi: "Main agree nahi karta.", hindi_script: "मैं अग्री नहीं करता।", english: "I do not agree." },
      { roman_hindi: "Ek kahani sunata hoon.", hindi_script: "एक कहानी सुनाता हूँ।", english: "Let me tell a story." },
      { roman_hindi: "Is vishay par sochna padega.", hindi_script: "इस विषय पर सोचना पड़ेगा।", english: "We need to think about this topic." },
      { roman_hindi: "Mera point of view alag hai.", hindi_script: "मेरा पॉइंट ऑफ़ व्यू अलग है।", english: "My point of view is different." },
      { roman_hindi: "Yeh interesting discussion hai.", hindi_script: "यह इंटरेस्टिंग डिस्कशन है।", english: "This is an interesting discussion." },
      { roman_hindi: "Main detail mein batata hoon.", hindi_script: "मैं डिटेल में बताता हूँ।", english: "I will explain in detail." },
      { roman_hindi: "Pehle suno, phir bolo.", hindi_script: "पहले सुनो, फिर बोलो।", english: "Listen first, then speak." },
      { roman_hindi: "Samjhauta karna zaroori hai.", hindi_script: "समझौता करना ज़रूरी है।", english: "Compromise is necessary." },
      { roman_hindi: "Baat khatam karte hain yahan.", hindi_script: "बात खत्म करते हैं यहाँ।", english: "Let us end the discussion here." },
    ],
    vocabulary: [
      { word: "opinion", language: "english", meaning: "personal view", pronunciation: "uh-PIN-yun", example: "Share your opinion." },
      { word: "discuss", language: "english", meaning: "talk about", pronunciation: "dis-KUS", example: "Let us discuss." },
      { word: "story", language: "english", meaning: "narrative tale", pronunciation: "STOR-ee", example: "Tell a story." },
      { word: "detail", language: "english", meaning: "specific information", pronunciation: "DEE-tayl", example: "Explain in detail." },
      { word: "compromise", language: "english", meaning: "middle agreement", pronunciation: "KOM-pro-myz", example: "Find a compromise." },
      { word: "raay", language: "hindi", meaning: "opinion", pronunciation: "RAAY", example: "Meri raay yeh hai." },
      { word: "vishay", language: "hindi", meaning: "topic", pronunciation: "vi-SHAY", example: "Vishay badlo." },
      { word: "kahani", language: "hindi", meaning: "story", pronunciation: "ka-HA-ni", example: "Kahani suno." },
      { word: "samjhauta", language: "hindi", meaning: "compromise", pronunciation: "sam-JHAU-ta", example: "Samjhauta karo." },
      { word: "vivad", language: "hindi", meaning: "debate/dispute", pronunciation: "vi-VAD", example: "Vivad mat karo." },
    ],
    paragraph: {
      title: "Deep Discussion",
      content: "Aaj humne ek interesting vishay par baat ki. Maine apni raay rakhi aur dusron ki baat dhyaan se suni. Aisi discussion se bolne ki practice hoti hai.",
      hindi_script: "आज हमने एक इंटरेस्टिंग विषय पर बात की। मैंने अपनी राय रखी और दूसरों की बात ध्यान से सुनी। ऐसी डिस्कशन से बोलने की प्रैक्टिस होती है।",
      difficulty: "hard",
    },
  },
];

export function getWeekIndex(dayNumber: number): number {
  const day = Math.max(1, Math.min(90, dayNumber));
  return Math.floor((day - 1) / 7) % CURRICULUM_WEEKS.length;
}

const DAY_FOCUS = [
  "Warm-up & basics",
  "Questions & answers",
  "Describing your day",
  "Asking for help",
  "Expressing opinions",
  "Review & repeat",
  "Weekend conversation",
] as const;

function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr;
  const o = ((offset % arr.length) + arr.length) % arr.length;
  return [...arr.slice(o), ...arr.slice(0, o)];
}

export function getGeneratedCurriculum(dayNumber: number) {
  const day = Math.max(1, Math.min(90, dayNumber));
  const weekIndex = getWeekIndex(day);
  const week = CURRICULUM_WEEKS[weekIndex];
  const weekNumber = Math.floor((day - 1) / 7) + 1;
  const dayInWeek = (day - 1) % 7;

  return {
    dayNumber: day,
    weekNumber,
    theme: week.theme,
    focus: `${week.focus} — ${DAY_FOCUS[dayInWeek]}`,
    sentences: rotate(week.sentences, dayInWeek),
    vocabulary: rotate(week.vocabulary, dayInWeek).map((v, i) => ({
      id: `gen-v-${day}-${i}`,
      ...v,
      day_number: day,
    })),
    paragraph: {
      id: `gen-p-${day}`,
      day_number: day,
      language: "roman_hindi",
      title: `${week.paragraph.title} (Day ${dayInWeek + 1})`,
      content: week.paragraph.content,
      hindi_script: week.paragraph.hindi_script,
      difficulty: week.paragraph.difficulty,
    },
  };
}

export function getCurriculumOverview() {
  return CURRICULUM_WEEKS.map((w, i) => ({
    week: i + 1,
    days: `${i * 7 + 1}-${Math.min((i + 1) * 7, 90)}`,
    theme: w.theme,
    focus: w.focus,
  }));
}
