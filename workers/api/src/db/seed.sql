-- Curriculum + mistake dictionary seed (no legacy single-user row)

-- Seed mistake dictionary
INSERT OR IGNORE INTO mistakes (id, wrong_form, correct_form, category, repeat_count) VALUES
  ('m1', 'pohach', 'pahunch', 'roman_hindi', 0),
  ('m2', 'pahuch', 'pahunch', 'roman_hindi', 0),
  ('m3', 'gye', 'gaye', 'roman_hindi', 0),
  ('m4', 'gya', 'gaya', 'roman_hindi', 0),
  ('m5', 'rha', 'raha', 'roman_hindi', 0),
  ('m6', 'rhe', 'rahe', 'roman_hindi', 0),
  ('m7', 'rhi', 'rahi', 'roman_hindi', 0),
  ('m8', 'hu', 'hoon', 'roman_hindi', 0),
  ('m9', 'nhi', 'nahi', 'roman_hindi', 0),
  ('m10', 'bajah', 'wajah', 'roman_hindi', 0),
  ('m11', 'kr', 'kar', 'roman_hindi', 0),
  ('m12', 'kro', 'karo', 'roman_hindi', 0),
  ('m13', 'mje', 'mujhe', 'roman_hindi', 0),
  ('m14', 'hmesha', 'hamesha', 'roman_hindi', 0),
  ('m15', 'chalrahehain', 'chal rahe hain', 'roman_hindi', 0);

-- Day 1 sentences
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s1', 1, 'Main subah jaldi uthta hoon.', 'मैं सुबह जल्दी उठता हूँ।', 'I wake up early in the morning.'),
  ('s2', 1, 'Mujhe chai pasand hai.', 'मुझे चाय पसंद है।', 'I like tea.'),
  ('s3', 1, 'Aaj mausam accha hai.', 'आज मौसम अच्छा है।', 'The weather is nice today.'),
  ('s4', 1, 'Main kaam kar raha hoon.', 'मैं काम कर रहा हूँ।', 'I am working.'),
  ('s5', 1, 'Tum kahan ja rahe ho?', 'तुम कहाँ जा रहे हो?', 'Where are you going?'),
  ('s6', 1, 'Main thodi der mein pahunch jaunga.', 'मैं थोड़ी देर में पहुँच जाऊँगा।', 'I will reach in a little while.'),
  ('s7', 1, 'Kya tumne khana khaya?', 'क्या तुमने खाना खाया?', 'Did you eat?'),
  ('s8', 1, 'Mujhe thakawat mehsoos ho rahi hai.', 'मुझे थकावट महसूस हो रही है।', 'I am feeling tired.'),
  ('s9', 1, 'Chalo baat karte hain.', 'चलो बात करते हैं।', 'Let us talk.'),
  ('s10', 1, 'Main seekh raha hoon.', 'मैं सीख रहा हूँ।', 'I am learning.');

-- Day 1 vocabulary
INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v1', 'reach', 'english', 'to arrive', 'REECH', 'I will reach at 5 PM.', 1),
  ('v2', 'clear', 'english', 'easy to understand', 'KLEER', 'Please speak clearly.', 1),
  ('v3', 'confident', 'english', 'sure and bold', 'KON-fih-dent', 'I want to sound confident.', 1),
  ('v4', 'practice', 'english', 'repeated training', 'PRAK-tis', 'I practice every day.', 1),
  ('v5', 'improve', 'english', 'become better', 'im-PROOV', 'I want to improve my Hindi.', 1),
  ('v6', 'pahunchna', 'hindi', 'to reach', 'pah-HOONCH-na', 'Main ghar pahunch gaya.', 1),
  ('v7', 'spasht', 'hindi', 'clear', 'SPASHT', 'Spasht bolo.', 1),
  ('v8', 'aatmavishwas', 'hindi', 'confidence', 'aat-ma-VISH-waas', 'Mujhe aatmavishwas chahiye.', 1),
  ('v9', 'abhyas', 'hindi', 'practice', 'ab-HYAAS', 'Roz abhyas karo.', 1),
  ('v10', 'sudhaar', 'hindi', 'improvement', 'su-DHAAR', 'Aaj sudhaar hua.', 1);

-- Day 1 paragraph
INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES
  ('p1', 1, 'roman_hindi', 'My Morning', 'Aaj main subah jaldi utha. Maine nashta kiya aur office ke liye nikla. Mausam bahut accha tha. Main samay par pahunch gaya.', 'आज मैं सुबह जल्दी उठा। मैंने नाश्ता किया और ऑफिस के लिए निकला। मौसम बहुत अच्छा था। मैं समय पर पहुँच गया।', 'easy');
