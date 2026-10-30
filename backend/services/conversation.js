// ============================================================
// BAJE AI — Core Conversation Engine
// बाजेसँग गफ गरौँ! The heart of the application.
// ============================================================

const { getContext, updateContext, setLastJokeMessage, canTellJoke, detectLanguage } = require('./context');
const { getRandomJoke, getJokeByCategory, shouldInsertJoke, getJokeWithLeadIn } = require('./humor');
const { isConfigured, generateResponse } = require('./ai');

// ============================================================
// RESPONSE DATABASE — The soul of Baje
// ============================================================

const responses = {
  greeting: {
    nepali: [
      'ए बाबु! आज यहाँ आइपुग्यौ! के छ खबर? सब ठीक छ त?',
      'हौ! को आयो भन्दा — आफ्नै नाति! ल भन त, आज के कुरा गर्ने हो?',
      'नमस्ते बाबु! बाजे तयार छ गफ गर्न! के छ आजकल?',
      'ल ल आइस्! अनि के गर्दैछौ? पढाइ ठीक छ त?',
      'हेर न! बाजेलाई सम्झ्यौ! ल गफ गरौँ, के छ खबर?',
      'बाबु! आयौ! चिया खाँदै गफ गरौँ — के कुरा लिएर आयौ?'
    ],
    english: [
      'Namaste babu! Good to see you! What\'s going on?',
      'Ah, you came to chat with Baje! What\'s the news today?',
      'Hello hello! Baje is always ready for a good chat. What\'s up?'
    ],
    romanized: [
      'Aye babu! K cha khwar? Sab thik cha ta?',
      'Namaste! Baje tayar cha guff garna! K cha aajkal?',
      'Haau! Ko aayo bhane — aafnai nati! L bhan ta, aaja k kura garne ho?'
    ]
  },

  farewell: {
    nepali: [
      'ल बाबु, जाँदैछौ? ठीक छ — सावधान रहनु! फेरि आउनु है!',
      'हौ जाऊ! तर बिर्सिनु नहोस् — बाजे सधैँ यहाँ छु! ❤️',
      'ल राम्रो गर! खाना खानु, पढ्नु, सुत्नु — बाजेको आदेश! 😄',
      'जाँदैछौ? ल ल, बाटो हेरेर जानु है! फेरि गफ गर्न आउनु!',
      'अलविदा बाबु! आफ्नो ख्याल राख्नु — बाजे माया गर्छ! ❤️'
    ],
    english: [
      'Goodbye babu! Take care and come back to chat again! ❤️',
      'Alright, off you go! Stay safe and don\'t forget to eat properly!',
      'Bye bye babu! Baje will be here whenever you want to chat!'
    ],
    romanized: [
      'L babu, jaadai chau? Thik cha — savdhan rahanu! Pheri aunu hai!',
      'Hau jau! Tara birsinu nahola — Baje sadai yaha chu! ❤️'
    ]
  },

  joke_request: {
    nepali: [
      null, // signals: tell a joke from humor module
    ],
    english: [null],
    romanized: [null]
  },

  exam_school: {
    nepali: [
      'ए बाबु! परीक्षा आउँदैछ भने अहिलेदेखि नै पढ्न थाल! मोबाइल राखेर किताब उठाउ! बाजेले गरेनस् भनेको होइन — जा पढ्! 📚',
      'परीक्षाको तयारी कस्तो छ बाबु? राम्ररी पढ्नु। नम्बर नआए पनि ज्ञान त आउँछ। तर नम्बर पनि ल्याउनु! 😄',
      'हेर न बाबु, पढाइ भनेको बोझ होइन — भविष्यको लागि लगानी हो। बाजेको पालामा यस्तो सुविधा भए पढिन्थ्यो नि!',
      'बाबु, परीक्षामा राम्रो गर्ने secret — नियमित पढाइ! Last minute मा पढेर brain थाक्छ। अलि अलि गरेर पढ्!',
      'ए! पढाइको कुरा आयो! बाजेलाई खुसी लाग्यो। के subject गाह्रो छ? बताउ, बाजेले जित्तिसक्यो नि!'
    ],
    english: [
      'Ah, studies! Baje is happy to talk about this. Which subject is giving you trouble babu?',
      'Exam coming up? Stop scrolling and start reading! That\'s Baje\'s golden advice! 📚',
      'Studies are important babu. Not just for marks — for knowledge! Both are good though. 😄'
    ],
    romanized: [
      'Aye babu! Exam aaudai cha bhane padha! Mobile rakhera kitab uthau!',
      'Padhai kasari cha? Regular padha babu — last minute ma tension hudaina!'
    ]
  },

  motivation: {
    nepali: [
      'हेर बाबु, बाजेले ७५ वर्षको जिन्दगीमा एउटा कुरा सिकेँ — कठिनाइ सधैँ अस्थायी हुन्छ। तर हार मान्यौ भने त्यो स्थायी हुन्छ। उठ!',
      'ए बाबु! दुःखी नहो। बाजेले पनि धेरै कठिनाइ झेलेको छ — तर यहाँ छु नि! तिमी पनि सक्छौ!',
      'जिन्दगी सधैँ राम्रो हुँदैन बाबु, तर सधैँ खराब पनि हुँदैन। एउटा राम्रो दिन पर्खदैछ — हार नमान!',
      'बाबु, अँध्यारो जति गाढा भए पनि बिहान आउँछ नै। हिम्मत राख! बाजे तिम्रो साथमा छ! ❤️',
      'हेर न, रुनु र हाँस्नु दुवै मानवीय हो। तर बाजे भन्छ — हाँस्दा नि रुन्छ भने, हाँस्नु नै राम्रो! 😄'
    ],
    english: [
      'Hey babu, don\'t give up! Baje has seen many difficult times — and here I am, still smiling! You can do it too! ❤️',
      'Life isn\'t always easy, but it gets better. Keep going babu! Every dark night has a morning.',
      'Baje believes in you! Whatever is troubling you — this too shall pass. Stay strong!'
    ],
    romanized: [
      'Babu, dukhi nahou! Baje ko 75 saal ko experience cha — kastosu difficult time ma bhi hope raakhnu pardcha!',
      'Haru naman babu! Timile sakchau — Baje ko bharosa cha timima! ❤️'
    ]
  },

  advice: {
    nepali: [
      'ल बाबु, सल्लाह चाहियो? के विषयमा हो? राम्ररी भन — बाजेको ७५ वर्षको अनुभव तिम्रो काम आउँछ!',
      'हेर न बाबु, सल्लाह दिन बाजे सधैँ तयार छ। तर पहिले समस्या राम्ररी बुझाउ — त्यसपछि सोचौँ!',
      'बाबु, सबभन्दा राम्रो सल्लाह के हो जान्छौ? आफ्नो मनको कुरा सुन — तर बाजेको कुरा पनि सुन! 😄',
      'के कुरामा सल्लाह चाहिन्छ बाबु? पढाइ, साथी, जिन्दगी — बाजेले सबै विषयमा कुरा गर्न सक्छ!'
    ],
    english: [
      'Advice? Baje is always ready! Tell me what\'s on your mind babu.',
      'What do you need guidance on? 75 years of wisdom at your service! 😄',
      'Share what\'s troubling you babu — let\'s think about it together!'
    ],
    romanized: [
      'L babu, k bisayama sallah chahiyo? Ramrari bhan — Baje le sochne!',
      'Ke kura ma problem cha? Baje sadai tayar cha!'
    ]
  },

  nepali_culture: {
    nepali: [
      'ए बाबु! नेपाली संस्कृतिको कुरा गर्‍यौ! बाजेलाई सबभन्दा प्रिय विषय! दशैँ, तिहार, तीज — कुन चाहियो?',
      'नेपाल भनेको पहाड, मन्दिर र मायाको देश हो बाबु! हाम्रो संस्कृति विश्वकै धनी छ। गर्व गर!',
      'हेर न, हाम्रो नेपाली संस्कृतिमा कति रमाइलो छ! दशैँमा टीका, तिहारमा दीपावली — यो सबै हाम्रो पहिचान हो!',
      'बाबु, नेपाली संस्कृति बारे सोधेकोमा खुसी लाग्यो! के जान्न चाहन्छौ — खाना, चाडपर्व, भेषभूषा?'
    ],
    english: [
      'Ah, Nepali culture! Baje\'s favorite topic! Nepal has such rich traditions — Dashain, Tihar, Teej. What do you want to know?',
      'Nepal is a land of mountains, temples, and beautiful culture babu! We should all be proud!',
      'Our culture is thousands of years old! What aspect interests you — festivals, food, traditions?'
    ],
    romanized: [
      'Nepali culture! Baje ko favourite topic! K jannu cha — Dashain, Tihar, khana?',
      'Nepal ko sanskriti bada rich cha babu! Garba gara!'
    ]
  },

  food: {
    nepali: [
      'ए बाबु! खाना! बाजेलाई सबभन्दा राम्रो विषय। दाल भात भन्दा राम्रो के छ र? 😄',
      'हेर न, दाल भात खाने नेपाली सधैँ healthy! तिमी दाल भात खान्छौ त बाबु?',
      'मोमो! बाबु मोमोको कुरा आयो! नेपाली मोमो भनेको बस एकलाई therapy हो! 😄',
      'खाना पकाउन जान्छौ बाबु? बाजेको पालामा सबैले पकाउन जानेका थिए — अहिलेको नाति नातिनीलाई Swiggy छ! हाहा!'
    ],
    english: [
      'Food talk! Baje loves this topic! Dal bhat is the king of all food babu! 😄',
      'Nothing beats a good plate of dal bhat and momo! Are you eating properly babu?',
      'Momo! If you\'re talking about food, Baje assumes momo is involved! 😄'
    ],
    romanized: [
      'Khana! Baje ko favourite topic! Dal bhat bhandaa ramro ke cha ra?',
      'Momo ko kura aayo! Nepal ko best therapy!'
    ]
  },

  love: {
    nepali: [
      'हौ बाबु! प्रेमको कुरा! बाजेलाई सुनाउ — पर्दैन लजाउन! बाजे पनि जवान थिए! 😄',
      'माया गर्नु राम्रो हो बाबु — तर पहिले आफूलाई माया गर्! अनि पढाइ, अनि बाँकी सबै! 😊',
      'हेर न बाबु, असली माया त्यो हो जसले तिम्रो जिन्दगी राम्रो बनाउँछ — नखराब! सोच्नु!',
      'ए! यो कुरा! बाजे जान्नु पर्ने सबै जान्दछ! के भयो? भन त!'
    ],
    english: [
      'Love! Baje understands babu — even Baje was young once! 😄 Tell me what\'s happening!',
      'Love is beautiful babu, but studies first! Then love, then everything else. 😊',
      'Ha! This topic! Baje knows all about it. What\'s going on?'
    ],
    romanized: [
      'Hau babu! Maya ko kura! Baje lai sunau — parne na lajaaunu!',
      'Maya garna ramro cha babu — tara padhai bhi ramro gara!'
    ]
  },

  technology: {
    nepali: [
      'ए बाबु! computer, internet, AI — यो सब बाजेलाई अलि अनौठो लाग्छ! तर तिमीहरू राम्रोसँग प्रयोग गर्नुस्!',
      'हेर न, बाजे सोच्छ — AI भनेको के हो? म नै AI हुँ भने झन् आश्चर्य! हाहा! 😄',
      'Technology राम्रो हो बाबु — तर मोबाइलमा मात्र समय नगुमाउनु! असली जिन्दगी पनि छ!',
      'बाबु AI को कुरा गर्छौ! बाजेलाई AI नबुझे पनि तिम्रो साथमा छु! हाहा!'
    ],
    english: [
      'Technology! Baje is still figuring out WhatsApp but asks you to explain! 😄',
      'AI, computers, internet — amazing things babu! Just don\'t forget real life too!',
      'Baje is an AI himself! How funny is that? 😄 What do you want to know about technology?'
    ],
    romanized: [
      'AI ko kura! Baje nai AI ho bhane kati aashcharya! Haha!',
      'Technology ramro cha babu — mobile ma matrai time nagumaaunu!'
    ]
  },

  weather: {
    nepali: [
      'मौसमको कुरा! नेपालमा मौसम कहिले कस्तो हुन्छ — थाहा छैन बाबु! एकदिन घाम, अर्को दिन पानी! 😄',
      'हेर न बाबु, नेपालको मौसम जस्तै जिन्दगी पनि — कहिले घाम, कहिले पानी! सधैँ छाता तयार राख्नु!',
      'जाडो लाग्यो बाबु? दाल भात र चिया खाउ! बाजेको guaranteed solution! 😄'
    ],
    english: [
      'Weather talk! Nepal\'s weather is unpredictable babu — one day sun, next day rain! Just like life! 😄',
      'Feeling cold? Dal bhat and tea! Baje\'s guaranteed solution! 😄'
    ],
    romanized: [
      'Mausam ko kura! Nepal ma kasto hola — thaha chhaina! Ekdin gham, arko din pani!'
    ]
  },

  family: {
    nepali: [
      'परिवारको कुरा! बाजेलाई सबभन्दा प्रिय विषय! परिवार भनेको संसारको सबभन्दा ठुलो सम्पत्ति हो बाबु! ❤️',
      'हेर न बाबु, परिवारले कहिलेकाहीँ झर्किन्छ — तर मायाले गर्छ। बुझ्नु!',
      'ए, परिवारको कुरा गर्‍यौ? आमा बुवाको ख्याल गर बाबु — उनीहरूको माया अमूल्य छ!'
    ],
    english: [
      'Family! Baje\'s favorite! Family is the greatest treasure in life babu! ❤️',
      'Take care of your family babu — they love you even when they scold! 😄'
    ],
    romanized: [
      'Parivaar ko kura! Baje lai sabai bhandaa priya topic! ❤️',
      'Aaama buwaa ko khyaal gara babu — uniharu ko maaya amulyaa cha!'
    ]
  },

  who_are_you: {
    nepali: [
      'हाहा! म BAJE हुँ — तिम्रो डिजिटल नेपाली हजुरबुवा! उमेर ७५, अनुभव अपार, माया अनन्त! 😄',
      'म? बाजे! डिजिटल भए पनि असली हजुरबुवा जस्तै माया गर्छु! नेपालको digital hajurbuwa!',
      'ए बाबु! म BAJE AI हुँ। नेपाली संस्कृति, हास्य र ज्ञान बोकेको तिम्रो virtual हजुरबुवा! 🇳🇵'
    ],
    english: [
      'I\'m BAJE! Your digital Nepali Hajurbuwa! 75 years young, full of wisdom and humor! 😄',
      'Baje AI! A digital grandfather who speaks Nepali, tells jokes, and gives advice! Made with love for Nepal 🇳🇵'
    ],
    romanized: [
      'Ma? BAJE! Digital bhaye pani asali hajurbuwa jastai maaya garchu!',
      'BAJE AI — timro virtual Nepali hajurbuwa! 😄'
    ]
  },

  age: {
    nepali: [
      'हाहा! उमेर सोध्यौ? बाजेको ७५ वर्ष भयो बाबु! तर मनले अझै जवान छु! 😄',
      'ए बाबु! उमेर थाहा पाउनु छ? ७५! र यो उमेरमा पनि तिमीसँग गफ गर्न तयार छु!'
    ],
    english: [
      '75 years young babu! Age is just a number — Baje is still sharp! 😄',
      'Baje is 75 but feels 25 in spirit! That\'s the power of good dal bhat!'
    ],
    romanized: [
      'Haha! Baje ko 75 barsha bhaayo babu! Tara manle juwaan chu! 😄'
    ]
  },

  bored: {
    nepali: [
      'हौ बाबु! यत्रो संसारमा गर्नलाई कति कुरा छन्, अनि तिमीलाई बोर लाग्यो? ल एउटा रमाइलो कुरा गरौँ!',
      'बोर? ल बाबु, बाजेसँग गफ गर! जोक सुन, कथा सुन, सल्लाह लिउ — बोर हुन्न! 😄',
      'ए! बोर लाग्यो? बाजे यहाँ छन् नि! के कुरा गर्ने — बाबुले नै रोज्नु!'
    ],
    english: [
      'Bored babu? Chat with Baje! Jokes, stories, advice — never a dull moment! 😄',
      'So much world to explore and you\'re bored! Let\'s have a fun conversation!'
    ],
    romanized: [
      'Bore laagyo? Baje sanga gauff gar! Jokes, stories — bore hudaina! 😄'
    ]
  },

  thanks: {
    nepali: [
      'ल ल बाबु! धन्यवाद भन्नु पर्दैन — बाजेलाई गफ गर्न पाए नै खुसी! ❤️',
      'हौ! खुसी भयो बाबु! बाजेको काम यही हो — गफ गर्नु र हँसाउनु! 😄',
      'ए बाबु! धन्यवाद! तर साँच्चिकै खुसी पार्नु छ भने — फेरि आउनु है! 😊'
    ],
    english: [
      'No thanks needed babu! Chatting with you makes Baje happy! ❤️',
      'Glad to help! Come back anytime babu!'
    ],
    romanized: [
      'L l babu! Dhanyawaad bhanna pardaina — Baje lai khusi cha! ❤️'
    ]
  },

  philosophy: {
    nepali: [
      'हेर न बाबु, जिन्दगी भनेको दाल भात जस्तै — सादो देखिए पनि भित्र धेरै स्वाद छ। जिउनु सिक्!',
      'बाजेले ७५ वर्षमा सिकेको एउटा कुरा — खुसी बाहिरबाट आउँदैन, भित्रबाट आउँछ!',
      'ए बाबु! जिन्दगीको अर्थ खोज्दैछौ? सबभन्दा सजिलो अर्थ — आफूले चाहेको गर, अरूलाई माया गर!'
    ],
    english: [
      'Life philosophy! Baje loves this. In 75 years I learned: happiness comes from within, not outside.',
      'Simple wisdom babu: do what you love, love what you do, and eat dal bhat daily! 😄'
    ],
    romanized: [
      'Jindagi ko kura! Baje ko 75 saal ko experience — khusi baahirbata audaina, bhitrabata aaucha!'
    ]
  },

  story: {
    nepali: [
      'ए बाबु! कथा सुन्ने? बाजेसँग कति कथा छन् — गाउँको, हिमालको, बाल्यकालको! सुनाउँछु!\n\nएकपटक हाम्रो गाउँमा एउटा मान्छे थियो जो यति अल्छी थियो कि उसले बिहान उठेर "आज अल्छी नगर्छु" भन्दा भन्दै फेरि सुत्थ्यो! हाहा! तिमी उस्तै त होइनौ बाबु? 😄',
      'ल कथा सुनाउँछु! बाजेको बाल्यकालको कुरा — हाम्रो गाउँमा electricity थिएन। राति पढ्न टुकीको उज्यालो! अहिलेका नाति नातिनी phone को light मा पढ्न बिर्सिन्छन्! हाहा!',
      'रमाइलो कथा? ल सुन बाबु!\n\nएक जना बुढो थिए जो सधैँ भन्थे — "मेरो बाल्यकाल धेरै कठिन थियो।" एकदिन नातिले सोध्यो — "बाजे, तपाईँले सबभन्दा कठिन के गर्नुभयो?" बाजेले भने — "WiFi बिना बाँच्नु!" 😂'
    ],
    english: [
      'A story! Baje has many! Let me tell you one from village life...\n\nThere was a man in our village so lazy that every morning he\'d say "I won\'t be lazy today" and then go back to sleep! Are you like him babu? 😄',
      'Story time! When Baje was young, there was no electricity. We read by oil lamp light! Now you have phone light but forget to read! Haha!'
    ],
    romanized: [
      'Katha sunne? Baje sanga dheri katha cha! Sunaaunu?\n\nEkpatak haami ro gaun ma...'
    ]
  },

  // Fallbacks when nothing matches
  fallback: {
    nepali: [
      'हम्म! बाजेले राम्ररी बुझेन बाबु। फेरि अलि स्पष्ट गरेर भन्नुस् त!',
      'ए बाबु! यो कुरा अलि नयाँ छ बाजेलाई। अलि बढी भन्नुस् त!',
      'हौ! बाजे सोच्दैछ... तिमीले के भन्न खोजेको? अलि विस्तार गरेर भन्!',
      'हम्म, अलि अस्पष्ट भयो बाबु। फेरि भन्नुस् — बाजे ध्यान दिएर सुन्छ!'
    ],
    english: [
      'Hmm, Baje didn\'t quite catch that! Could you explain a bit more babu?',
      'Interesting babu! Tell me more about what you mean.',
      'Baje is thinking... Could you be a bit more specific?'
    ],
    romanized: [
      'Hmm! Baje le ramrari bujhena babu. Aru bhanau ta!',
      'K bhannu khojepa? Aru bisataar gara!'
    ]
  }
};

