
// Mock data to simulate backend response
const MOCK_REVIEWS = [
  {
    id: '101',
    source: 'google',
    author_name: 'Anna Nowak',
    author_avatar: 'https://i.pravatar.cc/150?u=101',
    rating: 5,
    content: 'Fantastyczna obsługa! Pani Kasia to prawdziwa profesjonalistka. Na pewno wrócę.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'unanswered',
    service_context: {
      service_name: 'Koloryzacja Sombre',
      employee_name: 'Kasia'
    },
    reply: null
  },
  {
    id: '102',
    source: 'booksy',
    author_name: 'Marek Z.',
    author_avatar: null, // No avatar
    rating: 4,
    content: 'Strzyżenie ok, ale musiałem czekać 15 minut mimo rezerwacji. Kawka na plus.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    status: 'answered',
    service_context: {
      service_name: 'Strzyżenie Męskie',
      employee_name: 'Bartek'
    },
    reply: {
      content: 'Panie Marku, przepraszamy za opóźnienie! Cieszymy się, że kawa smakowała. Do zobaczenia!',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
    }
  },
  {
    id: '103',
    source: 'facebook',
    author_name: 'Klaudia B.',
    author_avatar: 'https://i.pravatar.cc/150?u=103',
    rating: 5,
    content: 'Polecam z całego serca! Najlepszy salon w mieście.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'unanswered',
    service_context: {
      service_name: 'Manicure Hybrydowy',
      employee_name: 'Monika'
    },
    reply: null
  },
  {
    id: '104',
    source: 'google',
    author_name: 'Tomasz K.',
    author_avatar: null,
    rating: 1,
    content: 'Nie polecam. Zniszczyli mi włosy.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: 'unanswered',
    service_context: {
      service_name: 'Rozjaśnianie',
      employee_name: 'Nieznany'
    },
    reply: null
  },
  {
    id: '105',
    source: 'google',
    author_name: 'Ewelina S.',
    author_avatar: 'https://i.pravatar.cc/150?u=105',
    rating: 5,
    content: 'Jestem stałą klientką od lat i nigdy się nie zawiodłam. Atmosfera super.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    status: 'answered',
    service_context: {
      service_name: 'Modelowanie',
      employee_name: 'Kasia'
    },
    reply: {
      content: 'Dziękujemy Pani Ewelino! Do zobaczenia przy następnej wizycie.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString()
    }
  }
];

const MOCK_STATS = {
  average_rating: 4.8,
  total_reviews: 128,
  positive_reviews_percentage: 78, // Percentage of 4-5 star reviews
  sources_breakdown: [
    { label: 'Google', value: 85, color: '#4285F4', icon: 'pi pi-google' },
    { label: 'Booksy', value: 30, color: '#00A3AD', icon: 'pi pi-calendar' },
    { label: 'Facebook', value: 13, color: '#1877F2', icon: 'pi pi-facebook' }
  ],
  response_rate: 82 // percentage
};

// Generate stats based on rating scenario
const generateStatsForScenario = (scenario) => {
  const { minRating, maxRating, id } = scenario;
  
  let averageRating, positivePercentage, responseRate, emoji, ratingColor, knobColor;
  
  if (id === 'positive') {
    // 4-5 stars: High ratings
    averageRating = 4.6 + Math.random() * 0.4; // 4.6-5.0
    positivePercentage = 85 + Math.random() * 10; // 85-95%
    responseRate = 90 + Math.random() * 8; // 90-98%
    emoji = '🎉';
    ratingColor = { from: 'from-blue-600', to: 'to-indigo-600' };
    knobColor = '#6366f1'; // indigo
  } else if (id === 'neutral') {
    // 3-4 stars: Medium ratings - WARNING
    // Realistic: mostly 3.0-3.5 range, some 3.5-3.9
    averageRating = 3.0 + Math.random() * 0.7; // 3.0-3.7
    positivePercentage = 25 + Math.random() * 15; // 25-40% (not majority positive!)
    responseRate = 55 + Math.random() * 15; // 55-70% (lower engagement)
    emoji = '⚠️';
    ratingColor = { from: 'from-yellow-500', to: 'to-orange-500' };
    knobColor = '#f59e0b'; // amber/warning
  } else {
    // <3 stars: Low ratings - CRITICAL
    // Realistic: mostly 1.5-2.5 range
    averageRating = 1.5 + Math.random() * 1.0; // 1.5-2.5
    positivePercentage = 3 + Math.random() * 7; // 3-10% (very few positive)
    responseRate = 25 + Math.random() * 15; // 25-40% (low engagement)
    emoji = '🚨';
    ratingColor = { from: 'from-red-600', to: 'to-red-700' };
    knobColor = '#dc2626'; // red/critical
  }
  
  return {
    average_rating: Math.round(averageRating * 10) / 10,
    total_reviews: 128,
    positive_reviews_percentage: Math.round(positivePercentage),
    sources_breakdown: MOCK_STATS.sources_breakdown,
    response_rate: Math.round(responseRate),
    scenario: {
      emoji,
      ratingColor,
      knobColor,
      id
    }
  };
};

