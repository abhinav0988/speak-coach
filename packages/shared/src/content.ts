export const SHADOWING_SENTENCES = [
  { text: "I speak clearly and confidently every day.", language: "english" },
  { text: "Today I will practice my pronunciation.", language: "english" },
  { text: "Main dheere aur spasht bolunga.", language: "roman_hindi" },
  { text: "Mujhe Hindi bolne ki practice karni hai.", language: "roman_hindi" },
  { text: "I think this is a wonderful opportunity.", language: "english" },
  { text: "Kya tumne khana khaya?", language: "roman_hindi" },
  { text: "Please speak slowly and finish every word.", language: "english" },
  { text: "Main ghar pahunch gaya hoon.", language: "roman_hindi" },
];

export const ROLEPLAY_SCENARIOS = [
  {
    id: "interview",
    title: "Job Interview",
    description: "Practice introducing yourself and answering interview questions.",
    language: "english",
    turns: [
      { role: "interviewer", text: "Good morning! Please tell me about yourself." },
      { role: "interviewer", text: "What are your strengths?" },
      { role: "interviewer", text: "Why do you want this job?" },
      { role: "interviewer", text: "Where do you see yourself in five years?" },
    ],
  },
  {
    id: "shop",
    title: "Shop / Restaurant",
    description: "Order food and ask for the bill.",
    language: "english",
    turns: [
      { role: "waiter", text: "Hello! What would you like to order today?" },
      { role: "waiter", text: "Would you like anything to drink?" },
      { role: "waiter", text: "Is everything okay with your food?" },
      { role: "waiter", text: "Would you like the bill?" },
    ],
  },
  {
    id: "travel",
    title: "Travel & Directions",
    description: "Ask for directions and book a hotel room.",
    language: "english",
    turns: [
      { role: "staff", text: "How can I help you today?" },
      { role: "staff", text: "Do you have a reservation?" },
      { role: "staff", text: "The train station is nearby. Need directions?" },
    ],
  },
  {
    id: "work",
    title: "Work Standup",
    description: "Describe what you did today in a team meeting.",
    language: "english",
    turns: [
      { role: "manager", text: "Good morning team! What did you work on yesterday?" },
      { role: "manager", text: "Any blockers today?" },
      { role: "manager", text: "What is your plan for today?" },
    ],
  },
  {
    id: "friend",
    title: "Friend Chat (Hindi)",
    description: "Casual Hindi conversation with a friend.",
    language: "roman_hindi",
    turns: [
      { role: "friend", text: "Arre, kya haal hai? Aaj kya kar raha hai?" },
      { role: "friend", text: "Chal, kahin ghoomne chalte hain?" },
      { role: "friend", text: "Tumne lunch khaya ya nahi?" },
    ],
  },
];

export const SOUND_GYM_DRILLS = [
  {
    id: "th",
    sound: "TH",
    title: "TH Sound",
    description: "Put tongue between teeth. think, three, thank",
    words: ["think", "three", "thank", "thin", "thick"],
    sentences: ["I think this is good.", "I have three things to do.", "Thank you very much."],
    tongueTwister: "I think I thanked the thin man three times.",
    hindi: false,
  },
  {
    id: "vw",
    sound: "V / W",
    title: "V vs W",
    description: "V = teeth on lip. W = rounded lips.",
    words: ["very", "wine", "vine", "west", "vest"],
    sentences: ["I am very happy.", "We will wait for you.", "This is a wonderful video."],
    tongueTwister: "Victor and William walk very well.",
    hindi: false,
  },
  {
    id: "ra",
    sound: "र",
    title: "Hindi: र (ra)",
    description: "Soft rolled R sound in Hindi.",
    words: ["raasta", "raat", "rang", "raja", "roti"],
    sentences: ["Main raat ko ghar jaunga.", "Yeh raasta sahi hai.", "Rang bahut sundar hai."],
    tongueTwister: "Raja ki roti raat ko ready hui.",
    hindi: true,
  },
  {
    id: "sha",
    sound: "श / स",
    title: "Hindi: श vs स",
    description: "श is palatal, स is dental.",
    words: ["shaanti", "samay", "shiksha", "sabha", "sundar"],
    sentences: ["Shaanti se bolo.", "Samay bahut kam hai.", "Shiksha bahut zaroori hai."],
    tongueTwister: "Samay par shaanti se shiksha lo.",
    hindi: true,
  },
];

export const CHALLENGE_PROMPTS = [
  "Describe your morning routine in 60 seconds.",
  "Talk about your favorite food and why you like it.",
  "Describe your home or room.",
  "What did you learn today?",
  "Tell a short story about something funny that happened.",
  "Aaj ka din kaisa raha? Detail mein batao.",
  "Apne ghar ke baare mein batao.",
  "Aapka favourite khana kya hai?",
];

export const SESSION_STEP_GUIDES = [
  {
    title: "Voice Warm-up",
    duration: "5-8 min",
    instructions: [
      "Breathe in 4 sec, hold 2 sec, exhale 6 sec (5 times)",
      "Hum 'Mmmmmm' for 5 long notes",
      "Say 'Ah-Ee-Oh-Oo' opening mouth wide",
      "Say 'HELLO. I SPEAK CLEARLY.' 5 times, louder each time",
    ],
  },
  {
    title: "English Pronunciation",
    duration: "5 min",
    instructions: [
      "Practice today's sound from Sound Gym",
      "Shadow 3 English sentences aloud",
      "Read a tongue twister slowly, then faster",
    ],
  },
  {
    title: "Hindi Pronunciation",
    duration: "5 min",
    instructions: [
      "Read 3 Hindi sentences from Vocabulary page",
      "Focus on clear word endings: hoon, gaya, nahi",
      "Speak slowly — do not rush",
    ],
  },
  {
    title: "Roman Hindi Correction",
    duration: "5 min",
    instructions: [
      "Write 3 sentences in Roman Hindi",
      "Submit each for correction",
      "Read the corrected version aloud",
    ],
  },
  {
    title: "Mistake Dictionary",
    duration: "3 min",
    instructions: [
      "Review your top 5 repeated mistakes",
      "Use flashcard mode on Mistakes page",
      "Say each correct form aloud 3 times",
    ],
  },
  {
    title: "Conversation Practice",
    duration: "5 min",
    instructions: [
      "Answer: How was your day?",
      "Answer: What are you doing right now?",
      "Use Roleplay for a short scenario",
    ],
  },
  {
    title: "English Correction",
    duration: "5 min",
    instructions: [
      "Write 2 English sentences about your day",
      "Submit for grammar correction",
      "Repeat the natural version aloud",
    ],
  },
  {
    title: "Hindi Sentences",
    duration: "5 min",
    instructions: [
      "Practice all 10 daily Hindi sentences",
      "Say each sentence twice: slow, then natural",
    ],
  },
  {
    title: "Daily Vocabulary",
    duration: "5 min",
    instructions: [
      "Learn 5 English + 5 Hindi words",
      "Use each word in a new sentence",
      "Mark words as known or difficult",
    ],
  },
  {
    title: "Confidence Coach",
    duration: "3 min",
    instructions: [
      "Say: 'Main dheere aur spasht bolunga' 3 times loudly",
      "Rate your confidence 1-10",
      "Write one line: I felt confident when...",
    ],
  },
];

export const PHRASE_CATEGORIES = [
  "greetings", "work", "travel", "feelings", "questions", "general",
] as const;