// ============================================================
// INTENT DETECTION
// ============================================================

const intentPatterns = [
  {
    intent: 'greeting',
    patterns: [
      /\b(hello|hi|hey|namaste|namaskar|नमस्ते|नमस्कार)\b/i,
      /\b(k cha|ke cha|kha cha|ke ho|ayo|aayo|आयो|के छ|कस्तो)\b/i,
      /^(baje|बाजे)[!,\s]*$/i,
      /\b(good morning|good evening|good afternoon|subha)\b/i,
      /\b(sanchai|सञ्चै|thik cha|ठीक छ)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'farewell',
    patterns: [
      /\b(bye|goodbye|alvida|अलविदा|जाँदैछु|jaadai chu|baadhi|pheri bhetnchha)\b/i,
      /\b(good night|subha ratri|suba ratri|शुभरात्री|राति|raat)\b/i,
      /\b(janchhu|jaanchu|जान्छु|laai|जाने|jaane)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'joke_request',
    patterns: [
      /\b(joke|jokes|jok|हाँसाउ|हँसाउ|hँसाउ|hasaau|हाहा|हँसो)\b/i,
      /\b(funny|ramaailo|रमाइलो|मजा|maza|hasau)\b/i,
      /जोक\s*(सुनाउ|सुनाउनुस्|भन|दिनुस्)/i,
      /\b(sunaaunu|sunaaau|सुनाउनुस्)\b/i
    ],
    jokeCategory: 'random'
  },
  {
    intent: 'exam_school',
    patterns: [
      /\b(exam|परीक्षा|pariksha|padhai|पढाइ|पढ्न|padna|school|college|marks|नम्बर)\b/i,
      /\b(fail|pass|result|homework|assignment|study|studies)\b/i,
      /\b(class|kaksha|कक्षा|subject|teacher|sir|madam)\b/i,
      /\b(tension|stress|padhna|kitaab|किताब)\b/i
    ],
    jokeCategory: 'exam'
  },
  {
    intent: 'motivation',
    patterns: [
      /\b(sad|dukhi|दुःखी|depressed|depression|help|sos|give up)\b/i,
      /\b(disappointed|frustrated|hopeless|unhappy|cry|runu|रोनु|रुँदैछु)\b/i,
      /\b(problem|samasya|समस्या|trouble|difficulty|kasht|कष्ट)\b/i,
      /\b(थाकेँ|thaake|tired|thaka|exhausted)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'advice',
    patterns: [
      /\b(sallah|सल्लाह|advice|suggestion|ke garne|के गर्ने|help me)\b/i,
      /\b(bataaunu|बताउनुस्|tell me|guide|guidance|सल्लाह)\b/i,
      /\b(kasto|kase|कसरी|how to|what to do|के गर्ने)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'nepali_culture',
    patterns: [
      /\b(nepal|नेपाल|culture|sanskriti|संस्कृति|dashain|दशैँ|tihar|तिहार|teej|तीज)\b/i,
      /\b(festival|chaadbad|चाडबाड|nuwakot|kathmandu|pokhara|lumbini)\b/i,
      /\b(tradition|riti|रीति|custom|heritage|pahad|पहाड|himal|हिमाल)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'food',
    patterns: [
      /\b(khana|खाना|food|eat|khaana|dal bhat|दाल भात|momo|मोमो)\b/i,
      /\b(bhok|भोक|hungry|cook|pakaaunu|पकाउनु|restaurant|chiya|चिया)\b/i,
      /\b(rice|roti|curry|tarkari|तरकारी|achar|अचार|sel roti)\b/i
    ],
    jokeCategory: 'food'
  },
  {
    intent: 'love',
    patterns: [
      /\b(maya|माया|love|girlfriend|boyfriend|relationship|crush|propose)\b/i,
      /\b(prem|प्रेम|heart|dil|jealous|breakup|dating|partner)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'technology',
    patterns: [
      /\b(mobile|phone|internet|computer|laptop|AI|robot|technology|tech)\b/i,
      /\b(app|website|social media|facebook|instagram|tiktok|youtube|whatsapp)\b/i,
      /\b(digital|online|wifi|internet|email|google|amazon)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'weather',
    patterns: [
      /\b(mausam|मौसम|weather|rain|pani|पानी|snow|himal|jado|जाडो|garmi)\b/i,
      /\b(hot|cold|monsoon|barsha|बर्षा|temperature|cold|sunny|cloudy)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'family',
    patterns: [
      /\b(family|parivaar|परिवार|aama|आमा|buwa|baba|dai|didi|bhai|bahini)\b/i,
      /\b(mother|father|brother|sister|parents|relative|nani|nata)\b/i,
      /\b(ghar|घर|home|house|hajurbuwa|hajuraama|grandpa|grandma)\b/i
    ],
    jokeCategory: 'family'
  },
  {
    intent: 'who_are_you',
    patterns: [
      /\b(ko ho|को हो|who are you|timi ko|timile|your name|naam|नाम)\b/i,
      /\b(baje ko|hajurbuwa|introduce|parichaya|परिचय)\b/i,
      /\b(what are you|are you AI|are you real|k ho timi)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'age',
    patterns: [
      /\b(age|umar|उमेर|kati barsha|कति वर्ष|how old|years old|birthday)\b/i,
      /\b(old|young|juwaan|जुवान|budo|बुढो)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'bored',
    patterns: [
      /\b(bored|bore|boring|बोर|एकनास|kei chaina|केही छैन)\b/i,
      /\b(nothing to do|timepass|time pass|dull|boring)\b/i
    ],
    jokeCategory: 'boredom'
  },
  {
    intent: 'thanks',
    patterns: [
      /\b(thanks|thank you|dhanyabaad|धन्यवाद|shukriya|tapaiko|helpful)\b/i,
      /\b(appreciate|grateful|ramro|राम्रो भयो|thik bhayo|good)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'philosophy',
    patterns: [
      /\b(life|jindagi|जिन्दगी|meaning|purpose|philosophy|soch|सोच)\b/i,
      /\b(happiness|khushi|खुशी|success|safalta|सफलता|truth|sachai)\b/i,
      /\b(future|bhawisya|भविष्य|dream|sapana|सपना|goal|lakshya)\b/i
    ],
    jokeCategory: null
  },
  {
    intent: 'story',
    patterns: [
      /\b(katha|कथा|story|stories|sunaaunu|सुनाउनुस्|tales|kahani)\b/i,
      /\b(ramaailo katha|tell me a story|sunaaunu|interesting)\b/i
    ],
    jokeCategory: null
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function detectIntent(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const { intent, patterns } of intentPatterns) {
    scores[intent] = 0;
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        scores[intent]++;
      }
    }
  }

  // Find highest-scoring intent
  let bestIntent = null;
  let bestScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return { intent: bestIntent, confidence: bestScore };
}

function getResponsePool(intent, lang) {
  const intentResponses = responses[intent];
  if (!intentResponses) return null;

  // Try exact language, then fall back
  if (lang === 'nepali' && intentResponses.nepali?.length) return intentResponses.nepali;
  if (lang === 'romanized' && intentResponses.romanized?.length) return intentResponses.romanized;
  if (lang === 'english' && intentResponses.english?.length) return intentResponses.english;
  if (lang === 'mixed') {
    // Mix nepali and english pools
    return [...(intentResponses.nepali || []), ...(intentResponses.english || [])];
  }

  // Default: return nepali
  return intentResponses.nepali || intentResponses.english || [];
}

function selectResponse(pool, recentResponses = []) {
  const available = pool.filter(r => r !== null && !recentResponses.includes(r));
  if (available.length === 0) return pool.filter(r => r !== null)[0] || null;
  return available[Math.floor(Math.random() * available.length)];
}

function getEmotionForIntent(intent) {
  const emotionMap = {
    greeting: 'happy',
    farewell: 'happy',
    joke_request: 'laughing',
    exam_school: 'advice',
    motivation: 'advice',
    advice: 'advice',
    nepali_culture: 'happy',
    food: 'happy',
    love: 'happy',
    technology: 'happy',
    weather: 'idle',
    family: 'happy',
    who_are_you: 'happy',
    age: 'laughing',
    bored: 'happy',
    thanks: 'happy',
    philosophy: 'advice',
    story: 'happy',
    fallback: 'thinking'
  };
  return emotionMap[intent] || 'happy';
}

// ============================================================
// MAIN PROCESS MESSAGE FUNCTION
// ============================================================

async function processMessage(sessionId, message, providedHistory = []) {
  const ctx = getContext(sessionId);
  const lang = detectLanguage(message);

  // Update language preference
  if (lang !== 'auto') ctx.languagePreference = lang;

  const { intent, confidence } = detectIntent(message);

  // Handle joke request explicitly
  if (intent === 'joke_request') {
    const joke = getRandomJoke();
    setLastJokeMessage(sessionId);
    updateContext(sessionId, message, joke, 'laughing');
    return { reply: joke, emotion: 'laughing', source: 'local' };
  }

  // Check if we should spontaneously inject a joke into this response
  const injectJoke = canTellJoke(sessionId) &&
    intent !== 'motivation' && // Don't joke during sad/serious moments
    intent !== 'fallback' &&
    shouldInsertJoke(ctx.messageCount, ctx.lastJokeMessage);

  // Get response for detected intent
  let reply = null;
  let emotion = 'happy';
  let source = 'local';

  if (intent && confidence > 0) {
    const pool = getResponsePool(intent, lang);

    if (pool && pool.length > 0) {
      reply = selectResponse(pool, ctx.recentResponses);
      emotion = getEmotionForIntent(intent);
    }
  }

  // If no good local response and AI is configured, use AI fallback
  if (!reply || confidence === 0) {
    if (isConfigured()) {
      try {
        const history = providedHistory.length > 0 ? providedHistory : ctx.history;
        const aiResult = await generateResponse(message, history, lang);
        reply = aiResult.reply;
        emotion = aiResult.emotion;
        source = 'ai';
      } catch (aiError) {
        console.error('AI fallback failed:', aiError.message);
        // Fall back to local fallback response
        const fallbackPool = getResponsePool('fallback', lang);
        reply = selectResponse(fallbackPool, ctx.recentResponses);
        emotion = 'thinking';
        source = 'local';
      }
    } else {
      // No AI, use local fallback
      const fallbackPool = getResponsePool('fallback', lang);
      reply = selectResponse(fallbackPool, ctx.recentResponses);
      emotion = 'thinking';
      source = 'local';
    }
  }

  // Append a spontaneous joke if conditions are met
  if (injectJoke && reply && source === 'local') {
    const jokeAddOn = '\n\n' + getJokeWithLeadIn();
    reply = reply + jokeAddOn;
    setLastJokeMessage(sessionId);
    emotion = 'laughing';
  }

  // Update context
  updateContext(sessionId, message, reply, emotion);

  return { reply, emotion, source };
}

module.exports = { processMessage };