// Mock templates - categorized by rating (1-5 stars)
// Helper function to convert plain @variable to HTML mention format
const convertToMentionFormat = (text, variableKey, description) => {
  const mentionTag = `<link rel="mention" name="${variableKey}" title="${description}">@${variableKey}</link>`;
  return text.replace(new RegExp(`@${variableKey}`, 'g'), mentionTag);
};

// Helper function to convert all variables in text to HTML mention format
const convertAllVariablesToMentions = (text) => {
  const variableMap = {
    'pelne_imie': 'Pełne imię (imię + nazwisko)',
    'imie': 'Imię klienta',
    'nazwisko': 'Nazwisko klienta',
    'email': 'Email klienta',
    'telefon': 'Numer telefonu',
    'ocena': 'Ocena (liczba)',
    'data': 'Data opinii',
    'usluga': 'Nazwa usługi',
    'pracownik': 'Imię pracownika',
    'zamowienie': 'Numer zamówienia'
  };
  
  let result = String(text);
  // Process in reverse order of key length to avoid partial matches
  const sortedKeys = Object.keys(variableMap).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    // Skip if already converted (contains link tag)
    if (result.includes(`<link rel="mention" name="${key}"`)) {
      continue;
    }
    const mentionTag = `<link rel="mention" name="${key}" title="${variableMap[key]}">@${key}</link>`;
    // Match @variable that is not already inside a link tag
    // This regex matches @variable followed by non-word characters (including parentheses, commas, etc.) or end of string
    const regex = new RegExp(`@${key}(?![a-zA-Z_])`, 'g');
    result = result.replace(regex, mentionTag);
  }
  
  return result;
};

