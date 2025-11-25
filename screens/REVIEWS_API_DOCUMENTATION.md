# Dokumentacja API - System Opinii Klientów

## Spis treści
1. [Przegląd](#przegląd)
2. [Autentykacja](#autentykacja)
3. [Endpointy - Opinie](#endpointy-opinie)
4. [Endpointy - Szablony Odpowiedzi](#endpointy-szablony-odpowiedzi)
5. [Endpointy - Przechwycone Opinie](#endpointy-przechwycone-opinie)
6. [Endpointy - Statystyki i Analiza](#endpointy-statystyki-i-analiza)
7. [Endpointy - Auto-Odpowiedzi](#endpointy-auto-odpowiedzi)
8. [Endpointy - Pozyskiwanie Opinii](#endpointy-pozyskiwanie-opinii)
9. [Struktury danych](#struktury-danych)
10. [Obsługa błędów](#obsługa-błędów)

---

## Przegląd

System Opinii Klientów umożliwia zarządzanie opiniami z różnych źródeł (Google, Booksy, Facebook), odpowiadanie na nie, tworzenie szablonów odpowiedzi oraz automatyczne odpowiadanie na opinie zgodnie z regułami.

**Base URL:** `https://api.example.com/api/v1`

**Format danych:** JSON

**Kodowanie:** UTF-8

---

## Autentykacja

Wszystkie endpointy wymagają autentykacji za pomocą tokena Bearer w nagłówku:

```
Authorization: Bearer {token}
```

---

## Endpointy - Opinie

### GET /reviews

Pobiera listę opinii z możliwością filtrowania i sortowania.

**Query Parameters:**
- `status` (string, optional): `'all'` | `'answered'` | `'unanswered'` - filtr statusu
- `source` (string, optional): `'all'` | `'google'` | `'booksy'` | `'facebook'` - filtr źródła
- `sort` (string, optional): `'newest'` | `'lowest'` - sortowanie

**Response 200:**
```json
[
  {
    "id": "101",
    "source": "google",
    "author_name": "Anna Nowak",
    "author_avatar": "https://i.pravatar.cc/150?u=101",
    "rating": 5,
    "content": "Fantastyczna obsługa! Pani Kasia to prawdziwa profesjonalistka. Na pewno wrócę.",
    "date": "2025-11-24T19:46:00.000Z",
    "status": "unanswered",
    "service_context": {
      "service_name": "Koloryzacja Sombre",
      "employee_name": "Kasia"
    },
    "reply": null,
    "email": "anna.nowak@example.com",
    "phone": "500600700",
    "order_no": "ORD-12345"
  }
]
```

**Struktura Review:**
- `id` (string, required): Unikalny identyfikator opinii
- `source` (string, required): Źródło opinii: `'google'` | `'booksy'` | `'facebook'`
- `author_name` (string, required): Imię i nazwisko autora
- `author_avatar` (string, nullable): URL do awatara autora
- `rating` (number, required): Ocena 1-5
- `content` (string, required): Treść opinii
- `date` (string, required): Data opinii w formacie ISO 8601
- `status` (string, required): `'answered'` | `'unanswered'`
- `service_context` (object, optional): Kontekst usługi
  - `service_name` (string, optional): Nazwa usługi
  - `employee_name` (string, optional): Imię pracownika
- `reply` (object, nullable): Odpowiedź na opinię
  - `content` (string, required): Treść odpowiedzi
  - `date` (string, required): Data odpowiedzi w formacie ISO 8601
- `email` (string, optional): Email klienta
- `phone` (string, optional): Numer telefonu klienta
- `order_no` (string, optional): Numer zamówienia

---

### POST /reviews/{reviewId}/reply

Wysyła odpowiedź na opinię.

**Path Parameters:**
- `reviewId` (string, required): ID opinii

**Request Body:**
```json
{
  "content": "Dziękujemy za opinię! Cieszymy się, że wizyta się udała."
}
```

**Response 200:**
```json
{
  "id": "101",
  "source": "google",
  "author_name": "Anna Nowak",
  "rating": 5,
  "content": "Fantastyczna obsługa!",
  "date": "2025-11-24T19:46:00.000Z",
  "status": "answered",
  "reply": {
    "content": "Dziękujemy za opinię! Cieszymy się, że wizyta się udała.",
    "date": "2025-11-24T20:00:00.000Z"
  }
}
```

---

### GET /reviews/unread-count

Pobiera liczbę nieprzeczytanych opinii.

**Response 200:**
```json
{
  "count": 3
}
```

---

## Endpointy - Szablony Odpowiedzi

### GET /templates

Pobiera listę wszystkich szablonów odpowiedzi.

**Response 200:**
```json
[
  {
    "id": "t1",
    "name": "Podziękowanie (Standard)",
    "content": "<link rel=\"mention\" name=\"pelne_imie\" title=\"Pełne imię (imię + nazwisko)\">@pelne_imie</link>, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi.",
    "rating": 5,
    "active": true,
    "auto_reply": false,
    "created_at": "2025-11-20T10:00:00.000Z",
    "updated_at": "2025-11-20T10:00:00.000Z"
  }
]
```

**Struktura Template:**
- `id` (string, required): Unikalny identyfikator szablonu
- `name` (string, required): Nazwa szablonu
- `content` (string, required): Treść szablonu z zmiennymi w formacie HTML mentions
- `rating` (number, required): Ocena dla której szablon jest przeznaczony (1-5)
- `active` (boolean, required): Czy szablon jest aktywny
- `auto_reply` (boolean, required): Czy szablon jest dostępny w auto-odpowiedziach
- `created_at` (string, optional): Data utworzenia w formacie ISO 8601
- `updated_at` (string, optional): Data aktualizacji w formacie ISO 8601

**Format zmiennych w treści:**
Zmienne są przechowywane w formacie HTML mentions:
```html
<link rel="mention" name="pelne_imie" title="Pełne imię (imię + nazwisko)">@pelne_imie</link>
```

**Dostępne zmienne:**
- `@imie` - Imię klienta
- `@nazwisko` - Nazwisko klienta
- `@pelne_imie` - Pełne imię (imię + nazwisko)
- `@email` - Email klienta
- `@telefon` - Numer telefonu
- `@ocena` - Ocena (liczba)
- `@data` - Data opinii
- `@usluga` - Nazwa usługi
- `@pracownik` - Imię pracownika
- `@zamowienie` - Numer zamówienia

---

### POST /templates

Tworzy nowy szablon odpowiedzi.

**Request Body:**
```json
{
  "name": "Podziękowanie (Standard)",
  "content": "@pelne_imie, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi.",
  "rating": 5,
  "active": true,
  "auto_reply": false
}
```

**Response 201:**
```json
{
  "id": "t19",
  "name": "Podziękowanie (Standard)",
  "content": "<link rel=\"mention\" name=\"pelne_imie\" title=\"Pełne imię (imię + nazwisko)\">@pelne_imie</link>, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi.",
  "rating": 5,
  "active": true,
  "auto_reply": false,
  "created_at": "2025-11-24T20:00:00.000Z",
  "updated_at": "2025-11-24T20:00:00.000Z"
}
```

**Uwaga:** Backend powinien automatycznie konwertować zwykłe zmienne (`@pelne_imie`) na format HTML mentions.

---

### PUT /templates/{templateId}

Aktualizuje istniejący szablon.

**Path Parameters:**
- `templateId` (string, required): ID szablonu

**Request Body:**
```json
{
  "name": "Podziękowanie (Standard) - Zaktualizowane",
  "content": "@pelne_imie, bardzo dziękujemy!",
  "rating": ą się, że spodobały Ci się nasze usługi.",
  "rating": 5,
  "active": true,
  "auto_reply": true
}
```

**Response 200:**
```json
{
  "id": "t1",
  "name": "Podziękowanie (Standard) - Zaktualizowane",
  "content": "<link rel=\"mention\" name=\"pelne_imie\" title=\"Pełne imię (imię + nazwisko)\">@pelne_imie</link>, bardzo dziękujemy!",
  "rating": 5,
  "active": true,
  "auto_reply": true,
  "updated_at": "2025-11-24T20:00:00.000Z"
}
```

---

### DELETE /templates/{templateId}

Usuwa szablon.

**Path Parameters:**
- `templateId` (string, required): ID szablonu

**Response 204:** No Content

---

### POST /templates/bulk-update

Masowa aktualizacja szablonów (zmiana aktywności, auto-reply, oceny).

**Request Body:**
```json
{
  "template_ids": ["t1", "t2", "t3"],
  "updates": {
    "active": true,
    "auto_reply": false,
    "rating": 5
  }
}
```

**Response 200:**
```json
{
  "updated_count": 3,
  "templates": [
    {
      "id": "t1",
      "active": true,
      "auto_reply": false,
      "rating": 5
    }
  ]
}
```

---

### DELETE /templates/bulk-delete

Masowe usuwanie szablonów.

**Request Body:**
```json
{
  "template_ids": ["t1", "t2", "t3"]
}
```

**Response 200:**
```json
{
  "deleted_count": 3
}
```

---

## Endpointy - Przechwycone Opinie

### GET /intercepted-feedbacks

Pobiera listę przechwyconych opinii (przed publikacją).

**Query Parameters:**
- `status` (string, optional): `'all'` | `'new'` | `'read'` | `'replied'` - filtr statusu
- `rating` (number, optional): Filtr oceny (1-5)
- `sort` (string, optional): `'newest'` | `'oldest'` | `'lowest'` - sortowanie

**Response 200:**
```json
[
  {
    "id": "f1",
    "date": "2025-11-24T14:46:00.000Z",
    "rating": 2,
    "comment": "Muzyka była zdecydowanie za głośno.",
    "status": "new",
    "name": "Jan",
    "surname": "Kowalski",
    "email": "jan.kowalski@example.com",
    "phone": "500 600 700",
    "order_no": "ORD-12345",
    "service_name": "Strzyżenie",
    "employee_name": "Bartek",
    "reply": null
  }
]
```

**Struktura InterceptedFeedback:**
- `id` (string, required): Unikalny identyfikator
- `date` (string, required): Data otrzymania w formacie ISO 8601
- `rating` (number, required): Ocena 1-5
- `comment` (string, required): Treść opinii
- `status` (string, required): `'new'` | `'read'` | `'replied'`
- `name` (string, required): Imię klienta
- `surname` (string, required): Nazwisko klienta
- `email` (string, optional): Email klienta
- `phone` (string, optional): Numer telefonu
- `order_no` (string, optional): Numer zamówienia
- `service_name` (string, optional): Nazwa usługi
- `employee_name` (string, optional): Imię pracownika
- `reply` (object, nullable): Odpowiedź
  - `content` (string, required): Treść odpowiedzi
  - `date` (string, required): Data odpowiedzi
  - `author` (string, optional): Autor odpowiedzi

---

### POST /intercepted-feedbacks

Tworzy nową przechwyconą opinię.

**Request Body:**
```json
{
  "rating": 2,
  "message": "Muzyka była zdecydowanie za głośno.",
  "name": "Jan",
  "surname": "Kowalski",
  "email": "jan.kowalski@example.com",
  "phone": "500 600 700",
  "order_no": "ORD-12345",
  "service_name": "Strzyżenie",
  "employee_name": "Bartek"
}
```

**Response 201:**
```json
{
  "id": "f4",
  "date": "2025-11-24T20:00:00.000Z",
  "rating": 2,
  "comment": "Muzyka była zdecydowanie za głośno.",
  "status": "new",
  "name": "Jan",
  "surname": "Kowalski",
  "email": "jan.kowalski@example.com",
  "phone": "500 600 700",
  "order_no": "ORD-12345",
  "service_name": "Strzyżenie",
  "employee_name": "Bartek",
  "reply": null
}
```

---

### PUT /intercepted-feedbacks/{feedbackId}/status

Aktualizuje status przechwyconej opinii.

**Path Parameters:**
- `feedbackId` (string, required): ID opinii

**Request Body:**
```json
{
  "status": "read"
}
```

**Response 200:**
```json
{
  "id": "f1",
  "status": "read",
  "updated_at": "2025-11-24T20:00:00.000Z"
}
```

---

### POST /intercepted-feedbacks/{feedbackId}/reply

Wysyła odpowiedź na przechwyconą opinię.

**Path Parameters:**
- `feedbackId` (string, required): ID opinii

**Request Body:**
```json
{
  "message": "Dziękujemy za opinię. Postaramy się poprawić."
}
```

**Response 200:**
```json
{
  "id": "f1",
  "status": "replied",
  "reply": {
    "content": "Dziękujemy za opinię. Postaramy się poprawić.",
    "date": "2025-11-24T20:00:00.000Z",
    "author": "Admin"
  }
}
```

---

### DELETE /intercepted-feedbacks/{feedbackId}

Usuwa przechwyconą opinię.

**Path Parameters:**
- `feedbackId` (string, required): ID opinii

**Response 204:** No Content

---

### GET /intercepted-feedbacks/unread-count

Pobiera liczbę nieprzeczytanych przechwyconych opinii.

**Response 200:**
```json
{
  "count": 1
}
```

---

## Endpointy - Statystyki i Analiza

### GET /stats

Pobiera podstawowe statystyki opinii.

**Query Parameters:**
- `scenario` (string, optional): `'positive'` | `'neutral'` | `'negative'` - scenariusz dla deweloperskiego menu

**Response 200:**
```json
{
  "average_rating": 4.8,
  "total_reviews": 128,
  "positive_reviews_percentage": 78,
  "sources_breakdown": [
    {
      "label": "Google",
      "value": 85,
      "color": "#4285F4",
      "icon": "pi pi-google"
    },
    {
      "label": "Booksy",
      "value": 30,
      "color": "#00A3AD",
      "icon": "pi pi-calendar"
    },
    {
      "label": "Facebook",
      "value": 13,
      "color": "#1877F2",
      "icon": "pi pi-facebook"
    }
  ],
  "response_rate": 82,
  "scenario": {
    "emoji": "🎉",
    "ratingColor": {
      "from": "from-blue-600",
      "to": "to-indigo-600"
    },
    "knobColor": "#6366f1",
    "id": "positive"
  }
}
```

**Struktura Stats:**
- `average_rating` (number, required): Średnia ocena (1-5)
- `total_reviews` (number, required): Całkowita liczba opinii
- `positive_reviews_percentage` (number, required): Procent pozytywnych opinii (4-5 gwiazdek)
- `sources_breakdown` (array, required): Rozkład według źródeł
  - `label` (string, required): Nazwa źródła
  - `value` (number, required): Liczba opinii
  - `color` (string, optional): Kolor dla wizualizacji
  - `icon` (string, optional): Ikona PrimeVue
- `response_rate` (number, required): Procent odpowiedzi na opinie
- `scenario` (object, optional): Dane scenariusza (tylko gdy `scenario` query param)

---

### POST /ai/analyze-sentiment

Analiza sentymentu opinii.

**Request Body:**
```json
{
  "reviews": [],
  "scenario": "positive"
}
```

**Response 200:**
```json
{
  "overall": "positive",
  "distribution": {
    "positive": 85,
    "neutral": 10,
    "negative": 5
  },
  "trends": {
    "labels": ["01.11", "02.11", "03.11", ...],
    "positive": [82, 84, 85, ...],
    "neutral": [12, 11, 10, ...],
    "negative": [6, 5, 5, ...]
  },
  "details": []
}
```

**Struktura SentimentAnalysis:**
- `overall` (string, required): `'positive'` | `'neutral'` | `'negative'`
- `distribution` (object, required): Rozkład sentymentu
  - `positive` (number, required): Procent pozytywnych (0-100)
  - `neutral` (number, required): Procent neutralnych (0-100)
  - `negative` (number, required): Procent negatywnych (0-100)
- `trends` (object, required): Trendy w czasie (ostatnie 30 dni)
  - `labels` (array, required): Etykiety dat (format: "DD.MM")
  - `positive` (array, required): Wartości pozytywnych dla każdego dnia
  - `neutral` (array, required): Wartości neutralnych dla każdego dnia
  - `negative` (array, required): Wartości negatywnych dla każdego dnia
- `details` (array, optional): Szczegóły analizy

---

### POST /ai/analyze-products-services

Analiza produktów i usług wizyt.

**Request Body:**
```json
{
  "reviews": []
}
```

**Response 200:**
```json
{
  "services": [
    {
      "name": "Strzyżenie Męskie",
      "count": 36,
      "percentage": 28
    },
    {
      "name": "Koloryzacja Sombre",
      "count": 31,
      "percentage": 24
    }
  ],
  "products": [
    {
      "name": "Produkty koloryzujące",
      "count": 30,
      "percentage": 35
    }
  ],
  "totalAnalyzed": 128
}
```

**Struktura ProductsServicesAnalysis:**
- `services` (array, required): Najczęściej wspominane usługi
  - `name` (string, required): Nazwa usługi
  - `count` (number, required): Liczba wzmianek
  - `percentage` (number, required): Procent wzmianek (0-100)
- `products` (array, required): Najczęściej wspominane produkty
  - `name` (string, required): Nazwa produktu
  - `count` (number, required): Liczba wzmianek
  - `percentage` (number, required): Procent wzmianek (0-100)
- `totalAnalyzed` (number, required): Całkowita liczba przeanalizowanych opinii

---

### POST /ai/analyze-repeating-elements

Analiza powtarzających się elementów i tematów.

**Request Body:**
```json
{
  "reviews": []
}
```

**Response 200:**
```json
{
  "themes": [
    {
      "theme": "Obsługa klienta",
      "count": 41,
      "percentage": 32,
      "sentiment": "positive"
    },
    {
      "theme": "Jakość usługi",
      "count": 36,
      "percentage": 28,
      "sentiment": "positive"
    }
  ],
  "keywords": [
    {
      "word": "profesjonalna",
      "count": 45
    },
    {
      "word": "polecam",
      "count": 38
    }
  ],
  "insights": [
    {
      "type": "trend",
      "title": "Najczęściej wspominane tematy",
      "elements": ["Obsługa klienta", "Jakość usługi", "Atmosfera"]
    },
    {
      "type": "recommendation",
      "title": "Obszary do poprawy",
      "description": "Czas oczekiwania jest często wspominany w opiniach - warto rozważyć optymalizację procesów",
      "elements": ["Czas oczekiwania"]
    }
  ]
}
```

**Struktura RepeatingElementsAnalysis:**
- `themes` (array, required): Najczęściej wspominane tematy
  - `theme` (string, required): Nazwa tematu
  - `count` (number, required): Liczba wzmianek
  - `percentage` (number, required): Procent wzmianek (0-100)
  - `sentiment` (string, required): `'positive'` | `'neutral'` | `'negative'`
- `keywords` (array, required): Najczęściej używane słowa kluczowe
  - `word` (string, required): Słowo kluczowe
  - `count` (number, required): Liczba wystąpień
- `insights` (array, required): Wnioski i rekomendacje
  - `type` (string, required): `'trend'` | `'recommendation'`
  - `title` (string, required): Tytuł wniosku
  - `description` (string, optional): Opis (dla typu `'recommendation'`)
  - `elements` (array, required): Lista elementów/tematów

---

### POST /ai/analyze-time-trends

Analiza trendów czasowych.

**Request Body:**
```json
{
  "reviews": [],
  "scenario": "positive"
}
```

**Response 200:**
```json
{
  "labels": ["01.11", "02.11", "03.11", ...],
  "reviewCounts": [8, 12, 6, ...],
  "averageRatings": [4.6, 4.8, 4.5, ...],
  "replyCounts": [7, 10, 5, ...]
}
```

**Struktura TimeTrendsAnalysis:**
- `labels` (array, required): Etykiety dat (format: "DD.MM") - ostatnie 30 dni
- `reviewCounts` (array, required): Liczba opinii dla każdego dnia
- `averageRatings` (array, required): Średnia ocena dla każdego dnia (1-5)
- `replyCounts` (array, required): Liczba odpowiedzi dla każdego dnia

---

### POST /ai/generate-reply

Generuje sugerowaną odpowiedź na opinię za pomocą AI.

**Request Body:**
```json
{
  "rating": 5,
  "author_name": "Anna Nowak",
  "content": "Fantastyczna obsługa!"
}
```

**Response 200:**
```json
{
  "suggested_reply": "Dziękujemy bardzo, Anna Nowak! Cieszymy się, że wizyta się udała. Zapraszamy ponownie!"
}
```

---

## Endpointy - Auto-Odpowiedzi

### GET /auto-reply/settings

Pobiera ustawienia auto-odpowiedzi.

**Response 200:**
```json
{
  "enabled": false,
  "require_approval": true,
  "email_notifications": false,
  "approval_timeout_hours": 24,
  "daily_limit": 50,
  "cooldown_days": 7,
  "max_age_days": 30,
  "response_rate_threshold": 95,
  "require_approval_for_ratings": [1, 2],
  "require_approval_keywords": ["reklamacja", "problem", "skarga"]
}
```

**Struktura AutoReplySettings:**
- `enabled` (boolean, required): Czy auto-odpowiedzi są włączone
- `require_approval` (boolean, required): Czy wymagane jest zatwierdzenie przed wysłaniem
- `email_notifications` (boolean, required): Czy wysyłać powiadomienia email
- `approval_timeout_hours` (number, required): Czas auto-zatwierdzenia w godzinach (0 = brak timeoutu)
- `daily_limit` (number, required): Dzienne ograniczenie liczby auto-odpowiedzi
- `cooldown_days` (number, required): Okres karencji przed ponowną auto-odpowiedzią dla tego samego klienta
- `max_age_days` (number, required): Maksymalny wiek opinii w dniach, na którą można odpowiedzieć automatycznie
- `response_rate_threshold` (number, optional): Próg wskaźnika odpowiedzi (0-100)
- `require_approval_for_ratings` (array, optional): Oceny wymagające zatwierdzenia [1, 2, ...]
- `require_approval_keywords` (array, optional): Słowa kluczowe wymagające zatwierdzenia

---

### PUT /auto-reply/settings

Aktualizuje ustawienia auto-odpowiedzi.

**Request Body:**
```json
{
  "enabled": true,
  "require_approval": true,
  "email_notifications": false,
  "approval_timeout_hours": 24,
  "daily_limit": 50,
  "cooldown_days": 7,
  "max_age_days": 30,
  "response_rate_threshold": 95,
  "require_approval_for_ratings": [1, 2],
  "require_approval_keywords": ["reklamacja", "problem", "skarga"]
}
```

**Response 200:**
```json
{
  "enabled": true,
  "require_approval": true,
  "email_notifications": false,
  "approval_timeout_hours": 24,
  "daily_limit": 50,
  "cooldown_days": 7,
  "max_age_days": 30,
  "response_rate_threshold": 95,
  "require_approval_for_ratings": [1, 2],
  "require_approval_keywords": ["reklamacja", "problem", "skarga"],
  "updated_at": "2025-11-24T20:00:00.000Z"
}
```

---

### GET /auto-reply/rules

Pobiera listę reguł auto-odpowiedzi.

**Response 200:**
```json
[
  {
    "id": "rule_1",
    "name": "Pozytywne opinie Google",
    "enabled": true,
    "conditions": {
      "rating": {
        "operator": "gte",
        "value": 4
      },
      "source": ["google"],
      "status": ["new", "read"]
    },
    "schedule": {
      "type": "immediate",
      "delay_minutes": 0,
      "time_window": null,
      "weekdays_only": false
    },
    "template_selection": {
      "strategy": "rating_match",
      "fallback_template_id": null
    },
    "created_at": "2025-11-17T10:00:00.000Z",
    "updated_at": "2025-11-17T10:00:00.000Z"
  }
]
```

**Struktura AutoReplyRule:**
- `id` (string, required): Unikalny identyfikator reguły
- `name` (string, required): Nazwa reguły
- `enabled` (boolean, required): Czy reguła jest aktywna
- `conditions` (object, required): Warunki dopasowania
  - `rating` (object, optional): Warunek oceny
    - `operator` (string, required): `'eq'` | `'gte'` | `'lte'` | `'between'`
    - `value` (number, required): Wartość dla `eq`, `gte`, `lte`
    - `min` (number, optional): Wartość minimalna dla `between`
    - `max` (number, optional): Wartość maksymalna dla `between`
  - `source` (array, optional): Lista dozwolonych źródeł: `['google', 'booksy', 'facebook']`
  - `status` (array, optional): Lista dozwolonych statusów: `['new', 'read']`
  - `keywords` (array, optional): Słowa kluczowe, które muszą występować w treści
- `schedule` (object, required): Harmonogram wysyłania
  - `type` (string, required): `'immediate'` | `'delayed'` | `'scheduled'`
  - `delay_minutes` (number, optional): Opóźnienie w minutach (dla `delayed`)
  - `time_window` (object, optional): Okno czasowe (dla `scheduled`)
    - `start` (string, optional): Godzina rozpoczęcia (format: "HH:mm")
    - `end` (string, optional): Godzina zakończenia (format: "HH:mm")
  - `weekdays_only` (boolean, optional): Tylko dni robocze
- `template_selection` (object, required): Strategia wyboru szablonu
  - `strategy` (string, required): `'rating_match'` | `'random'` | `'first_available'`
  - `fallback_template_id` (string, nullable): ID szablonu zapasowego
- `created_at` (string, optional): Data utworzenia w formacie ISO 8601
- `updated_at` (string, optional): Data aktualizacji w formacie ISO 8601

---

### POST /auto-reply/rules

Tworzy nową regułę auto-odpowiedzi.

**Request Body:**
```json
{
  "name": "Pozytywne opinie Google",
  "enabled": true,
  "conditions": {
    "rating": {
      "operator": "gte",
      "value": 4
    },
    "source": ["google"],
    "status": ["new", "read"]
  },
  "schedule": {
    "type": "immediate",
    "delay_minutes": 0,
    "time_window": null,
    "weekdays_only": false
  },
  "template_selection": {
    "strategy": "rating_match",
    "fallback_template_id": null
  }
}
```

**Response 201:**
```json
{
  "id": "rule_3",
  "name": "Pozytywne opinie Google",
  "enabled": true,
  "conditions": {
    "rating": {
      "operator": "gte",
      "value": 4
    },
    "source": ["google"],
    "status": ["new", "read"]
  },
  "schedule": {
    "type": "immediate",
    "delay_minutes": 0,
    "time_window": null,
    "weekdays_only": false
  },
  "template_selection": {
    "strategy": "rating_match",
    "fallback_template_id": null
  },
  "created_at": "2025-11-24T20:00:00.000Z",
  "updated_at": "2025-11-24T20:00:00.000Z"
}
```

---

### PUT /auto-reply/rules/{ruleId}

Aktualizuje istniejącą regułę.

**Path Parameters:**
- `ruleId` (string, required): ID reguły

**Request Body:** (jak w POST /auto-reply/rules)

**Response 200:** (jak w POST /auto-reply/rules)

---

### DELETE /auto-reply/rules/{ruleId}

Usuwa regułę auto-odpowiedzi.

**Path Parameters:**
- `ruleId` (string, required): ID reguły

**Response 204:** No Content

---

### GET /auto-reply/history

Pobiera historię auto-odpowiedzi.

**Query Parameters:**
- `status` (string, optional): `'all'` | `'sent'` | `'pending'` | `'failed'` | `'cancelled'` - filtr statusu
- `review_type` (string, optional): `'all'` | `'review'` | `'feedback'` - filtr typu opinii

**Response 200:**
```json
[
  {
    "id": "ar1",
    "review_id": "101",
    "review_type": "review",
    "template_id": "t1",
    "template_name": "Podziękowanie (Standard)",
    "rule_id": "rule_1",
    "rule_name": "Pozytywne opinie Google",
    "content": "Anna Nowak, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi.",
    "status": "sent",
    "created_at": "2025-11-24T18:00:00.000Z",
    "sent_at": "2025-11-24T18:00:00.000Z",
    "approved_by": null,
    "approved_at": null,
    "cancelled_at": null,
    "error_message": null
  }
]
```

**Struktura AutoReplyHistory:**
- `id` (string, required): Unikalny identyfikator wpisu historii
- `review_id` (string, required): ID opinii lub przechwyconej opinii
- `review_type` (string, required): `'review'` | `'feedback'`
- `template_id` (string, required): ID użytego szablonu
- `template_name` (string, required): Nazwa użytego szablonu
- `rule_id` (string, required): ID reguły, która wygenerowała odpowiedź
- `rule_name` (string, required): Nazwa reguły
- `content` (string, required): Treść wygenerowanej odpowiedzi (po podstawieniu zmiennych)
- `status` (string, required): `'sent'` | `'pending'` | `'failed'` | `'cancelled'`
- `created_at` (string, required): Data utworzenia w formacie ISO 8601
- `sent_at` (string, nullable): Data wysłania w formacie ISO 8601
- `approved_by` (string, nullable): ID użytkownika, który zatwierdził
- `approved_at` (string, nullable): Data zatwierdzenia w formacie ISO 8601
- `cancelled_at` (string, nullable): Data anulowania w formacie ISO 8601
- `error_message` (string, nullable): Komunikat błędu (dla statusu `'failed'`)

---

### POST /auto-reply/history/{historyId}/approve

Zatwierdza oczekującą auto-odpowiedź.

**Path Parameters:**
- `historyId` (string, required): ID wpisu historii

**Request Body:**
```json
{
  "edited_content": "Anna Nowak, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi. Zapraszamy ponownie!"
}
```

**Response 200:**
```json
{
  "id": "ar2",
  "status": "sent",
  "content": "Anna Nowak, bardzo dziękujemy! Cieszymy się, że spodobały Ci się nasze usługi. Zapraszamy ponownie!",
  "sent_at": "2025-11-24T20:00:00.000Z",
  "approved_at": "2025-11-24T20:00:00.000Z",
  "approved_by": "user_123"
}
```

**Uwaga:** Jeśli `edited_content` nie jest podane, używana jest oryginalna treść.

---

### POST /auto-reply/history/{historyId}/cancel

Anuluje oczekującą auto-odpowiedź.

**Path Parameters:**
- `historyId` (string, required): ID wpisu historii

**Response 200:**
```json
{
  "id": "ar2",
  "status": "cancelled",
  "cancelled_at": "2025-11-24T20:00:00.000Z"
}
```

---

### POST /auto-reply/history/{historyId}/retry

Ponawia próbę wysłania nieudanej auto-odpowiedzi.

**Path Parameters:**
- `historyId` (string, required): ID wpisu historii

**Response 200:**
```json
{
  "id": "ar3",
  "status": "sent",
  "sent_at": "2025-11-24T20:00:00.000Z",
  "error_message": null
}
```

---

### GET /auto-reply/stats

Pobiera statystyki auto-odpowiedzi.

**Response 200:**
```json
{
  "total_sent": 45,
  "total_pending": 3,
  "total_failed": 2,
  "total_auto_replies": 50,
  "google_auto_replies": 30,
  "intercepted_auto_replies": 15,
  "time_saved_hours": 3.8
}
```

**Struktura AutoReplyStats:**
- `total_sent` (number, required): Liczba wysłanych auto-odpowiedzi
- `total_pending` (number, required): Liczba oczekujących auto-odpowiedzi
- `total_failed` (number, required): Liczba nieudanych auto-odpowiedzi
- `total_auto_replies` (number, required): Całkowita liczba auto-odpowiedzi
- `google_auto_replies` (number, required): Liczba auto-odpowiedzi na opinie Google
- `intercepted_auto_replies` (number, required): Liczba auto-odpowiedzi na przechwycone opinie
- `time_saved_hours` (number, required): Szacunkowy czas zaoszczędzony w godzinach

---

### POST /auto-reply/rules/{ruleId}/test

Testuje regułę auto-odpowiedzi na konkretnej opinii.

**Path Parameters:**
- `ruleId` (string, required): ID reguły

**Request Body:**
```json
{
  "review_id": "101",
  "review_type": "review"
}
```

**Response 200:**
```json
{
  "matches": true,
  "template": {
    "id": "t1",
    "name": "Podziękowanie (Standard)",
    "content": "<link rel=\"mention\" name=\"pelne_imie\" title=\"Pełne imię (imię + nazwisko)\">@pelne_imie</link>, bardzo dziękujemy!"
  },
  "preview": "Anna Nowak, bardzo dziękujemy!",
  "feedbackData": {
    "name": "Anna",
    "surname": "Nowak",
    "email": "anna.nowak@example.com",
    "phone": "",
    "rating": 5,
    "date": "2025-11-24T19:46:00.000Z",
    "service_name": "Koloryzacja Sombre",
    "employee_name": "Kasia",
    "order_no": "",
    "source": "google"
  }
}
```

**Response 200 (nie pasuje):**
```json
{
  "matches": false,
  "message": "Reguła nie pasuje do wybranej opinii"
}
```

---

## Endpointy - Pozyskiwanie Opinii

### GET /acquisition/settings

Pobiera ustawienia pozyskiwania opinii.

**Response 200:**
```json
{
  "headline": "Daj znać jak nam poszło",
  "min_rating_for_google": 4,
  "google_place_id": "ChIJ...",
  "theme_color": "3B82F6",
  "logo_url": null,
  "style": "poster",
  "business_name": "Kolabo group sp z o.o.",
  "business_name_visible": true,
  "business_name_top": 11,
  "business_name_left": 50,
  "business_name_size": 1,
  "poster_headline": "Oceń nas!",
  "poster_headline_visible": true,
  "poster_headline_top": 21,
  "poster_headline_left": 50,
  "poster_headline_size": 1,
  "qr_color": "4179E0",
  "qr_dots_style": "rounded",
  "qr_top": 49,
  "qr_left": 50,
  "qr_size": 1,
  "qr_visible": true,
  "qr_border_width": 3,
  "qr_border_color": "111827",
  "badge_text": "SKANUJ",
  "badge_color": "EF4444",
  "badge_visible": true,
  "badge_top": 4,
  "badge_left": 27,
  "badge_size": 1.3,
  "stars_visible": true,
  "stars_top": 82,
  "stars_left": 50,
  "stars_size": 1,
  "google_logo_visible": true,
  "google_logo_top": 93,
  "google_logo_left": 50,
  "google_logo_size": 0.8,
  "footer_text": "Oceń nas w",
  "form_fields": [
    {
      "key": "name",
      "label": "Imię",
      "visible": true,
      "required": false
    },
    {
      "key": "surname",
      "label": "Nazwisko",
      "visible": true,
      "required": false
    },
    {
      "key": "phone",
      "label": "Telefon",
      "visible": true,
      "required": false
    },
    {
      "key": "email",
      "label": "Email",
      "visible": true,
      "required": true
    },
    {
      "key": "order_no",
      "label": "Numer zamówienia",
      "visible": false,
      "required": false
    },
    {
      "key": "service_name",
      "label": "Nazwa usługi",
      "visible": false,
      "required": false
    },
    {
      "key": "employee_name",
      "label": "Pracownik",
      "visible": false,
      "required": false
    }
  ]
}
```

---

### PUT /acquisition/settings

Aktualizuje ustawienia pozyskiwania opinii.

**Request Body:** (jak w GET /acquisition/settings)

**Response 200:** (jak w GET /acquisition/settings)

---

## Struktury danych

### Format dat

Wszystkie daty są w formacie ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`

Przykład: `2025-11-24T20:00:00.000Z`

### Format zmiennych w szablonach

Zmienne w treści szablonów są przechowywane w formacie HTML mentions:

```html
<link rel="mention" name="pelne_imie" title="Pełne imię (imię + nazwisko)">@pelne_imie</link>
```

**Dostępne zmienne:**
- `@imie` - Imię klienta
- `@nazwisko` - Nazwisko klienta
- `@pelne_imie` - Pełne imię (imię + nazwisko)
- `@email` - Email klienta
- `@telefon` - Numer telefonu
- `@ocena` - Ocena (liczba)
- `@data` - Data opinii (format: DD.MM.YYYY)
- `@usluga` - Nazwa usługi
- `@pracownik` - Imię pracownika
- `@zamowienie` - Numer zamówienia

**Podstawianie zmiennych:**

Backend powinien podstawiać zmienne w następujący sposób:
1. Dla formatu HTML mentions: zastąpić cały tag `<link>` wartością zmiennej
2. Dla zwykłego formatu `@variable`: zastąpić `@variable` wartością zmiennej

**Przykład podstawiania:**

Dane klienta:
```json
{
  "name": "Anna",
  "surname": "Nowak",
  "rating": 5,
  "service_name": "Koloryzacja Sombre"
}
```

Szablon:
```html
<link rel="mention" name="pelne_imie" title="Pełne imię">@pelne_imie</link>, dziękujemy za ocenę @ocena gwiazdek dla usługi @usluga!
```

Wynik:
```
Anna Nowak, dziękujemy za ocenę 5 gwiazdek dla usługi Koloryzacja Sombre!
```

---

## Obsługa błędów

### Format odpowiedzi błędu

```json
{
  "error": {
    "code": "REVIEW_NOT_FOUND",
    "message": "Opinia o podanym ID nie została znaleziona",
    "details": {}
  }
}
```

### Kody błędów

- `REVIEW_NOT_FOUND` (404): Opinia nie została znaleziona
- `TEMPLATE_NOT_FOUND` (404): Szablon nie został znaleziony
- `RULE_NOT_FOUND` (404): Reguła nie została znaleziona
- `FEEDBACK_NOT_FOUND` (404): Przechwycona opinia nie została znaleziona
- `AUTO_REPLY_NOT_FOUND` (404): Auto-odpowiedź nie została znaleziona
- `VALIDATION_ERROR` (400): Błąd walidacji danych
- `UNAUTHORIZED` (401): Brak autoryzacji
- `FORBIDDEN` (403): Brak uprawnień
- `RATE_LIMIT_EXCEEDED` (429): Przekroczony limit zapytań
- `INTERNAL_SERVER_ERROR` (500): Błąd serwera

### Przykłady odpowiedzi błędów

**404 Not Found:**
```json
{
  "error": {
    "code": "REVIEW_NOT_FOUND",
    "message": "Opinia o ID '101' nie została znaleziona"
  }
}
```

**400 Bad Request:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nieprawidłowe dane wejściowe",
    "details": {
      "rating": ["Ocena musi być liczbą od 1 do 5"],
      "content": ["Treść opinii jest wymagana"]
    }
  }
}
```

---

## Uwagi dotyczące integracji

### 1. Konwersja zmiennych

Backend powinien automatycznie konwertować zwykłe zmienne (`@pelne_imie`) na format HTML mentions podczas zapisywania szablonu. Frontend wysyła zmienne w obu formatach, ale preferowany jest format HTML mentions.

### 2. Filtrowanie i sortowanie

Wszystkie endpointy listujące (GET /reviews, GET /intercepted-feedbacks, GET /auto-reply/history) powinny obsługiwać:
- Filtrowanie przez query parameters
- Sortowanie przez query parameters
- Paginację (jeśli wymagana)

### 3. Real-time updates

Rozważ implementację WebSocket lub Server-Sent Events dla:
- Nowych opinii
- Nowych przechwyconych opinii
- Zmian statusu auto-odpowiedzi

### 4. Rate limiting

Endpointy związane z auto-odpowiedziami powinny mieć odpowiednie limity, aby zapobiec nadużyciom.

### 5. Walidacja danych

Backend powinien walidować:
- Format dat (ISO 8601)
- Zakresy wartości (rating 1-5, procenty 0-100)
- Wymagane pola
- Format HTML mentions w szablonach

### 6. Bezpieczeństwo

- Wszystkie endpointy wymagają autoryzacji
- Walidacja uprawnień użytkownika
- Sanityzacja danych wejściowych (szczególnie treści opinii i odpowiedzi)
- Ochrona przed XSS (szczególnie w treściach HTML)

### 7. Performance

- Rozważ cache'owanie statystyk i analiz AI
- Optymalizacja zapytań do bazy danych
- Indeksowanie często używanych pól (status, rating, source)

---

## Przykłady użycia

### Przykład 1: Pobranie opinii i odpowiedź

```javascript
// 1. Pobierz opinie
const reviews = await fetch('/api/v1/reviews?status=unanswered&sort=newest', {
  headers: { 'Authorization': 'Bearer ' + token }
}).then(r => r.json());

// 2. Wyślij odpowiedź
const reply = await fetch(`/api/v1/reviews/${reviews[0].id}/reply`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Dziękujemy za opinię!'
  })
}).then(r => r.json());
```

### Przykład 2: Utworzenie szablonu i użycie w auto-odpowiedzi

```javascript
// 1. Utwórz szablon
const template = await fetch('/api/v1/templates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Podziękowanie',
    content: '@pelne_imie, dziękujemy za opinię!',
    rating: 5,
    active: true,
    auto_reply: true
  })
}).then(r => r.json());

// 2. Utwórz regułę auto-odpowiedzi
const rule = await fetch('/api/v1/auto-reply/rules', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Pozytywne opinie',
    enabled: true,
    conditions: {
      rating: { operator: 'gte', value: 4 },
      source: ['google']
    },
    schedule: {
      type: 'immediate',
      delay_minutes: 0,
      weekdays_only: false
    },
    template_selection: {
      strategy: 'rating_match',
      fallback_template_id: null
    }
  })
}).then(r => r.json());
```

---

## Changelog

### Wersja 1.0.0 (2025-11-24)
- Początkowa wersja dokumentacji API
- Wszystkie endpointy dla opinii, szablonów, auto-odpowiedzi i analizy AI
- Dokumentacja struktur danych i formatów

---

**Ostatnia aktualizacja:** 2025-11-24

