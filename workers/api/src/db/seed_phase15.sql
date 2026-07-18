-- Phase 15: auto-generated curriculum seed days 8-90
-- Regenerate: npm run db:seed:generate -w @speak-coach/api

-- Day 8: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s8_0', 8, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.'),
  ('s8_1', 8, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.'),
  ('s8_2', 8, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.'),
  ('s8_3', 8, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?'),
  ('s8_4', 8, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.'),
  ('s8_5', 8, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.'),
  ('s8_6', 8, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s8_7', 8, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s8_8', 8, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s8_9', 8, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v8_0', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 8),
  ('v8_1', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 8),
  ('v8_2', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 8),
  ('v8_3', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 8),
  ('v8_4', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 8),
  ('v8_5', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 8),
  ('v8_6', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 8),
  ('v8_7', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 8),
  ('v8_8', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 8),
  ('v8_9', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 8);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p8', 8, 'roman_hindi', 'At Work (Day 1)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 9: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s9_0', 9, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.'),
  ('s9_1', 9, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.'),
  ('s9_2', 9, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?'),
  ('s9_3', 9, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.'),
  ('s9_4', 9, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.'),
  ('s9_5', 9, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s9_6', 9, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s9_7', 9, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s9_8', 9, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.'),
  ('s9_9', 9, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v9_0', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 9),
  ('v9_1', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 9),
  ('v9_2', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 9),
  ('v9_3', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 9),
  ('v9_4', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 9),
  ('v9_5', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 9),
  ('v9_6', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 9),
  ('v9_7', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 9),
  ('v9_8', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 9),
  ('v9_9', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 9);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p9', 9, 'roman_hindi', 'At Work (Day 2)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 10: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s10_0', 10, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.'),
  ('s10_1', 10, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?'),
  ('s10_2', 10, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.'),
  ('s10_3', 10, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.'),
  ('s10_4', 10, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s10_5', 10, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s10_6', 10, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s10_7', 10, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.'),
  ('s10_8', 10, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.'),
  ('s10_9', 10, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v10_0', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 10),
  ('v10_1', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 10),
  ('v10_2', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 10),
  ('v10_3', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 10),
  ('v10_4', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 10),
  ('v10_5', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 10),
  ('v10_6', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 10),
  ('v10_7', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 10),
  ('v10_8', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 10),
  ('v10_9', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 10);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p10', 10, 'roman_hindi', 'At Work (Day 3)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 11: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s11_0', 11, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?'),
  ('s11_1', 11, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.'),
  ('s11_2', 11, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.'),
  ('s11_3', 11, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s11_4', 11, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s11_5', 11, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s11_6', 11, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.'),
  ('s11_7', 11, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.'),
  ('s11_8', 11, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.'),
  ('s11_9', 11, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v11_0', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 11),
  ('v11_1', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 11),
  ('v11_2', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 11),
  ('v11_3', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 11),
  ('v11_4', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 11),
  ('v11_5', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 11),
  ('v11_6', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 11),
  ('v11_7', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 11),
  ('v11_8', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 11),
  ('v11_9', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 11);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p11', 11, 'roman_hindi', 'At Work (Day 4)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 12: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s12_0', 12, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.'),
  ('s12_1', 12, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.'),
  ('s12_2', 12, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s12_3', 12, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s12_4', 12, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s12_5', 12, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.'),
  ('s12_6', 12, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.'),
  ('s12_7', 12, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.'),
  ('s12_8', 12, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.'),
  ('s12_9', 12, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v12_0', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 12),
  ('v12_1', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 12),
  ('v12_2', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 12),
  ('v12_3', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 12),
  ('v12_4', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 12),
  ('v12_5', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 12),
  ('v12_6', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 12),
  ('v12_7', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 12),
  ('v12_8', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 12),
  ('v12_9', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 12);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p12', 12, 'roman_hindi', 'At Work (Day 5)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 13: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s13_0', 13, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.'),
  ('s13_1', 13, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s13_2', 13, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s13_3', 13, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s13_4', 13, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.'),
  ('s13_5', 13, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.'),
  ('s13_6', 13, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.'),
  ('s13_7', 13, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.'),
  ('s13_8', 13, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?'),
  ('s13_9', 13, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v13_0', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 13),
  ('v13_1', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 13),
  ('v13_2', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 13),
  ('v13_3', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 13),
  ('v13_4', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 13),
  ('v13_5', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 13),
  ('v13_6', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 13),
  ('v13_7', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 13),
  ('v13_8', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 13),
  ('v13_9', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 13);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p13', 13, 'roman_hindi', 'At Work (Day 6)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 14: Work & Office
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s14_0', 14, 'Main thoda busy hoon.', 'मैं थोड़ा व्यस्त हूँ।', 'I am a little busy.'),
  ('s14_1', 14, 'Baad mein baat karte hain.', 'बाद में बात करते हैं।', 'Let us talk later.'),
  ('s14_2', 14, 'Mujhe samajh aa gaya.', 'मुझे समझ आ गया।', 'I understood.'),
  ('s14_3', 14, 'Shukriya, bahut madad hui.', 'शुक्रिया, बहुत मदद हुई।', 'Thank you, it helped a lot.'),
  ('s14_4', 14, 'Main office ja raha hoon.', 'मैं ऑफिस जा रहा हूँ।', 'I am going to the office.'),
  ('s14_5', 14, 'Aaj meeting hai.', 'आज मीटिंग है।', 'There is a meeting today.'),
  ('s14_6', 14, 'Mujhe report likhni hai.', 'मुझे रिपोर्ट लिखनी है।', 'I need to write a report.'),
  ('s14_7', 14, 'Kya aap madad kar sakte hain?', 'क्या आप मदद कर सकते हैं?', 'Can you help me?'),
  ('s14_8', 14, 'Main samay par pahunchunga.', 'मैं समय पर पहुँचूँगा।', 'I will arrive on time.'),
  ('s14_9', 14, 'Yeh kaam zaroori hai.', 'यह काम ज़रूरी है।', 'This work is important.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v14_0', 'vyast', 'hindi', 'busy', 'vy-AST', 'Main vyast hoon.', 14),
  ('v14_1', 'madad', 'hindi', 'help', 'ma-DAD', 'Madad chahiye.', 14),
  ('v14_2', 'kaam', 'hindi', 'work', 'KAAM', 'Kaam khatam karo.', 14),
  ('v14_3', 'report', 'hindi', 'report', 'ri-PORT', 'Report submit karo.', 14),
  ('v14_4', 'meeting', 'english', 'planned discussion', 'MEE-ting', 'We have a meeting at 10.', 14),
  ('v14_5', 'deadline', 'english', 'last date to finish', 'DED-line', 'The deadline is Friday.', 14),
  ('v14_6', 'report', 'english', 'written summary', 'ri-PORT', 'I finished the report.', 14),
  ('v14_7', 'busy', 'english', 'having much work', 'BIZ-ee', 'I am busy today.', 14),
  ('v14_8', 'team', 'english', 'group working together', 'TEEM', 'Our team is strong.', 14),
  ('v14_9', 'samay', 'hindi', 'time', 'sa-MAY', 'Samay par aao.', 14);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p14', 14, 'roman_hindi', 'At Work (Day 7)', 'Aaj office mein bahut kaam tha. Maine ek meeting attend ki aur report likhi. Samay par sab kuch complete kiya. Boss ne meri madad ki.', 'आज ऑफिस में बहुत काम था। मैंने एक मीटिंग अटेंड की और रिपोर्ट लिखी। समय पर सब कुछ कम्प्लीट किया। बॉस ने मेरी मदद की।', 'easy');

-- Day 15: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s15_0', 15, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.'),
  ('s15_1', 15, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?'),
  ('s15_2', 15, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.'),
  ('s15_3', 15, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.'),
  ('s15_4', 15, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?'),
  ('s15_5', 15, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.'),
  ('s15_6', 15, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s15_7', 15, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s15_8', 15, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s15_9', 15, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v15_0', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 15),
  ('v15_1', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 15),
  ('v15_2', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 15),
  ('v15_3', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 15),
  ('v15_4', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 15),
  ('v15_5', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 15),
  ('v15_6', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 15),
  ('v15_7', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 15),
  ('v15_8', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 15),
  ('v15_9', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 15);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p15', 15, 'roman_hindi', 'Shopping (Day 1)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 16: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s16_0', 16, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?'),
  ('s16_1', 16, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.'),
  ('s16_2', 16, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.'),
  ('s16_3', 16, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?'),
  ('s16_4', 16, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.'),
  ('s16_5', 16, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s16_6', 16, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s16_7', 16, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s16_8', 16, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.'),
  ('s16_9', 16, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v16_0', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 16),
  ('v16_1', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 16),
  ('v16_2', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 16),
  ('v16_3', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 16),
  ('v16_4', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 16),
  ('v16_5', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 16),
  ('v16_6', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 16),
  ('v16_7', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 16),
  ('v16_8', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 16),
  ('v16_9', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 16);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p16', 16, 'roman_hindi', 'Shopping (Day 2)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 17: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s17_0', 17, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.'),
  ('s17_1', 17, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.'),
  ('s17_2', 17, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?'),
  ('s17_3', 17, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.'),
  ('s17_4', 17, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s17_5', 17, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s17_6', 17, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s17_7', 17, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.'),
  ('s17_8', 17, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.'),
  ('s17_9', 17, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v17_0', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 17),
  ('v17_1', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 17),
  ('v17_2', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 17),
  ('v17_3', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 17),
  ('v17_4', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 17),
  ('v17_5', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 17),
  ('v17_6', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 17),
  ('v17_7', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 17),
  ('v17_8', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 17),
  ('v17_9', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 17);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p17', 17, 'roman_hindi', 'Shopping (Day 3)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 18: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s18_0', 18, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.'),
  ('s18_1', 18, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?'),
  ('s18_2', 18, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.'),
  ('s18_3', 18, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s18_4', 18, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s18_5', 18, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s18_6', 18, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.'),
  ('s18_7', 18, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.'),
  ('s18_8', 18, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?'),
  ('s18_9', 18, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v18_0', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 18),
  ('v18_1', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 18),
  ('v18_2', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 18),
  ('v18_3', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 18),
  ('v18_4', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 18),
  ('v18_5', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 18),
  ('v18_6', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 18),
  ('v18_7', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 18),
  ('v18_8', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 18),
  ('v18_9', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 18);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p18', 18, 'roman_hindi', 'Shopping (Day 4)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 19: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s19_0', 19, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?'),
  ('s19_1', 19, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.'),
  ('s19_2', 19, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s19_3', 19, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s19_4', 19, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s19_5', 19, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.'),
  ('s19_6', 19, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.'),
  ('s19_7', 19, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?'),
  ('s19_8', 19, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.'),
  ('s19_9', 19, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v19_0', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 19),
  ('v19_1', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 19),
  ('v19_2', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 19),
  ('v19_3', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 19),
  ('v19_4', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 19),
  ('v19_5', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 19),
  ('v19_6', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 19),
  ('v19_7', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 19),
  ('v19_8', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 19),
  ('v19_9', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 19);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p19', 19, 'roman_hindi', 'Shopping (Day 5)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 20: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s20_0', 20, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.'),
  ('s20_1', 20, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s20_2', 20, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s20_3', 20, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s20_4', 20, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.'),
  ('s20_5', 20, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.'),
  ('s20_6', 20, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?'),
  ('s20_7', 20, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.'),
  ('s20_8', 20, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.'),
  ('s20_9', 20, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v20_0', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 20),
  ('v20_1', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 20),
  ('v20_2', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 20),
  ('v20_3', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 20),
  ('v20_4', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 20),
  ('v20_5', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 20),
  ('v20_6', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 20),
  ('v20_7', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 20),
  ('v20_8', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 20),
  ('v20_9', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 20);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p20', 20, 'roman_hindi', 'Shopping (Day 6)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 21: Shopping & Market
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s21_0', 21, 'Main card se dunga.', 'मैं कार्ड से दूँगा।', 'I will pay by card.'),
  ('s21_1', 21, 'Ghar le jaana hai.', 'घर ले जाना है।', 'Need to take it home.'),
  ('s21_2', 21, 'Bahut accha maal hai.', 'बहुत अच्छा माल है।', 'Very good quality.'),
  ('s21_3', 21, 'Phir milenge.', 'फिर मिलेंगे।', 'See you again.'),
  ('s21_4', 21, 'Main market ja raha hoon.', 'मैं मार्केट जा रहा हूँ।', 'I am going to the market.'),
  ('s21_5', 21, 'Kitne paise honge?', 'कितने पैसे होंगे?', 'How much will it cost?'),
  ('s21_6', 21, 'Thoda sasta karo please.', 'थोड़ा सस्ता करो प्लीज़।', 'Please make it cheaper.'),
  ('s21_7', 21, 'Mujhe yeh chahiye.', 'मुझे यह चाहिए।', 'I want this.'),
  ('s21_8', 21, 'Kya yeh fresh hai?', 'क्या यह ताज़ा है?', 'Is this fresh?'),
  ('s21_9', 21, 'Bill de dijiye.', 'बिल दे दीजिए।', 'Please give the bill.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v21_0', 'taza', 'hindi', 'fresh', 'ta-ZA', 'Sabzi tazi hai.', 21),
  ('v21_1', 'sasta', 'hindi', 'cheap', 'SAS-ta', 'Thoda sasta karo.', 21),
  ('v21_2', 'khareedna', 'hindi', 'to buy', 'kha-REED-na', 'Yeh khareed lo.', 21),
  ('v21_3', 'maal', 'hindi', 'goods', 'MAAL', 'Accha maal hai.', 21),
  ('v21_4', 'price', 'english', 'cost', 'PRYS', 'What is the price?', 21),
  ('v21_5', 'fresh', 'english', 'new, not old', 'FRESH', 'Is it fresh?', 21),
  ('v21_6', 'cheap', 'english', 'low cost', 'CHEEP', 'Make it cheaper.', 21),
  ('v21_7', 'bill', 'english', 'payment receipt', 'BIL', 'Give me the bill.', 21),
  ('v21_8', 'quality', 'english', 'how good something is', 'KWOL-i-tee', 'Good quality.', 21),
  ('v21_9', 'daam', 'hindi', 'price', 'DAAM', 'Daam kya hai?', 21);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p21', 21, 'roman_hindi', 'Shopping (Day 7)', 'Main market gaya. Sabzi fresh thi lekin daam thoda zyada tha. Maine thoda sasta karwaya. Bill pay karke ghar aa gaya.', 'मैं मार्केट गया। सब्ज़ी ताज़ी थी लेकिन दाम थोड़ा ज़्यादा था। मैंने थोड़ा सस्ता करवाया। बिल पे करके घर आ गया।', 'easy');

-- Day 22: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s22_0', 22, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.'),
  ('s22_1', 22, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?'),
  ('s22_2', 22, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?'),
  ('s22_3', 22, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?'),
  ('s22_4', 22, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?'),
  ('s22_5', 22, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.'),
  ('s22_6', 22, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s22_7', 22, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s22_8', 22, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s22_9', 22, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v22_0', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 22),
  ('v22_1', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 22),
  ('v22_2', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 22),
  ('v22_3', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 22),
  ('v22_4', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 22),
  ('v22_5', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 22),
  ('v22_6', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 22),
  ('v22_7', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 22),
  ('v22_8', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 22),
  ('v22_9', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 22);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p22', 22, 'roman_hindi', 'Travel Day (Day 1)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 23: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s23_0', 23, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?'),
  ('s23_1', 23, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?'),
  ('s23_2', 23, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?'),
  ('s23_3', 23, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?'),
  ('s23_4', 23, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.'),
  ('s23_5', 23, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s23_6', 23, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s23_7', 23, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s23_8', 23, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.'),
  ('s23_9', 23, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v23_0', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 23),
  ('v23_1', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 23),
  ('v23_2', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 23),
  ('v23_3', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 23),
  ('v23_4', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 23),
  ('v23_5', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 23),
  ('v23_6', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 23),
  ('v23_7', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 23),
  ('v23_8', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 23),
  ('v23_9', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 23);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p23', 23, 'roman_hindi', 'Travel Day (Day 2)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 24: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s24_0', 24, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?'),
  ('s24_1', 24, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?'),
  ('s24_2', 24, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?'),
  ('s24_3', 24, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.'),
  ('s24_4', 24, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s24_5', 24, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s24_6', 24, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s24_7', 24, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.'),
  ('s24_8', 24, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.'),
  ('s24_9', 24, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v24_0', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 24),
  ('v24_1', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 24),
  ('v24_2', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 24),
  ('v24_3', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 24),
  ('v24_4', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 24),
  ('v24_5', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 24),
  ('v24_6', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 24),
  ('v24_7', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 24),
  ('v24_8', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 24),
  ('v24_9', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 24);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p24', 24, 'roman_hindi', 'Travel Day (Day 3)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 25: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s25_0', 25, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?'),
  ('s25_1', 25, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?'),
  ('s25_2', 25, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.'),
  ('s25_3', 25, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s25_4', 25, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s25_5', 25, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s25_6', 25, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.'),
  ('s25_7', 25, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.'),
  ('s25_8', 25, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?'),
  ('s25_9', 25, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v25_0', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 25),
  ('v25_1', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 25),
  ('v25_2', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 25),
  ('v25_3', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 25),
  ('v25_4', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 25),
  ('v25_5', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 25),
  ('v25_6', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 25),
  ('v25_7', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 25),
  ('v25_8', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 25),
  ('v25_9', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 25);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p25', 25, 'roman_hindi', 'Travel Day (Day 4)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 26: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s26_0', 26, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?'),
  ('s26_1', 26, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.'),
  ('s26_2', 26, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s26_3', 26, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s26_4', 26, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s26_5', 26, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.'),
  ('s26_6', 26, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.'),
  ('s26_7', 26, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?'),
  ('s26_8', 26, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?'),
  ('s26_9', 26, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v26_0', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 26),
  ('v26_1', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 26),
  ('v26_2', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 26),
  ('v26_3', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 26),
  ('v26_4', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 26),
  ('v26_5', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 26),
  ('v26_6', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 26),
  ('v26_7', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 26),
  ('v26_8', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 26),
  ('v26_9', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 26);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p26', 26, 'roman_hindi', 'Travel Day (Day 5)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 27: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s27_0', 27, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.'),
  ('s27_1', 27, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s27_2', 27, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s27_3', 27, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s27_4', 27, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.'),
  ('s27_5', 27, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.'),
  ('s27_6', 27, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?'),
  ('s27_7', 27, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?'),
  ('s27_8', 27, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?'),
  ('s27_9', 27, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v27_0', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 27),
  ('v27_1', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 27),
  ('v27_2', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 27),
  ('v27_3', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 27),
  ('v27_4', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 27),
  ('v27_5', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 27),
  ('v27_6', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 27),
  ('v27_7', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 27),
  ('v27_8', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 27),
  ('v27_9', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 27);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p27', 27, 'roman_hindi', 'Travel Day (Day 6)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 28: Travel & Directions
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s28_0', 28, 'Rasta batayiye please.', 'रास्ता बताइए प्लीज़।', 'Please show the way.'),
  ('s28_1', 28, 'Hotel kahan hai?', 'होटल कहाँ है?', 'Where is the hotel?'),
  ('s28_2', 28, 'Main kho gaya hoon.', 'मैं खो गया हूँ।', 'I am lost.'),
  ('s28_3', 28, 'Madad ke liye dhanyavaad.', 'मदद के लिए धन्यवाद।', 'Thanks for the help.'),
  ('s28_4', 28, 'Main travel kar raha hoon.', 'मैं ट्रैवल कर रहा हूँ।', 'I am traveling.'),
  ('s28_5', 28, 'Ticket kahan milegi?', 'टिकट कहाँ मिलेगी?', 'Where will I get the ticket?'),
  ('s28_6', 28, 'Train kitne baje hai?', 'ट्रेन कितने बजे है?', 'What time is the train?'),
  ('s28_7', 28, 'Platform number kya hai?', 'प्लेटफ़ॉर्म नंबर क्या है?', 'What is the platform number?'),
  ('s28_8', 28, 'Mera seat kahan hai?', 'मेरा सीट कहाँ है?', 'Where is my seat?'),
  ('s28_9', 28, 'Station par utarna hai.', 'स्टेशन पर उतरना है।', 'I need to get off at the station.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v28_0', 'safar', 'hindi', 'journey', 'sa-FAR', 'Safar accha raha.', 28),
  ('v28_1', 'map', 'hindi', 'map', 'MAP', 'Map dekho.', 28),
  ('v28_2', 'booking', 'hindi', 'reservation', 'BOOK-ing', 'Booking confirm hai.', 28),
  ('v28_3', 'station', 'hindi', 'station', 'STAY-shun', 'Station aa gaya.', 28),
  ('v28_4', 'ticket', 'english', 'travel pass', 'TIK-et', 'Buy a ticket.', 28),
  ('v28_5', 'platform', 'english', 'train boarding area', 'PLAT-form', 'Which platform?', 28),
  ('v28_6', 'station', 'english', 'train stop', 'STAY-shun', 'Get off at the station.', 28),
  ('v28_7', 'hotel', 'english', 'place to stay', 'ho-TEL', 'Book a hotel.', 28),
  ('v28_8', 'direction', 'english', 'way to go', 'di-REK-shun', 'Show direction.', 28),
  ('v28_9', 'rasta', 'hindi', 'path/way', 'RAS-ta', 'Rasta batayo.', 28);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p28', 28, 'roman_hindi', 'Travel Day (Day 7)', 'Main station pahuncha. Ticket li aur sahi platform par gaya. Train time par aayi. Hotel tak pahunchne mein thodi madad chahiye thi.', 'मैं स्टेशन पहुँचा। टिकट ली और सही प्लेटफ़ॉर्म पर गया। ट्रेन टाइम पर आई। होटल तक पहुँचने में थोड़ी मदद चाहिए थी।', 'medium');

-- Day 29: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s29_0', 29, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.'),
  ('s29_1', 29, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.'),
  ('s29_2', 29, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...'),
  ('s29_3', 29, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.'),
  ('s29_4', 29, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.'),
  ('s29_5', 29, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.'),
  ('s29_6', 29, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s29_7', 29, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s29_8', 29, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s29_9', 29, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v29_0', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 29),
  ('v29_1', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 29),
  ('v29_2', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 29),
  ('v29_3', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 29),
  ('v29_4', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 29),
  ('v29_5', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 29),
  ('v29_6', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 29),
  ('v29_7', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 29),
  ('v29_8', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 29),
  ('v29_9', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 29);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p29', 29, 'roman_hindi', 'Interview (Day 1)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 30: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s30_0', 30, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.'),
  ('s30_1', 30, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...'),
  ('s30_2', 30, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.'),
  ('s30_3', 30, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.'),
  ('s30_4', 30, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.'),
  ('s30_5', 30, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s30_6', 30, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s30_7', 30, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s30_8', 30, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.'),
  ('s30_9', 30, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v30_0', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 30),
  ('v30_1', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 30),
  ('v30_2', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 30),
  ('v30_3', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 30),
  ('v30_4', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 30),
  ('v30_5', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 30),
  ('v30_6', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 30),
  ('v30_7', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 30),
  ('v30_8', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 30),
  ('v30_9', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 30);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p30', 30, 'roman_hindi', 'Interview (Day 2)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 31: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s31_0', 31, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...'),
  ('s31_1', 31, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.'),
  ('s31_2', 31, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.'),
  ('s31_3', 31, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.'),
  ('s31_4', 31, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s31_5', 31, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s31_6', 31, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s31_7', 31, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.'),
  ('s31_8', 31, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.'),
  ('s31_9', 31, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v31_0', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 31),
  ('v31_1', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 31),
  ('v31_2', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 31),
  ('v31_3', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 31),
  ('v31_4', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 31),
  ('v31_5', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 31),
  ('v31_6', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 31),
  ('v31_7', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 31),
  ('v31_8', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 31),
  ('v31_9', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 31);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p31', 31, 'roman_hindi', 'Interview (Day 3)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 32: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s32_0', 32, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.'),
  ('s32_1', 32, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.'),
  ('s32_2', 32, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.'),
  ('s32_3', 32, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s32_4', 32, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s32_5', 32, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s32_6', 32, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.'),
  ('s32_7', 32, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.'),
  ('s32_8', 32, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.'),
  ('s32_9', 32, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v32_0', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 32),
  ('v32_1', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 32),
  ('v32_2', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 32),
  ('v32_3', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 32),
  ('v32_4', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 32),
  ('v32_5', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 32),
  ('v32_6', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 32),
  ('v32_7', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 32),
  ('v32_8', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 32),
  ('v32_9', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 32);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p32', 32, 'roman_hindi', 'Interview (Day 4)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 33: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s33_0', 33, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.'),
  ('s33_1', 33, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.'),
  ('s33_2', 33, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s33_3', 33, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s33_4', 33, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s33_5', 33, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.'),
  ('s33_6', 33, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.'),
  ('s33_7', 33, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.'),
  ('s33_8', 33, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...'),
  ('s33_9', 33, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v33_0', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 33),
  ('v33_1', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 33),
  ('v33_2', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 33),
  ('v33_3', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 33),
  ('v33_4', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 33),
  ('v33_5', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 33),
  ('v33_6', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 33),
  ('v33_7', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 33),
  ('v33_8', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 33),
  ('v33_9', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 33);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p33', 33, 'roman_hindi', 'Interview (Day 5)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 34: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s34_0', 34, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.'),
  ('s34_1', 34, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s34_2', 34, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s34_3', 34, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s34_4', 34, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.'),
  ('s34_5', 34, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.'),
  ('s34_6', 34, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.'),
  ('s34_7', 34, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...'),
  ('s34_8', 34, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.'),
  ('s34_9', 34, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v34_0', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 34),
  ('v34_1', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 34),
  ('v34_2', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 34),
  ('v34_3', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 34),
  ('v34_4', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 34),
  ('v34_5', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 34),
  ('v34_6', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 34),
  ('v34_7', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 34),
  ('v34_8', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 34),
  ('v34_9', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 34);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p34', 34, 'roman_hindi', 'Interview (Day 6)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 35: Interview & Career
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s35_0', 35, 'Mujhe yeh role pasand hai.', 'मुझे यह रोल पसंद है।', 'I like this role.'),
  ('s35_1', 35, 'Main seekhne ke liye taiyar hoon.', 'मैं सीखने के लिए तैयार हूँ।', 'I am ready to learn.'),
  ('s35_2', 35, 'Aapka sawal accha hai.', 'आपका सवाल अच्छा है।', 'That is a good question.'),
  ('s35_3', 35, 'Mujhe umeed hai.', 'मुझे उम्मीद है।', 'I am hopeful.'),
  ('s35_4', 35, 'Main interview ke liye gaya.', 'मैं इंटरव्यू के लिए गया।', 'I went for an interview.'),
  ('s35_5', 35, 'Apna introduction dijiye.', 'अपना इंट्रोडक्शन दीजिए।', 'Please give your introduction.'),
  ('s35_6', 35, 'Mera naam hai...', 'मेरा नाम है...', 'My name is...'),
  ('s35_7', 35, 'Main engineer hoon.', 'मैं इंजीनियर हूँ।', 'I am an engineer.'),
  ('s35_8', 35, 'Mere paas experience hai.', 'मेरे पास अनुभव है।', 'I have experience.'),
  ('s35_9', 35, 'Main team mein kaam karta hoon.', 'मैं टीम में काम करता हूँ।', 'I work in a team.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v35_0', 'umeed', 'hindi', 'hope', 'u-MEED', 'Mujhe umeed hai.', 35),
  ('v35_1', 'sawal', 'hindi', 'question', 'sa-WAL', 'Sawal pucho.', 35),
  ('v35_2', 'jawab', 'hindi', 'answer', 'ja-WAB', 'Jawab do.', 35),
  ('v35_3', 'naukri', 'hindi', 'job', 'NAUK-ri', 'Naukri mil gayi.', 35),
  ('v35_4', 'interview', 'english', 'job Q&A meeting', 'IN-ter-vyoo', 'I have an interview.', 35),
  ('v35_5', 'experience', 'english', 'past work knowledge', 'ik-SPEER-ee-ens', 'I have 3 years experience.', 35),
  ('v35_6', 'skill', 'english', 'ability', 'SKIL', 'I have good skills.', 35),
  ('v35_7', 'goal', 'english', 'target', 'GOHL', 'My goal is to grow.', 35),
  ('v35_8', 'resume', 'english', 'CV document', 'REZ-oo-may', 'I sent my resume.', 35),
  ('v35_9', 'anubhav', 'hindi', 'experience', 'a-nu-BHAV', 'Mera anubhav hai.', 35);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p35', 35, 'roman_hindi', 'Interview (Day 7)', 'Aaj mera interview tha. Maine apna introduction diya aur experience bataya. Main confident tha. Interviewer ne acche sawal puche.', 'आज मेरा इंटरव्यू था। मैंने अपना इंट्रोडक्शन दिया और अनुभव बताया। मैं कॉन्फ़िडेंट था। इंटरव्यूअर ने अच्छे सवाल पूछे।', 'medium');

-- Day 36: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s36_0', 36, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.'),
  ('s36_1', 36, 'Kya haal hai?', 'क्या हाल है?', 'How are you?'),
  ('s36_2', 36, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.'),
  ('s36_3', 36, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?'),
  ('s36_4', 36, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.'),
  ('s36_5', 36, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.'),
  ('s36_6', 36, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s36_7', 36, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s36_8', 36, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s36_9', 36, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v36_0', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 36),
  ('v36_1', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 36),
  ('v36_2', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 36),
  ('v36_3', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 36),
  ('v36_4', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 36),
  ('v36_5', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 36),
  ('v36_6', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 36),
  ('v36_7', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 36),
  ('v36_8', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 36),
  ('v36_9', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 36);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p36', 36, 'roman_hindi', 'With Friends (Day 1)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 37: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s37_0', 37, 'Kya haal hai?', 'क्या हाल है?', 'How are you?'),
  ('s37_1', 37, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.'),
  ('s37_2', 37, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?'),
  ('s37_3', 37, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.'),
  ('s37_4', 37, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.'),
  ('s37_5', 37, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s37_6', 37, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s37_7', 37, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s37_8', 37, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.'),
  ('s37_9', 37, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v37_0', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 37),
  ('v37_1', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 37),
  ('v37_2', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 37),
  ('v37_3', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 37),
  ('v37_4', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 37),
  ('v37_5', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 37),
  ('v37_6', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 37),
  ('v37_7', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 37),
  ('v37_8', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 37),
  ('v37_9', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 37);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p37', 37, 'roman_hindi', 'With Friends (Day 2)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 38: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s38_0', 38, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.'),
  ('s38_1', 38, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?'),
  ('s38_2', 38, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.'),
  ('s38_3', 38, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.'),
  ('s38_4', 38, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s38_5', 38, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s38_6', 38, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s38_7', 38, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.'),
  ('s38_8', 38, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.'),
  ('s38_9', 38, 'Kya haal hai?', 'क्या हाल है?', 'How are you?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v38_0', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 38),
  ('v38_1', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 38),
  ('v38_2', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 38),
  ('v38_3', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 38),
  ('v38_4', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 38),
  ('v38_5', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 38),
  ('v38_6', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 38),
  ('v38_7', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 38),
  ('v38_8', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 38),
  ('v38_9', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 38);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p38', 38, 'roman_hindi', 'With Friends (Day 3)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 39: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s39_0', 39, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?'),
  ('s39_1', 39, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.'),
  ('s39_2', 39, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.'),
  ('s39_3', 39, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s39_4', 39, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s39_5', 39, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s39_6', 39, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.'),
  ('s39_7', 39, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.'),
  ('s39_8', 39, 'Kya haal hai?', 'क्या हाल है?', 'How are you?'),
  ('s39_9', 39, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v39_0', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 39),
  ('v39_1', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 39),
  ('v39_2', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 39),
  ('v39_3', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 39),
  ('v39_4', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 39),
  ('v39_5', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 39),
  ('v39_6', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 39),
  ('v39_7', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 39),
  ('v39_8', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 39),
  ('v39_9', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 39);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p39', 39, 'roman_hindi', 'With Friends (Day 4)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 40: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s40_0', 40, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.'),
  ('s40_1', 40, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.'),
  ('s40_2', 40, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s40_3', 40, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s40_4', 40, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s40_5', 40, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.'),
  ('s40_6', 40, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.'),
  ('s40_7', 40, 'Kya haal hai?', 'क्या हाल है?', 'How are you?'),
  ('s40_8', 40, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.'),
  ('s40_9', 40, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v40_0', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 40),
  ('v40_1', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 40),
  ('v40_2', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 40),
  ('v40_3', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 40),
  ('v40_4', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 40),
  ('v40_5', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 40),
  ('v40_6', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 40),
  ('v40_7', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 40),
  ('v40_8', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 40),
  ('v40_9', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 40);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p40', 40, 'roman_hindi', 'With Friends (Day 5)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 41: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s41_0', 41, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.'),
  ('s41_1', 41, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s41_2', 41, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s41_3', 41, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s41_4', 41, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.'),
  ('s41_5', 41, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.'),
  ('s41_6', 41, 'Kya haal hai?', 'क्या हाल है?', 'How are you?'),
  ('s41_7', 41, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.'),
  ('s41_8', 41, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?'),
  ('s41_9', 41, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v41_0', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 41),
  ('v41_1', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 41),
  ('v41_2', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 41),
  ('v41_3', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 41),
  ('v41_4', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 41),
  ('v41_5', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 41),
  ('v41_6', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 41),
  ('v41_7', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 41),
  ('v41_8', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 41),
  ('v41_9', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 41);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p41', 41, 'roman_hindi', 'With Friends (Day 6)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 42: Friends & Social
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s42_0', 42, 'Tum bahut acche ho.', 'तुम बहुत अच्छे हो।', 'You are very nice.'),
  ('s42_1', 42, 'Kal milte hain.', 'कल मिलते हैं।', 'See you tomorrow.'),
  ('s42_2', 42, 'Apna khayal rakho.', 'अपना ख्याल रखो।', 'Take care.'),
  ('s42_3', 42, 'Tumhari yaad aati hai.', 'तुम्हारी याद आती है।', 'I miss you.'),
  ('s42_4', 42, 'Dost se baat kar raha hoon.', 'दोस्त से बात कर रहा हूँ।', 'Talking with a friend.'),
  ('s42_5', 42, 'Kya haal hai?', 'क्या हाल है?', 'How are you?'),
  ('s42_6', 42, 'Main theek hoon.', 'मैं ठीक हूँ।', 'I am fine.'),
  ('s42_7', 42, 'Aaj kya plan hai?', 'आज क्या प्लान है?', 'What is the plan today?'),
  ('s42_8', 42, 'Chalo kahin ghoomte hain.', 'चलो कहीं घूमते हैं।', 'Let us go somewhere.'),
  ('s42_9', 42, 'Bahut maza aaya.', 'बहुत मज़ा आया।', 'Had a lot of fun.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v42_0', 'maza', 'hindi', 'fun', 'MA-za', 'Bahut maza aaya.', 42),
  ('v42_1', 'yaad', 'hindi', 'memory/miss', 'YAAD', 'Tumhari yaad aati hai.', 42),
  ('v42_2', 'khayal', 'hindi', 'care', 'kha-YAL', 'Apna khayal rakho.', 42),
  ('v42_3', 'ghoomna', 'hindi', 'to roam', 'GHOOM-na', 'Chalo ghoomte hain.', 42),
  ('v42_4', 'friend', 'english', 'close person', 'FREND', 'He is my friend.', 42),
  ('v42_5', 'plan', 'english', 'arrangement', 'PLAN', 'What is the plan?', 42),
  ('v42_6', 'fun', 'english', 'enjoyment', 'FUN', 'We had fun.', 42),
  ('v42_7', 'miss', 'english', 'feel absence of', 'MIS', 'I miss you.', 42),
  ('v42_8', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'Let us go together.', 42),
  ('v42_9', 'dost', 'hindi', 'friend', 'DOST', 'Mera dost hai.', 42);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p42', 42, 'roman_hindi', 'With Friends (Day 7)', 'Aaj main apne dost se mila. Hum ne baat ki aur bahar ghoomne ka plan banaya. Bahut maza aaya. Kal phir milenge.', 'आज मैं अपने दोस्त से मिला। हमने बात की और बाहर घूमने का प्लान बनाया। बहुत मज़ा आया। कल फिर मिलेंगे।', 'easy');

-- Day 43: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s43_0', 43, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.'),
  ('s43_1', 43, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.'),
  ('s43_2', 43, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.'),
  ('s43_3', 43, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.'),
  ('s43_4', 43, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.'),
  ('s43_5', 43, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.'),
  ('s43_6', 43, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s43_7', 43, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s43_8', 43, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s43_9', 43, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v43_0', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 43),
  ('v43_1', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 43),
  ('v43_2', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 43),
  ('v43_3', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 43),
  ('v43_4', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 43),
  ('v43_5', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 43),
  ('v43_6', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 43),
  ('v43_7', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 43),
  ('v43_8', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 43),
  ('v43_9', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 43);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p43', 43, 'roman_hindi', 'One Week Done (Day 1)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 44: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s44_0', 44, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.'),
  ('s44_1', 44, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.'),
  ('s44_2', 44, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.'),
  ('s44_3', 44, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.'),
  ('s44_4', 44, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.'),
  ('s44_5', 44, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s44_6', 44, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s44_7', 44, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s44_8', 44, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.'),
  ('s44_9', 44, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v44_0', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 44),
  ('v44_1', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 44),
  ('v44_2', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 44),
  ('v44_3', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 44),
  ('v44_4', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 44),
  ('v44_5', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 44),
  ('v44_6', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 44),
  ('v44_7', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 44),
  ('v44_8', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 44),
  ('v44_9', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 44);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p44', 44, 'roman_hindi', 'One Week Done (Day 2)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 45: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s45_0', 45, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.'),
  ('s45_1', 45, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.'),
  ('s45_2', 45, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.'),
  ('s45_3', 45, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.'),
  ('s45_4', 45, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s45_5', 45, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s45_6', 45, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s45_7', 45, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.'),
  ('s45_8', 45, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.'),
  ('s45_9', 45, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v45_0', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 45),
  ('v45_1', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 45),
  ('v45_2', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 45),
  ('v45_3', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 45),
  ('v45_4', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 45),
  ('v45_5', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 45),
  ('v45_6', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 45),
  ('v45_7', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 45),
  ('v45_8', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 45),
  ('v45_9', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 45);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p45', 45, 'roman_hindi', 'One Week Done (Day 3)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 46: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s46_0', 46, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.'),
  ('s46_1', 46, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.'),
  ('s46_2', 46, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.'),
  ('s46_3', 46, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s46_4', 46, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s46_5', 46, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s46_6', 46, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.'),
  ('s46_7', 46, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.'),
  ('s46_8', 46, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.'),
  ('s46_9', 46, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v46_0', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 46),
  ('v46_1', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 46),
  ('v46_2', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 46),
  ('v46_3', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 46),
  ('v46_4', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 46),
  ('v46_5', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 46),
  ('v46_6', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 46),
  ('v46_7', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 46),
  ('v46_8', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 46),
  ('v46_9', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 46);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p46', 46, 'roman_hindi', 'One Week Done (Day 4)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 47: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s47_0', 47, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.'),
  ('s47_1', 47, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.'),
  ('s47_2', 47, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s47_3', 47, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s47_4', 47, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s47_5', 47, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.'),
  ('s47_6', 47, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.'),
  ('s47_7', 47, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.'),
  ('s47_8', 47, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.'),
  ('s47_9', 47, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v47_0', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 47),
  ('v47_1', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 47),
  ('v47_2', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 47),
  ('v47_3', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 47),
  ('v47_4', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 47),
  ('v47_5', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 47),
  ('v47_6', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 47),
  ('v47_7', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 47),
  ('v47_8', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 47),
  ('v47_9', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 47);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p47', 47, 'roman_hindi', 'One Week Done (Day 5)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 48: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s48_0', 48, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.'),
  ('s48_1', 48, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s48_2', 48, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s48_3', 48, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s48_4', 48, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.'),
  ('s48_5', 48, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.'),
  ('s48_6', 48, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.'),
  ('s48_7', 48, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.'),
  ('s48_8', 48, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.'),
  ('s48_9', 48, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v48_0', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 48),
  ('v48_1', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 48),
  ('v48_2', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 48),
  ('v48_3', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 48),
  ('v48_4', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 48),
  ('v48_5', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 48),
  ('v48_6', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 48),
  ('v48_7', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 48),
  ('v48_8', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 48),
  ('v48_9', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 48);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p48', 48, 'roman_hindi', 'One Week Done (Day 6)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 49: Week 1 Review
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s49_0', 49, 'Galtiyan seekhne ka hissa hain.', 'गलतियाँ सीखने का हिस्सा हैं।', 'Mistakes are part of learning.'),
  ('s49_1', 49, 'Agle hafte aur strong.', 'अगले हफ़्ते और स्ट्रॉन्ग।', 'Next week even stronger.'),
  ('s49_2', 49, 'Main proud hoon apne aap par.', 'मैं प्राउड हूँ अपने आप पर।', 'I am proud of myself.'),
  ('s49_3', 49, 'Chalo aage badhte hain.', 'चलो आगे बढ़ते हैं।', 'Let us move forward.'),
  ('s49_4', 49, 'Ek hafta ho gaya practice karte.', 'एक हफ़्ता हो गया प्रैक्टिस करते।', 'One week of practice done.'),
  ('s49_5', 49, 'Main behtar bol raha hoon.', 'मैं बेहतर बोल रहा हूँ।', 'I am speaking better.'),
  ('s49_6', 49, 'Mistakes kam ho rahi hain.', 'मिस्टेक्स कम हो रही हैं।', 'Mistakes are reducing.'),
  ('s49_7', 49, 'Awaaz zyada clear hai.', 'आवाज़ ज़्यादा क्लियर है।', 'Voice is clearer.'),
  ('s49_8', 49, 'Main confident mehsoos kar raha hoon.', 'मैं कॉन्फ़िडेंट महसूस कर रहा हूँ।', 'I feel confident.'),
  ('s49_9', 49, 'Roz thoda practice karo.', 'रोज़ थोड़ा प्रैक्टिस करो।', 'Practice a little every day.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v49_0', 'galti', 'hindi', 'mistake', 'GAL-ti', 'Galti mat karo.', 49),
  ('v49_1', 'garv', 'hindi', 'pride', 'GARV', 'Mujhe garv hai.', 49),
  ('v49_2', 'aage', 'hindi', 'forward', 'AA-ge', 'Aage badho.', 49),
  ('v49_3', 'aadat', 'hindi', 'habit', 'aa-DAT', 'Acchi aadat banao.', 49),
  ('v49_4', 'progress', 'english', 'improvement over time', 'PROG-res', 'Good progress!', 49),
  ('v49_5', 'habit', 'english', 'regular behavior', 'HAB-it', 'Daily habit helps.', 49),
  ('v49_6', 'mistake', 'english', 'error', 'mis-TAYK', 'Learn from mistakes.', 49),
  ('v49_7', 'proud', 'english', 'happy with achievement', 'PROWD', 'I am proud.', 49),
  ('v49_8', 'consistent', 'english', 'steady, regular', 'kun-SIS-tent', 'Be consistent.', 49),
  ('v49_9', 'pragati', 'hindi', 'progress', 'pra-ga-TI', 'Pragati ho rahi hai.', 49);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p49', 49, 'roman_hindi', 'One Week Done (Day 7)', 'Ek hafta practice ho gaya. Meri awaaz zyada clear hai aur Roman Hindi mistakes kam ho rahi hain. Main apne aap par garv karta hoon. Agle hafte aur strong banunga.', 'एक हफ़्ता प्रैक्टिस हो गया। मेरी आवाज़ ज़्यादा क्लियर है और रोमन हिंदी मिस्टेक्स कम हो रही हैं। मैं अपने आप पर गर्व करता हूँ। अगले हफ़्ते और स्ट्रॉन्ग बनूँगा।', 'medium');

-- Day 50: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s50_0', 50, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.'),
  ('s50_1', 50, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.'),
  ('s50_2', 50, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.'),
  ('s50_3', 50, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.'),
  ('s50_4', 50, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.'),
  ('s50_5', 50, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.'),
  ('s50_6', 50, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s50_7', 50, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s50_8', 50, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s50_9', 50, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v50_0', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 50),
  ('v50_1', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 50),
  ('v50_2', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 50),
  ('v50_3', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 50),
  ('v50_4', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 50),
  ('v50_5', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 50),
  ('v50_6', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 50),
  ('v50_7', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 50),
  ('v50_8', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 50),
  ('v50_9', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 50);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p50', 50, 'roman_hindi', 'Healthy Day (Day 1)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 51: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s51_0', 51, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.'),
  ('s51_1', 51, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.'),
  ('s51_2', 51, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.'),
  ('s51_3', 51, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.'),
  ('s51_4', 51, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.'),
  ('s51_5', 51, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s51_6', 51, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s51_7', 51, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s51_8', 51, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.'),
  ('s51_9', 51, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v51_0', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 51),
  ('v51_1', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 51),
  ('v51_2', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 51),
  ('v51_3', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 51),
  ('v51_4', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 51),
  ('v51_5', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 51),
  ('v51_6', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 51),
  ('v51_7', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 51),
  ('v51_8', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 51),
  ('v51_9', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 51);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p51', 51, 'roman_hindi', 'Healthy Day (Day 2)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 52: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s52_0', 52, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.'),
  ('s52_1', 52, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.'),
  ('s52_2', 52, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.'),
  ('s52_3', 52, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.'),
  ('s52_4', 52, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s52_5', 52, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s52_6', 52, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s52_7', 52, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.'),
  ('s52_8', 52, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.'),
  ('s52_9', 52, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v52_0', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 52),
  ('v52_1', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 52),
  ('v52_2', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 52),
  ('v52_3', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 52),
  ('v52_4', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 52),
  ('v52_5', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 52),
  ('v52_6', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 52),
  ('v52_7', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 52),
  ('v52_8', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 52),
  ('v52_9', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 52);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p52', 52, 'roman_hindi', 'Healthy Day (Day 3)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 53: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s53_0', 53, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.'),
  ('s53_1', 53, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.'),
  ('s53_2', 53, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.'),
  ('s53_3', 53, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s53_4', 53, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s53_5', 53, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s53_6', 53, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.'),
  ('s53_7', 53, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.'),
  ('s53_8', 53, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.'),
  ('s53_9', 53, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v53_0', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 53),
  ('v53_1', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 53),
  ('v53_2', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 53),
  ('v53_3', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 53),
  ('v53_4', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 53),
  ('v53_5', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 53),
  ('v53_6', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 53),
  ('v53_7', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 53),
  ('v53_8', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 53),
  ('v53_9', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 53);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p53', 53, 'roman_hindi', 'Healthy Day (Day 4)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 54: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s54_0', 54, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.'),
  ('s54_1', 54, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.'),
  ('s54_2', 54, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s54_3', 54, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s54_4', 54, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s54_5', 54, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.'),
  ('s54_6', 54, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.'),
  ('s54_7', 54, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.'),
  ('s54_8', 54, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.'),
  ('s54_9', 54, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v54_0', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 54),
  ('v54_1', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 54),
  ('v54_2', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 54),
  ('v54_3', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 54),
  ('v54_4', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 54),
  ('v54_5', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 54),
  ('v54_6', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 54),
  ('v54_7', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 54),
  ('v54_8', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 54),
  ('v54_9', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 54);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p54', 54, 'roman_hindi', 'Healthy Day (Day 5)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 55: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s55_0', 55, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.'),
  ('s55_1', 55, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s55_2', 55, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s55_3', 55, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s55_4', 55, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.'),
  ('s55_5', 55, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.'),
  ('s55_6', 55, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.'),
  ('s55_7', 55, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.'),
  ('s55_8', 55, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.'),
  ('s55_9', 55, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v55_0', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 55),
  ('v55_1', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 55),
  ('v55_2', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 55),
  ('v55_3', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 55),
  ('v55_4', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 55),
  ('v55_5', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 55),
  ('v55_6', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 55),
  ('v55_7', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 55),
  ('v55_8', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 55),
  ('v55_9', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 55);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p55', 55, 'roman_hindi', 'Healthy Day (Day 6)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 56: Health & Fitness
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s56_0', 56, 'Tabiyat theek nahi hai.', 'तबीयत ठीक नहीं है।', 'Not feeling well.'),
  ('s56_1', 56, 'Dawa le li hai.', 'दवा ले ली है।', 'I took medicine.'),
  ('s56_2', 56, 'Stress kam karna hai.', 'स्ट्रेस कम करना है।', 'Need to reduce stress.'),
  ('s56_3', 56, 'Aaj main fresh mehsoos kar raha hoon.', 'आज मैं फ्रेश महसूस कर रहा हूँ।', 'I feel fresh today.'),
  ('s56_4', 56, 'Main roz exercise karta hoon.', 'मैं रोज़ एक्सरसाइज़ करता हूँ।', 'I exercise every day.'),
  ('s56_5', 56, 'Paani zyada peena chahiye.', 'पानी ज़्यादा पीना चाहिए।', 'You should drink more water.'),
  ('s56_6', 56, 'Mujhe neend acchi nahi aayi.', 'मुझे नींद अच्छी नहीं आई।', 'I did not sleep well.'),
  ('s56_7', 56, 'Healthy khana khana zaroori hai.', 'हेल्दी खाना खाना ज़रूरी है।', 'Eating healthy is important.'),
  ('s56_8', 56, 'Doctor se milna chahiye.', 'डॉक्टर से मिलना चाहिए।', 'Should see a doctor.'),
  ('s56_9', 56, 'Main walk par ja raha hoon.', 'मैं वॉक पर जा रहा हूँ।', 'I am going for a walk.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v56_0', 'dawa', 'hindi', 'medicine', 'da-WA', 'Dawa le lo.', 56),
  ('v56_1', 'vyayam', 'hindi', 'exercise', 'vy-A-yam', 'Roz vyayam karo.', 56),
  ('v56_2', 'neend', 'hindi', 'sleep', 'NEEND', 'Neend acchi aayi.', 56),
  ('v56_3', 'tandarust', 'hindi', 'healthy', 'tan-da-RUST', 'Main tandarust hoon.', 56),
  ('v56_4', 'exercise', 'english', 'physical activity', 'EK-ser-syz', 'I exercise daily.', 56),
  ('v56_5', 'healthy', 'english', 'good for body', 'HEL-thee', 'Eat healthy food.', 56),
  ('v56_6', 'sleep', 'english', 'rest at night', 'SLEEP', 'I need more sleep.', 56),
  ('v56_7', 'doctor', 'english', 'medical professional', 'DOK-ter', 'See a doctor.', 56),
  ('v56_8', 'stress', 'english', 'mental pressure', 'STRES', 'Reduce stress.', 56),
  ('v56_9', 'tabiyat', 'hindi', 'health/condition', 'ta-bi-YAT', 'Tabiyat kharab hai.', 56);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p56', 56, 'roman_hindi', 'Healthy Day (Day 7)', 'Aaj main subah walk par gaya. Maine healthy nashta kiya aur paani zyada piya. Shaam ko thoda exercise kiya. Tabiyat acchi lag rahi hai.', 'आज मैं सुबह वॉक पर गया। मैंने हेल्दी नाश्ता किया और पानी ज़्यादा पिया। शाम को थोड़ा एक्सरसाइज़ किया। तबीयत अच्छी लग रही है।', 'medium');

-- Day 57: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s57_0', 57, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.'),
  ('s57_1', 57, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.'),
  ('s57_2', 57, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.'),
  ('s57_3', 57, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.'),
  ('s57_4', 57, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.'),
  ('s57_5', 57, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.'),
  ('s57_6', 57, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s57_7', 57, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s57_8', 57, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s57_9', 57, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v57_0', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 57),
  ('v57_1', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 57),
  ('v57_2', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 57),
  ('v57_3', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 57),
  ('v57_4', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 57),
  ('v57_5', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 57),
  ('v57_6', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 57),
  ('v57_7', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 57),
  ('v57_8', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 57),
  ('v57_9', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 57);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p57', 57, 'roman_hindi', 'At Home (Day 1)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 58: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s58_0', 58, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.'),
  ('s58_1', 58, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.'),
  ('s58_2', 58, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.'),
  ('s58_3', 58, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.'),
  ('s58_4', 58, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.'),
  ('s58_5', 58, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s58_6', 58, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s58_7', 58, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s58_8', 58, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.'),
  ('s58_9', 58, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v58_0', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 58),
  ('v58_1', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 58),
  ('v58_2', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 58),
  ('v58_3', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 58),
  ('v58_4', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 58),
  ('v58_5', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 58),
  ('v58_6', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 58),
  ('v58_7', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 58),
  ('v58_8', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 58),
  ('v58_9', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 58);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p58', 58, 'roman_hindi', 'At Home (Day 2)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 59: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s59_0', 59, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.'),
  ('s59_1', 59, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.'),
  ('s59_2', 59, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.'),
  ('s59_3', 59, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.'),
  ('s59_4', 59, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s59_5', 59, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s59_6', 59, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s59_7', 59, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.'),
  ('s59_8', 59, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.'),
  ('s59_9', 59, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v59_0', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 59),
  ('v59_1', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 59),
  ('v59_2', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 59),
  ('v59_3', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 59),
  ('v59_4', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 59),
  ('v59_5', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 59),
  ('v59_6', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 59),
  ('v59_7', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 59),
  ('v59_8', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 59),
  ('v59_9', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 59);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p59', 59, 'roman_hindi', 'At Home (Day 3)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 60: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s60_0', 60, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.'),
  ('s60_1', 60, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.'),
  ('s60_2', 60, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.'),
  ('s60_3', 60, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s60_4', 60, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s60_5', 60, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s60_6', 60, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.'),
  ('s60_7', 60, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.'),
  ('s60_8', 60, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.'),
  ('s60_9', 60, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v60_0', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 60),
  ('v60_1', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 60),
  ('v60_2', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 60),
  ('v60_3', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 60),
  ('v60_4', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 60),
  ('v60_5', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 60),
  ('v60_6', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 60),
  ('v60_7', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 60),
  ('v60_8', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 60),
  ('v60_9', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 60);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p60', 60, 'roman_hindi', 'At Home (Day 4)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 61: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s61_0', 61, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.'),
  ('s61_1', 61, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.'),
  ('s61_2', 61, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s61_3', 61, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s61_4', 61, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s61_5', 61, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.'),
  ('s61_6', 61, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.'),
  ('s61_7', 61, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.'),
  ('s61_8', 61, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.'),
  ('s61_9', 61, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v61_0', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 61),
  ('v61_1', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 61),
  ('v61_2', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 61),
  ('v61_3', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 61),
  ('v61_4', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 61),
  ('v61_5', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 61),
  ('v61_6', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 61),
  ('v61_7', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 61),
  ('v61_8', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 61),
  ('v61_9', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 61);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p61', 61, 'roman_hindi', 'At Home (Day 5)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 62: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s62_0', 62, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.'),
  ('s62_1', 62, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s62_2', 62, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s62_3', 62, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s62_4', 62, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.'),
  ('s62_5', 62, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.'),
  ('s62_6', 62, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.'),
  ('s62_7', 62, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.'),
  ('s62_8', 62, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.'),
  ('s62_9', 62, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v62_0', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 62),
  ('v62_1', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 62),
  ('v62_2', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 62),
  ('v62_3', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 62),
  ('v62_4', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 62),
  ('v62_5', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 62),
  ('v62_6', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 62),
  ('v62_7', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 62),
  ('v62_8', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 62),
  ('v62_9', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 62);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p62', 62, 'roman_hindi', 'At Home (Day 6)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 63: Family & Home
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s63_0', 63, 'Parivaar ke saath khana khaya.', 'परिवार के साथ खाना खाया।', 'Ate with family.'),
  ('s63_1', 63, 'Ghar par shaant mahaul hai.', 'घर पर शांत माहौल है।', 'Peaceful atmosphere at home.'),
  ('s63_2', 63, 'Mujhe apne ghar se pyaar hai.', 'मुझे अपने घर से प्यार है।', 'I love my home.'),
  ('s63_3', 63, 'Sab log theek hain.', 'सब लोग ठीक हैं।', 'Everyone is fine.'),
  ('s63_4', 63, 'Mera parivaar bahut accha hai.', 'मेरा परिवार बहुत अच्छा है।', 'My family is very nice.'),
  ('s63_5', 63, 'Maa ne khana banaya.', 'माँ ने खाना बनाया।', 'Mom cooked food.'),
  ('s63_6', 63, 'Papa office gaye hain.', 'पापा ऑफिस गए हैं।', 'Dad went to office.'),
  ('s63_7', 63, 'Bhai bahan se baat ki.', 'भाई बहन से बात की।', 'Talked with siblings.'),
  ('s63_8', 63, 'Ghar saaf karna hai.', 'घर साफ़ करना है।', 'Need to clean the house.'),
  ('s63_9', 63, 'Dada dadi se milne jao.', 'दादा दादी से मिलने जाओ।', 'Go meet grandparents.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v63_0', 'ghar', 'hindi', 'home', 'GHAR', 'Ghar aa gaya.', 63),
  ('v63_1', 'maa', 'hindi', 'mother', 'MAA', 'Maa ne khana banaya.', 63),
  ('v63_2', 'pyaar', 'hindi', 'love', 'py-AAR', 'Bahut pyaar hai.', 63),
  ('v63_3', 'rishta', 'hindi', 'relationship', 'RISH-ta', 'Acche rishte rakho.', 63),
  ('v63_4', 'family', 'english', 'relatives at home', 'FAM-i-lee', 'I love my family.', 63),
  ('v63_5', 'parent', 'english', 'mother or father', 'PAIR-ent', 'My parents are kind.', 63),
  ('v63_6', 'home', 'english', 'where you live', 'HOHM', 'I am at home.', 63),
  ('v63_7', 'together', 'english', 'with each other', 'tuh-GEH-ther', 'We eat together.', 63),
  ('v63_8', 'love', 'english', 'deep affection', 'LUV', 'I love my family.', 63),
  ('v63_9', 'parivaar', 'hindi', 'family', 'pa-ri-VAAR', 'Mera parivaar accha hai.', 63);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p63', 63, 'roman_hindi', 'At Home (Day 7)', 'Aaj ghar par shaant din tha. Maa ne accha khana banaya. Hum sab ne saath mein baithkar baat ki. Parivaar ke saath time bitana accha lagta hai.', 'आज घर पर शांत दिन था। माँ ने अच्छा खाना बनाया। हम सब ने साथ में बैठकर बात की। परिवार के साथ टाइम बिताना अच्छा लगता है।', 'easy');

-- Day 64: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s64_0', 64, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?'),
  ('s64_1', 64, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.'),
  ('s64_2', 64, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.'),
  ('s64_3', 64, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.'),
  ('s64_4', 64, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.'),
  ('s64_5', 64, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.'),
  ('s64_6', 64, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s64_7', 64, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s64_8', 64, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s64_9', 64, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v64_0', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 64),
  ('v64_1', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 64),
  ('v64_2', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 64),
  ('v64_3', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 64),
  ('v64_4', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 64),
  ('v64_5', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 64),
  ('v64_6', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 64),
  ('v64_7', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 64),
  ('v64_8', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 64),
  ('v64_9', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 64);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p64', 64, 'roman_hindi', 'Cooking Day (Day 1)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 65: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s65_0', 65, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.'),
  ('s65_1', 65, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.'),
  ('s65_2', 65, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.'),
  ('s65_3', 65, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.'),
  ('s65_4', 65, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.'),
  ('s65_5', 65, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s65_6', 65, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s65_7', 65, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s65_8', 65, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.'),
  ('s65_9', 65, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v65_0', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 65),
  ('v65_1', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 65),
  ('v65_2', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 65),
  ('v65_3', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 65),
  ('v65_4', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 65),
  ('v65_5', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 65),
  ('v65_6', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 65),
  ('v65_7', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 65),
  ('v65_8', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 65),
  ('v65_9', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 65);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p65', 65, 'roman_hindi', 'Cooking Day (Day 2)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 66: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s66_0', 66, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.'),
  ('s66_1', 66, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.'),
  ('s66_2', 66, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.'),
  ('s66_3', 66, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.'),
  ('s66_4', 66, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s66_5', 66, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s66_6', 66, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s66_7', 66, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.'),
  ('s66_8', 66, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?'),
  ('s66_9', 66, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v66_0', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 66),
  ('v66_1', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 66),
  ('v66_2', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 66),
  ('v66_3', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 66),
  ('v66_4', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 66),
  ('v66_5', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 66),
  ('v66_6', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 66),
  ('v66_7', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 66),
  ('v66_8', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 66),
  ('v66_9', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 66);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p66', 66, 'roman_hindi', 'Cooking Day (Day 3)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 67: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s67_0', 67, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.'),
  ('s67_1', 67, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.'),
  ('s67_2', 67, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.'),
  ('s67_3', 67, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s67_4', 67, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s67_5', 67, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s67_6', 67, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.'),
  ('s67_7', 67, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?'),
  ('s67_8', 67, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.'),
  ('s67_9', 67, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v67_0', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 67),
  ('v67_1', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 67),
  ('v67_2', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 67),
  ('v67_3', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 67),
  ('v67_4', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 67),
  ('v67_5', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 67),
  ('v67_6', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 67),
  ('v67_7', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 67),
  ('v67_8', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 67),
  ('v67_9', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 67);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p67', 67, 'roman_hindi', 'Cooking Day (Day 4)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 68: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s68_0', 68, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.'),
  ('s68_1', 68, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.'),
  ('s68_2', 68, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s68_3', 68, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s68_4', 68, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s68_5', 68, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.'),
  ('s68_6', 68, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?'),
  ('s68_7', 68, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.'),
  ('s68_8', 68, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.'),
  ('s68_9', 68, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v68_0', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 68),
  ('v68_1', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 68),
  ('v68_2', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 68),
  ('v68_3', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 68),
  ('v68_4', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 68),
  ('v68_5', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 68),
  ('v68_6', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 68),
  ('v68_7', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 68),
  ('v68_8', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 68),
  ('v68_9', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 68);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p68', 68, 'roman_hindi', 'Cooking Day (Day 5)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 69: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s69_0', 69, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.'),
  ('s69_1', 69, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s69_2', 69, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s69_3', 69, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s69_4', 69, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.'),
  ('s69_5', 69, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?'),
  ('s69_6', 69, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.'),
  ('s69_7', 69, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.'),
  ('s69_8', 69, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.'),
  ('s69_9', 69, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v69_0', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 69),
  ('v69_1', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 69),
  ('v69_2', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 69),
  ('v69_3', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 69),
  ('v69_4', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 69),
  ('v69_5', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 69),
  ('v69_6', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 69),
  ('v69_7', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 69),
  ('v69_8', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 69),
  ('v69_9', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 69);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p69', 69, 'roman_hindi', 'Cooking Day (Day 6)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 70: Food & Cooking
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s70_0', 70, 'Mithai bahut meethi hai.', 'मिठाई बहुत मीठी है।', 'The sweet is very sweet.'),
  ('s70_1', 70, 'Bhook lagi hai.', 'भूख लगी है।', 'I am hungry.'),
  ('s70_2', 70, 'Khana taiyar ho gaya.', 'खाना तैयार हो गया।', 'Food is ready.'),
  ('s70_3', 70, 'Maza aa gaya khane mein.', 'मज़ा आ गया खाने में।', 'Enjoyed the meal.'),
  ('s70_4', 70, 'Aaj kya pakana hai?', 'आज क्या पकाना है?', 'What to cook today?'),
  ('s70_5', 70, 'Mujhe spicy khana pasand hai.', 'मुझे स्पाइसी खाना पसंद है।', 'I like spicy food.'),
  ('s70_6', 70, 'Recipe batayiye.', 'रेसिपी बताइए।', 'Tell me the recipe.'),
  ('s70_7', 70, 'Swad bahut accha hai.', 'स्वाद बहुत अच्छा है।', 'Taste is very good.'),
  ('s70_8', 70, 'Restaurant mein khana khaya.', 'रेस्टोरेंट में खाना खाया।', 'Ate at a restaurant.'),
  ('s70_9', 70, 'Chai bana do please.', 'चाय बना दो प्लीज़।', 'Please make tea.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v70_0', 'bhook', 'hindi', 'hunger', 'BHOOK', 'Bhook lagi hai.', 70),
  ('v70_1', 'pakana', 'hindi', 'to cook', 'pa-KA-na', 'Khana pakao.', 70),
  ('v70_2', 'mithai', 'hindi', 'sweet', 'mi-THAI', 'Mithai lo.', 70),
  ('v70_3', 'nashta', 'hindi', 'breakfast', 'NAS-ta', 'Nashta karo.', 70),
  ('v70_4', 'recipe', 'english', 'cooking instructions', 'RES-i-pee', 'Share the recipe.', 70),
  ('v70_5', 'taste', 'english', 'flavor', 'TAYST', 'Good taste.', 70),
  ('v70_6', 'spicy', 'english', 'hot flavor', 'SPY-see', 'I like spicy food.', 70),
  ('v70_7', 'hungry', 'english', 'wanting food', 'HUN-gree', 'I am hungry.', 70),
  ('v70_8', 'delicious', 'english', 'very tasty', 'di-LISH-us', 'Delicious food!', 70),
  ('v70_9', 'swad', 'hindi', 'taste', 'SWAD', 'Swad accha hai.', 70);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p70', 70, 'roman_hindi', 'Cooking Day (Day 7)', 'Aaj maine ghar par khana banaya. Swad bahut accha nikla. Parivaar ne tareef ki. Restaurant se zyada accha ghar ka khana lagta hai.', 'आज मैंने घर पर खाना बनाया। स्वाद बहुत अच्छा निकला। परिवार ने तारीफ़ की। रेस्टोरेंट से ज़्यादा अच्छा घर का खाना लगता है।', 'medium');

-- Day 71: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s71_0', 71, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.'),
  ('s71_1', 71, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.'),
  ('s71_2', 71, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.'),
  ('s71_3', 71, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.'),
  ('s71_4', 71, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.'),
  ('s71_5', 71, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.'),
  ('s71_6', 71, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s71_7', 71, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s71_8', 71, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s71_9', 71, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v71_0', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 71),
  ('v71_1', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 71),
  ('v71_2', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 71),
  ('v71_3', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 71),
  ('v71_4', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 71),
  ('v71_5', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 71),
  ('v71_6', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 71),
  ('v71_7', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 71),
  ('v71_8', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 71),
  ('v71_9', 'app', 'hindi', 'application', 'APP', 'App kholo.', 71);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p71', 71, 'roman_hindi', 'Tech Day (Day 1)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 72: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s72_0', 72, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.'),
  ('s72_1', 72, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.'),
  ('s72_2', 72, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.'),
  ('s72_3', 72, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.'),
  ('s72_4', 72, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.'),
  ('s72_5', 72, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s72_6', 72, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s72_7', 72, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s72_8', 72, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.'),
  ('s72_9', 72, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v72_0', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 72),
  ('v72_1', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 72),
  ('v72_2', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 72),
  ('v72_3', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 72),
  ('v72_4', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 72),
  ('v72_5', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 72),
  ('v72_6', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 72),
  ('v72_7', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 72),
  ('v72_8', 'app', 'hindi', 'application', 'APP', 'App kholo.', 72),
  ('v72_9', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 72);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p72', 72, 'roman_hindi', 'Tech Day (Day 2)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 73: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s73_0', 73, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.'),
  ('s73_1', 73, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.'),
  ('s73_2', 73, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.'),
  ('s73_3', 73, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.'),
  ('s73_4', 73, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s73_5', 73, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s73_6', 73, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s73_7', 73, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.'),
  ('s73_8', 73, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.'),
  ('s73_9', 73, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v73_0', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 73),
  ('v73_1', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 73),
  ('v73_2', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 73),
  ('v73_3', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 73),
  ('v73_4', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 73),
  ('v73_5', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 73),
  ('v73_6', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 73),
  ('v73_7', 'app', 'hindi', 'application', 'APP', 'App kholo.', 73),
  ('v73_8', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 73),
  ('v73_9', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 73);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p73', 73, 'roman_hindi', 'Tech Day (Day 3)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 74: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s74_0', 74, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.'),
  ('s74_1', 74, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.'),
  ('s74_2', 74, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.'),
  ('s74_3', 74, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s74_4', 74, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s74_5', 74, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s74_6', 74, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.'),
  ('s74_7', 74, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.'),
  ('s74_8', 74, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.'),
  ('s74_9', 74, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v74_0', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 74),
  ('v74_1', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 74),
  ('v74_2', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 74),
  ('v74_3', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 74),
  ('v74_4', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 74),
  ('v74_5', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 74),
  ('v74_6', 'app', 'hindi', 'application', 'APP', 'App kholo.', 74),
  ('v74_7', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 74),
  ('v74_8', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 74),
  ('v74_9', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 74);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p74', 74, 'roman_hindi', 'Tech Day (Day 4)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 75: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s75_0', 75, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.'),
  ('s75_1', 75, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.'),
  ('s75_2', 75, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s75_3', 75, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s75_4', 75, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s75_5', 75, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.'),
  ('s75_6', 75, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.'),
  ('s75_7', 75, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.'),
  ('s75_8', 75, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.'),
  ('s75_9', 75, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v75_0', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 75),
  ('v75_1', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 75),
  ('v75_2', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 75),
  ('v75_3', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 75),
  ('v75_4', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 75),
  ('v75_5', 'app', 'hindi', 'application', 'APP', 'App kholo.', 75),
  ('v75_6', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 75),
  ('v75_7', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 75),
  ('v75_8', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 75),
  ('v75_9', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 75);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p75', 75, 'roman_hindi', 'Tech Day (Day 5)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 76: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s76_0', 76, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.'),
  ('s76_1', 76, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s76_2', 76, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s76_3', 76, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s76_4', 76, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.'),
  ('s76_5', 76, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.'),
  ('s76_6', 76, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.'),
  ('s76_7', 76, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.'),
  ('s76_8', 76, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.'),
  ('s76_9', 76, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v76_0', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 76),
  ('v76_1', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 76),
  ('v76_2', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 76),
  ('v76_3', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 76),
  ('v76_4', 'app', 'hindi', 'application', 'APP', 'App kholo.', 76),
  ('v76_5', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 76),
  ('v76_6', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 76),
  ('v76_7', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 76),
  ('v76_8', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 76),
  ('v76_9', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 76);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p76', 76, 'roman_hindi', 'Tech Day (Day 6)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 77: Phone & Technology
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s77_0', 77, 'Message bhej diya.', 'मैसेज भेज दिया।', 'Sent the message.'),
  ('s77_1', 77, 'WiFi connect nahi ho raha.', 'वाईफ़ाई कनेक्ट नहीं हो रहा।', 'WiFi is not connecting.'),
  ('s77_2', 77, 'Naya phone lena hai.', 'नया फ़ोन लेना है।', 'Need to buy a new phone.'),
  ('s77_3', 77, 'Technology bahut tez badh rahi hai.', 'टेक्नोलॉजी बहुत तेज़ बढ़ रही है।', 'Technology is growing fast.'),
  ('s77_4', 77, 'Mera phone charge khatam ho gaya.', 'मेरा फ़ोन चार्ज खत्म हो गया।', 'My phone battery died.'),
  ('s77_5', 77, 'Internet slow hai aaj.', 'इंटरनेट स्लो है आज।', 'Internet is slow today.'),
  ('s77_6', 77, 'App download kar li.', 'ऐप डाउनलोड कर ली।', 'Downloaded the app.'),
  ('s77_7', 77, 'Video call karte hain.', 'वीडियो कॉल करते हैं।', 'Let us video call.'),
  ('s77_8', 77, 'Password yaad nahi hai.', 'पासवर्ड याद नहीं है।', 'I forgot the password.'),
  ('s77_9', 77, 'Laptop par kaam kar raha hoon.', 'लैपटॉप पर काम कर रहा हूँ।', 'Working on laptop.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v77_0', 'internet', 'hindi', 'internet', 'IN-ter-net', 'Internet slow hai.', 77),
  ('v77_1', 'sandesh', 'hindi', 'message', 'san-DESH', 'Sandesh bhejo.', 77),
  ('v77_2', 'charge', 'hindi', 'battery charge', 'CHAARJ', 'Charge lagao.', 77),
  ('v77_3', 'app', 'hindi', 'application', 'APP', 'App kholo.', 77),
  ('v77_4', 'download', 'english', 'get from internet', 'DOWN-lohd', 'Download the app.', 77),
  ('v77_5', 'password', 'english', 'secret login code', 'PAS-werd', 'Enter password.', 77),
  ('v77_6', 'message', 'english', 'text sent to someone', 'MES-ij', 'Send a message.', 77),
  ('v77_7', 'battery', 'english', 'phone power', 'BAT-uh-ree', 'Low battery.', 77),
  ('v77_8', 'connect', 'english', 'link together', 'kuh-NEKT', 'Connect to WiFi.', 77),
  ('v77_9', 'phone', 'hindi', 'phone', 'FONE', 'Phone charge karo.', 77);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p77', 77, 'roman_hindi', 'Tech Day (Day 7)', 'Aaj maine nayi app download ki. Video call par doston se baat ki. Internet thoda slow tha lekin kaam ho gaya. Technology se kaam aasan hota hai.', 'आज मैंने नई ऐप डाउनलोड की। वीडियो कॉल पर दोस्तों से बात की। इंटरनेट थोड़ा स्लो था लेकिन काम हो गया। टेक्नोलॉजी से काम आसान होता है।', 'medium');

-- Day 78: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s78_0', 78, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.'),
  ('s78_1', 78, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.'),
  ('s78_2', 78, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.'),
  ('s78_3', 78, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.'),
  ('s78_4', 78, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.'),
  ('s78_5', 78, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.'),
  ('s78_6', 78, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s78_7', 78, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s78_8', 78, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s78_9', 78, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v78_0', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 78),
  ('v78_1', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 78),
  ('v78_2', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 78),
  ('v78_3', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 78),
  ('v78_4', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 78),
  ('v78_5', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 78),
  ('v78_6', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 78),
  ('v78_7', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 78),
  ('v78_8', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 78),
  ('v78_9', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 78);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p78', 78, 'roman_hindi', 'Building Confidence (Day 1)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 79: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s79_0', 79, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.'),
  ('s79_1', 79, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.'),
  ('s79_2', 79, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.'),
  ('s79_3', 79, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.'),
  ('s79_4', 79, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.'),
  ('s79_5', 79, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s79_6', 79, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s79_7', 79, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s79_8', 79, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.'),
  ('s79_9', 79, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v79_0', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 79),
  ('v79_1', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 79),
  ('v79_2', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 79),
  ('v79_3', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 79),
  ('v79_4', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 79),
  ('v79_5', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 79),
  ('v79_6', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 79),
  ('v79_7', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 79),
  ('v79_8', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 79),
  ('v79_9', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 79);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p79', 79, 'roman_hindi', 'Building Confidence (Day 2)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 80: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s80_0', 80, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.'),
  ('s80_1', 80, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.'),
  ('s80_2', 80, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.'),
  ('s80_3', 80, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.'),
  ('s80_4', 80, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s80_5', 80, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s80_6', 80, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s80_7', 80, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.'),
  ('s80_8', 80, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.'),
  ('s80_9', 80, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v80_0', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 80),
  ('v80_1', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 80),
  ('v80_2', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 80),
  ('v80_3', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 80),
  ('v80_4', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 80),
  ('v80_5', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 80),
  ('v80_6', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 80),
  ('v80_7', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 80),
  ('v80_8', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 80),
  ('v80_9', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 80);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p80', 80, 'roman_hindi', 'Building Confidence (Day 3)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 81: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s81_0', 81, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.'),
  ('s81_1', 81, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.'),
  ('s81_2', 81, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.'),
  ('s81_3', 81, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s81_4', 81, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s81_5', 81, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s81_6', 81, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.'),
  ('s81_7', 81, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.'),
  ('s81_8', 81, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.'),
  ('s81_9', 81, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v81_0', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 81),
  ('v81_1', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 81),
  ('v81_2', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 81),
  ('v81_3', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 81),
  ('v81_4', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 81),
  ('v81_5', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 81),
  ('v81_6', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 81),
  ('v81_7', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 81),
  ('v81_8', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 81),
  ('v81_9', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 81);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p81', 81, 'roman_hindi', 'Building Confidence (Day 4)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 82: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s82_0', 82, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.'),
  ('s82_1', 82, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.'),
  ('s82_2', 82, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s82_3', 82, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s82_4', 82, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s82_5', 82, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.'),
  ('s82_6', 82, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.'),
  ('s82_7', 82, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.'),
  ('s82_8', 82, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.'),
  ('s82_9', 82, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v82_0', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 82),
  ('v82_1', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 82),
  ('v82_2', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 82),
  ('v82_3', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 82),
  ('v82_4', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 82),
  ('v82_5', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 82),
  ('v82_6', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 82),
  ('v82_7', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 82),
  ('v82_8', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 82),
  ('v82_9', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 82);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p82', 82, 'roman_hindi', 'Building Confidence (Day 5)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 83: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s83_0', 83, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.'),
  ('s83_1', 83, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s83_2', 83, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s83_3', 83, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s83_4', 83, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.'),
  ('s83_5', 83, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.'),
  ('s83_6', 83, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.'),
  ('s83_7', 83, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.'),
  ('s83_8', 83, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.'),
  ('s83_9', 83, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v83_0', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 83),
  ('v83_1', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 83),
  ('v83_2', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 83),
  ('v83_3', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 83),
  ('v83_4', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 83),
  ('v83_5', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 83),
  ('v83_6', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 83),
  ('v83_7', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 83),
  ('v83_8', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 83),
  ('v83_9', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 83);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p83', 83, 'roman_hindi', 'Building Confidence (Day 6)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 84: Emotions & Confidence
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s84_0', 84, 'Mujhe motivation chahiye.', 'मुझे मोटिवेशन चाहिए।', 'I need motivation.'),
  ('s84_1', 84, 'Main strong hoon.', 'मैं स्ट्रॉन्ग हूँ।', 'I am strong.'),
  ('s84_2', 84, 'Kal se naya start.', 'कल से नया स्टार्ट।', 'Fresh start from tomorrow.'),
  ('s84_3', 84, 'Main jeetunga.', 'मैं जीतूँगा।', 'I will succeed.'),
  ('s84_4', 84, 'Main khush hoon aaj.', 'मैं खुश हूँ आज।', 'I am happy today.'),
  ('s84_5', 84, 'Thoda nervous lag raha hai.', 'थोड़ा नर्वस लग रहा है।', 'Feeling a little nervous.'),
  ('s84_6', 84, 'Main himmat karunga.', 'मैं हिम्मत करूँगा।', 'I will be brave.'),
  ('s84_7', 84, 'Galti se seekha.', 'गलती से सीखा।', 'Learned from the mistake.'),
  ('s84_8', 84, 'Main apne aap par bharosa karta hoon.', 'मैं अपने आप पर भरोसा करता हूँ।', 'I trust myself.'),
  ('s84_9', 84, 'Aaj ka din accha gaya.', 'आज का दिन अच्छा गया।', 'Today went well.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v84_0', 'himmat', 'hindi', 'courage', 'HIM-mat', 'Himmat rakho.', 84),
  ('v84_1', 'bharosa', 'hindi', 'trust', 'bha-RO-sa', 'Apne par bharosa.', 84),
  ('v84_2', 'jeet', 'hindi', 'victory', 'JEET', 'Jeet tumhari hai.', 84),
  ('v84_3', 'tension', 'hindi', 'stress/worry', 'TEN-shun', 'Tension mat lo.', 84),
  ('v84_4', 'confident', 'english', 'self-assured', 'KON-fih-dent', 'Stay confident.', 84),
  ('v84_5', 'nervous', 'english', 'anxious', 'NER-vus', 'I feel nervous.', 84),
  ('v84_6', 'brave', 'english', 'courageous', 'BRAYV', 'Be brave.', 84),
  ('v84_7', 'motivation', 'english', 'drive to act', 'moh-tih-VAY-shun', 'I need motivation.', 84),
  ('v84_8', 'trust', 'english', 'believe in', 'TRUST', 'Trust yourself.', 84),
  ('v84_9', 'khushi', 'hindi', 'happiness', 'khu-SHI', 'Bahut khushi hai.', 84);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p84', 84, 'roman_hindi', 'Building Confidence (Day 7)', 'Kabhi nervous feel hota hai lekin practice se confidence badhti hai. Main roz thoda bolta hoon aur har din behtar hota hoon. Main jeetunga.', 'कभी नर्वस फ़ील होता है लेकिन प्रैक्टिस से कॉन्फ़िडेंस बढ़ती है। मैं रोज़ थोड़ा बोलता हूँ और हर दिन बेहतर होता हूँ। मैं जीतूँगा।', 'medium');

-- Day 85: Month 1 Milestone
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s85_0', 85, 'Tees din poore ho gaye.', 'तीस दिन पूरे हो गए।', 'Thirty days completed.'),
  ('s85_1', 85, 'Meri bolne ki speed badhi.', 'मेरी बोलने की स्पीड बढ़ी।', 'My speaking speed improved.'),
  ('s85_2', 85, 'Roman Hindi spelling behtar hai.', 'रोमन हिंदी स्पेलिंग बेहतर है।', 'Roman Hindi spelling is better.'),
  ('s85_3', 85, 'English sentences zyada natural hain.', 'इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।', 'English sentences are more natural.'),
  ('s85_4', 85, 'Main bina dare bol sakta hoon.', 'मैं बिना डरे बोल सकता हूँ।', 'I can speak without fear.'),
  ('s85_5', 85, 'Agle 30 din aur focus.', 'अगले 30 दिन और फ़ोकस।', 'Next 30 days more focus.'),
  ('s85_6', 85, 'Mera goal clear hai.', 'मेरा गोल क्लियर है।', 'My goal is clear.'),
  ('s85_7', 85, 'Practice band nahi karni.', 'प्रैक्टिस बंद नहीं करनी।', 'Do not stop practicing.'),
  ('s85_8', 85, 'Main apni journey enjoy kar raha hoon.', 'मैं अपनी जर्नी एन्जॉय कर रहा हूँ।', 'I am enjoying my journey.'),
  ('s85_9', 85, 'Day 90 tak fluent banunga.', 'डे 90 तक फ्लूएंट बनूँगा।', 'I will be fluent by Day 90.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v85_0', 'milestone', 'english', 'important achievement point', 'MYL-stohn', 'Day 30 milestone!', 85),
  ('v85_1', 'fluent', 'english', 'speaking smoothly', 'FLOO-ent', 'I want to be fluent.', 85),
  ('v85_2', 'natural', 'english', 'not forced', 'NACH-ur-ul', 'Sound natural.', 85),
  ('v85_3', 'goal', 'english', 'target', 'GOHL', 'My goal is clear.', 85),
  ('v85_4', 'journey', 'english', 'long process', 'JER-nee', 'Enjoy the journey.', 85),
  ('v85_5', 'safalta', 'hindi', 'success', 'sa-FAL-ta', 'Safalta milegi.', 85),
  ('v85_6', 'lakshya', 'hindi', 'goal', 'LAK-shya', 'Lakshya clear hai.', 85),
  ('v85_7', 'yatra', 'hindi', 'journey', 'ya-TRA', 'Yatra acchi hai.', 85),
  ('v85_8', 'nirantar', 'hindi', 'continuous', 'ni-RAN-tar', 'Nirantar practice.', 85),
  ('v85_9', 'pakka', 'hindi', 'sure/definite', 'PAK-ka', 'Pakka banunga.', 85);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p85', 85, 'roman_hindi', '30 Days Strong (Day 1)', 'Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.', 'तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।', 'hard');

-- Day 86: Month 1 Milestone
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s86_0', 86, 'Meri bolne ki speed badhi.', 'मेरी बोलने की स्पीड बढ़ी।', 'My speaking speed improved.'),
  ('s86_1', 86, 'Roman Hindi spelling behtar hai.', 'रोमन हिंदी स्पेलिंग बेहतर है।', 'Roman Hindi spelling is better.'),
  ('s86_2', 86, 'English sentences zyada natural hain.', 'इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।', 'English sentences are more natural.'),
  ('s86_3', 86, 'Main bina dare bol sakta hoon.', 'मैं बिना डरे बोल सकता हूँ।', 'I can speak without fear.'),
  ('s86_4', 86, 'Agle 30 din aur focus.', 'अगले 30 दिन और फ़ोकस।', 'Next 30 days more focus.'),
  ('s86_5', 86, 'Mera goal clear hai.', 'मेरा गोल क्लियर है।', 'My goal is clear.'),
  ('s86_6', 86, 'Practice band nahi karni.', 'प्रैक्टिस बंद नहीं करनी।', 'Do not stop practicing.'),
  ('s86_7', 86, 'Main apni journey enjoy kar raha hoon.', 'मैं अपनी जर्नी एन्जॉय कर रहा हूँ।', 'I am enjoying my journey.'),
  ('s86_8', 86, 'Day 90 tak fluent banunga.', 'डे 90 तक फ्लूएंट बनूँगा।', 'I will be fluent by Day 90.'),
  ('s86_9', 86, 'Tees din poore ho gaye.', 'तीस दिन पूरे हो गए।', 'Thirty days completed.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v86_0', 'fluent', 'english', 'speaking smoothly', 'FLOO-ent', 'I want to be fluent.', 86),
  ('v86_1', 'natural', 'english', 'not forced', 'NACH-ur-ul', 'Sound natural.', 86),
  ('v86_2', 'goal', 'english', 'target', 'GOHL', 'My goal is clear.', 86),
  ('v86_3', 'journey', 'english', 'long process', 'JER-nee', 'Enjoy the journey.', 86),
  ('v86_4', 'safalta', 'hindi', 'success', 'sa-FAL-ta', 'Safalta milegi.', 86),
  ('v86_5', 'lakshya', 'hindi', 'goal', 'LAK-shya', 'Lakshya clear hai.', 86),
  ('v86_6', 'yatra', 'hindi', 'journey', 'ya-TRA', 'Yatra acchi hai.', 86),
  ('v86_7', 'nirantar', 'hindi', 'continuous', 'ni-RAN-tar', 'Nirantar practice.', 86),
  ('v86_8', 'pakka', 'hindi', 'sure/definite', 'PAK-ka', 'Pakka banunga.', 86),
  ('v86_9', 'milestone', 'english', 'important achievement point', 'MYL-stohn', 'Day 30 milestone!', 86);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p86', 86, 'roman_hindi', '30 Days Strong (Day 2)', 'Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.', 'तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।', 'hard');

-- Day 87: Month 1 Milestone
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s87_0', 87, 'Roman Hindi spelling behtar hai.', 'रोमन हिंदी स्पेलिंग बेहतर है।', 'Roman Hindi spelling is better.'),
  ('s87_1', 87, 'English sentences zyada natural hain.', 'इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।', 'English sentences are more natural.'),
  ('s87_2', 87, 'Main bina dare bol sakta hoon.', 'मैं बिना डरे बोल सकता हूँ।', 'I can speak without fear.'),
  ('s87_3', 87, 'Agle 30 din aur focus.', 'अगले 30 दिन और फ़ोकस।', 'Next 30 days more focus.'),
  ('s87_4', 87, 'Mera goal clear hai.', 'मेरा गोल क्लियर है।', 'My goal is clear.'),
  ('s87_5', 87, 'Practice band nahi karni.', 'प्रैक्टिस बंद नहीं करनी।', 'Do not stop practicing.'),
  ('s87_6', 87, 'Main apni journey enjoy kar raha hoon.', 'मैं अपनी जर्नी एन्जॉय कर रहा हूँ।', 'I am enjoying my journey.'),
  ('s87_7', 87, 'Day 90 tak fluent banunga.', 'डे 90 तक फ्लूएंट बनूँगा।', 'I will be fluent by Day 90.'),
  ('s87_8', 87, 'Tees din poore ho gaye.', 'तीस दिन पूरे हो गए।', 'Thirty days completed.'),
  ('s87_9', 87, 'Meri bolne ki speed badhi.', 'मेरी बोलने की स्पीड बढ़ी।', 'My speaking speed improved.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v87_0', 'natural', 'english', 'not forced', 'NACH-ur-ul', 'Sound natural.', 87),
  ('v87_1', 'goal', 'english', 'target', 'GOHL', 'My goal is clear.', 87),
  ('v87_2', 'journey', 'english', 'long process', 'JER-nee', 'Enjoy the journey.', 87),
  ('v87_3', 'safalta', 'hindi', 'success', 'sa-FAL-ta', 'Safalta milegi.', 87),
  ('v87_4', 'lakshya', 'hindi', 'goal', 'LAK-shya', 'Lakshya clear hai.', 87),
  ('v87_5', 'yatra', 'hindi', 'journey', 'ya-TRA', 'Yatra acchi hai.', 87),
  ('v87_6', 'nirantar', 'hindi', 'continuous', 'ni-RAN-tar', 'Nirantar practice.', 87),
  ('v87_7', 'pakka', 'hindi', 'sure/definite', 'PAK-ka', 'Pakka banunga.', 87),
  ('v87_8', 'milestone', 'english', 'important achievement point', 'MYL-stohn', 'Day 30 milestone!', 87),
  ('v87_9', 'fluent', 'english', 'speaking smoothly', 'FLOO-ent', 'I want to be fluent.', 87);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p87', 87, 'roman_hindi', '30 Days Strong (Day 3)', 'Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.', 'तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।', 'hard');

-- Day 88: Month 1 Milestone
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s88_0', 88, 'English sentences zyada natural hain.', 'इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।', 'English sentences are more natural.'),
  ('s88_1', 88, 'Main bina dare bol sakta hoon.', 'मैं बिना डरे बोल सकता हूँ।', 'I can speak without fear.'),
  ('s88_2', 88, 'Agle 30 din aur focus.', 'अगले 30 दिन और फ़ोकस।', 'Next 30 days more focus.'),
  ('s88_3', 88, 'Mera goal clear hai.', 'मेरा गोल क्लियर है।', 'My goal is clear.'),
  ('s88_4', 88, 'Practice band nahi karni.', 'प्रैक्टिस बंद नहीं करनी।', 'Do not stop practicing.'),
  ('s88_5', 88, 'Main apni journey enjoy kar raha hoon.', 'मैं अपनी जर्नी एन्जॉय कर रहा हूँ।', 'I am enjoying my journey.'),
  ('s88_6', 88, 'Day 90 tak fluent banunga.', 'डे 90 तक फ्लूएंट बनूँगा।', 'I will be fluent by Day 90.'),
  ('s88_7', 88, 'Tees din poore ho gaye.', 'तीस दिन पूरे हो गए।', 'Thirty days completed.'),
  ('s88_8', 88, 'Meri bolne ki speed badhi.', 'मेरी बोलने की स्पीड बढ़ी।', 'My speaking speed improved.'),
  ('s88_9', 88, 'Roman Hindi spelling behtar hai.', 'रोमन हिंदी स्पेलिंग बेहतर है।', 'Roman Hindi spelling is better.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v88_0', 'goal', 'english', 'target', 'GOHL', 'My goal is clear.', 88),
  ('v88_1', 'journey', 'english', 'long process', 'JER-nee', 'Enjoy the journey.', 88),
  ('v88_2', 'safalta', 'hindi', 'success', 'sa-FAL-ta', 'Safalta milegi.', 88),
  ('v88_3', 'lakshya', 'hindi', 'goal', 'LAK-shya', 'Lakshya clear hai.', 88),
  ('v88_4', 'yatra', 'hindi', 'journey', 'ya-TRA', 'Yatra acchi hai.', 88),
  ('v88_5', 'nirantar', 'hindi', 'continuous', 'ni-RAN-tar', 'Nirantar practice.', 88),
  ('v88_6', 'pakka', 'hindi', 'sure/definite', 'PAK-ka', 'Pakka banunga.', 88),
  ('v88_7', 'milestone', 'english', 'important achievement point', 'MYL-stohn', 'Day 30 milestone!', 88),
  ('v88_8', 'fluent', 'english', 'speaking smoothly', 'FLOO-ent', 'I want to be fluent.', 88),
  ('v88_9', 'natural', 'english', 'not forced', 'NACH-ur-ul', 'Sound natural.', 88);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p88', 88, 'roman_hindi', '30 Days Strong (Day 4)', 'Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.', 'तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।', 'hard');

-- Day 89: Month 1 Milestone
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s89_0', 89, 'Main bina dare bol sakta hoon.', 'मैं बिना डरे बोल सकता हूँ।', 'I can speak without fear.'),
  ('s89_1', 89, 'Agle 30 din aur focus.', 'अगले 30 दिन और फ़ोकस।', 'Next 30 days more focus.'),
  ('s89_2', 89, 'Mera goal clear hai.', 'मेरा गोल क्लियर है।', 'My goal is clear.'),
  ('s89_3', 89, 'Practice band nahi karni.', 'प्रैक्टिस बंद नहीं करनी।', 'Do not stop practicing.'),
  ('s89_4', 89, 'Main apni journey enjoy kar raha hoon.', 'मैं अपनी जर्नी एन्जॉय कर रहा हूँ।', 'I am enjoying my journey.'),
  ('s89_5', 89, 'Day 90 tak fluent banunga.', 'डे 90 तक फ्लूएंट बनूँगा।', 'I will be fluent by Day 90.'),
  ('s89_6', 89, 'Tees din poore ho gaye.', 'तीस दिन पूरे हो गए।', 'Thirty days completed.'),
  ('s89_7', 89, 'Meri bolne ki speed badhi.', 'मेरी बोलने की स्पीड बढ़ी।', 'My speaking speed improved.'),
  ('s89_8', 89, 'Roman Hindi spelling behtar hai.', 'रोमन हिंदी स्पेलिंग बेहतर है।', 'Roman Hindi spelling is better.'),
  ('s89_9', 89, 'English sentences zyada natural hain.', 'इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।', 'English sentences are more natural.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v89_0', 'journey', 'english', 'long process', 'JER-nee', 'Enjoy the journey.', 89),
  ('v89_1', 'safalta', 'hindi', 'success', 'sa-FAL-ta', 'Safalta milegi.', 89),
  ('v89_2', 'lakshya', 'hindi', 'goal', 'LAK-shya', 'Lakshya clear hai.', 89),
  ('v89_3', 'yatra', 'hindi', 'journey', 'ya-TRA', 'Yatra acchi hai.', 89),
  ('v89_4', 'nirantar', 'hindi', 'continuous', 'ni-RAN-tar', 'Nirantar practice.', 89),
  ('v89_5', 'pakka', 'hindi', 'sure/definite', 'PAK-ka', 'Pakka banunga.', 89),
  ('v89_6', 'milestone', 'english', 'important achievement point', 'MYL-stohn', 'Day 30 milestone!', 89),
  ('v89_7', 'fluent', 'english', 'speaking smoothly', 'FLOO-ent', 'I want to be fluent.', 89),
  ('v89_8', 'natural', 'english', 'not forced', 'NACH-ur-ul', 'Sound natural.', 89),
  ('v89_9', 'goal', 'english', 'target', 'GOHL', 'My goal is clear.', 89);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p89', 89, 'roman_hindi', '30 Days Strong (Day 5)', 'Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.', 'तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।', 'hard');

-- Day 90: Month 1 Milestone
INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES
  ('s90_0', 90, 'Agle 30 din aur focus.', 'अगले 30 दिन और फ़ोकस।', 'Next 30 days more focus.'),
  ('s90_1', 90, 'Mera goal clear hai.', 'मेरा गोल क्लियर है।', 'My goal is clear.'),
  ('s90_2', 90, 'Practice band nahi karni.', 'प्रैक्टिस बंद नहीं करनी।', 'Do not stop practicing.'),
  ('s90_3', 90, 'Main apni journey enjoy kar raha hoon.', 'मैं अपनी जर्नी एन्जॉय कर रहा हूँ।', 'I am enjoying my journey.'),
  ('s90_4', 90, 'Day 90 tak fluent banunga.', 'डे 90 तक फ्लूएंट बनूँगा।', 'I will be fluent by Day 90.'),
  ('s90_5', 90, 'Tees din poore ho gaye.', 'तीस दिन पूरे हो गए।', 'Thirty days completed.'),
  ('s90_6', 90, 'Meri bolne ki speed badhi.', 'मेरी बोलने की स्पीड बढ़ी।', 'My speaking speed improved.'),
  ('s90_7', 90, 'Roman Hindi spelling behtar hai.', 'रोमन हिंदी स्पेलिंग बेहतर है।', 'Roman Hindi spelling is better.'),
  ('s90_8', 90, 'English sentences zyada natural hain.', 'इंग्लिश सेंटेंस ज़्यादा नैचुरल हैं।', 'English sentences are more natural.'),
  ('s90_9', 90, 'Main bina dare bol sakta hoon.', 'मैं बिना डरे बोल सकता हूँ।', 'I can speak without fear.');

INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES
  ('v90_0', 'safalta', 'hindi', 'success', 'sa-FAL-ta', 'Safalta milegi.', 90),
  ('v90_1', 'lakshya', 'hindi', 'goal', 'LAK-shya', 'Lakshya clear hai.', 90),
  ('v90_2', 'yatra', 'hindi', 'journey', 'ya-TRA', 'Yatra acchi hai.', 90),
  ('v90_3', 'nirantar', 'hindi', 'continuous', 'ni-RAN-tar', 'Nirantar practice.', 90),
  ('v90_4', 'pakka', 'hindi', 'sure/definite', 'PAK-ka', 'Pakka banunga.', 90),
  ('v90_5', 'milestone', 'english', 'important achievement point', 'MYL-stohn', 'Day 30 milestone!', 90),
  ('v90_6', 'fluent', 'english', 'speaking smoothly', 'FLOO-ent', 'I want to be fluent.', 90),
  ('v90_7', 'natural', 'english', 'not forced', 'NACH-ur-ul', 'Sound natural.', 90),
  ('v90_8', 'goal', 'english', 'target', 'GOHL', 'My goal is clear.', 90),
  ('v90_9', 'journey', 'english', 'long process', 'JER-nee', 'Enjoy the journey.', 90);

INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p90', 90, 'roman_hindi', '30 Days Strong (Day 6)', 'Tees din practice ke baad main bahut aage aa gaya hoon. Meri awaaz clear hai, Roman Hindi sudhar gayi hai, aur English zyada natural lagti hai. Agle 60 din aur mazboot banunga.', 'तीस दिन प्रैक्टिस के बाद मैं बहुत आगे आ गया हूँ। मेरी आवाज़ क्लियर है, रोमन हिंदी सुधर गई है, और इंग्लिश ज़्यादा नैचुरल लगती है। अगले 60 दिन और मज़बूत बनूँगा।', 'hard');