const MOCK_TEMPLATES = [
  // 5 stars - Very Positive
  {
    id: 't1',
    name: 'Podziękowanie (Standard)',
    content: convertAllVariablesToMentions('@pelne_imie, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi. Daj nam znać, jeśli będziesz potrzebować czegoś jeszcze. Życzymy wszystkiego najlepszego!'),
    rating: 5,
    active: true,
    auto_reply: false
  },
  {
    id: 't2',
    name: 'Polecenie',
    content: convertAllVariablesToMentions('@pelne_imie, dziękujemy za polecenie nas innym. Jest nam niezmiernie miło słyszeć o Twoim pozytywnym doświadczeniu z naszą firmą. Dla nas to była również czysta przyjemność! Prosimy, daj nam znać jeśli potrzebujesz czegoś jeszcze.'),
    rating: 5,
    active: true,
    auto_reply: false
  },
  {
    id: 't3',
    name: 'Wyjątkowa obsługa',
    content: 'Dziękujemy bardzo za miłe słowa! Cieszymy się, że miałeś tak pozytywne doświadczenia z nami. Zawsze staramy się, aby zapewnić każdemu klientowi wyjątkową obsługę i jakość. Twoja opinia motywuje nasz zespół do dalszej ciężkiej pracy i dostarczania najlepszych produktów każdego dnia.',
    rating: 5,
    active: true,
    auto_reply: false
  },
  {
    id: 't4',
    name: 'Niezapomniane doświadczenie',
    content: 'Dziękujemy bardzo za wspaniałą opinię! Cieszymy się, że nasz zespół mógł sprostać Twoim oczekiwaniom i sprawić, że Twoje doświadczenie będzie niezapomniane. Satysfakcja każdego klienta jest naszym najwyższym priorytetem, a Twoje pozytywne opinie dają nam znać, że idziemy w dobrym kierunku.',
    rating: 5,
    active: true,
    auto_reply: false
  },
  {
    id: 't5',
    name: 'Krótkie dzięki',
    content: convertAllVariablesToMentions('Dzięki @imie! Do zobaczenia!'),
    rating: 5,
    active: true,
    auto_reply: false
  },
  
  // 4 stars - Positive
  {
    id: 't6',
    name: 'Dziękujemy za recenzję',
    content: 'Dziękujemy za recenzję - cieszymy się, że mogliśmy pomóc. Czy jest coś, co moglibyśmy poprawić? Życzymy miłego dnia! Z wyrazami szacunku',
    rating: 4,
    active: true,
    auto_reply: false
  },
  {
    id: 't7',
    name: 'Miłe podziękowanie',
    content: convertAllVariablesToMentions('@pelne_imie, bardzo dziękujemy! Było nam miło, że mogliśmy Ci pomóc. Daj nam znać, jeśli będziesz potrzebował czegoś jeszcze! Miłego dnia!'),
    rating: 4,
    active: true,
    auto_reply: false
  },
  {
    id: 't8',
    name: 'Doceniamy sugestie',
    content: 'Dziękujemy za Twoją opinię! Cieszymy się, że jesteś zadowolony z usługi. Doceniamy Twoje sugestie i zawsze staramy się poprawiać nasze usługi, aby jeszcze lepiej odpowiadać na potrzeby naszych klientów. Twoja opinia pomaga nam się rozwijać i stawać się lepszymi każdego dnia.',
    rating: 4,
    active: true,
    auto_reply: false
  },
  {
    id: 't9',
    name: 'Nadzieja na wyższą ocenę',
    content: 'Dziękujemy za Twoją opinię! Cieszymy się, że doceniłeś/aś naszą usługę. Mamy nadzieję, że kolejne doświadczenie z naszą firmą będziesz mógł ocenić jeszcze wyżej. Pozdrawiamy,',
    rating: 4,
    active: true,
    auto_reply: false
  },
  
  // 3 stars - Neutral
  {
    id: 't10',
    name: 'Wdzięczność za opinię',
    content: convertAllVariablesToMentions('Hej @pelne_imie, jesteśmy naprawdę wdzięczni za udostępnienie swojej opinii. Na pewno przekażemy ją naszym zespołom, aby mogli się z nią zapoznać i wyciągnąć wnioski. Dziękujemy za poświęcony czas!'),
    rating: 3,
    active: true,
    auto_reply: false
  },
  {
    id: 't11',
    name: 'Cel - zadowolenie klienta',
    content: 'Dziękujemy za poświęcenie czasu na ocenę naszych usług. Naszym celem jest sprawienie, aby nasi klienci byli jak najbardziej zadowoleni. Twoja opinia pomaga nam zrozumieć, co możemy poprawić.',
    rating: 3,
    active: true,
    auto_reply: false
  },
  {
    id: 't12',
    name: 'Zależy nam na zadowoleniu',
    content: 'Dziękujemy za Twoją opinię! Zależy nam, aby sprostać oczekiwaniom każdego klienta. Jeśli masz jakieś sugestie, jak moglibyśmy poprawić nasze usługi, prosimy o kontakt. Chętnie wysłuchamy Twoich pomysłów.',
    rating: 3,
    active: true,
    auto_reply: false
  },
  {
    id: 't13',
    name: 'Wyjaśnienie sytuacji',
    content: convertAllVariablesToMentions('Dziękujemy za opinię, @pelne_imie. Przykro nam, że nie wszystko było idealne. Postaramy się poprawić przy kolejnej wizycie. Jeśli chcesz, możemy omówić szczegóły bezpośrednio - prosimy o kontakt.'),
    rating: 3,
    active: true,
    auto_reply: false
  },
  
  // 2 stars - Negative
  {
    id: 't14',
    name: 'Przepraszamy za doświadczenie',
    content: convertAllVariablesToMentions('Przepraszamy za to doświadczenie, @pelne_imie. Rozumiemy Twoje rozczarowanie i bardzo nam przykro. Chcielibyśmy wyjaśnić sytuację i zrekompensować niedogodności. Prosimy o kontakt telefoniczny (@telefon) lub email (@email), abyśmy mogli to omówić.'),
    rating: 2,
    active: true,
    auto_reply: false
  },
  {
    id: 't15',
    name: 'Chcemy naprawić sytuację',
    content: convertAllVariablesToMentions('Bardzo nam przykro z powodu Twojego doświadczenia, @pelne_imie. Nie spełniliśmy Twoich oczekiwań i za to szczerze przepraszamy. Chcielibyśmy mieć szansę naprawić tę sytuację. Prosimy o kontakt - zrobimy wszystko, co w naszej mocy, aby to naprawić.'),
    rating: 2,
    active: true,
    auto_reply: false
  },
  
  // 1 star - Very Negative
  {
    id: 't16',
    name: 'Pilna prośba o kontakt',
    content: convertAllVariablesToMentions('Panie/Pani @pelne_imie, bardzo nam przykro z powodu zaistniałej sytuacji. Rozumiemy Twoje rozczarowanie i traktujemy to bardzo poważnie. Prosimy o pilny kontakt telefoniczny (@telefon), abyśmy mogli wyjaśnić sytuację i znaleźć rozwiązanie. Zależy nam na Twoim zadowoleniu.'),
    rating: 1,
    active: true,
    auto_reply: false
  },
  {
    id: 't17',
    name: 'Wyjaśnienie i rekompensata',
    content: convertAllVariablesToMentions('Przepraszamy za to doświadczenie, @pelne_imie. Prosimy o kontakt bezpośredni, abyśmy mogli wyjaśnić sytuację i zrekompensować niedogodności. Twoja opinia jest dla nas bardzo ważna i chcemy naprawić tę sytuację.'),
    rating: 1,
    active: true,
    auto_reply: false
  },
  {
    id: 't18',
    name: 'Osobiste wyjaśnienie',
    content: convertAllVariablesToMentions('Bardzo przepraszamy za zaistniałą sytuację, @pelne_imie. Chcielibyśmy porozmawiać z Tobą osobiście, aby zrozumieć, co poszło nie tak i jak możemy to naprawić. Prosimy o kontakt pod numerem @telefon lub emailem @email. Dziękujemy za cierpliwość.'),
    rating: 1,
    active: true,
    auto_reply: false
  }
];

