// ============================================================
// BAJE AI — Nepali Humor Engine 😂
// ============================================================

const jokes = [
  // School / Exam jokes
  {
    id: 1, category: 'exam',
    text: 'बाबु, परीक्षामा फेल भएको मान्छे किन रुँदैन थाहा छ? किनभने आँसु पनि नम्बर दिँदैन! 😂'
  },
  {
    id: 2, category: 'exam',
    text: 'मोबाइलमा यति ध्यान दिन्छौ — काश परीक्षामा पनि यत्तिकै ध्यान दिन्थ्यौ भने बाजे खुसी हुन्थे! हाहा!'
  },
  {
    id: 3, category: 'exam',
    text: 'एउटा विद्यार्थीले परीक्षामा लेख्यो — "यो प्रश्न मलाई थाहा छैन, तर बाजेलाई सोध्नुस्, उहाँले जान्नुहुन्छ।" शिक्षकले बाजेलाई नै डाक्नुभयो! 😄'
  },
  {
    id: 4, category: 'exam',
    text: 'परीक्षाको रात किताब र मोबाइल दुवै खुल्ला हुन्छन् — किताब रोएको छ, मोबाइल हाँसेको छ। हाहा!'
  },
  {
    id: 5, category: 'exam',
    text: 'बाबु, "Copy" गर्दा पनि सोच्नु — copy गरेको कागजमा गलत लेखिएको थियो भने दुइटैलाई शून्य! 😂'
  },

  // Village life jokes
  {
    id: 6, category: 'village',
    text: 'हाम्रो गाउँमा एउटा मान्छे यति ढिलो हिँड्थ्यो, उसको छायाँ पनि उसलाई कुरेर थाक्थ्यो! हाहा!'
  },
  {
    id: 7, category: 'village',
    text: 'गाउँको बूढो मान्छेले पहिलो पटक लिफ्ट चढ्यो। माथि पुगेर भन्यो — "अरे! यो कोठाले मलाई उठाइदियो!" 😄'
  },
  {
    id: 8, category: 'village',
    text: 'हाम्रो गाउँमा WiFi आयो। पहिले गफ गर्दा — "खाना खायौ?" अब गफ गर्दा — "WiFi password के हो?" हाहा!'
  },
  {
    id: 9, category: 'village',
    text: 'गाउँको मान्छेले शहरमा ATM मेसिन देख्यो। अनि सोध्यो — "यो मेसिन पनि तलबमा काम गर्छ कि?" 😂'
  },
  {
    id: 10, category: 'village',
    text: 'हाम्रो गाउँमा बिजुली आयो। पहिलो रातमा सबैले टुकी बन्द गरे तर एउटाले टुकीबाट बल्ब बाल्ने कोशिस गर्यो! हाहा!'
  },

  // Grandfather-grandchild jokes
  {
    id: 11, category: 'grandchild',
    text: 'नाति: "बाजे, तपाईँलाई कति उमेर भयो?" बाजे: "७५!" नाति: "त्यत्रो! त्यो भन्दा मेरो मोबाइलको storage धेरै छ!" 😄'
  },
  {
    id: 12, category: 'grandchild',
    text: 'नातिले भन्यो — "बाजे, तपाईँ slow हुनुहुन्छ।" बाजेले भन्यो — "हो, slow र steady — त्यसैले ७५ वर्ष जिए, तिमी fast-fast गरेर कता पुग्छौ हेरौँला!" 😂'
  },
  {
    id: 13, category: 'grandchild',
    text: 'नातिले सोध्यो — "बाजे, Google मा के खोज्नुहुन्छ?" बाजेले भन्यो — "आफ्नै नाम। एकदिन famous हुन्छु भन्ने आस छ!" हाहा!'
  },
  {
    id: 14, category: 'grandchild',
    text: 'बाजेले WhatsApp चलाउन सिके। पहिलो message पठाए — "नमस्ते, के यो काम गर्दैछ? माथिको बटन थिचेको हो।" पूरा group मा पठाइदिए! 😄'
  },
  {
    id: 15, category: 'grandchild',
    text: 'नाति: "बाजे, online shopping गर्न सिक्नुस्!" बाजे: "सिकेँ! तर किनेको जुत्ता आएन — किनभने wrong address लेखेछु।" नाति: "के लेख्नुभयो?" बाजे: "धरतीको छोरो, नेपाल।" 😂'
  },

  // Teacher-student jokes
  {
    id: 16, category: 'school',
    text: 'शिक्षक: "पृथ्वी गोलो छ भनेर कसले सिद्ध गर्यो?" विद्यार्थी: "सरले नै भन्नुभएको थियो, मैले त विश्वास गरेँ!" 😄'
  },
  {
    id: 17, category: 'school',
    text: 'शिक्षकले सोध्यो — "तिमी ढिलो किन आयौ?" विद्यार्थी: "सर, बाटोमा बोर्ड देखेँ — SCHOOL AHEAD, GO SLOW। त्यही गरेँ!" हाहा!'
  },
  {
    id: 18, category: 'school',
    text: 'सरले भन्यो — "यो Homework गरेनौ!" विद्यार्थीले भन्यो — "सर, Environment protect गर्दैछु — कागज बचाएँ!" 😂'
  },

  // Nepali family humor
  {
    id: 19, category: 'family',
    text: 'नेपाली आमाले भन्छिन् — "खाना खा।" नखाए — "खान्न भने।" धेरै खाए — "हजुर! यति छ र?" बाबु, आमालाई कहिल्यै जित्न सकिँदैन! 😄'
  },
  {
    id: 20, category: 'family',
    text: 'नेपाली बुवाले विदेशबाट फोन गरे — "खाना खायौ?" यति सोध्न नै international call गरे! हाहा! माया त यस्तै हो बाबु!'
  },
  {
    id: 21, category: 'family',
    text: 'घरमा light जाँदा नेपाली परिवार: मोबाइल निकाल्छन्, torch बाल्छन्, अनि सबैले आफ्नै मोबाइलमा हेर्न थाल्छन्! 😂 एकता!'
  },
  {
    id: 22, category: 'family',
    text: 'दाजुले भन्यो — "मैले सबभन्दा पहिले जन्मेँ।" बहिनीले भन्यो — "मैले सबभन्दा पछि जन्मेँ, त्यसैले बाबा-आमाको अनुभव छ थाहा छ।" बाजे मुनि बसेर हाँस्दैछ! हाहा!'
  },

  // Everyday Nepali observations
  {
    id: 23, category: 'observation',
    text: 'नेपालमा "अहिले आउँछु" को अर्थ — ३० मिनेटदेखि ३ घण्टासम्म कुनैपनि! हाहा! यो बुझे भने जिन्दगी सजिलो हुन्छ!'
  },
  {
    id: 24, category: 'observation',
    text: 'नेपाली डाक्टरले लेखेको prescription पढ्न केवल pharmacist सक्छन् — त्यो एउटा secret language हो बाबु! 😄'
  },
  {
    id: 25, category: 'observation',
    text: 'नेपालमा "थोरै पर छ" को मतलब — कम्तिमा ३ किलोमिटर! हाहा! बाजे धेरै हिँड्नु पर्यो यो भनाइमा परेर!'
  },
  {
    id: 26, category: 'observation',
    text: 'दाल भात खाने नेपाली — सबैभन्दा healthy! अनि चिया त इन्जिन oil जस्तै — बिना चिया कुनै engine चल्दैन नेपालमा! 😄'
  },
  {
    id: 27, category: 'observation',
    text: 'नेपालमा traffic जाम हुँदा — सबैले horn बजाउँछन्, जस्तो horn बजाउँदा बाटो खुल्छ! हाहा! बाबु, त्यो magic काम गर्दैन!'
  },

  // Clever one-liners
  {
    id: 28, category: 'oneliner',
    text: 'मान्छे भन्छन् "समय सबभन्दा ठुलो धन।" तर नेपालमा NTC को network जस्तै — कहिले छ, कहिले छैन! 😂'
  },
  {
    id: 29, category: 'oneliner',
    text: 'जिन्दगी पनि दाल भात जस्तै — सादो देखिए पनि भित्र धेरै स्वाद छ! हाहा!'
  },
  {
    id: 30, category: 'oneliner',
    text: 'Diet सुरु गर्छु भन्ने मान्छे र नेपालको विकास — दुवैको "भोलिबाट" भनेको कहिल्यै आउँदैन! 😄'
  },
  {
    id: 31, category: 'oneliner',
    text: 'परिवर्तन मन नलाग्ने मान्छे र पुरानो computer — दुवैले update refuse गर्छन्! हाहा!'
  },

  // Nepali wordplay
  {
    id: 32, category: 'wordplay',
    text: '"Tension" र "Attention" मा एउटा "A" को फरक छ। जिन्दगीमा पनि यस्तै — एउटा सोचले सबै बदलिन्छ! हाहा बाजे philosopher भए!'
  },
  {
    id: 33, category: 'wordplay',
    text: 'बाबु, "ABCDE" याद छ? A=Always, B=Be, C=Careful, D=Doing, E=Exam! हाहा! बाजेको formula!'
  },

  // Friendly teasing
  {
    id: 34, category: 'teasing',
    text: 'बाबु, तिमीलाई आजकल AI सँग कुरा गर्न राम्रो लाग्छ? बाजेलाई भन — असली हजुरबुवा भए पनि free advice दिन्थेँ! 😄'
  },
  {
    id: 35, category: 'teasing',
    text: 'यति late उठ्छौ — घाम पनि तिमीलाई देखेर हाँस्दै उगिसक्यो होला! हाहा!'
  },
  {
    id: 36, category: 'teasing',
    text: 'मोबाइल charge मा राख्छौ तर आफू charge हुन सुत्दैनौ — यो backward logic हो बाबु! 😂'
  },
  {
    id: 37, category: 'teasing',
    text: 'बाबु, तिम्रो भोक लाग्दा पनि मोबाइल हेर्छौ? YouTube मा खाना हेरेर पेट भर्ने काम गर्दैनौ है! हाहा!'
  },

  // Situational humor
  {
    id: 38, category: 'situational',
    text: 'सोमबार: "यो हप्ता productive हुन्छु।" बुधबार: "अलि थकित छु।" शुक्रबार: "भोलिबाट सुरु गर्छु।" बाबु, यो बाजेले पनि गरेको हो! हाहा!'
  },
  {
    id: 39, category: 'situational',
    text: 'बिहान उठेर gym जाने plan — रातमा बनाउने, बिहान उठ्दा बिर्सिने। यो कला नेपालीमा सबैलाई थाहा छ! 😄'
  },
  {
    id: 40, category: 'situational',
    text: 'Online meeting मा "mute" हुनु बिर्सेर कुरा गर्यौ? बाबु, सबैले सुनेको थिए — including बाजे! हाहा!'
  },

  // Momo jokes (bonus)
  {
    id: 41, category: 'food',
    text: 'नेपालीको emotional support: मोमो! दुःखमा — मोमो, खुसीमा — मोमो, बोर लागे — मोमो। बाबु, मोमो नेपालको therapy हो! 😄'
  },
  {
    id: 42, category: 'food',
    text: 'बाहिरी मान्छेले मोमो देखेर सोध्यो — "यो के हो?" नेपालीले भन्यो — "यो खाना होइन, यो संस्कृति हो!" हाहा!'
  },

  // More grandchild
  {
    id: 43, category: 'grandchild',
    text: 'बाजे र Google दुवैको जवाफ छ — तर बाजेको जवाफमा माया पनि छ! हाहा! Google ले "म माया गर्छु" भन्दैन नि!'
  },
  {
    id: 44, category: 'grandchild',
    text: 'नातिले selfie खिच्यो र भन्यो — "बाजे, यो filter हो।" बाजेले भन्यो — "मेरो जिन्दगीमा पनि filter थियो — कठिनाइ! त्यसले मलाई strong बनायो!" Deep! 😄'
  },

  // Bored
  {
    id: 45, category: 'boredom',
    text: 'बोर लाग्यो? बाबु, बाजेको पालामा बोर भन्ने शब्द थिएन — काम गर, खेल, पढ वा सुत! Options थिए! 😂'
  },
  {
    id: 46, category: 'boredom',
    text: 'यत्रो संसारमा: पहाड चढ्न, नदी तर्न, मोमो खान, साथी भेट्न — अनि बोर? बाबु तिमी unique छौ! हाहा!'
  }
];

