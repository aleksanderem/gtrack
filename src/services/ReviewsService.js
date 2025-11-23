
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
  nps_score: 72,
  sources_breakdown: [
    { label: 'Google', value: 85, color: '#4285F4', icon: 'pi pi-google' },
    { label: 'Booksy', value: 30, color: '#00A3AD', icon: 'pi pi-calendar' },
    { label: 'Facebook', value: 13, color: '#1877F2', icon: 'pi pi-facebook' }
  ],
  response_rate: 82 // percentage
};

// Mock templates
const MOCK_TEMPLATES = [
  {
    id: 't1',
    name: 'Podziękowanie (Standard)',
    content: 'Dziękujemy ślicznie za opinię, {{imie}}! Cieszymy się, że wizyta się podobała. Zapraszamy ponownie!',
    category: 'positive'
  },
  {
    id: 't2',
    name: 'Wyjaśnienie sytuacji',
    content: 'Panie/Pani {{imie}}, bardzo nam przykro z powodu zaistniałej sytuacji. Prosimy o kontakt telefoniczny, chcielibyśmy to wyjaśnić.',
    category: 'negative'
  },
  {
    id: 't3',
    name: 'Krótkie dzięki',
    content: 'Dzięki {{imie}}! Do zobaczenia!',
    category: 'positive'
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
    customer_name: 'Anonim',
    rating: 2,
    comment: 'Muzyka była zdecydowanie za głośno.',
    status: 'new'
  },
  {
    id: 'f2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    customer_name: 'Piotr K.',
    rating: 3,
    comment: 'Długo czekałem na recepcji.',
    status: 'read'
  }
];

// Simulation delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const ReviewsService = {
  async getStats() {
    await delay(600); // Simulate network latency
    return MOCK_STATS;
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

  // Templates API
  async getTemplates() {
    await delay(500);
    return [...MOCK_TEMPLATES];
  },

  async saveTemplate(template) {
    await delay(700);
    if (template.id) {
      const index = MOCK_TEMPLATES.findIndex(t => t.id === template.id);
      if (index !== -1) MOCK_TEMPLATES[index] = template;
    } else {
      template.id = 't' + (MOCK_TEMPLATES.length + 1);
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
        customer_name: feedback.name || 'Anonim',
        rating: feedback.rating,
        comment: feedback.message,
        status: 'new',
        details: feedback
    };
    MOCK_INTERNAL_FEEDBACKS.unshift(newFeedback);
    return newFeedback;
  }
};