// Mock acquisition settings
let MOCK_ACQUISITION_SETTINGS = {
  headline: 'Daj znać jak nam poszło',
  min_rating_for_google: 4,
  google_place_id: 'ChIJ...',
  theme_color: '3B82F6',
  logo_url: null,
  style: 'poster',

  // Reverse-engineered from user feedback
  business_name: 'Kolabo group sp z o.o.',
  business_name_visible: true,
  business_name_top: 11,
  business_name_left: 50,
  business_name_size: 1,

  poster_headline: 'Oceń nas!',
  poster_headline_visible: true,
  poster_headline_top: 21,
  poster_headline_left: 50,
  poster_headline_size: 1,

  qr_color: '4179E0',
  qr_dots_style: 'rounded',
  qr_top: 49,
  qr_left: 50,
  qr_size: 1,
  qr_visible: true,
  qr_border_width: 3,
  qr_border_color: '111827',

  badge_text: 'SKANUJ',
  badge_color: 'EF4444',
  badge_visible: true,
  badge_top: 4,
  badge_left: 27,
  badge_size: 1.3,

  stars_visible: true,
  stars_top: 82,
  stars_left: 50,
  stars_size: 1,

  google_logo_visible: true,
  google_logo_top: 93,
  google_logo_left: 50,
  google_logo_size: 0.8,
  footer_text: 'Oceń nas w',

  form_fields: [
    { key: 'name', label: 'Imię', visible: true, required: false },
    { key: 'surname', label: 'Nazwisko', visible: true, required: false },
    { key: 'phone', label: 'Telefon', visible: true, required: false },
    { key: 'email', label: 'Email', visible: true, required: true },
    { key: 'order_no', label: 'Numer zamówienia', visible: false, required: false },
    { key: 'service_name', label: 'Nazwa usługi', visible: false, required: false },
    { key: 'employee_name', label: 'Pracownik', visible: false, required: false }
  ],

  qr_border_width: 4,
  qr_border_color: '111827' // gray-900
};

// Mock internal feedbacks (intercepted bad reviews)
const MOCK_INTERNAL_FEEDBACKS = [
  {
    id: 'f1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    rating: 2,
    comment: 'Muzyka była zdecydowanie za głośno.',
    status: 'new',
    name: 'Jan',
    surname: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '500 600 700',
    order_no: 'ORD-12345',
    service_name: 'Strzyżenie',
    employee_name: 'Bartek'
  },
  {
    id: 'f2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    rating: 3,
    comment: 'Długo czekałem na recepcji.',
    status: 'read',
    name: 'Piotr',
    surname: 'Nowak',
    email: 'piotr.nowak@example.com',
    phone: '600 700 800',
    order_no: '',
    service_name: '',
    employee_name: ''
  },
  {
    id: 'f3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    rating: 1,
    comment: 'Usługa wykonana niestarannie.',
    status: 'replied',
    name: 'Anna',
    surname: 'Zielińska',
    email: 'anna.zielinska@example.com',
    phone: '',
    order_no: 'ORD-98765',
    service_name: 'Koloryzacja',
    employee_name: 'Kasia'
  }
];