// Usage tracking (avoid recent repeats)
const recentJokeIds = [];
const MAX_RECENT = 8;

/**
 * Get a random joke, avoiding recent ones.
 */
function getRandomJoke(avoidIds = []) {
  const allAvoid = [...recentJokeIds, ...avoidIds];
  let available = jokes.filter(j => !allAvoid.includes(j.id));

  if (available.length === 0) {
    // Reset if all jokes used recently
    recentJokeIds.length = 0;
    available = jokes;
  }

  const joke = available[Math.floor(Math.random() * available.length)];

  // Track recent
  recentJokeIds.push(joke.id);
  if (recentJokeIds.length > MAX_RECENT) recentJokeIds.shift();

  return joke.text;
}

/**
 * Get a joke for a specific category.
 */
function getJokeByCategory(category) {
  const categoryJokes = jokes.filter(j => j.category === category && !recentJokeIds.includes(j.id));
  if (categoryJokes.length === 0) return getRandomJoke();

  const joke = categoryJokes[Math.floor(Math.random() * categoryJokes.length)];
  recentJokeIds.push(joke.id);
  if (recentJokeIds.length > MAX_RECENT) recentJokeIds.shift();

  return joke.text;
}

/**
 * Determine if baje should spontaneously inject a joke.
 * 30% chance when cooldown has passed.
 */
function shouldInsertJoke(messageCount, lastJokeMessage) {
  const cooldownPassed = (messageCount - lastJokeMessage) >= 4;
  return cooldownPassed && Math.random() < 0.25;
}

/**
 * Get a joke prefixed with a natural lead-in.
 */
function getJokeWithLeadIn() {
  const leadIns = [
    'हाहा! सुन बाबु, एउटा रमाइलो कुरा: ',
    'ल एउटा कुरा सुनाउँछु — ',
    'अनि यो पनि सुन: ',
    'हौ! याद आयो एउटा: '
  ];
  const leadIn = leadIns[Math.floor(Math.random() * leadIns.length)];
  return leadIn + getRandomJoke();
}

module.exports = {
  getRandomJoke,
  getJokeByCategory,
  shouldInsertJoke,
  getJokeWithLeadIn
};
