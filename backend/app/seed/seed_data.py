import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.api.auth import hash_password
from app.models.models import (
    User, Course, Unit, Skill, Lesson, Exercise, ExerciseOption,
    UserProgress, Achievement, UserAchievement, DailyQuest, UserQuest,
    ShopItem, LeaderboardEntry
)

LANGUAGES_DATA = [
    {
        "code": "hi", "name": "Hindi", "flag": "🇮🇳", "icon": "hindi",
        "desc": "Master Devanagari, daily conversation, and Hindi grammar.",
        "units": [
            {
                "title": "Unit 1: Hindi Basics & Greetings",
                "desc": "Learn Namaste, Devanagari script, and simple greetings.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Namaste & Greetings", "icon": "hand-wave", "desc": "Say Namaste, Dhanyavaad, and Aap kaise hain?",
                        "lessons": [
                            {
                                "title": "Namaste Essentials",
                                "intro": "In Hindi, 'Namaste' (नमस्ते) is the traditional greeting used respectfully to say Hello and Goodbye. 'Aap kaise hain?' (आप कैसे हैं?) means 'How are you?' when speaking politely.",
                                "vocab": "• नमस्ते (Namaste) = Hello\n• धन्यवाद (Dhanyavaad) = Thank you\n• हाँ (Haan) = Yes\n• नहीं (Nahi) = No\n• आप कैसे हैं? (Aap kaise hain?) = How are you?",
                                "exercises": [
                                    {"type": "word_bank", "prompt": "Translate into English", "question": "नमस्ते, आप कैसे हैं ?", "hint": "Hello, how are you?", "exp": "'Namaste' means Hello and 'Aap kaise hain?' means How are you?", "answer": json.dumps(["Hello,", "how", "are", "you?"]), "options": ["Hello,", "how", "are", "you?", "Good", "morning,"]},
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Thank you'", "question": "Thank you", "hint": "Polite expression", "exp": "'धन्यवाद' (Dhanyavaad) means Thank you in Hindi.", "answer": "धन्यवाद (Dhanyavaad)", "options": [{"text": "धन्यवाद (Dhanyavaad)", "is_correct": True}, {"text": "नमस्ते (Namaste)", "is_correct": False}, {"text": "अलविदा (Alvida)", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Hindi and English pairs", "question": "Match words", "exp": "Pair up Hindi words with their meanings.", "answer": json.dumps({"नमस्ते (Namaste)": "Hello", "धन्यवाद (Dhanyavaad)": "Thank you", "हाँ (Haan)": "Yes", "नहीं (Nahi)": "No"}), "options": []},
                                    {"type": "fill_blank", "prompt": "Complete the missing Hindi word", "question": "आप ___ हैं ? (How are you?)", "hint": "Missing word for how", "exp": "'कैसे' (Kaise) means 'how'.", "answer": "कैसे", "options": [{"text": "कैसे", "is_correct": True}, {"text": "क्या", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English translation for 'हाँ, धन्यवाद'", "question": "हाँ, धन्यवाद", "hint": "Yes, thank you", "exp": "'हाँ' means Yes and 'धन्यवाद' means Thank you.", "answer": "Yes, thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen and select the spoken phrase", "question": "🔊 [Audio: Namaste]", "hint": "Greeting", "exp": "The audio clip plays Namaste.", "answer": "Namaste (नमस्ते)", "options": [{"text": "Namaste (नमस्ते)", "is_correct": True}, {"text": "Alvida (अलविदा)", "is_correct": False}]},
                                    {"type": "arrange_sentence", "prompt": "Arrange into correct Hindi order", "question": "I am fine", "hint": "Main thik hoon", "exp": "Hindi sentence structure is Subject + Complement + Verb.", "answer": json.dumps(["मैं", "ठीक", "हूँ"]), "options": ["मैं", "ठीक", "हूँ", "क्या"]},
                                    {"type": "translate_sentence", "prompt": "Translate this sentence", "question": "Main Bharat se hoon", "hint": "I am from India", "exp": "'Main' = I, 'Bharat' = India, 'se hoon' = am from.", "answer": "I am from India", "options": []}
                                ]
                            },
                            {
                                "title": "Asking Names & Introductions",
                                "intro": "To ask someone's name politely in Hindi, say 'Aapka naam kya hai?' (आपका नाम क्या है?). To reply, say 'Mera naam Ashutosh hai' (मेरा नाम आशुतोष है).",
                                "vocab": "• नाम (Naam) = Name\n• क्या (Kya) = What\n• मेरा (Mera) = My\n• आपका (Aapka) = Your (polite)",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'What is your name?'", "question": "What is your name?", "hint": "Polite question", "exp": "'आपका नाम क्या है?' (Aapka naam kya hai?) means What is your name?", "answer": "आपका नाम क्या है?", "options": [{"text": "आपका नाम क्या है?", "is_correct": True}, {"text": "आप कैसे हैं?", "is_correct": False}]},
                                    {"type": "word_bank", "prompt": "Translate into Hindi", "question": "My name is Ashutosh", "hint": "Mera naam Ashutosh hai", "exp": "'Mera' = My, 'naam' = name, 'hai' = is.", "answer": json.dumps(["मेरा", "नाम", "आशुतोष", "है"]), "options": ["मेरा", "नाम", "आशुतोष", "है", "आप"]},
                                    {"type": "fill_blank", "prompt": "Fill in the blank", "question": "मेरा नाम Rahul ___।", "hint": "is", "exp": "'है' (hai) means 'is' in Hindi.", "answer": "है", "options": [{"text": "है", "is_correct": True}, {"text": "हूँ", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Hindi words", "question": "Match pairs", "exp": "Connect Hindi pronouns with English.", "answer": json.dumps({"मेरा (Mera)": "My", "आपका (Aapka)": "Your", "नाम (Naam)": "Name"}), "options": []},
                                    {"type": "type_answer", "prompt": "Type English for 'Mera naam Priya hai'", "question": "मेरा नाम Priya है", "hint": "My name is Priya", "exp": "Translates to My name is Priya.", "answer": "My name is Priya", "options": []},
                                    {"type": "listening", "prompt": "Select what you hear", "question": "🔊 [Audio: Aapka naam kya hai]", "hint": "Name query", "exp": "Asks for name.", "answer": "Aapka naam kya hai?", "options": [{"text": "Aapka naam kya hai?", "is_correct": True}, {"text": "Aap kaise hain?", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate to English", "question": "Aapka swagat hai", "hint": "You are welcome", "exp": "'Swagat' means Welcome.", "answer": "You are welcome", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'See you later'", "question": "Phir milenge", "hint": "Goodbye phrase", "exp": "'Phir milenge' means See you again.", "answer": "See you again", "options": [{"text": "See you again", "is_correct": True}, {"text": "Good morning", "is_correct": False}]}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Hindi Vowels (Swar)", "icon": "book-open", "desc": "Learn अ, आ, इ, ई, उ, ऊ and pronunciations.",
                        "lessons": [
                            {
                                "title": "First Vowels: अ and आ",
                                "intro": "'अ' (a) sounds like 'u' in 'up'. 'आ' (aa) sounds like 'a' in 'father'. Example: अनार (Anaar - Pomegranate), आम (Aam - Mango).",
                                "vocab": "• अ (a) -> अनार (Anaar - Pomegranate)\n• आ (aa) -> आम (Aam - Mango)",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Which letter makes the 'aa' sound as in Mango?", "question": "Mango (Aam)", "hint": "Long vowel", "exp": "'आ' is the long 'aa' vowel.", "answer": "आ", "options": [{"text": "आ", "is_correct": True}, {"text": "अ", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match vowel symbols to words", "question": "Match", "exp": "Connect vowels with words.", "answer": json.dumps({"अ": "अनार (Anaar)", "आ": "आम (Aam)"}), "options": []},
                                    {"type": "fill_blank", "prompt": "Complete word for Mango: ___म", "question": "___म (Aam)", "hint": "Starts with aa", "exp": "Mango is आम (Aam).", "answer": "आ", "options": [{"text": "आ", "is_correct": True}, {"text": "अ", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Aam'", "question": "आम", "hint": "Fruit", "exp": "आम translates to Mango.", "answer": "Mango", "options": []},
                                    {"type": "word_bank", "prompt": "Translate into English", "question": "यह आम मीठा है", "hint": "This mango is sweet", "exp": "'Yeh' = This, 'aam' = mango, 'meetha' = sweet.", "answer": json.dumps(["This", "mango", "is", "sweet"]), "options": ["This", "mango", "is", "sweet", "sour"]},
                                    {"type": "listening", "prompt": "Identify the vowel sound", "question": "🔊 [Audio: Anaar]", "hint": "Starts with अ", "exp": "Pomegranate starts with अ.", "answer": "Anaar (अनार)", "options": [{"text": "Anaar (अनार)", "is_correct": True}, {"text": "Aam (आम)", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate to English", "question": "Anaar laal hai", "hint": "Pomegranate is red", "exp": "Anaar = Pomegranate, laal = red.", "answer": "Pomegranate is red", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Fruit'", "question": "Phal (फल)", "hint": "Fruit in Hindi", "exp": "Phal means fruit.", "answer": "Fruit", "options": [{"text": "Fruit", "is_correct": True}, {"text": "Vegetable", "is_correct": False}]}
                                ]
                            },
                            {
                                "title": "Vowels: इ and ई",
                                "intro": "'इ' (i) sounds short like 'i' in 'pin'. 'ई' (ee) sounds long like 'ee' in 'see'. Example: इमली (Imli - Tamarind), ईख (Eekh - Sugarcane).",
                                "vocab": "• इ (i) -> इमली (Imli)\n• ई (ee) -> ईख (Eekh)",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Which letter is long 'ee'?", "question": "Long EE sound", "hint": "Sugarcane", "exp": "'ई' is long EE.", "answer": "ई", "options": [{"text": "ई", "is_correct": True}, {"text": "इ", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match vowels", "question": "Match", "exp": "Connect vowels.", "answer": json.dumps({"इ": "इमली (Imli)", "ई": "ईख (Eekh)"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate", "question": "इमली खट्टी है", "hint": "Tamarind is sour", "exp": "'Khatti' means sour.", "answer": json.dumps(["Tamarind", "is", "sour"]), "options": ["Tamarind", "is", "sour", "sweet"]},
                                    {"type": "fill_blank", "prompt": "Complete: ___मली", "question": "___मली (Imli)", "hint": "Short i", "exp": "Imli starts with इ.", "answer": "इ", "options": [{"text": "इ", "is_correct": True}, {"text": "ई", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Imli'", "question": "इमली", "hint": "Sour fruit", "exp": "Imli is Tamarind.", "answer": "Tamarind", "options": []},
                                    {"type": "listening", "prompt": "Listen to audio", "question": "🔊 [Audio: Eekh]", "hint": "Sugarcane", "exp": "Audio plays Eekh.", "answer": "Sugarcane (ईख)", "options": [{"text": "Sugarcane (ईख)", "is_correct": True}, {"text": "Tamarind", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Yeh meetha hai", "hint": "This is sweet", "exp": "Yeh = This, meetha = sweet.", "answer": "This is sweet", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Sugar'", "question": "Chini (चीनी)", "hint": "Sweet substance", "exp": "Chini means Sugar.", "answer": "Sugar", "options": [{"text": "Sugar", "is_correct": True}, {"text": "Salt", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Unit 2: Family & Food in Hindi",
                "desc": "Learn Indian family relations and order chai/food.",
                "color": "#CE82FF",
                "skills": [
                    {
                        "title": "Indian Family (Parivaar)", "icon": "users", "desc": "Mata, Pita, Bhai, Behen",
                        "lessons": [
                            {
                                "title": "Family Members",
                                "intro": "In Indian culture, family terms are specific: Mataji (Mother), Pitaji (Father), Bhai (Brother), Behen (Sister). Respect suffix 'ji' is added to elders.",
                                "vocab": "• माताजी (Mataji) = Mother\n• पिताजी (Pitaji) = Father\n• भाई (Bhai) = Brother\n• बहन (Behen) = Sister",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Mother'", "question": "Mother", "hint": "Mataji", "exp": "Mataji means Mother.", "answer": "माताजी (Mataji)", "options": [{"text": "माताजी (Mataji)", "is_correct": True}, {"text": "पिताजी (Pitaji)", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match family relations", "question": "Match", "exp": "Match family terms.", "answer": json.dumps({"माताजी": "Mother", "पिताजी": "Father", "भाई": "Brother", "बहन": "Sister"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate into English", "question": "यह मेरे पिताजी हैं", "hint": "This is my father", "exp": "Pitaji = Father, mere = my.", "answer": json.dumps(["This", "is", "my", "father"]), "options": ["This", "is", "my", "father", "brother"]},
                                    {"type": "fill_blank", "prompt": "Complete: यह मेरी ___ है (sister)", "question": "यह मेरी ___ है।", "hint": "Sister", "exp": "Sister is बहन (Behen).", "answer": "बहन", "options": [{"text": "बहन", "is_correct": True}, {"text": "भाई", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Mera bhai'", "question": "मेरा भाई", "hint": "My brother", "exp": "Mera bhai translates to My brother.", "answer": "My brother", "options": []},
                                    {"type": "listening", "prompt": "Listen to family word", "question": "🔊 [Audio: Pitaji]", "hint": "Father", "exp": "Audio clip says Pitaji.", "answer": "Father (पिताजी)", "options": [{"text": "Father (पिताजी)", "is_correct": True}, {"text": "Mother", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Parivaar bada hai", "hint": "Family is big", "exp": "Parivaar = family, bada = big.", "answer": "Family is big", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Happy family'", "question": "Khush parivaar", "hint": "Happy family", "exp": "Khush = Happy.", "answer": "Happy family", "options": [{"text": "Happy family", "is_correct": True}, {"text": "Small family", "is_correct": False}]}
                                ]
                            },
                            {
                                "title": "Describing Family",
                                "intro": "Use adjectives like 'Pyaara' (Lovely), 'Bada' (Big), and 'Chhota' (Small) to describe your family.",
                                "vocab": "• बड़ा (Bada) = Big\n• छोटा (Chhota) = Small\n• प्यारा (Pyaara) = Lovely",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Big'", "question": "Big", "hint": "Bada", "exp": "Bada means Big in Hindi.", "answer": "बड़ा (Bada)", "options": [{"text": "बड़ा (Bada)", "is_correct": True}, {"text": "छोटा", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match adjectives", "question": "Match", "exp": "Match words.", "answer": json.dumps({"बड़ा": "Big", "छोटा": "Small", "प्यारा": "Lovely"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate", "question": "मेरा छोटा भाई", "hint": "My younger brother", "exp": "Chhota bhai = younger/small brother.", "answer": json.dumps(["My", "younger", "brother"]), "options": ["My", "younger", "brother", "elder"]},
                                    {"type": "fill_blank", "prompt": "Complete: बड़ा ___ (family)", "question": "बड़ा ___", "hint": "Family", "exp": "Family is परिवार.", "answer": "परिवार", "options": [{"text": "परिवार", "is_correct": True}, {"text": "घर", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Pyaara parivaar'", "question": "प्यारा परिवार", "hint": "Lovely family", "exp": "Lovely family.", "answer": "Lovely family", "options": []},
                                    {"type": "listening", "prompt": "Listen to word", "question": "🔊 [Audio: Chhota]", "hint": "Small", "exp": "Audio says Chhota.", "answer": "Small (छोटा)", "options": [{"text": "Small (छोटा)", "is_correct": True}, {"text": "Big", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Yeh mera ghar hai", "hint": "This is my home", "exp": "Ghar = Home/House.", "answer": "This is my home", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Home'", "question": "Ghar (घर)", "hint": "House", "exp": "Ghar = Home.", "answer": "Home", "options": [{"text": "Home", "is_correct": True}, {"text": "School", "is_correct": False}]}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Chai & Food", "icon": "coffee", "desc": "Order Chai, Samosa, and Water.",
                        "lessons": [
                            {
                                "title": "Ordering Chai at Dhaba",
                                "intro": "In India, 'Chai' (चाय) is national tea! To order politely: 'Ek garam chai dena' (Give one hot tea please). Water is 'Paani' (पानी).",
                                "vocab": "• चाय (Chai) = Tea\n• पानी (Paani) = Water\n• गरम (Garam) = Hot\n• ठंडी (Thandi) = Cold",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Water'", "question": "Water", "hint": "Paani", "exp": "Paani means Water in Hindi.", "answer": "पानी (Paani)", "options": [{"text": "पानी (Paani)", "is_correct": True}, {"text": "चाय", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match food words", "question": "Match", "exp": "Match Hindi food words.", "answer": json.dumps({"चाय": "Tea", "पानी": "Water", "गरम": "Hot", "ठंडी": "Cold"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate into English", "question": "एक गरम चाय, कृपया", "hint": "One hot tea, please", "exp": "Ek = One, garam = hot, chai = tea.", "answer": json.dumps(["One", "hot", "tea,", "please"]), "options": ["One", "hot", "tea,", "please", "coffee"]},
                                    {"type": "fill_blank", "prompt": "Complete: ___ चाय (Hot tea)", "question": "___ चाय", "hint": "Hot", "exp": "Hot is गरम (Garam).", "answer": "गरम", "options": [{"text": "गरम", "is_correct": True}, {"text": "ठंडी", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Thanda paani'", "question": "ठंडा पानी", "hint": "Cold water", "exp": "Thanda paani = Cold water.", "answer": "Cold water", "options": []},
                                    {"type": "listening", "prompt": "Listen to food word", "question": "🔊 [Audio: Chai]", "hint": "Tea", "exp": "Audio plays Chai.", "answer": "Tea (चाय)", "options": [{"text": "Tea (चाय)", "is_correct": True}, {"text": "Water", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Khaana swadisht hai", "hint": "Food is delicious", "exp": "Swadisht = Delicious.", "answer": "Food is delicious", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Delicious'", "question": "Swadisht (स्वादिष्ट)", "hint": "Tasty", "exp": "Swadisht means delicious.", "answer": "Delicious", "options": [{"text": "Delicious", "is_correct": True}, {"text": "Spicy", "is_correct": False}]}
                                ]
                            },
                            {
                                "title": "Samosa & Sweets",
                                "intro": "Popular snacks include Samosa (समौसा) and Gulab Jamun (गुलाब जामुन). 'Khaana' means Food.",
                                "vocab": "• खाना (Khaana) = Food\n• मीठा (Meetha) = Sweet\n• तीखा (Teekha) = Spicy",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Spicy'", "question": "Spicy", "hint": "Teekha", "exp": "Teekha means spicy in Hindi.", "answer": "तीखा (Teekha)", "options": [{"text": "तीखा (Teekha)", "is_correct": True}, {"text": "मीठा", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match taste words", "question": "Match", "exp": "Connect taste descriptors.", "answer": json.dumps({"खाना": "Food", "मीठा": "Sweet", "तीखा": "Spicy"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate", "question": "समौसा बहुत तीखा है", "hint": "Samosa is very spicy", "exp": "Bahut = Very, teekha = spicy.", "answer": json.dumps(["Samosa", "is", "very", "spicy"]), "options": ["Samosa", "is", "very", "spicy", "sweet"]},
                                    {"type": "fill_blank", "prompt": "Complete: ___ खाना (Delicious food)", "question": "___ खाना", "hint": "Tasty", "exp": "Tasty food is स्वादिष्ट खाना.", "answer": "स्वादिष्ट", "options": [{"text": "स्वादिष्ट", "is_correct": True}, {"text": "खट्टा", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Meethi lassi'", "question": "मीठी लस्सी", "hint": "Sweet lassi", "exp": "Sweet lassi yogurt drink.", "answer": "Sweet lassi", "options": []},
                                    {"type": "listening", "prompt": "Listen to clip", "question": "🔊 [Audio: Samosa]", "hint": "Indian snack", "exp": "Plays Samosa.", "answer": "Samosa (समौसा)", "options": [{"text": "Samosa (समौसा)", "is_correct": True}, {"text": "Jalebi", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Main samosa khata hoon", "hint": "I eat samosa", "exp": "Khata = eat.", "answer": "I eat samosa", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Bill please'", "question": "Bill dena", "hint": "Check please", "exp": "Bill dena = Give the check.", "answer": "Give the bill", "options": [{"text": "Give the bill", "is_correct": True}, {"text": "Give water", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "en", "name": "English", "flag": "🇬🇧", "icon": "english",
        "desc": "Fluent spoken English for career & everyday conversation.",
        "units": [
            {
                "title": "Unit 1: Everyday English & Self-Intro",
                "desc": "Master greetings, self introductions, and daily conversational English.",
                "color": "#1CB0F6",
                "skills": [
                    {
                        "title": "English Greetings", "icon": "hand-wave", "desc": "Hello, Good morning, How are you doing?",
                        "lessons": [
                            {
                                "title": "Greetings & Hello",
                                "intro": "In English, 'Hello' and 'Hi' are common greetings. 'Good morning' is used before noon. 'How are you?' is standard courtesy.",
                                "vocab": "• Hello / Hi = Greetings\n• Good morning = Morning greeting\n• How are you? = Query on well-being\n• I am fine = Healthy reply",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select Hindi translation for 'Good morning'", "question": "Good morning", "hint": "Morning greeting", "exp": "Good morning translates to 'शुभ प्रभात' (Shubh Prabhat).", "answer": "शुभ प्रभात", "options": [{"text": "शुभ प्रभात", "is_correct": True}, {"text": "शुभ रात्रि", "is_correct": False}]},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "नमस्ते, आप कैसे हैं?", "hint": "Hello, how are you?", "exp": "Namaste = Hello, Aap kaise hain = How are you.", "answer": json.dumps(["Hello,", "how", "are", "you?"]), "options": ["Hello,", "how", "are", "you?", "fine"]},
                                    {"type": "match_pairs", "prompt": "Match English and Hindi phrases", "question": "Match", "exp": "Match English with Hindi.", "answer": json.dumps({"Hello": "नमस्ते", "Good morning": "शुभ प्रभात", "Thank you": "धन्यवाद"}), "options": []},
                                    {"type": "fill_blank", "prompt": "Fill missing word: How ___ you?", "question": "How ___ you?", "hint": "are", "exp": "'are' accompanies 'you' in present tense.", "answer": "are", "options": [{"text": "are", "is_correct": True}, {"text": "is", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type Hindi for 'I am fine'", "question": "I am fine", "hint": "Main thik hoon", "exp": "Translates to 'मैं ठीक हूँ' (Main thik hoon).", "answer": "मैं ठीक हूँ", "options": []},
                                    {"type": "listening", "prompt": "Listen audio", "question": "🔊 [Audio: Good morning]", "hint": "Greeting", "exp": "Plays Good morning.", "answer": "Good morning", "options": [{"text": "Good morning", "is_correct": True}, {"text": "Good night", "is_correct": False}]},
                                    {"type": "arrange_sentence", "prompt": "Arrange words: am / fine / I", "question": "I am fine", "hint": "Subject + Verb + Adj", "exp": "Standard order is I am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "you"]},
                                    {"type": "translate_sentence", "prompt": "Translate to English", "question": "Mera naam Ashutosh hai", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []}
                                ]
                            },
                            {
                                "title": "Introducing Yourself",
                                "intro": "Say 'My name is...' and 'I live in...' to introduce yourself in professional or casual settings.",
                                "vocab": "• Name = Identity\n• Live = Reside\n• City = Place of living",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'My name is Priya'", "question": "Mera naam Priya hai", "hint": "Introduction", "exp": "Translates to My name is Priya.", "answer": "My name is Priya", "options": [{"text": "My name is Priya", "is_correct": True}, {"text": "I am Priya", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match words", "question": "Match", "exp": "Connect terms.", "answer": json.dumps({"Name": "नाम", "Live": "रहना", "City": "शहर"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "मैं दिल्ली में रहता हूँ", "hint": "I live in Delhi", "exp": "Main = I, Delhi me = in Delhi, rehta hoon = live.", "answer": json.dumps(["I", "live", "in", "Delhi"]), "options": ["I", "live", "in", "Delhi", "Mumbai"]},
                                    {"type": "fill_blank", "prompt": "Complete: I ___ in Mumbai", "question": "I ___ in Mumbai", "hint": "Reside", "exp": "I live in Mumbai.", "answer": "live", "options": [{"text": "live", "is_correct": True}, {"text": "work", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Aap kahan rehte hain?'", "question": "आप कहाँ रहते हैं?", "hint": "Where do you live?", "exp": "Where do you live?", "answer": "Where do you live?", "options": []},
                                    {"type": "listening", "prompt": "Listen to phrase", "question": "🔊 [Audio: Nice to meet you]", "hint": "Greeting", "exp": "Plays Nice to meet you.", "answer": "Nice to meet you", "options": [{"text": "Nice to meet you", "is_correct": True}, {"text": "See you later", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate to Hindi", "question": "Welcome to India", "hint": "Bharat me aapka swagat hai", "exp": "भारत में आपका स्वागत है।", "answer": "भारत में आपका स्वागत है", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Student'", "question": "Chhatra (छात्र)", "hint": "Learner", "exp": "Student = छात्र.", "answer": "Student", "options": [{"text": "Student", "is_correct": True}, {"text": "Teacher", "is_correct": False}]}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Job & Workplace English", "icon": "briefcase", "desc": "Office vocabulary and polite queries.",
                        "lessons": [
                            {
                                "title": "Office Conversations",
                                "intro": "Key workplace terms: 'Meeting', 'Project', 'Manager', 'Email'. Practice polite phrasing: 'Could you please check this?'",
                                "vocab": "• Meeting = Baithak\n• Office = Daftar\n• Email = E-Patra",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Office'", "question": "Office", "hint": "Daftar", "exp": "Office means दफ़्तर (Daftar).", "answer": "दफ़्तर (Daftar)", "options": [{"text": "दफ़्तर (Daftar)", "is_correct": True}, {"text": "घर", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match work terms", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"Office": "दफ़्तर", "Work": "काम", "Boss": "मालिक"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "आज मीटिंग है", "hint": "There is a meeting today", "exp": "Aaj = Today, meeting hai = there is a meeting.", "answer": json.dumps(["There", "is", "a", "meeting", "today"]), "options": ["There", "is", "a", "meeting", "today", "tomorrow"]},
                                    {"type": "fill_blank", "prompt": "Complete: I have a ___ today (meeting)", "question": "I have a ___ today", "hint": "Meeting", "exp": "I have a meeting today.", "answer": "meeting", "options": [{"text": "meeting", "is_correct": True}, {"text": "holiday", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Mera kaam khatam ho gaya'", "question": "मेरा काम खत्म हो गया", "hint": "My work is finished", "exp": "My work is finished.", "answer": "My work is finished", "options": []},
                                    {"type": "listening", "prompt": "Listen to office term", "question": "🔊 [Audio: Please send an email]", "hint": "Email query", "exp": "Plays Please send an email.", "answer": "Please send an email", "options": [{"text": "Please send an email", "is_correct": True}, {"text": "Call me later", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Good job!", "hint": "Bahut accha kaam!", "exp": "बहुत अच्छा काम!", "answer": "बहुत अच्छा काम", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Salary'", "question": "Vetan (वेतन)", "hint": "Pay", "exp": "Vetan = Salary.", "answer": "Salary", "options": [{"text": "Salary", "is_correct": True}, {"text": "Rent", "is_correct": False}]}
                                ]
                            },
                            {
                                "title": "Email & Communication",
                                "intro": "Learn common email sign-offs: 'Regards', 'Sincerely', 'Thank you for your response.'",
                                "vocab": "• Regards = Aadar sahit\n• Response = Uttar",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select sign-off word", "question": "Regards", "hint": "Respectful closing", "exp": "Regards is a formal email closing.", "answer": "Regards", "options": [{"text": "Regards", "is_correct": True}, {"text": "Bye", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match email phrases", "question": "Match", "exp": "Match phrases.", "answer": json.dumps({"Response": "उत्तर", "Message": "संदेश", "File": "फ़ाइल"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate", "question": "कृपया फ़ाइल अटैच करें", "hint": "Please attach the file", "exp": "Please attach the file.", "answer": json.dumps(["Please", "attach", "the", "file"]), "options": ["Please", "attach", "the", "file", "delete"]},
                                    {"type": "fill_blank", "prompt": "Complete: Thank you for your ___ (reply)", "question": "Thank you for your ___", "hint": "Reply", "exp": "Thank you for your reply.", "answer": "reply", "options": [{"text": "reply", "is_correct": True}, {"text": "question", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Main kal aunga'", "question": "मैं कल आऊँगा", "hint": "I will come tomorrow", "exp": "I will come tomorrow.", "answer": "I will come tomorrow", "options": []},
                                    {"type": "listening", "prompt": "Listen to clip", "question": "🔊 [Audio: See you tomorrow]", "hint": "Goodbye", "exp": "Plays See you tomorrow.", "answer": "See you tomorrow", "options": [{"text": "See you tomorrow", "is_correct": True}, {"text": "See you yesterday", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Have a great day!", "hint": "Aapka din shubh ho!", "exp": "आपका दिन शुभ हो!", "answer": "आपका दिन शुभ हो", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Important'", "question": "Zaroori (ज़रूरी)", "hint": "Crucial", "exp": "Zaroori = Important.", "answer": "Important", "options": [{"text": "Important", "is_correct": True}, {"text": "Trivial", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Unit 2: Travel & Shopping English",
                "desc": "Navigate airports, hotels, restaurants, and shopping malls.",
                "color": "#CE82FF",
                "skills": [
                    {
                        "title": "Hotel & Restaurant", "icon": "utensils", "desc": "Order food, ask for menu and bill.",
                        "lessons": [
                            {
                                "title": "At the Restaurant",
                                "intro": "Ask 'Could I see the menu?' and 'Could we get the check please?' when dining out.",
                                "vocab": "• Menu = Suchi\n• Bill = Check\n• Delicious = Swadisht",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Menu'", "question": "Menu", "hint": "Food list", "exp": "Menu lists dishes.", "answer": "Menu", "options": [{"text": "Menu", "is_correct": True}, {"text": "Bill", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match dining words", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"Water": "पानी", "Food": "खाना", "Bill": "बिल"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate", "question": "खाना बहुत स्वादिष्ट था", "hint": "The food was delicious", "exp": "The food was delicious.", "answer": json.dumps(["The", "food", "was", "delicious"]), "options": ["The", "food", "was", "delicious", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: Could I get the ___ please? (bill)", "question": "Could I get the ___ please?", "hint": "Check", "exp": "Could I get the bill please?", "answer": "bill", "options": [{"text": "bill", "is_correct": True}, {"text": "water", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Ek glass paani dena'", "question": "एक गिलास पानी देना", "hint": "Give a glass of water", "exp": "Give a glass of water.", "answer": "Give a glass of water", "options": []},
                                    {"type": "listening", "prompt": "Listen to audio", "question": "🔊 [Audio: Table for two please]", "hint": "Seating request", "exp": "Plays Table for two please.", "answer": "Table for two please", "options": [{"text": "Table for two please", "is_correct": True}, {"text": "Check please", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Is it spicy?", "hint": "Kya yeh teekha hai?", "exp": "क्या यह तीखा है?", "answer": "क्या यह तीखा है", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Vegetarian'", "question": "Shakahari (शाकाहारी)", "hint": "Veg", "exp": "Shakahari = Vegetarian.", "answer": "Vegetarian", "options": [{"text": "Vegetarian", "is_correct": True}, {"text": "Non-vegetarian", "is_correct": False}]}
                                ]
                            },
                            {
                                "title": "Hotel Check-in",
                                "intro": "Say 'I have a reservation under the name...' when checking in at hotel receptions.",
                                "vocab": "• Key = Chaabi\n• Room = Kamra\n• Reservation = Booking",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Room key'", "question": "Kamre ki chaabi", "hint": "Key", "exp": "Room key.", "answer": "Room key", "options": [{"text": "Room key", "is_correct": True}, {"text": "Car key", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match hotel terms", "question": "Match", "exp": "Connect terms.", "answer": json.dumps({"Room": "कमरा", "Key": "चाबी", "Hotel": "होटल"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate", "question": "कमरा बहुत साफ़ है", "hint": "The room is very clean", "exp": "Saaf = Clean.", "answer": json.dumps(["The", "room", "is", "very", "clean"]), "options": ["The", "room", "is", "very", "clean", "dirty"]},
                                    {"type": "fill_blank", "prompt": "Complete: Where is the ___? (elevator)", "question": "Where is the ___?", "hint": "Lift", "exp": "Where is the elevator?", "answer": "elevator", "options": [{"text": "elevator", "is_correct": True}, {"text": "door", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Mera booking hai'", "question": "मेरा बुकिंग है", "hint": "I have a reservation", "exp": "I have a reservation.", "answer": "I have a reservation", "options": []},
                                    {"type": "listening", "prompt": "Listen clip", "question": "🔊 [Audio: Enjoy your stay]", "hint": "Hotel greeting", "exp": "Plays Enjoy your stay.", "answer": "Enjoy your stay", "options": [{"text": "Enjoy your stay", "is_correct": True}, {"text": "Good morning", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "What is the Wi-Fi password?", "hint": "Wi-Fi ka password kya hai?", "exp": "वाई-फ़ाई का पासवर्ड क्या है?", "answer": "वाई-फ़ाई का पासवर्ड क्या है", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Checkout time'", "question": "Jaane ka samay", "hint": "Departure time", "exp": "Checkout time.", "answer": "Checkout time", "options": [{"text": "Checkout time", "is_correct": True}, {"text": "Lunch time", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "bn", "name": "Bengali", "flag": "🇮🇳", "icon": "bengali",
        "desc": "Learn sweet Bengali phrases, greetings, and vocabulary.",
        "units": [
            {
                "title": "Unit 1: Bengali Basics & Greetings",
                "desc": "Say Nômoshkar, Kemon acho, and basic phrases.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Bengali Greetings", "icon": "hand-wave", "desc": "Nômoshkar, Kemon acho, Dhonyobad",
                        "lessons": [
                            {
                                "title": "Nômoshkar & Hello",
                                "intro": "In Bengali, 'Nômoshkar' (নমস্কার) is used to greet elders with respect. 'Kemon acho?' (কেমন আছো?) means 'How are you?' to friends.",
                                "vocab": "• নমস্কার (Nômoshkar) = Hello\n• কেমন আছো? (Kemon acho?) = How are you?\n• ধন্যবাদ (Dhonyobad) = Thank you\n• ভালো (Bhalo) = Good / Fine",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'How are you?' in Bengali", "question": "How are you?", "hint": "Kemon acho", "exp": "'কেমন আছো?' (Kemon acho?) means How are you in Bengali.", "answer": "কেমন আছো? (Kemon acho?)", "options": [{"text": "কেমন আছো? (Kemon acho?)", "is_correct": True}, {"text": "নমস্কার", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Bengali and English pairs", "question": "Match", "exp": "Pair up words.", "answer": json.dumps({"নমস্কার": "Hello", "ধন্যবাদ": "Thank you", "ভালো": "Good", "হ্যাঁ": "Yes"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "আমি ভালো আছি", "hint": "I am fine", "exp": "Ami = I, bhalo = good, achhi = am.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: আপনার নাম ___? (what)", "question": "আপনার নাম ___?", "hint": "What", "exp": "'কী' (ki) means what.", "answer": "কী", "options": [{"text": "কী", "is_correct": True}, {"text": "কোথায়", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Dhonyobad'", "question": "ধন্যবাদ", "hint": "Thank you", "exp": "Dhonyobad translates to Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen to Bengali phrase", "question": "🔊 [Audio: Kemon acho]", "hint": "Query", "exp": "Audio plays Kemon acho.", "answer": "Kemon acho?", "options": [{"text": "Kemon acho?", "is_correct": True}, {"text": "Nomoshkar", "is_correct": False}]},
                                    {"type": "arrange_sentence", "prompt": "Arrange: Ami / bhalo / achhi", "question": "I am fine", "hint": "Ami bhalo achhi", "exp": "Bengali order: Ami bhalo achhi.", "answer": json.dumps(["আমি", "ভালো", "আছি"]), "options": ["আমি", "ভালো", "আছি", "নাম"]},
                                    {"type": "translate_sentence", "prompt": "Translate to English", "question": "Amar naam Rahul", "hint": "My name is Rahul", "exp": "My name is Rahul.", "answer": "My name is Rahul", "options": []}
                                ]
                            },
                            {
                                "title": "Bengali Sweets & Food",
                                "intro": "Bengali cuisine is famous for 'Maachh' (Fish), 'Bhaat' (Rice), and 'Rosogolla' (Sweet).",
                                "vocab": "• মাছ (Maachh) = Fish\n• ভাত (Bhaat) = Rice\n• মিষ্টি (Mishti) = Sweet",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Rice' in Bengali", "question": "Rice", "hint": "Bhaat", "exp": "'ভাত' (Bhaat) means Rice.", "answer": "ভাত (Bhaat)", "options": [{"text": "ভাত (Bhaat)", "is_correct": True}, {"text": "মাছ", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match food terms", "question": "Match", "exp": "Connect foods.", "answer": json.dumps({"মাছ": "Fish", "ভাত": "Rice", "মিষ্টি": "Sweet"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "রসগোল্লা খুব মিষ্টি", "hint": "Rosogolla is very sweet", "exp": "Rosogolla is very sweet.", "answer": json.dumps(["Rosogolla", "is", "very", "sweet"]), "options": ["Rosogolla", "is", "very", "sweet", "salty"]},
                                    {"type": "fill_blank", "prompt": "Complete: ___ খাব (will eat rice)", "question": "___ খাব", "hint": "Rice", "exp": "Bhaat khabo.", "answer": "ভাত", "options": [{"text": "ভাত", "is_correct": True}, {"text": "চা", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Ami maachh bhalobashi'", "question": "আমি মাছ ভালোবাসি", "hint": "I love fish", "exp": "I love fish.", "answer": "I love fish", "options": []},
                                    {"type": "listening", "prompt": "Listen to sweet name", "question": "🔊 [Audio: Mishti]", "hint": "Sweet", "exp": "Plays Mishti.", "answer": "Sweet (মিষ্টি)", "options": [{"text": "Sweet (মিষ্টি)", "is_correct": True}, {"text": "Rice", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Khabaar khub bhalo", "hint": "Food is very good", "exp": "Food is very good.", "answer": "Food is very good", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Tea'", "question": "Cha (চা)", "hint": "Beverage", "exp": "Cha = Tea.", "answer": "Tea", "options": [{"text": "Tea", "is_correct": True}, {"text": "Coffee", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "ta", "name": "Tamil", "flag": "🇮🇳", "icon": "tamil",
        "desc": "Discover Tamil script, ancient literature, and spoken Tamil.",
        "units": [
            {
                "title": "Unit 1: Tamil Basics & Vanakkam",
                "desc": "Learn Vanakkam, Nandri, and basic Tamil pronouns.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Vanakkam & Greetings", "icon": "hand-wave", "desc": "Vanakkam, Nandri, Eppati irukkireerkal?",
                        "lessons": [
                            {
                                "title": "Vanakkam Essentials",
                                "intro": "'Vanakkam' (வணக்கம்) is the traditional respectful greeting in Tamil. 'Nandri' (நன்றி) means 'Thank you'. 'Eppadi irukkeenga?' means 'How are you?'",
                                "vocab": "• வணக்கம் (Vanakkam) = Hello\n• நன்றி (Nandri) = Thank you\n• ஆமாம் (Aamam) = Yes\n• இல்லை (Illai) = No",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select translation for 'Thank you' in Tamil", "question": "Thank you", "hint": "Nandri", "exp": "'நன்றி' (Nandri) means Thank you in Tamil.", "answer": "நன்றி (Nandri)", "options": [{"text": "நன்றி (Nandri)", "is_correct": True}, {"text": "வணக்கம்", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Tamil words", "question": "Match", "exp": "Match Tamil terms.", "answer": json.dumps({"வணக்கம்": "Hello", "நன்றி": "Thank you", "ஆமாம்": "Yes", "இல்லை": "No"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "நான் நன்றாக இருக்கிறேன்", "hint": "I am doing well", "exp": "Naan = I, nandraaga = well, irukkiren = am.", "answer": json.dumps(["I", "am", "doing", "well"]), "options": ["I", "am", "doing", "well", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: ___ வணக்கம் (Hello)", "question": "___ வணக்கம்", "hint": "Hello", "exp": "Vanakkam.", "answer": "வணக்கம்", "options": [{"text": "வணக்கம்", "is_correct": True}, {"text": "நன்றி", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Nandri'", "question": "நன்றி", "hint": "Thank you", "exp": "Translates to Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen to clip", "question": "🔊 [Audio: Vanakkam]", "hint": "Greeting", "exp": "Audio clip plays Vanakkam.", "answer": "Hello (வணக்கம்)", "options": [{"text": "Hello (வணக்கம்)", "is_correct": True}, {"text": "Nandri", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "En peyar Ashutosh", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Yes'", "question": "Aamam (ஆமாம்)", "hint": "Affirmative", "exp": "Aamam = Yes.", "answer": "Yes", "options": [{"text": "Yes", "is_correct": True}, {"text": "No", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "te", "name": "Telugu", "flag": "🇮🇳", "icon": "telugu",
        "desc": "Learn Telugu greetings, verbs, and daily sentence formation.",
        "units": [
            {
                "title": "Unit 1: Telugu Basics & Namaskaram",
                "desc": "Learn Namaskaram, Bagunnara, and daily phrases.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Namaskaram & Greetings", "icon": "hand-wave", "desc": "Namaskaram, Dhanyavadalu, Ela unnaru?",
                        "lessons": [
                            {
                                "title": "Namaskaram Essentials",
                                "intro": "'Namaskaram' (నమస్కారం) is the traditional Telugu greeting. 'Ela unnaru?' (ఎలా ఉన్నారు?) means 'How are you?'. 'Dhanyavadalu' (ధన్యవాదాలు) means 'Thank you'.",
                                "vocab": "• నమస్కారం (Namaskaram) = Hello\n• ధన్యవాదాలు (Dhanyavadalu) = Thank you\n• అవును (Avunu) = Yes\n• కాదు (Kadu) = No",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Thank you' in Telugu", "question": "Thank you", "hint": "Dhanyavadalu", "exp": "'ధన్యవాదాలు' means Thank you.", "answer": "ధన్యవాదాలు (Dhanyavadalu)", "options": [{"text": "ధన్యవాదాలు (Dhanyavadalu)", "is_correct": True}, {"text": "నమస్కారం", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Telugu phrases", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"నమస్కారం": "Hello", "ధన్యవాదాలు": "Thank you", "అవును": "Yes", "కాదు": "No"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "నేను బాగున్నాను", "hint": "I am fine", "exp": "Nenu = I, bagunnanu = am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: మీ పేరు ___? (what)", "question": "మీ పేరు ___?", "hint": "What", "exp": "'ఏమిటి' (Emiti) means what.", "answer": "ఏమిటి", "options": [{"text": "ఏమిటి", "is_correct": True}, {"text": "ఎక్కడ", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Namaskaram'", "question": "నమస్కారం", "hint": "Hello", "exp": "Namaskaram translates to Hello.", "answer": "Hello", "options": []},
                                    {"type": "listening", "prompt": "Listen to audio", "question": "🔊 [Audio: Ela unnaru]", "hint": "Query", "exp": "Plays Ela unnaru.", "answer": "How are you?", "options": [{"text": "How are you?", "is_correct": True}, {"text": "Hello", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Naa peru Ashutosh", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Yes'", "question": "Avunu (అవును)", "hint": "Affirmative", "exp": "Avunu = Yes.", "answer": "Yes", "options": [{"text": "Yes", "is_correct": True}, {"text": "No", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "mr", "name": "Marathi", "flag": "🇮🇳", "icon": "marathi",
        "desc": "Master spoken Marathi for Mumbai, Pune & Maharashtra.",
        "units": [
            {
                "title": "Unit 1: Marathi Basics & Namaskar",
                "desc": "Learn Namaskar, Kasa ahes, and daily Marathi expressions.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Namaskar & Greetings", "icon": "hand-wave", "desc": "Namaskar, Dhanyavaad, Kasa ahes?",
                        "lessons": [
                            {
                                "title": "Namaskar Essentials",
                                "intro": "'Namaskar' (नमस्कार) is the Marathi greeting. 'Tumi kase ahat?' (तुम्ही कसे आहात?) means 'How are you?' with respect.",
                                "vocab": "• नमस्कार (Namaskar) = Hello\n• धन्यवाद (Dhanyavaad) = Thank you\n• हो (Ho) = Yes\n• नाही (Nahi) = No",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Hello' in Marathi", "question": "Hello", "hint": "Namaskar", "exp": "'नमस्कार' means Hello in Marathi.", "answer": "नमस्कार (Namaskar)", "options": [{"text": "नमस्कार (Namaskar)", "is_correct": True}, {"text": "धन्यवाद", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Marathi words", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"नमस्कार": "Hello", "धन्यवाद": "Thank you", "हो": "Yes", "नाही": "No"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "मी छान आहे", "hint": "I am fine", "exp": "Mi = I, chhan ahe = am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: तुमचे नाव ___ आहे? (what)", "question": "तुमचे नाव ___ आहे?", "hint": "What", "exp": "'काय' (Kay) means what in Marathi.", "answer": "काय", "options": [{"text": "काय", "is_correct": True}, {"text": "कुठे", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Dhanyavaad'", "question": "धन्यवाद", "hint": "Thank you", "exp": "Dhanyavaad means Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen to Marathi audio", "question": "🔊 [Audio: Kasa ahes]", "hint": "How are you", "exp": "Plays Kasa ahes.", "answer": "How are you?", "options": [{"text": "How are you?", "is_correct": True}, {"text": "Hello", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Maaze naav Ashutosh ahe", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Yes'", "question": "Ho (हो)", "hint": "Affirmative", "exp": "Ho = Yes in Marathi.", "answer": "Yes", "options": [{"text": "Yes", "is_correct": True}, {"text": "No", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "kn", "name": "Kannada", "flag": "🇮🇳", "icon": "kannada",
        "desc": "Learn Kannada for Bengaluru work and social life.",
        "units": [
            {
                "title": "Unit 1: Kannada Basics & Namaskara",
                "desc": "Learn Namaskara, Hegiddeera, and Bengaluru daily phrases.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Namaskara & Greetings", "icon": "hand-wave", "desc": "Namaskara, Dhanyavada, Hegiddeera?",
                        "lessons": [
                            {
                                "title": "Namaskara Essentials",
                                "intro": "'Namaskara' (ನಮಸ್ಕಾರ) is the greeting in Kannada. 'Hegiddeera?' (ಹೇಗಿದ್ದೀರಾ?) means 'How are you?' politely.",
                                "vocab": "• ನಮಸ್ಕಾರ (Namaskara) = Hello\n• ಧನ್ಯವಾದ (Dhanyavada) = Thank you\n• ಹೌದು (Haudu) = Yes\n• ಇಲ್ಲ (Illa) = No",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Hello' in Kannada", "question": "Hello", "hint": "Namaskara", "exp": "'ನಮಸ್ಕಾರ' means Hello.", "answer": "ನಮಸ್ಕಾರ (Namaskara)", "options": [{"text": "ನಮಸ್ಕಾರ (Namaskara)", "is_correct": True}, {"text": "ಧನ್ಯವಾದ", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Kannada terms", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"ನಮಸ್ಕಾರ": "Hello", "ಧನ್ಯವಾದ": "Thank you", "ಹೌದು": "Yes", "ಇಲ್ಲ": "No"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ", "hint": "I am fine", "exp": "Naanu = I, chennagiddene = am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: ನಿಮ್ಮ ಹೆಸರು ___? (what)", "question": "ನಿಮ್ಮ ಹೆಸರು ___?", "hint": "What", "exp": "'ಏನು' (Enu) means what.", "answer": "ಏನು", "options": [{"text": "ಏನು", "is_correct": True}, {"text": "ಎಲ್ಲಿ", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Dhanyavada'", "question": "ಧನ್ಯವಾದ", "hint": "Thank you", "exp": "Dhanyavada means Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen to Kannada clip", "question": "🔊 [Audio: Hegiddeera]", "hint": "Query", "exp": "Plays Hegiddeera.", "answer": "How are you?", "options": [{"text": "How are you?", "is_correct": True}, {"text": "Hello", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Nanna hesaru Ashutosh", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'No'", "question": "Illa (ಇಲ್ಲ)", "hint": "Negative", "exp": "Illa = No / Not there in Kannada.", "answer": "No", "options": [{"text": "No", "is_correct": True}, {"text": "Yes", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "gu", "name": "Gujarati", "flag": "🇮🇳", "icon": "gujarati",
        "desc": "Learn Gujarati business vocabulary and greetings.",
        "units": [
            {
                "title": "Unit 1: Gujarati Basics & Namaste",
                "desc": "Learn Kem cho, Majama, and Gujarati conversations.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Kem Cho & Greetings", "icon": "hand-wave", "desc": "Kem cho, Majama, Aabhar",
                        "lessons": [
                            {
                                "title": "Kem Cho Essentials",
                                "intro": "'Kem cho?' (કેમ છો?) is the iconic Gujarati phrase meaning 'How are you?'. The standard reply is 'Majama' (મજામાં - I am fine!).",
                                "vocab": "• કેમ છો? (Kem cho?) = How are you?\n• મજામાં (Majama) = Fine / Enjoying!\n• આભાર (Aabhar) = Thank you\n• હા (Ha) = Yes",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'How are you?' in Gujarati", "question": "How are you?", "hint": "Kem cho", "exp": "'કેમ છો?' (Kem cho?) means How are you in Gujarati.", "answer": "કેમ છો? (Kem cho?)", "options": [{"text": "કેમ છો? (Kem cho?)", "is_correct": True}, {"text": "આભાર", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Gujarati phrases", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"કેમ છો?": "How are you?", "મજામાં": "Fine", "આભાર": "Thank you", "હા": "Yes"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "હું મજામાં છું", "hint": "I am fine", "exp": "Hu = I, majama chhu = am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: તમારું નામ ___ છે? (what)", "question": "તમારું નામ ___ છે?", "hint": "What", "exp": "'શું' (Shu) means what in Gujarati.", "answer": "શું", "options": [{"text": "શું", "is_correct": True}, {"text": "ક્યાં", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Aabhar'", "question": "આભાર", "hint": "Thank you", "exp": "Aabhar means Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen to Gujarati clip", "question": "🔊 [Audio: Kem cho]", "hint": "Query", "exp": "Plays Kem cho.", "answer": "Kem cho?", "options": [{"text": "Kem cho?", "is_correct": True}, {"text": "Aabhar", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Maru naam Ashutosh chhe", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Yes'", "question": "Ha (હા)", "hint": "Affirmative", "exp": "Ha = Yes.", "answer": "Yes", "options": [{"text": "Yes", "is_correct": True}, {"text": "No", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "ml", "name": "Malayalam", "flag": "🇮🇳", "icon": "malayalam",
        "desc": "Learn Malayalam script and Kerala conversational phrases.",
        "units": [
            {
                "title": "Unit 1: Malayalam Basics & Namaskaram",
                "desc": "Learn Namaskaram, Sugamaano, and Kerala phrases.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Namaskaram & Greetings", "icon": "hand-wave", "desc": "Namaskaram, Nandi, Sugamaano?",
                        "lessons": [
                            {
                                "title": "Namaskaram Essentials",
                                "intro": "'Namaskaram' (നമസ്കാരം) is the greeting in Malayalam. 'Sugamaano?' (സുഖമാണോ?) means 'Are you doing well?'. 'Nandi' (നന്ദി) means 'Thank you'.",
                                "vocab": "• നമസ്കാരം (Namaskaram) = Hello\n• സുഖമാണോ? (Sugamaano?) = How are you?\n• നന്ദി (Nandi) = Thank you\n• അതേ (Aathe) = Yes",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Thank you' in Malayalam", "question": "Thank you", "hint": "Nandi", "exp": "'നന്ദി' (Nandi) means Thank you.", "answer": "നന്ദി (Nandi)", "options": [{"text": "നന്ദി (Nandi)", "is_correct": True}, {"text": "നമസ്കാരം", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Malayalam words", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"നമസ്കാരം": "Hello", "നന്ദി": "Thank you", "അതേ": "Yes", "അല്ല": "No"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "എനിക്ക് സുഖമാണ്", "hint": "I am fine", "exp": "Enikku sugamaanu = I am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: പേര് ___? (what)", "question": "പേര് ___?", "hint": "What", "exp": "'എന്താണ്' (Enthaanu) means what.", "answer": "എന്താണ്", "options": [{"text": "എന്താണ്", "is_correct": True}, {"text": "എവിടെ", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Nandi'", "question": "നന്ദി", "hint": "Thank you", "exp": "Nandi means Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen audio", "question": "🔊 [Audio: Sugamaano]", "hint": "Query", "exp": "Plays Sugamaano.", "answer": "How are you?", "options": [{"text": "How are you?", "is_correct": True}, {"text": "Hello", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Ente peru Ashutosh", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Yes'", "question": "Aathe (അതേ)", "hint": "Affirmative", "exp": "Aathe = Yes.", "answer": "Yes", "options": [{"text": "Yes", "is_correct": True}, {"text": "No", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "code": "pa", "name": "Punjabi", "flag": "🇮🇳", "icon": "punjabi",
        "desc": "Learn Gurmukhi script and joyful Punjabi phrases.",
        "units": [
            {
                "title": "Unit 1: Punjabi Basics & Sat Sri Akaal",
                "desc": "Learn Sat Sri Akaal, Kiddan, and Punjabi culture phrases.",
                "color": "#58CC02",
                "skills": [
                    {
                        "title": "Sat Sri Akaal & Greetings", "icon": "hand-wave", "desc": "Sat Sri Akaal, Dhanvaad, Kiddan?",
                        "lessons": [
                            {
                                "title": "Sat Sri Akaal Essentials",
                                "intro": "'Sat Sri Akaal' (ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ) is the holy greeting in Punjabi. 'Kiddan?' (ਕਿੱਦਾਂ?) is informal 'How's it going?'. 'Dhanvaad' (ਧੰਨਵਾਦ) means 'Thank you'.",
                                "vocab": "• ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ (Sat Sri Akaal) = Hello\n• ਕਿੱਦਾਂ? (Kiddan?) = How's it going?\n• ਧੰਨਵਾਦ (Dhanvaad) = Thank you\n• ਹਾਂ (Haan) = Yes",
                                "exercises": [
                                    {"type": "multiple_choice", "prompt": "Select 'Hello' in Punjabi", "question": "Hello", "hint": "Sat Sri Akaal", "exp": "'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ' means Hello in Punjabi.", "answer": "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ (Sat Sri Akaal)", "options": [{"text": "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ (Sat Sri Akaal)", "is_correct": True}, {"text": "ਧੰਨਵਾਦ", "is_correct": False}]},
                                    {"type": "match_pairs", "prompt": "Match Punjabi phrases", "question": "Match", "exp": "Pair terms.", "answer": json.dumps({"ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ": "Hello", "ਧੰਨਵਾਦ": "Thank you", "ਹਾਂ": "Yes", "ਨਹੀਂ": "No"}), "options": []},
                                    {"type": "word_bank", "prompt": "Translate to English", "question": "ਮੈਂ ਵਧੀਆ ਹਾਂ", "hint": "I am fine", "exp": "Main vadhiya haan = I am fine.", "answer": json.dumps(["I", "am", "fine"]), "options": ["I", "am", "fine", "bad"]},
                                    {"type": "fill_blank", "prompt": "Complete: ਤੁਹਾਡਾ ਨਾਮ ___ ਹੈ? (what)", "question": "ਤੁਹਾਡਾ ਨਾਮ ___ ਹੈ?", "hint": "What", "exp": "'ਕੀ' (Ki) means what.", "answer": "ਕੀ", "options": [{"text": "ਕੀ", "is_correct": True}, {"text": "ਕਿੱਥੇ", "is_correct": False}]},
                                    {"type": "type_answer", "prompt": "Type English for 'Dhanvaad'", "question": "ਧੰਨਵਾਦ", "hint": "Thank you", "exp": "Dhanvaad means Thank you.", "answer": "Thank you", "options": []},
                                    {"type": "listening", "prompt": "Listen to Punjabi audio", "question": "🔊 [Audio: Kiddan]", "hint": "Query", "exp": "Plays Kiddan.", "answer": "How's it going?", "options": [{"text": "How's it going?", "is_correct": True}, {"text": "Hello", "is_correct": False}]},
                                    {"type": "translate_sentence", "prompt": "Translate", "question": "Mera naam Ashutosh hai", "hint": "My name is Ashutosh", "exp": "My name is Ashutosh.", "answer": "My name is Ashutosh", "options": []},
                                    {"type": "multiple_choice", "prompt": "Select 'Yes'", "question": "Haan (ਹਾਂ)", "hint": "Affirmative", "exp": "Haan = Yes.", "answer": "Yes", "options": [{"text": "Yes", "is_correct": True}, {"text": "No", "is_correct": False}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("Seeding database with 10 Indian Languages & Zero Placeholder content...")

    # 1. Primary User: Ashutosh Raj
    user = User(
        full_name="Ashutosh Raj",
        email="ashutosh@example.com",
        username="ashutosh_raj",
        hashed_password=hash_password("password123"),
        avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
        native_language="English",
        language_to_learn="Hindi",
        country="India",
        xp=1240,
        streak=5,
        hearts=5,
        max_hearts=5,
        gems=450,
        level=12,
        daily_xp_goal=50,
        dark_mode=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Iterate and Seed All 10 Courses
    first_course_id = None
    for lang in LANGUAGES_DATA:
        c = Course(
            title=lang["name"],
            code=lang["code"],
            flag_emoji=lang["flag"],
            description=lang["desc"],
            icon_name=lang["icon"]
        )
        db.add(c)
        db.commit()
        db.refresh(c)

        if not first_course_id:
            first_course_id = c.id

        unit_order = 1
        for u_data in lang["units"]:
            unit = Unit(
                course_id=c.id,
                title=u_data["title"],
                description=u_data["desc"],
                color_hex=u_data["color"],
                order=unit_order
            )
            db.add(unit)
            db.commit()
            db.refresh(unit)
            unit_order += 1

            skill_order = 1
            for sk_data in u_data["skills"]:
                skill = Skill(
                    unit_id=unit.id,
                    title=sk_data["title"],
                    icon=sk_data["icon"],
                    description=sk_data["desc"],
                    order=skill_order,
                    total_lessons=len(sk_data["lessons"])
                )
                db.add(skill)
                db.commit()
                db.refresh(skill)
                skill_order += 1

                # User progress
                is_unlocked = (unit_order == 2 and skill_order <= 3)
                is_completed = (unit_order == 2 and skill_order == 2)
                completed_count = 4 if is_completed else (2 if is_unlocked else 0)
                db.add(UserProgress(
                    user_id=user.id,
                    skill_id=skill.id,
                    completed_lessons=completed_count,
                    is_unlocked=is_unlocked,
                    is_completed=is_completed
                ))
                db.commit()

                lesson_order = 1
                for l_data in sk_data["lessons"]:
                    lesson = Lesson(
                        skill_id=skill.id,
                        title=l_data["title"],
                        intro_explanation=l_data.get("intro"),
                        vocabulary_notes=l_data.get("vocab"),
                        xp_reward=25,
                        order=lesson_order
                    )
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    lesson_order += 1

                    ex_order = 1
                    for ex_data in l_data["exercises"]:
                        exercise = Exercise(
                            lesson_id=lesson.id,
                            type=ex_data["type"],
                            prompt=ex_data["prompt"],
                            question_text=ex_data["question"],
                            translation_hint=ex_data.get("hint"),
                            explanation=ex_data.get("exp"),
                            correct_answer=ex_data["answer"],
                            order=ex_order
                        )
                        db.add(exercise)
                        db.commit()
                        db.refresh(exercise)
                        ex_order += 1

                        if ex_data.get("options"):
                            for opt in ex_data["options"]:
                                if isinstance(opt, dict):
                                    db.add(ExerciseOption(
                                        exercise_id=exercise.id,
                                        text=opt["text"],
                                        translation=opt.get("translation"),
                                        is_correct=opt.get("is_correct", False)
                                    ))
                                else:
                                    db.add(ExerciseOption(
                                        exercise_id=exercise.id,
                                        text=str(opt),
                                        is_correct=False
                                    ))
                            db.commit()

    user.current_course_id = first_course_id
    db.commit()

    # 3. Leaderboard Entries (Indian Competitors)
    leaderboard = [
        LeaderboardEntry(username="Rahul Sharma", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Rahul", city="Delhi", xp=5100, league="Gold", rank=1, is_user=False),
        LeaderboardEntry(username="Ashutosh Raj", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh", city="Bengaluru", xp=4250, league="Gold", rank=2, is_user=True),
        LeaderboardEntry(username="Priya Verma", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Priya", city="Mumbai", xp=4200, league="Gold", rank=3, is_user=False),
        LeaderboardEntry(username="Amit Kumar", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Amit", city="Kolkata", xp=3800, league="Gold", rank=4, is_user=False),
        LeaderboardEntry(username="Neha Singh", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Neha", city="Lucknow", xp=3150, league="Gold", rank=5, is_user=False),
        LeaderboardEntry(username="Arjun Patel", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Arjun", city="Ahmedabad", xp=2900, league="Gold", rank=6, is_user=False),
        LeaderboardEntry(username="Sneha Reddy", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Sneha", city="Hyderabad", xp=2750, league="Gold", rank=7, is_user=False),
        LeaderboardEntry(username="Vikram Joshi", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Vikram", city="Pune", xp=2500, league="Gold", rank=8, is_user=False),
        LeaderboardEntry(username="Karan Mehta", avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Karan", city="Jaipur", xp=2300, league="Gold", rank=9, is_user=False),
    ]
    db.add_all(leaderboard)
    db.commit()

    # 4. Achievements
    achievements = [
        Achievement(key="first_lesson", title="First Steps", description="Complete your first Indian language lesson", category="lesson", max_progress=1, gem_reward=50),
        Achievement(key="wildfire", title="Wildfire", description="Reach a 7-day learning streak", category="streak", max_progress=7, gem_reward=100),
        Achievement(key="sage", title="Sage", description="Earn 1,000 XP in your course", category="xp", max_progress=1000, gem_reward=150),
        Achievement(key="sharpshooter", title="Sharpshooter", description="Complete 5 lessons with 100% accuracy", category="accuracy", max_progress=5, gem_reward=75),
        Achievement(key="polyglot", title="Polyglot", description="Start learning 3 or more Indian languages", category="languages", max_progress=3, gem_reward=200),
    ]
    db.add_all(achievements)
    db.commit()

    db.add_all([
        UserAchievement(user_id=user.id, achievement_id=achievements[0].id, current_progress=1, is_unlocked=True, claimed=True),
        UserAchievement(user_id=user.id, achievement_id=achievements[1].id, current_progress=5, is_unlocked=False, claimed=False),
        UserAchievement(user_id=user.id, achievement_id=achievements[2].id, current_progress=1000, is_unlocked=True, claimed=True),
        UserAchievement(user_id=user.id, achievement_id=achievements[3].id, current_progress=4, is_unlocked=False, claimed=False),
    ])
    db.commit()

    # 5. Quests
    quests = [
        DailyQuest(title="Earn 50 XP", description="Maintain your daily streak by earning 50 XP.", target_amount=50, reward_xp=30, reward_gems=20, quest_type="xp"),
        DailyQuest(title="Complete 2 Lessons", description="Finish 2 path lessons today.", target_amount=2, reward_xp=40, reward_gems=25, quest_type="lessons"),
        DailyQuest(title="Master 100% Accuracy", description="Complete a lesson with 0 mistakes.", target_amount=1, reward_xp=50, reward_gems=30, quest_type="accuracy"),
    ]
    db.add_all(quests)
    db.commit()

    db.add_all([
        UserQuest(user_id=user.id, quest_id=quests[0].id, current_progress=35, completed=False, claimed=False),
        UserQuest(user_id=user.id, quest_id=quests[1].id, current_progress=1, completed=False, claimed=False),
        UserQuest(user_id=user.id, quest_id=quests[2].id, current_progress=1, completed=True, claimed=True),
    ])
    db.commit()

    # 6. Shop Items
    shop_items = [
        ShopItem(key="heart_refill", name="Heart Refill", description="Refill your hearts to maximum so you can keep learning without pauses.", category="heart", price_gems=350, icon_name="heart"),
        ShopItem(key="streak_freeze", name="Streak Freeze", description="Protects your streak if you miss a day of practice.", category="freeze", price_gems=200, icon_name="snowflake"),
        ShopItem(key="xp_boost", name="2x XP Double Boost", description="Earn double XP on all lessons for the next 15 minutes.", category="boost", price_gems=150, icon_name="zap"),
        ShopItem(key="super_lingoquest", name="LingoQuest Plus", description="Unlimited Hearts, Zero Ads, and Special Badges.", category="premium", price_gems=1000, icon_name="crown"),
    ]
    db.add_all(shop_items)
    db.commit()

    print("All 10 Indian Languages & educational courses seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