// Simulation delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const ReviewsService = {
  async getStats(scenario = null) {
    await delay(600); // Simulate network latency
    if (!scenario) {
      return MOCK_STATS;
    }
    return generateStatsForScenario(scenario);
  },
  
  async getStatsForScenario(scenario) {
    await delay(600);
    return generateStatsForScenario(scenario);
  },

  async getReviews(filters = {}) {
    await delay(800);
    let reviews = [...MOCK_REVIEWS];

    // Mock filtering logic
    if (filters.status && filters.status !== 'all') {
      reviews = reviews.filter(r => r.status === filters.status);
    }

    if (filters.source && filters.source !== 'all') {
      reviews = reviews.filter(r => r.source === filters.source);
    }

    if (filters.sort) {
      if (filters.sort === 'newest') {
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (filters.sort === 'lowest') {
        reviews.sort((a, b) => a.rating - b.rating);
      }
    }

    return reviews;
  },

  async postReply(reviewId, content) {
    await delay(1000);
    const review = MOCK_REVIEWS.find(r => r.id === reviewId);
    if (review) {
      review.status = 'answered';
      review.reply = {
        content: content,
        date: new Date().toISOString()
      };
      return review;
    }
    throw new Error('Review not found');
  },

  async generateAiReply(reviewContext) {
    await delay(1500); // AI takes a bit longer
    const { rating, author_name } = reviewContext;

    if (rating >= 4) {
      return `Dziękujemy bardzo, ${author_name}! Cieszymy się, że wizyta się udała. Zapraszamy ponownie!`;
    } else if (rating === 3) {
      return `Dziękujemy za opinię, ${author_name}. Przykro nam, że nie wszystko było idealne. Postaramy się poprawić przy kolejnej wizycie.`;
    } else {
      return `Przepraszamy za to doświadczenie, ${author_name}. Prosimy o kontakt bezpośredni, abyśmy mogli wyjaśnić sytuację i zrekompensować niedogodności.`;
    }
  },

  // Template variable replacement helper
  replaceTemplateVariables(templateContent, feedbackData) {
    if (!templateContent || !feedbackData) return templateContent;
    
    let content = templateContent;
    
    // Map feedback data to variables
    const variables = {
      'imie': feedbackData.name || '',
      'nazwisko': feedbackData.surname || '',
      'pelne_imie': `${feedbackData.name || ''} ${feedbackData.surname || ''}`.trim() || 'Kliencie',
      'email': feedbackData.email || '',
      'telefon': feedbackData.phone || '',
      'ocena': feedbackData.rating?.toString() || '',
      'data': feedbackData.date ? new Date(feedbackData.date).toLocaleDateString('pl-PL') : '',
      'usluga': feedbackData.service_name || '',
      'pracownik': feedbackData.employee_name || '',
      'zamowienie': feedbackData.order_no || ''
    };
    
    // Handle HTML mentions (<link rel="mention" name="variable">@variable</link>)
    // Replace mentions in HTML format
    const mentionRegex = /<link\s+rel="mention"\s+name="(\w+)"[^>]*>@\1<\/link>/gi;
    content = content.replace(mentionRegex, (match, varName) => {
      const value = variables[varName.toLowerCase()] || '';
      return value;
    });
    
    // Also handle plain @variable format for backward compatibility
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`@${key}`, 'gi');
      content = content.replace(regex, variables[key] || '');
    });
    
    return content;
  },

  // Check if template can be used with given feedback (all required variables are available)
  canUseTemplate(template, feedbackData) {
    if (!template || !template.content || !feedbackData) return false;
    
    // Extract all variables from template content (both HTML mentions and plain @variable)
    const htmlMentionMatches = template.content.match(/<link\s+rel="mention"\s+name="(\w+)"[^>]*>/gi) || [];
    const plainMatches = template.content.match(/@(\w+)/gi) || [];
    
    // Extract variable names from HTML mentions
    const htmlVariables = htmlMentionMatches.map(match => {
      const nameMatch = match.match(/name="(\w+)"/i);
      return nameMatch ? nameMatch[1].toLowerCase() : null;
    }).filter(Boolean);
    
    // Extract variable names from plain @variable format
    const plainVariables = plainMatches.map(match => match.substring(1).toLowerCase());
    
    // Combine and deduplicate
    const requiredVariables = [...new Set([...htmlVariables, ...plainVariables])];
    
    if (requiredVariables.length === 0) return true; // No variables, template can always be used
    
    // Check if all required variables are available in feedback data
    const variableMap = {
      'imie': feedbackData.name,
      'nazwisko': feedbackData.surname,
      'pelne_imie': feedbackData.name || feedbackData.surname,
      'email': feedbackData.email,
      'telefon': feedbackData.phone,
      'ocena': feedbackData.rating !== undefined,
      'data': feedbackData.date,
      'usluga': feedbackData.service_name,
      'pracownik': feedbackData.employee_name,
      'zamowienie': feedbackData.order_no
    };
    
    // Check if all required variables have values
    return requiredVariables.every(varName => {
      const value = variableMap[varName.toLowerCase()];
      return value !== undefined && value !== null && value !== '';
    });
  },

  // Templates API
  async getTemplates() {
    await delay(500);
    // Ensure all templates have variables converted to HTML mentions format and default values for active and auto_reply
    return MOCK_TEMPLATES.map(template => {
      let result = { ...template };
      if (result.content && typeof result.content === 'string') {
        // Check if content contains plain @variable (not already converted)
        const hasPlainVariable = /@(pelne_imie|imie|nazwisko|email|telefon|ocena|data|usluga|pracownik|zamowienie)(?![a-zA-Z_])/.test(result.content);
        if (hasPlainVariable && !result.content.includes('<link rel="mention"')) {
          // Convert plain variables to HTML mentions
          result = { ...result, content: convertAllVariablesToMentions(result.content) };
        }
      }
      // Ensure default values for active and auto_reply
      if (result.active === undefined) result.active = true;
      if (result.auto_reply === undefined) result.auto_reply = false;
      return result;
    });
  },

  async saveTemplate(template) {
    await delay(700);
    if (template.id) {
      const index = MOCK_TEMPLATES.findIndex(t => t.id === template.id);
      if (index !== -1) {
        // Convert old category to rating if needed
        if (template.category && !template.rating) {
          template.rating = template.category === 'positive' ? 5 : 2;
          delete template.category;
        }
        // Always use the provided rating, or preserve existing if not provided
        if (template.rating === undefined || template.rating === null) {
          template.rating = MOCK_TEMPLATES[index].rating || 5;
        }
        // Create a new object to ensure reactivity
        MOCK_TEMPLATES[index] = { ...template };
      }
    } else {
      template.id = 't' + (MOCK_TEMPLATES.length + 1);
      // Ensure rating is set
      if (!template.rating) {
        template.rating = template.category === 'positive' ? 5 : template.category === 'negative' ? 2 : 5;
        delete template.category;
      }
      MOCK_TEMPLATES.push(template);
    }
    return template;
  },

  async deleteTemplate(id) {
    await delay(500);
    const index = MOCK_TEMPLATES.findIndex(t => t.id === id);
    if (index !== -1) {
      MOCK_TEMPLATES.splice(index, 1);
    }
  },

  // Acquisition API
  async getAcquisitionSettings() {
    await delay(600);
    return { ...MOCK_ACQUISITION_SETTINGS };
  },

  async saveAcquisitionSettings(settings) {
    await delay(800);
    MOCK_ACQUISITION_SETTINGS = { ...settings };
    return MOCK_ACQUISITION_SETTINGS;
  },

  async getInternalFeedbacks() {
    await delay(700);
    return [...MOCK_INTERNAL_FEEDBACKS];
  },

  async saveInternalFeedback(feedback) {
    await delay(800);
    const newFeedback = {
        id: 'f' + Date.now(),
        date: new Date().toISOString(),
        rating: feedback.rating,
        comment: feedback.message,
        status: 'new',
        name: feedback.name || 'Anonim',
        surname: feedback.surname || '',
        email: feedback.email || '',
        phone: feedback.phone || '',
        order_no: feedback.order_no || '',
        service_name: feedback.service_name || '',
        employee_name: feedback.employee_name || ''
    };
    MOCK_INTERNAL_FEEDBACKS.unshift(newFeedback);
    return newFeedback;
  },

  async updateInternalFeedbackStatus(id, status) {
    await delay(500);
    const index = MOCK_INTERNAL_FEEDBACKS.findIndex(f => f.id === id);
    if (index !== -1) {
        MOCK_INTERNAL_FEEDBACKS[index].status = status;
        return MOCK_INTERNAL_FEEDBACKS[index];
    }
    throw new Error('Feedback not found');
  },

  async deleteInternalFeedback(id) {
    await delay(600);
    const index = MOCK_INTERNAL_FEEDBACKS.findIndex(f => f.id === id);
    if (index !== -1) {
        MOCK_INTERNAL_FEEDBACKS.splice(index, 1);
        return true;
    }
    throw new Error('Feedback not found');
  },

  async replyToInternalFeedback(id, message) {
    await delay(800);
    const index = MOCK_INTERNAL_FEEDBACKS.findIndex(f => f.id === id);
    if (index !== -1) {
        MOCK_INTERNAL_FEEDBACKS[index].status = 'replied';
        MOCK_INTERNAL_FEEDBACKS[index].reply = {
            content: message,
            date: new Date().toISOString(),
            author: 'Ty' // In real app: current user name
        };
        return MOCK_INTERNAL_FEEDBACKS[index];
    }
    throw new Error('Feedback not found');
  },

  // AI Analysis functions
  async analyzeSentiment(reviews, scenario = null) {
    await delay(1200); // Simulate AI processing time
    
    // Generate realistic sentiment trends over last 30 days
    const today = new Date();
    const days = [];
    const positiveTrends = [];
    const neutralTrends = [];
    const negativeTrends = [];
    
    // Base values - adjust based on scenario
    let basePositive, baseNeutral, baseNegative;
    
    if (scenario?.id === 'positive') {
      // 4-5 stars: Mostly positive
      basePositive = 85;
      baseNeutral = 10;
      baseNegative = 5;
    } else if (scenario?.id === 'neutral') {
      // 3-4 stars: Warning - NOT positive, mostly neutral/negative
      basePositive = 15;
      baseNeutral = 50;
      baseNegative = 35;
    } else if (scenario?.id === 'negative') {
      // <3 stars: Critical - Mostly negative
      basePositive = 5;
      baseNeutral = 20;
      baseNegative = 75;
    } else {
      basePositive = 75;
      baseNeutral = 15;
      baseNegative = 10;
    }
    
    // Generate last 30 days with realistic variations
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
      days.push(dateStr);
      
      // Add realistic variations (±5%)
      const positiveVariation = (Math.random() - 0.5) * 10;
      const neutralVariation = (Math.random() - 0.5) * 6;
      const negativeVariation = (Math.random() - 0.5) * 6;
      
      // Ensure they sum to ~100% - adjust ranges based on scenario
      let positiveMin, positiveMax, neutralMin, neutralMax, negativeMin, negativeMax;
      
      if (scenario?.id === 'positive') {
        positiveMin = 75; positiveMax = 95;
        neutralMin = 5; neutralMax = 15;
        negativeMin = 2; negativeMax = 10;
      } else if (scenario?.id === 'neutral') {
        positiveMin = 10; positiveMax = 25;
        neutralMin = 40; neutralMax = 60;
        negativeMin = 25; negativeMax = 45;
      } else if (scenario?.id === 'negative') {
        positiveMin = 2; positiveMax = 10;
        neutralMin = 15; neutralMax = 30;
        negativeMin = 65; negativeMax = 85;
      } else {
        positiveMin = 60; positiveMax = 85;
        neutralMin = 8; neutralMax = 20;
        negativeMin = 5; negativeMax = 15;
      }
      
      let positive = Math.max(positiveMin, Math.min(positiveMax, basePositive + positiveVariation));
      let neutral = Math.max(neutralMin, Math.min(neutralMax, baseNeutral + neutralVariation));
      let negative = Math.max(negativeMin, Math.min(negativeMax, baseNegative + negativeVariation));
      
      // Normalize to sum to 100
      const total = positive + neutral + negative;
      positive = Math.round((positive / total) * 100);
      neutral = Math.round((neutral / total) * 100);
      negative = 100 - positive - neutral;
      
      positiveTrends.push(positive);
      neutralTrends.push(neutral);
      negativeTrends.push(negative);
    }
    
    // Calculate overall from latest day
    const latestPositive = positiveTrends[positiveTrends.length - 1];
    const latestNegative = negativeTrends[negativeTrends.length - 1];
    const latestNeutral = neutralTrends[neutralTrends.length - 1];
    
    // Determine overall sentiment based on scenario
    // For neutral scenario (3.2 rating), sentiment should always be neutral
    let overall;
    if (scenario?.id === 'positive') {
      overall = 'positive';
    } else if (scenario?.id === 'neutral') {
      // For neutral scenario (3.2 rating), sentiment should always be neutral
      overall = 'neutral';
    } else if (scenario?.id === 'negative') {
      overall = 'negative';
    } else {
      overall = latestPositive > latestNegative ? 'positive' : 
                latestNegative > latestPositive ? 'negative' : 'neutral';
    }
    
    return {
      overall,
      distribution: {
        positive: latestPositive,
        neutral: neutralTrends[neutralTrends.length - 1],
        negative: latestNegative
      },
      trends: {
        labels: days,
        positive: positiveTrends,
        neutral: neutralTrends,
        negative: negativeTrends
      },
      details: []
    };
  },

  async analyzeProductsAndServices(reviews) {
    await delay(1500);
    
    // Realistic mock data for services and products
    // Based on typical salon/fitness business services
    const realisticServices = [
      { name: 'Strzyżenie Męskie', basePercentage: 28 },
      { name: 'Koloryzacja Sombre', basePercentage: 24 },
      { name: 'Manicure Hybrydowy', basePercentage: 18 },
      { name: 'Modelowanie', basePercentage: 15 },
      { name: 'Rozjaśnianie', basePercentage: 10 },
      { name: 'Pedicure', basePercentage: 5 }
    ];
    
    const realisticProducts = [
      { name: 'Produkty koloryzujące', basePercentage: 35 },
      { name: 'Produkty do pielęgnacji', basePercentage: 28 },
      { name: 'Szampony profesjonalne', basePercentage: 20 },
      { name: 'Odżywki i maski', basePercentage: 12 },
      { name: 'Styling i utrwalanie', basePercentage: 5 }
    ];
    
    // Add realistic variations (±5%)
    const topServices = realisticServices.map(service => {
      const variation = (Math.random() - 0.5) * 10;
      const percentage = Math.max(3, Math.min(35, service.basePercentage + variation));
      return {
        name: service.name,
        count: Math.round((percentage / 100) * 128), // Assuming ~128 total reviews
        percentage: Math.round(percentage)
      };
    }).sort((a, b) => b.percentage - a.percentage);
    
    const topProducts = realisticProducts.map(product => {
      const variation = (Math.random() - 0.5) * 10;
      const percentage = Math.max(3, Math.min(40, product.basePercentage + variation));
      return {
        name: product.name,
        count: Math.round((percentage / 100) * 85), // Assuming ~85 product mentions
        percentage: Math.round(percentage)
      };
    }).sort((a, b) => b.percentage - a.percentage);
    
    return {
      services: topServices,
      products: topProducts,
      totalAnalyzed: reviews.length
    };
  },

  async analyzeRepeatingElements(reviews) {
    await delay(1800);
    
    // Realistic mock data for repeating themes
    const realisticThemes = [
      { theme: 'Obsługa klienta', basePercentage: 32, sentiment: 'positive' },
      { theme: 'Jakość usługi', basePercentage: 28, sentiment: 'positive' },
      { theme: 'Atmosfera', basePercentage: 22, sentiment: 'positive' },
      { theme: 'Pracownicy', basePercentage: 18, sentiment: 'positive' },
      { theme: 'Czas oczekiwania', basePercentage: 12, sentiment: 'neutral' },
      { theme: 'Cena', basePercentage: 8, sentiment: 'neutral' },
      { theme: 'Lokalizacja', basePercentage: 5, sentiment: 'positive' }
    ];
    
    // Generate realistic theme data with variations
    const totalMentions = 128; // Total theme mentions across all reviews
    const topThemes = realisticThemes.map(theme => {
      const variation = (Math.random() - 0.5) * 8;
      const percentage = Math.max(3, Math.min(35, theme.basePercentage + variation));
      const count = Math.round((percentage / 100) * totalMentions);
      
      return {
        theme: theme.theme,
        count: count,
        percentage: Math.round(percentage),
        sentiment: theme.sentiment
      };
    }).sort((a, b) => b.percentage - a.percentage);
    
    // Realistic keywords
    const realisticKeywords = [
      { word: 'profesjonalna', count: 45 },
      { word: 'polecam', count: 38 },
      { word: 'świetna', count: 32 },
      { word: 'miła', count: 28 },
      { word: 'atmosfera', count: 25 },
      { word: 'jakość', count: 22 },
      { word: 'obsługa', count: 20 },
      { word: 'szybka', count: 18 },
      { word: 'czysto', count: 15 },
      { word: 'komfortowa', count: 12 }
    ];
    
    const topKeywords = realisticKeywords.map(kw => ({
      word: kw.word,
      count: kw.count + Math.round((Math.random() - 0.5) * 5)
    })).sort((a, b) => b.count - a.count);
    
    return {
      themes: topThemes,
      keywords: topKeywords,
      insights: [
        {
          type: 'trend',
          title: 'Najczęściej wspominane tematy',
          elements: topThemes.slice(0, 3).map(t => t.theme)
        },
        {
          type: 'recommendation',
          title: 'Obszary do poprawy',
          description: topThemes.find(t => t.theme === 'Czas oczekiwania')?.percentage > 10 
            ? 'Czas oczekiwania jest często wspominany w opiniach - warto rozważyć optymalizację procesów' 
            : 'Wszystkie obszary są pozytywnie oceniane',
          elements: topThemes.find(t => t.theme === 'Czas oczekiwania')?.percentage > 10 
            ? ['Czas oczekiwania'] 
            : []
        }
      ]
    };
  },

  async analyzeTimeTrends(reviews, scenario = null) {
    await delay(1000);
    
    // Generate realistic mock data for last 30 days
    const today = new Date();
    const days = [];
    const reviewCounts = [];
    const averageRatings = [];
    const replyCounts = [];
    
    // Base values with realistic trends - adjust based on scenario
    let baseReviewCount, baseRating, replyRate;
    
    if (scenario?.id === 'positive') {
      baseReviewCount = 8; // Average reviews per day
      baseRating = 4.6; // High average rating
      replyRate = 0.85; // High response rate
    } else if (scenario?.id === 'neutral') {
      baseReviewCount = 6; // Fewer reviews
      baseRating = 3.2; // Medium average rating (around 3.2)
      replyRate = 0.60; // Lower response rate
    } else if (scenario?.id === 'negative') {
      baseReviewCount = 4; // Even fewer reviews
      baseRating = 2.0; // Low average rating
      replyRate = 0.35; // Low response rate
    } else {
      baseReviewCount = 8;
      baseRating = 4.6;
      replyRate = 0.75;
    }
    
    // Generate last 30 days with realistic patterns
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
      days.push(dateStr);
      
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const daysAgo = 29 - i;
      
      // Weekend boost (more reviews on weekends)
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1.0;
      
      // Trend: slight growth over time (more recent = more reviews)
      const trendMultiplier = 1 + (daysAgo * 0.01); // 1% growth per day
      
      // Random variation (±30%)
      const randomVariation = 0.7 + Math.random() * 0.6;
      
      // Calculate review count with realistic patterns
      let reviewCount = Math.round(baseReviewCount * weekendMultiplier * trendMultiplier * randomVariation);
      reviewCount = Math.max(2, Math.min(20, reviewCount)); // Clamp between 2-20
      
      reviewCounts.push(reviewCount);
      
      // Average rating with realistic variations based on scenario
      let ratingVariation, finalRating;
      
      if (scenario?.id === 'positive') {
        // Ratings between 4.2-5.0 with occasional dips
        ratingVariation = (Math.random() - 0.5) * 0.4; // ±0.2 variation
        const dayRating = baseRating + ratingVariation;
        const badDayChance = Math.random();
        finalRating = badDayChance < 0.1 ? 
          Math.max(3.8, dayRating - 0.5) : // Bad day: lower rating
          Math.min(5.0, Math.max(4.0, dayRating)); // Normal day
      } else if (scenario?.id === 'neutral') {
        // Ratings between 2.9-3.6 (around 3.2) - more realistic for neutral
        ratingVariation = (Math.random() - 0.5) * 0.5; // ±0.25 variation
        const dayRating = baseRating + ratingVariation;
        // Ensure ratings stay in neutral range, mostly around 3.0-3.4
        finalRating = Math.min(3.6, Math.max(2.9, dayRating));
      } else if (scenario?.id === 'negative') {
        // Ratings between 1.5-2.5
        ratingVariation = (Math.random() - 0.5) * 0.6; // ±0.3 variation
        const dayRating = baseRating + ratingVariation;
        finalRating = Math.min(2.8, Math.max(1.2, dayRating));
      } else {
        ratingVariation = (Math.random() - 0.5) * 0.4;
        const dayRating = baseRating + ratingVariation;
        const badDayChance = Math.random();
        finalRating = badDayChance < 0.1 ? 
          Math.max(3.8, dayRating - 0.5) :
          Math.min(5.0, Math.max(4.0, dayRating));
      }
      
      averageRatings.push(Number(finalRating.toFixed(2)));
      
      // Reply count: realistic response rate with some variation
      const replyRateVariation = replyRate + (Math.random() - 0.5) * 0.2; // ±10% variation
      const replies = Math.round(reviewCount * Math.max(0.5, Math.min(0.95, replyRateVariation)));
      replyCounts.push(Math.max(0, replies));
    }
    
    return {
      labels: days,
      reviewCounts,
      averageRatings,
      replyCounts
    };
  }
};
