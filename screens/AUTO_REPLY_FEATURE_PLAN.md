# Auto-Odpowiedzi na Opinie – Plan Funkcjonalności

> **⚠️ WAŻNE:** Ten plan buduje na istniejących komponentach i funkcjonalnościach. Nie duplikuje kodu, tylko rozszerza to co już działa.

## 1. Co Już Jest Zrobione (Istniejące Komponenty)

### ✅ **Szablony Odpowiedzi** (`ResponseTemplates.vue`)
- Pełny system zarządzania szablonami (CRUD)
- Pole `auto_reply` (boolean) - już istnieje w bazie
- Pole `active` (boolean) - już istnieje
- Toggle `auto_reply` w tabeli z ikoną magic
- Bulk actions dla `auto_reply`
- TinyEditor z obsługą zmiennych (@imie, @pelne_imie, etc.)
- System zmiennych: `imie`, `nazwisko`, `pelne_imie`, `email`, `telefon`, `ocena`, `data`, `usluga`, `pracownik`, `zamowienie`
- `ReviewsService.getTemplates()` - pobieranie szablonów
- `ReviewsService.saveTemplate()` - zapisywanie szablonów
- `ReviewsService.canUseTemplate()` - sprawdzanie czy szablon pasuje do danych
- `ReviewsService.replaceTemplateVariables()` - zamiana zmiennych na wartości

### ✅ **System Odpowiedzi**
- `InterceptedReviews.vue` - odpowiadanie na przechwycone opinie
- `ReviewItem.vue` - odpowiadanie na opinie z Google/Booksy/Facebook
- `ReviewsService.postReply()` - wysyłanie odpowiedzi na opinie
- `ReviewsService.replyToInternalFeedback()` - wysyłanie odpowiedzi na przechwycone opinie
- `TemplateSelector.vue` - wybór szablonu przy ręcznym odpowiadaniu
- TinyEditor w odpowiedziach z dostępnymi zmiennymi
- System statusów: `new`, `read`, `replied`, `unanswered`, `answered`

### ✅ **Struktury Danych**
- **Opinie** (`MOCK_REVIEWS`): `id`, `source` (google/booksy/facebook), `author_name`, `rating`, `content`, `date`, `status`, `service_context`, `reply`
- **Przechwycone opinie** (`MOCK_INTERNAL_FEEDBACKS`): `id`, `name`, `surname`, `email`, `phone`, `rating`, `date`, `status`, `service_name`, `employee_name`, `order_no`, `reply`
- **Szablony** (`MOCK_TEMPLATES`): `id`, `name`, `content`, `rating`, `active`, `auto_reply`

### ✅ **Dashboard i Nawigacja**
- `ReviewsDashboard.vue` - główny dashboard z zakładkami
- `ReviewsOverview.vue` - przegląd statystyk
- `ReviewsList.vue` - lista opinii
- `InterceptedReviews.vue` - przechwycone opinie
- `ResponseTemplates.vue` - szablony odpowiedzi

---

## 2. Przegląd i Wartość Biznesowa

### Problem, który rozwiązujemy
- **Czas:** Odpowiadanie ręcznie na każdą opinię zajmuje 5-10 minut → przy 50 opiniach/miesiąc = 4-8 godzin pracy
- **Response Rate:** Bez automatyzacji wiele pozytywnych opinii pozostaje bez odpowiedzi, co wpływa negatywnie na wizerunek
- **Spójność:** Ręczne odpowiedzi są niespójne w tonie i treści
- **Skalowalność:** Wraz z wzrostem liczby opinii, ręczne zarządzanie staje się niemożliwe

### Wartość dla klienta
- ⏱️ **Oszczędność czasu:** Automatyczne odpowiadanie na 80%+ opinii, oszczędność 3-6 godzin/miesiąc
- 📈 **Zwiększenie Response Rate:** Z 60% do 95%+ automatycznie odpowiadanych opinii
- 🎯 **Spójność komunikacji:** Wszystkie odpowiedzi zgodne z brand voice i najlepszymi praktykami
- 🚀 **Skalowalność:** System działa 24/7, niezależnie od liczby opinii
- 💰 **ROI:** Każda odpowiedź na pozytywną opinię zwiększa prawdopodobieństwo powrotu klienta o 15-20%

---

## 2. Architektura Funkcji

### 2.1 Nowe Komponenty (Budowane na Istniejących)

#### A. **Ustawienia Auto-Odpowiedzi** (`AutoReplySettings.vue`)
**Lokalizacja:** Nowa zakładka w `ReviewsDashboard.vue` lub sekcja w istniejącym widoku

**Wykorzystuje:**
- ✅ Istniejące szablony z `auto_reply = true`
- ✅ `ReviewsService.getTemplates()` - filtrowanie szablonów
- ✅ `ReviewsService.canUseTemplate()` - walidacja szablonów
- ✅ Istniejące zmienne i system mentions

**Nowe funkcje:**
- Konfiguracja reguł automatycznego odpowiadania
- Ustawienia harmonogramów i limitów
- Testowanie reguł na przykładowych opiniach

#### B. **Silnik Automatycznego Odpowiadania** (Rozszerzenie `ReviewsService.js`)
**Wykorzystuje:**
- ✅ `ReviewsService.getReviews()` - pobieranie opinii
- ✅ `ReviewsService.getInternalFeedbacks()` - pobieranie przechwyconych opinii
- ✅ `ReviewsService.postReply()` - wysyłanie odpowiedzi
- ✅ `ReviewsService.replyToInternalFeedback()` - wysyłanie odpowiedzi na przechwycone
- ✅ `ReviewsService.replaceTemplateVariables()` - zamiana zmiennych
- ✅ `ReviewsService.canUseTemplate()` - sprawdzanie dopasowania szablonu

**Nowe funkcje:**
- `ReviewsService.getAutoReplySettings()` - pobieranie ustawień
- `ReviewsService.saveAutoReplySettings()` - zapisywanie ustawień
- `ReviewsService.processAutoReply()` - główna funkcja przetwarzania
- `ReviewsService.getAutoReplyRules()` - pobieranie reguł

#### C. **Historia Auto-Odpowiedzi** (`AutoReplyHistory.vue`)
**Wykorzystuje:**
- ✅ Istniejące struktury danych opinii i feedbacków
- ✅ `ReviewsService.postReply()` / `replyToInternalFeedback()` - do wysyłania
- ✅ Statusy: rozszerzenie o `auto_reply_pending`, `auto_reply_sent`, `auto_reply_failed`

**Nowe funkcje:**
- Lista wszystkich auto-odpowiedzi
- Kolejka zatwierdzeń (jeśli `require_approval = true`)
- Możliwość edycji przed wysłaniem

#### D. **Dashboard Statystyk** (Rozszerzenie `ReviewsOverview.vue`)
**Wykorzystuje:**
- ✅ Istniejące statystyki z `ReviewsService.getStats()`
- ✅ Istniejące wykresy i komponenty wizualizacji

**Nowe funkcje:**
- Karta statystyk auto-odpowiedzi
- Metryki: liczba wysłanych, response rate, oszczędność czasu

---

## 3. Szczegółowa Specyfikacja Funkcjonalności

### 3.1 Ustawienia Auto-Odpowiedzi – Struktura UI

#### **Sekcja 1: Główne Przełączniki**

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Auto-Odpowiedzi                                      │
│                                                         │
│ [Toggle] Włącz auto-odpowiedzi                         │
│    ℹ️ System automatycznie odpowiada na opinie zgodnie  │
│       z poniższymi regułami                             │
│                                                         │
│ [Toggle] Wymagaj zatwierdzenia przed wysłaniem        │
│    ℹ️ Każda odpowiedź będzie wymagała Twojego          │
│       zatwierdzenia przed wysłaniem                    │
│                                                         │
│ [Toggle] Powiadomienia email o nowych odpowiedziach     │
│    ℹ️ Otrzymasz email gdy system wygeneruje odpowiedź  │
└─────────────────────────────────────────────────────────┘
```

**Pola konfiguracyjne:**
- `enabled` (boolean) - główny przełącznik
- `require_approval` (boolean) - czy wymagać zatwierdzenia
- `email_notifications` (boolean) - powiadomienia email
- `approval_timeout_hours` (number, default: 24) - po ilu godzinach auto-zatwierdzenie jeśli brak akcji

#### **Sekcja 2: Reguły Automatycznego Odpowiadania**

```
┌─────────────────────────────────────────────────────────┐
│ 📋 Reguły Odpowiadania                                   │
│                                                         │
│ System odpowiada automatycznie gdy:                    │
│                                                         │
│ ☑️ Ocena: [Dropdown: Wszystkie / 5 / 4 / 3 / 2 / 1]   │
│ ☑️ Źródło: [MultiSelect: Google, Booksy, Facebook]     │
│ ☑️ Status: [MultiSelect: Nowa, Przeczytana]            │
│ ☑️ Zawiera słowa kluczowe: [Input]                     │
│                                                         │
│ ⏰ Harmonogram:                                         │
│    [ ] Od razu po otrzymaniu                            │
│    [ ] Z opóźnieniem: [Input: 30] minut                │
│    [ ] Tylko w godzinach: [TimePicker: 9:00-17:00]     │
│    [ ] Tylko w dni robocze                              │
│                                                         │
│ [Button: + Dodaj regułę]                               │
└─────────────────────────────────────────────────────────┘
```

**Struktura reguły:**
```javascript
{
  id: 'rule_1',
  name: 'Pozytywne opinie Google',
  enabled: true,
  conditions: {
    rating: { operator: 'gte', value: 4 }, // >= 4
    source: { operator: 'in', value: ['google'] },
    status: { operator: 'in', value: ['new', 'read'] },
    keywords: { operator: 'contains', value: [] }, // opcjonalne
    sentiment: { operator: 'eq', value: 'positive' } // jeśli AI analysis dostępne
  },
  schedule: {
    type: 'immediate' | 'delayed' | 'scheduled',
    delay_minutes: 30, // jeśli delayed
    time_window: { start: '09:00', end: '17:00' }, // jeśli scheduled
    weekdays_only: true
  },
  template_selection: {
    strategy: 'rating_match' | 'ai_best_match' | 'random',
    fallback_template_id: 't1' // jeśli brak dopasowania
  }
}
```

#### **Sekcja 3: Wybór Szablonów**

```
┌─────────────────────────────────────────────────────────┐
│ 📝 Szablony dla Auto-Odpowiedzi                         │
│                                                         │
│ System używa tylko szablonów oznaczonych jako          │
│ "Dostępny w auto-odpowiedziach"                        │
│                                                         │
│ Strategia wyboru szablonu:                             │
│ ○ Dopasuj do oceny (5⭐ → szablon dla 5⭐)              │
│ ○ AI wybiera najlepszy na podstawie treści opinii      │
│ ○ Losowy z dostępnych dla danej oceny                  │
│                                                         │
│ [Link: Zarządzaj szablonami →]                         │
│                                                         │
│ Podgląd dostępnych szablonów:                          │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 5⭐: 3 szablony dostępne                           │ │
│ │ 4⭐: 2 szablony dostępne                           │ │
│ │ 3⭐: 1 szablon dostępny                            │ │
│ │ 2⭐: 0 szablonów (⚠️ Dodaj szablon dla negatywnych)│ │
│ │ 1⭐: 0 szablonów (⚠️ Dodaj szablon dla negatywnych)│ │
│ └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### **Sekcja 4: Ograniczenia i Zabezpieczenia**

```
┌─────────────────────────────────────────────────────────┐
│ 🛡️ Zabezpieczenia                                       │
│                                                         │
│ Limity dzienne:                                         │
│    Maksymalna liczba auto-odpowiedzi/dzień: [Input: 50]│
│                                                         │
│ Ograniczenia:                                           │
│    ☑️ Nie odpowiadaj jeśli klient już otrzymał         │
│       odpowiedź w ciągu ostatnich 7 dni                │
│    ☑️ Nie odpowiadaj na opinie starsze niż [30] dni   │
│    ☑️ Zatrzymaj jeśli Response Rate > [95]%             │
│                                                         │
│ Wyjątki:                                                │
│    ☑️ Zawsze wymagaj zatwierdzenia dla ocen 1-2⭐      │
│    ☑️ Zawsze wymagaj zatwierdzenia jeśli opinia        │
│       zawiera słowa: [Input: reklamacja, problem]      │
└─────────────────────────────────────────────────────────┘
```

**Pola konfiguracyjne:**
- `daily_limit` (number) - maksymalna liczba auto-odpowiedzi dziennie
- `cooldown_days` (number) - nie odpowiadaj jeśli już odpowiedziano w ciągu X dni
- `max_age_days` (number) - nie odpowiadaj na opinie starsze niż X dni
- `response_rate_threshold` (number) - zatrzymaj jeśli response rate przekroczy X%
- `require_approval_for_ratings` (array) - zawsze wymagaj zatwierdzenia dla ocen [1, 2]
- `require_approval_keywords` (array) - zawsze wymagaj zatwierdzenia jeśli zawiera słowa

#### **Sekcja 5: Podgląd i Testowanie**

```
┌─────────────────────────────────────────────────────────┐
│ 🧪 Test Reguł                                           │
│                                                         │
│ Wybierz przykładową opinię:                            │
│ [Dropdown: Przykładowe opinie...]                      │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ Przykładowa opinia:                               │ │
│ │ "Fantastyczna obsługa! Pani Kasia to profesjonali-│ │ │
│ │ stka. Na pewno wrócę."                            │ │
│ │ Ocena: 5⭐ | Źródło: Google | Data: 2h temu       │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ Wynik testu:                                           │
│ ✅ Reguła "Pozytywne opinie Google" pasuje             │
│ ✅ Szablon "Podziękowanie (Standard)" wybrany          │
│ ✅ Wszystkie zmienne dostępne                          │
│                                                         │
│ Podgląd odpowiedzi:                                    │
│ ┌───────────────────────────────────────────────────┐ │
│ │ Anna Nowak, bardzo dziękujemy! Cieszymy się, że   │ │
│ │ spodobały Ci się nasze usługi. Daj nam znać, jeśli│ │
│ │ będziesz potrzebować czegoś jeszcze. Życzymy     │ │
│ │ wszystkiego najlepszego!                          │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ [Button: Wyślij testową odpowiedź]                     │
└─────────────────────────────────────────────────────────┘
```

---

### 3.2 Historia Auto-Odpowiedzi

#### **Widok Listy** (`AutoReplyHistory.vue`)

```
┌─────────────────────────────────────────────────────────┐
│ 📜 Historia Auto-Odpowiedzi                            │
│                                                         │
│ Filtry: [Status] [Źródło] [Data] [Ocena]              │
│                                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ID    │ Klient    │ Ocena │ Status │ Data          │ │
│ ├───────┼───────────┼───────┼────────┼───────────────┤ │
│ │ #101  │ Anna N.   │ 5⭐   │ ✅ Wysł│ 2h temu       │ │
│ │ #102  │ Marek Z.  │ 4⭐   │ ⏳ Oczek│ 5h temu       │ │
│ │ #103  │ Klaudia B.│ 5⭐   │ ❌ Błąd │ 1d temu       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Button: Zatwierdź wszystkie oczekujące]                │
└─────────────────────────────────────────────────────────┘
```

**Kolumny:**
- ID opinii (link do szczegółów)
- Klient (imię, nazwisko)
- Ocena (Rating component)
- Źródło (Tag z ikoną)
- Status (Tag: `pending`, `sent`, `failed`, `cancelled`)
- Data wygenerowania
- Szablon użyty (nazwa)
- Akcje (Podgląd, Edytuj, Wyślij, Anuluj)

#### **Dialog Zatwierdzania**

Gdy `require_approval = true`, każda wygenerowana odpowiedź trafia do kolejki zatwierdzeń:

```
┌─────────────────────────────────────────────────────────┐
│ ✉️ Zatwierdź Auto-Odpowiedź                            │
│                                                         │
│ Opinia:                                                 │
│ ┌───────────────────────────────────────────────────┐ │
│ │ Anna Nowak | 5⭐ | Google                         │ │
│ │ "Fantastyczna obsługa! Pani Kasia to profesjonali-│ │
│ │ stka. Na pewno wrócę."                            │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ Wygenerowana odpowiedź:                                 │
│ ┌───────────────────────────────────────────────────┐ │
│ │ [TinyEditor z edycją]                             │ │
│ │ Anna Nowak, bardzo dziękujemy! Cieszymy się, że  │ │
│ │ spodobały Ci się nasze usługi...                  │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ Szablon: "Podziękowanie (Standard)"                    │
│ Reguła: "Pozytywne opinie Google"                      │
│                                                         │
│ [Button: ✏️ Edytuj] [Button: ✅ Zatwierdź i wyślij]   │
│ [Button: ❌ Odrzuć] [Button: ⏭️ Pomiń]                │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 Integracja z Dashboardem

#### **Karta Statystyk Auto-Odpowiedzi** (w `ReviewsOverview.vue`)

```
┌─────────────────────────────────────────────────────────┐
│ 🤖 Auto-Odpowiedzi                                     │
│                                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ 142      │ │ 95%      │ │ 3.2h     │ │ 12       │ │
│ │ Wysłanych│ │ Response │ │ Oszczędz │ │ Oczekuje │ │
│ │          │ │ Rate     │ │          │ │          │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                         │
│ [Wykres: Trend auto-odpowiedzi w czasie]                │
│                                                         │
│ [Link: Zobacz historię →] [Link: Ustawienia →]         │
└─────────────────────────────────────────────────────────┘
```

**Metryki:**
- Liczba wysłanych auto-odpowiedzi (total)
- Response Rate (z auto-odpowiedziami)
- Oszczędność czasu (szacunkowa)
- Liczba oczekujących na zatwierdzenie

---

## 4. Logika Biznesowa

### 4.1 Proces Automatycznego Odpowiadania

```
1. NOWA OPINIA PRZYCHODZI
   ↓
2. SPRAWDŹ CZY AUTO-ODPOWIEDZI SĄ WŁĄCZONE
   ↓ (nie) → KONIEC
   ↓ (tak)
3. SPRAWDŹ OGRANICZENIA
   - Czy nie przekroczono dziennego limitu?
   - Czy opinia nie jest za stara?
   - Czy klient nie otrzymał już odpowiedzi w cooldown period?
   ↓ (blokada) → LOGUJ + KONIEC
   ↓ (OK)
4. ZNAJDŹ PASUJĄCE REGUŁY
   - Iteruj przez wszystkie włączone reguły
   - Sprawdź warunki (ocena, źródło, status, keywords, sentiment)
   - Sprawdź harmonogram (czy teraz jest odpowiedni czas?)
   ↓ (brak reguł) → KONIEC
   ↓ (znaleziono regułę)
5. WYBIERZ SZABLON
   - Zgodnie ze strategią (rating_match / ai_best_match / random)
   - Sprawdź czy szablon ma `auto_reply = true`
   - Sprawdź czy wszystkie zmienne są dostępne
   ↓ (brak szablonu) → LOGUJ + KONIEC
   ↓ (szablon znaleziony)
6. WYPEŁNIJ ZMIENNE W SZABLONIE
   - Zamień @imie, @nazwisko, @ocena, etc. na rzeczywiste wartości
   - Waliduj czy wszystkie wymagane zmienne są dostępne
   ↓ (błąd) → LOGUJ + KONIEC
   ↓ (OK)
7. SPRAWDŹ CZY WYMAGANE ZATWIERDZENIE
   - Czy `require_approval = true`?
   - Czy ocena jest w `require_approval_for_ratings`?
   - Czy opinia zawiera słowa z `require_approval_keywords`?
   ↓ (wymaga zatwierdzenia) → DODAJ DO KOLEJKI ZATWIERDZEŃ
   ↓ (nie wymaga)
8. WYŚLIJ ODPOWIEDŹ
   - Wywołaj API platformy (Google/Booksy/Facebook)
   - Zapisz w historii jako `sent`
   - Zaktualizuj status opinii na `answered`
   ↓ (sukces) → KONIEC
   ↓ (błąd) → LOGUJ JAKO `failed` + POWIADOM EMAIL
```

### 4.2 Strategie Wyboru Szablonu

#### **A. Rating Match (domyślna)**
```javascript
// Najprostsza strategia - dopasuj szablon do oceny
const templates = availableTemplates.filter(t => 
  t.rating === review.rating && 
  t.auto_reply === true && 
  t.active === true
);
return templates[0]; // pierwszy pasujący
```

#### **B. AI Best Match**
```javascript
// Użyj AI do analizy treści opinii i wyboru najlepszego szablonu
const analysis = await analyzeReviewContent(review.content);
const templates = availableTemplates.filter(t => 
  t.auto_reply === true && 
  t.active === true
);
// Porównaj sentiment, keywords, tone z każdym szablonem
const bestMatch = findBestMatchingTemplate(templates, analysis);
return bestMatch;
```

#### **C. Random**
```javascript
// Losowy wybór z dostępnych szablonów dla danej oceny
const templates = availableTemplates.filter(t => 
  t.rating === review.rating && 
  t.auto_reply === true && 
  t.active === true
);
return templates[Math.floor(Math.random() * templates.length)];
```

### 4.3 Obsługa Zmiennych

**Dostępne zmienne:**
- `@imie` - imię klienta
- `@nazwisko` - nazwisko klienta
- `@pelne_imie` - imię + nazwisko
- `@email` - email klienta
- `@telefon` - numer telefonu
- `@ocena` - ocena (liczba)
- `@data` - data opinii (sformatowana)
- `@usluga` - nazwa usługi
- `@pracownik` - imię pracownika
- `@zamowienie` - numer zamówienia

**Walidacja przed wysłaniem:**
- Jeśli szablon zawiera zmienną, która nie jest dostępna w danych opinii → **BŁĄD**
- Opcje obsługi:
  1. **Fail silently** - nie wysyłaj, loguj jako `failed`
  2. **Use fallback** - użyj wartości domyślnej (np. "Klientie" zamiast "@imie")
  3. **Require approval** - automatycznie wymagaj zatwierdzenia

---

## 5. UI/UX - Wizualna Prezentacja

### 5.1 Główna Karta Ustawień

**Lokalizacja:** `ReviewsDashboard.vue` → nowa zakładka "Auto-Odpowiedzi" lub sekcja w "Ustawienia"

**Design:**
- **Card-based layout** z wyraźnymi sekcjami
- **Toggle switches** z ikonami i opisami
- **Color coding:** 
  - Zielony = włączone/aktywne
  - Szary = wyłączone/nieaktywne
  - Pomarańczowy = wymaga uwagi (brak szablonów dla niektórych ocen)
- **Progressive disclosure:** Zaawansowane opcje w accordionach
- **Inline help:** Tooltips z `pi-info-circle` przy każdym polu

### 5.2 Wizualizacja Reguł

**Lista reguł:**
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Reguły (3 aktywne, 1 wyłączona)                     │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ ✅ Pozytywne opinie Google                        │ │
│ │    Jeśli: 4-5⭐, Google, Nowa                     │ │
│ │    Wtedy: Wyślij natychmiast                      │ │
│ │    Szablon: Rating Match                          │ │
│ │    [Edit] [Toggle] [Delete]                       │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ ⚠️ Neutralne opinie (wymaga zatwierdzenia)        │ │
│ │    Jeśli: 3⭐, Wszystkie źródła                    │ │
│ │    Wtedy: Wyślij po 1h, wymagaj zatwierdzenia     │ │
│ │    Szablon: AI Best Match                         │ │
│ │    [Edit] [Toggle] [Delete]                        │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ [Button: + Dodaj regułę]                               │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Status Badges i Wskaźniki

**W historii auto-odpowiedzi:**
- `pending` → 🟡 Pomarańczowy badge "Oczekuje"
- `sent` → 🟢 Zielony badge "Wysłano" + timestamp
- `failed` → 🔴 Czerwony badge "Błąd" + przycisk "Spróbuj ponownie"
- `cancelled` → ⚫ Szary badge "Anulowano"

**W dashboardzie:**
- Licznik oczekujących zatwierdzeń jako **Badge** na ikonie Auto-Odpowiedzi
- Jeśli brak szablonów dla niektórych ocen → **Alert** z CTA "Dodaj szablony"

---

## 6. Integracja z Istniejącym Systemem

### 6.1 Rozszerzenie `ReviewsService.js`

**Wykorzystuje istniejące metody:**
- ✅ `getTemplates()` - filtrowanie szablonów z `auto_reply = true`
- ✅ `canUseTemplate()` - sprawdzanie czy szablon pasuje
- ✅ `replaceTemplateVariables()` - zamiana zmiennych
- ✅ `postReply()` / `replyToInternalFeedback()` - wysyłanie odpowiedzi
- ✅ `getReviews()` / `getInternalFeedbacks()` - pobieranie opinii

**Nowe metody do dodania:**
```javascript
// W ReviewsService.js - rozszerzenie istniejącego obiektu
{
  // Ustawienia auto-odpowiedzi
  async getAutoReplySettings() {
    await delay(500);
    return MOCK_AUTO_REPLY_SETTINGS; // Nowa stała
  },
  async saveAutoReplySettings(settings) {
    await delay(700);
    MOCK_AUTO_REPLY_SETTINGS = { ...settings };
    return MOCK_AUTO_REPLY_SETTINGS;
  },
  
  // Reguły
  async getAutoReplyRules() {
    await delay(500);
    return MOCK_AUTO_REPLY_RULES; // Nowa stała
  },
  async saveAutoReplyRule(rule) {
    await delay(700);
    // Dodaj/aktualizuj regułę w MOCK_AUTO_REPLY_RULES
    return rule;
  },
  
  // Główna funkcja przetwarzania (używana przez backend/cron)
  async processAutoReply() {
    // 1. Pobierz ustawienia
    const settings = await this.getAutoReplySettings();
    if (!settings.enabled) return;
    
    // 2. Pobierz reguły
    const rules = await this.getAutoReplyRules();
    const activeRules = rules.filter(r => r.enabled);
    
    // 3. Pobierz opinie bez odpowiedzi
    const reviews = await this.getReviews({ status: 'unanswered' });
    const feedbacks = await this.getInternalFeedbacks();
    const allItems = [
      ...reviews.map(r => ({ type: 'review', data: r })),
      ...feedbacks.filter(f => f.status !== 'replied').map(f => ({ type: 'feedback', data: f }))
    ];
    
    // 4. Dla każdej opinii sprawdź reguły i wyślij odpowiedź
    for (const item of allItems) {
      await this.processItemWithRules(item, activeRules, settings);
    }
  },
  
  // Pomocnicza funkcja przetwarzania pojedynczej opinii
  async processItemWithRules(item, rules, settings) {
    const { type, data } = item;
    
    // Znajdź pasującą regułę
    const matchingRule = this.findMatchingRule(data, rules);
    if (!matchingRule) return;
    
    // Sprawdź ograniczenia (limity, cooldown, etc.)
    if (!this.checkLimits(data, settings)) return;
    
    // Wybierz szablon
    const templates = await this.getTemplates();
    const availableTemplates = templates.filter(t => 
      t.auto_reply === true && 
      t.active === true &&
      this.canUseTemplate(t, this.mapToFeedbackData(data))
    );
    
    const template = this.selectTemplate(matchingRule, data, availableTemplates);
    if (!template) return;
    
    // Wypełnij zmienne
    const feedbackData = this.mapToFeedbackData(data);
    const replyContent = this.replaceTemplateVariables(template.content, feedbackData);
    
    // Sprawdź czy wymaga zatwierdzenia
    if (this.requiresApproval(data, settings, matchingRule)) {
      // Dodaj do kolejki zatwierdzeń
      await this.addToApprovalQueue(item, template, replyContent);
      return;
    }
    
    // Wyślij odpowiedź
    try {
      if (type === 'review') {
        await this.postReply(data.id, replyContent);
      } else {
        await this.replyToInternalFeedback(data.id, replyContent);
      }
      // Zapisz w historii auto-odpowiedzi
      await this.logAutoReply(data.id, template.id, 'sent', replyContent);
    } catch (e) {
      await this.logAutoReply(data.id, template.id, 'failed', replyContent, e.message);
    }
  }
}
```

### 6.2 Wykorzystanie Istniejących Szablonów

**Szablony już mają wszystko co potrzeba:**
- ✅ Pole `auto_reply` (boolean) - już istnieje
- ✅ Pole `active` (boolean) - już istnieje
- ✅ Pole `rating` - już istnieje (dopasowanie do oceny)
- ✅ System zmiennych - już działa

**Co trzeba zrobić:**
- W `AutoReplySettings.vue` użyć `ReviewsService.getTemplates()` i filtrować `auto_reply = true`
- Pokazać podgląd dostępnych szablonów dla każdej oceny (już jest wizualizacja w planie)
- Użyć istniejącego `TemplateSelector.vue` jako referencji dla wyboru szablonu w regułach

### 6.3 Rozszerzenie Struktur Danych

**Nie trzeba zmieniać istniejących struktur!** Można dodać opcjonalne pole do przechowywania informacji o auto-odpowiedzi:

```javascript
// Opcjonalne rozszerzenie (nie wymagane dla MVP)
// Można przechowywać w osobnej tabeli/historii
const MOCK_AUTO_REPLY_HISTORY = [
  {
    id: 'ar1',
    review_id: '101', // lub feedback_id
    review_type: 'review', // lub 'feedback'
    template_id: 't1',
    rule_id: 'rule1',
    content: '...',
    status: 'sent', // 'pending', 'sent', 'failed', 'cancelled'
    created_at: '2025-01-XX...',
    sent_at: '2025-01-XX...',
    approved_by: null,
    approved_at: null
  }
];
```

**Dla opinii i feedbacków:** Nie trzeba zmieniać struktury - auto-odpowiedź po prostu używa istniejącego `postReply()` / `replyToInternalFeedback()`, które już aktualizują status na `answered` / `replied`.

---

## 7. Roadmap Implementacji (Budowanie na Istniejącym)

### **Faza 1: Podstawowa Funkcjonalność** (MVP) - **Wykorzystuje 80% istniejącego kodu**
- ✅ **UI ustawień auto-odpowiedzi** (`AutoReplySettings.vue`)
  - Wykorzystuje: istniejące komponenty PrimeVue (ToggleSwitch, Select, InputText)
  - Wykorzystuje: `ReviewsService.getTemplates()` do wyświetlania dostępnych szablonów
  - Nowe: formularz konfiguracji reguł
  
- ✅ **Proste reguły** (ocena + źródło)
  - Wykorzystuje: istniejące struktury danych opinii (`rating`, `source`)
  - Wykorzystuje: istniejące szablony z `auto_reply = true`
  - Nowe: logika dopasowywania reguł do opinii
  
- ✅ **Integracja z szablonami**
  - ✅ **Już gotowe:** Szablony mają `auto_reply` flag
  - ✅ **Już gotowe:** `ReviewsService.canUseTemplate()` sprawdza dopasowanie
  - ✅ **Już gotowe:** `ReviewsService.replaceTemplateVariables()` zamienia zmienne
  - Nowe: tylko logika wyboru szablonu w regułach
  
- ✅ **Podstawowa historia** (`AutoReplyHistory.vue`)
  - Wykorzystuje: istniejące struktury opinii i feedbacków
  - Wykorzystuje: istniejące komponenty DataTable, Tag, Badge
  - Nowe: tylko filtrowanie i wyświetlanie historii auto-odpowiedzi
  
- ✅ **Testowanie reguł**
  - Wykorzystuje: `ReviewsService.getReviews()` / `getInternalFeedbacks()` - przykładowe opinie
  - Wykorzystuje: `ReviewsService.replaceTemplateVariables()` - podgląd odpowiedzi
  - Nowe: tylko UI testowania

### **Faza 2: Zaawansowane Reguły** - **Rozszerza Fazę 1**
- ⏳ Harmonogramy (opóźnienia, okna czasowe)
  - Nowe: logika sprawdzania czasu w `processItemWithRules()`
  
- ⏳ Warunki z keywords
  - Wykorzystuje: istniejące pole `content` w opiniach
  - Nowe: logika wyszukiwania słów kluczowych
  
- ⏳ Integracja z AI sentiment analysis
  - Wykorzystuje: istniejące `ReviewsService.analyzeSentiment()` (już jest!)
  - Nowe: tylko użycie wyniku analizy w regułach
  
- ⏳ Różne strategie wyboru szablonu
  - Wykorzystuje: istniejące szablony i `canUseTemplate()`
  - Nowe: tylko logika wyboru (rating_match, random, ai_best_match)

### **Faza 3: Zatwierdzanie i Kontrola** - **Rozszerza Fazę 1**
- ⏳ Kolejka zatwierdzeń
  - Wykorzystuje: istniejące `ReviewsService.postReply()` / `replyToInternalFeedback()`
  - Wykorzystuje: istniejące TinyEditor z odpowiedzi
  - Nowe: tylko kolejka i UI zatwierdzania
  
- ⏳ Edycja odpowiedzi przed wysłaniem
  - Wykorzystuje: istniejący TinyEditor z `InterceptedReviews.vue`
  - Nowe: tylko zapis edytowanej wersji
  
- ⏳ Powiadomienia email
  - Nowe: integracja z systemem powiadomień (backend)
  
- ⏳ Bulk actions
  - Wykorzystuje: istniejące wzorce z `ResponseTemplates.vue` (bulk actions)
  - Nowe: tylko akcje dla kolejki zatwierdzeń

### **Faza 4: Statystyki i Optymalizacja** - **Rozszerza `ReviewsOverview.vue`**
- ⏳ Dashboard statystyk auto-odpowiedzi
  - Wykorzystuje: istniejące komponenty statystyk w `ReviewsOverview.vue`
  - Wykorzystuje: istniejące wykresy Chart.js
  - Nowe: tylko nowe metryki i wykresy
  
- ⏳ Wykresy trendów
  - Wykorzystuje: istniejące komponenty Chart w `AIAnalysis.vue`
  - Nowe: tylko nowe dane
  
- ⏳ A/B testing szablonów
  - Nowe: logika testowania (może wykorzystać istniejące statystyki)
  
- ⏳ Sugestie optymalizacji
  - Wykorzystuje: istniejące `analyzeSentiment()`, `analyzeRepeatingElements()`
  - Nowe: tylko generowanie sugestii

### **Faza 5: Integracja z Platformami** - **Wykorzystuje istniejące metody**
- ⏳ Wysyłanie przez Google My Business API
  - Wykorzystuje: istniejące `ReviewsService.postReply()` - tylko trzeba podpiąć prawdziwe API
  
- ⏳ Wysyłanie przez Booksy API
  - Wykorzystuje: istniejące `ReviewsService.postReply()` - tylko trzeba podpiąć prawdziwe API
  
- ⏳ Wysyłanie przez Facebook API
  - Wykorzystuje: istniejące `ReviewsService.postReply()` - tylko trzeba podpiąć prawdziwe API
  
- ⏳ Obsługa błędów i retry logic
  - Wykorzystuje: istniejące try/catch w `postReply()` / `replyToInternalFeedback()`
  - Nowe: tylko logika retry i logowanie błędów

---

## 8. Metryki Sukcesu

### **Dla Klienta:**
- Response Rate wzrośnie z 60% do 95%+
- Czas spędzony na odpowiadaniu zmniejszy się o 80%
- Spójność odpowiedzi: 100% (wszystkie z szablonów)

### **Dla Produktu:**
- Adoption rate: 70%+ użytkowników włączy auto-odpowiedzi w ciągu 30 dni
- Engagement: 50%+ użytkowników tworzy własne reguły
- Retention: Użytkownicy z auto-odpowiedziami mają 2x wyższy retention

---

## 9. Ryzyka i Zabezpieczenia

### **Ryzyka:**
1. **Niewłaściwe odpowiedzi** → Rozwiązanie: Zatwierdzanie, testowanie, fallback templates
2. **Spam/Over-responding** → Rozwiązanie: Limity dzienne, cooldown periods
3. **Błędy API platform** → Rozwiązanie: Retry logic, error handling, notifications
4. **Brak zmiennych w szablonie** → Rozwiązanie: Walidacja przed wysłaniem, fallback values

### **Zabezpieczenia:**
- ✅ Walidacja wszystkich zmiennych przed wysłaniem
- ✅ Limity dzienne i cooldown periods
- ✅ Wymagane zatwierdzenie dla negatywnych opinii
- ✅ Logowanie wszystkich akcji
- ✅ Możliwość natychmiastowego wyłączenia

---

## 10. Przykładowe Scenariusze Użycia

### **Scenariusz 1: Salon Fryzjerski**
- **Cel:** Automatycznie odpowiadać na wszystkie pozytywne opinie (4-5⭐) z Google
- **Konfiguracja:**
  - Reguła: Ocena >= 4, Źródło = Google, Status = Nowa
  - Szablon: Rating Match
  - Wysyłanie: Natychmiast
  - Zatwierdzanie: Nie wymagane dla 4-5⭐
- **Rezultat:** 80% pozytywnych opinii otrzymuje odpowiedź w ciągu 1h

### **Scenariusz 2: Restauracja z Kontrolą Jakości**
- **Cel:** Odpowiadać na wszystkie opinie, ale wymagać zatwierdzenia dla negatywnych
- **Konfiguracja:**
  - Reguła 1: Ocena >= 4 → Auto-wysyłka
  - Reguła 2: Ocena <= 3 → Wymagaj zatwierdzenia
  - Szablon: AI Best Match
  - Powiadomienia email: Tak
- **Rezultat:** Wszystkie opinie otrzymują odpowiedź, negatywne są kontrolowane przed wysłaniem

### **Scenariusz 3: Sklep Online z Dużą Liczbą Opinii**
- **Cel:** Skalować odpowiedzi bez zwiększania zespołu
- **Konfiguracja:**
  - Reguła: Wszystkie opinie 4-5⭐, wszystkie źródła
  - Szablon: Random (dla różnorodności)
  - Limit dzienny: 100 odpowiedzi
  - Harmonogram: Tylko w godzinach 9:00-17:00
- **Rezultat:** 1000+ opinii/miesiąc obsłużonych automatycznie

---

## 11. Wnioski i Następne Kroki

### **Co Mamy Gotowe (Nie Trzeba Robić):**
1. ✅ **System Szablonów** - pełny CRUD, `auto_reply` flag, zmienne, TinyEditor
2. ✅ **System Odpowiedzi** - `postReply()`, `replyToInternalFeedback()`, zamiana zmiennych
3. ✅ **Struktury Danych** - opinie, feedbacki, szablony - wszystko gotowe
4. ✅ **UI Komponenty** - DataTable, TinyEditor, ToggleSwitch, Drawer, Dialog - wszystko gotowe
5. ✅ **Dashboard** - `ReviewsDashboard`, `ReviewsOverview` - struktura gotowa

### **Co Trzeba Zbudować (Nowe Komponenty):**
1. **`AutoReplySettings.vue`** - formularz konfiguracji (używa istniejących komponentów)
2. **`AutoReplyHistory.vue`** - lista historii (używa istniejących DataTable, Tag)
3. **Rozszerzenie `ReviewsService.js`** - nowe metody przetwarzania (używa istniejących metod)
4. **Integracja w `ReviewsDashboard.vue`** - nowa zakładka (używa istniejącej struktury)
5. **Rozszerzenie `ReviewsOverview.vue`** - karta statystyk (używa istniejących komponentów)

### **Priorytetowe Elementy do Implementacji (MVP):**
1. **`AutoReplySettings.vue`** - UI konfiguracji (2-3 dni)
   - Wykorzystuje: istniejące komponenty PrimeVue
   - Wykorzystuje: `ReviewsService.getTemplates()` do wyświetlania szablonów
   - Nowe: tylko formularz reguł i ustawień
   
2. **Rozszerzenie `ReviewsService.js`** - logika przetwarzania (1-2 dni)
   - Wykorzystuje: `getTemplates()`, `canUseTemplate()`, `replaceTemplateVariables()`, `postReply()`
   - Nowe: tylko `processAutoReply()`, `processItemWithRules()`, `findMatchingRule()`
   
3. **`AutoReplyHistory.vue`** - historia (1 dzień)
   - Wykorzystuje: istniejące DataTable, Tag, Badge
   - Nowe: tylko filtrowanie i wyświetlanie historii
   
4. **Integracja w Dashboard** - nowa zakładka (0.5 dnia)
   - Wykorzystuje: istniejącą strukturę `ReviewsDashboard.vue`
   - Nowe: tylko dodanie zakładki i routingu
   
5. **Testowanie reguł** - UI testowania (1 dzień)
   - Wykorzystuje: `getReviews()`, `replaceTemplateVariables()`
   - Nowe: tylko UI testowania

**Szacowany czas MVP: 5-7 dni** (dzięki wykorzystaniu istniejącego kodu!)

---

## 12. Konkretne Przykłady Wykorzystania Istniejącego Kodu

### **Przykład 1: Pobieranie Szablonów dla Auto-Odpowiedzi**

```javascript
// W AutoReplySettings.vue - wykorzystuje istniejący kod
import { ReviewsService } from '../../../services/ReviewsService';

const templates = ref([]);
const autoReplyTemplates = computed(() => {
  // Wykorzystuje istniejące getTemplates()
  return templates.value.filter(t => 
    t.auto_reply === true && 
    t.active === true
  );
});

const loadTemplates = async () => {
  // Używa istniejącej metody
  templates.value = await ReviewsService.getTemplates();
};
```

### **Przykład 2: Sprawdzanie Czy Szablon Pasuje**

```javascript
// W logice przetwarzania auto-odpowiedzi
const feedbackData = {
  name: review.author_name?.split(' ')[0] || '',
  surname: review.author_name?.split(' ').slice(1).join(' ') || '',
  rating: review.rating,
  // ... inne pola
};

// Wykorzystuje istniejącą metodę
const availableTemplates = autoReplyTemplates.value.filter(template => 
  ReviewsService.canUseTemplate(template, feedbackData)
);
```

### **Przykład 3: Zamiana Zmiennych w Szablonie**

```javascript
// W logice wysyłania auto-odpowiedzi
const selectedTemplate = availableTemplates[0];

// Wykorzystuje istniejącą metodę
const replyContent = ReviewsService.replaceTemplateVariables(
  selectedTemplate.content, 
  feedbackData
);

// Wykorzystuje istniejącą metodę wysyłania
await ReviewsService.postReply(review.id, replyContent);
```

### **Przykład 4: Wyświetlanie Szablonów w UI**

```vue
<!-- W AutoReplySettings.vue - wykorzystuje istniejące komponenty -->
<template>
  <div class="card">
    <DataTable :value="autoReplyTemplates" class="text-sm">
      <!-- Wykorzystuje istniejący sposób wyświetlania -->
      <Column field="name" header="Nazwa" />
      <Column field="rating" header="Ocena">
        <template #body="{ data }">
          <Rating :modelValue="data.rating" :readonly="true" />
        </template>
      </Column>
      <Column field="content" header="Treść">
        <template #body="{ data }">
          <!-- Wykorzystuje istniejący TinyEditor -->
          <TinyEditor 
            :modelValue="data.content"
            :mentions="mentionsMap"
            :editable="false"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
```

### **Przykład 5: Testowanie Reguły na Przykładowej Opinii**

```javascript
// W AutoReplySettings.vue - wykorzystuje istniejące dane
const testRule = async (rule, reviewId) => {
  // Wykorzystuje istniejącą metodę pobierania opinii
  const reviews = await ReviewsService.getReviews();
  const testReview = reviews.find(r => r.id === reviewId);
  
  if (!testReview) return;
  
  // Mapowanie do formatu feedback (istniejąca logika)
  const feedbackData = {
    name: testReview.author_name?.split(' ')[0] || '',
    surname: testReview.author_name?.split(' ').slice(1).join(' ') || '',
    rating: testReview.rating,
    source: testReview.source,
    // ...
  };
  
  // Sprawdź czy reguła pasuje (nowa logika, ale używa istniejących danych)
  const matches = checkRuleConditions(rule, feedbackData);
  
  if (matches) {
    // Znajdź szablon (wykorzystuje istniejące metody)
    const templates = await ReviewsService.getTemplates();
    const template = findTemplateForRule(rule, templates, feedbackData);
    
    if (template) {
      // Podgląd odpowiedzi (wykorzystuje istniejącą metodę)
      const preview = ReviewsService.replaceTemplateVariables(
        template.content,
        feedbackData
      );
      return { matches: true, template, preview };
    }
  }
  
  return { matches: false };
};
```

### **Przykład 6: Integracja z Istniejącym Dashboardem**

```vue
<!-- W ReviewsDashboard.vue - tylko dodanie nowej zakładki -->
<script setup>
const tabs = [
  { id: 'overview', label: 'Przegląd', icon: 'pi pi-home', routeName: 'reviews-overview' },
  { id: 'reviews', label: 'Opinie', icon: 'pi pi-comments', routeName: 'reviews-list' },
  { id: 'acquisition', label: 'Pozyskiwanie Opinii', icon: 'pi pi-megaphone', routeName: 'reviews-acquisition' },
  { id: 'intercepted', label: 'Przechwycone Opinie', icon: 'pi pi-inbox', routeName: 'reviews-intercepted' },
  { id: 'templates', label: 'Szablony Odpowiedzi', icon: 'pi pi-list', routeName: 'reviews-templates' },
  // NOWA ZAKŁADKA - wykorzystuje istniejącą strukturę
  { id: 'auto-reply', label: 'Auto-Odpowiedzi', icon: 'pi pi-sparkles', routeName: 'reviews-auto-reply' }
];
</script>
```

### **Przykład 7: Wyświetlanie Historii Auto-Odpowiedzi**

```vue
<!-- W AutoReplyHistory.vue - wykorzystuje istniejące komponenty -->
<template>
  <div class="card">
    <!-- Wykorzystuje istniejący DataTable z InterceptedReviews.vue -->
    <DataTable :value="autoReplyHistory" class="text-sm">
      <Column field="review_id" header="ID Opinii" />
      <Column field="template_name" header="Szablon" />
      <!-- Wykorzystuje istniejący sposób wyświetlania statusów -->
      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag 
            :value="getStatusLabel(data.status)" 
            :severity="getStatusSeverity(data.status)" 
          />
        </template>
      </Column>
      <Column field="created_at" header="Data">
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
// Wykorzystuje istniejące funkcje pomocnicze
const getStatusLabel = (status) => {
  // Taka sama logika jak w InterceptedReviews.vue
  switch (status) {
    case 'pending': return 'Oczekuje';
    case 'sent': return 'Wysłano';
    case 'failed': return 'Błąd';
    default: return status;
  }
};

const formatDate = (value) => {
  // Taka sama logika jak w InterceptedReviews.vue
  return new Date(value).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
```

### **Przykład 8: Główna Funkcja Przetwarzania (Backend/Cron)**

```javascript
// W ReviewsService.js - rozszerzenie istniejącego obiektu
async processAutoReply() {
  // 1. Pobierz ustawienia (nowa metoda, ale prosta)
  const settings = await this.getAutoReplySettings();
  if (!settings.enabled) return;
  
  // 2. Pobierz reguły (nowa metoda, ale prosta)
  const rules = await this.getAutoReplyRules();
  const activeRules = rules.filter(r => r.enabled);
  
  // 3. Wykorzystuje istniejące metody pobierania
  const reviews = await this.getReviews({ status: 'unanswered' });
  const feedbacks = await this.getInternalFeedbacks();
  
  // 4. Dla każdej opinii - wykorzystuje istniejące metody
  for (const review of reviews) {
    const matchingRule = this.findMatchingRule(review, activeRules);
    if (!matchingRule) continue;
    
    // Wykorzystuje istniejące metody
    const templates = await this.getTemplates();
    const template = this.selectTemplate(matchingRule, review, templates);
    if (!template) continue;
    
    // Wykorzystuje istniejącą metodę zamiany zmiennych
    const feedbackData = this.mapReviewToFeedbackData(review);
    const replyContent = this.replaceTemplateVariables(template.content, feedbackData);
    
    // Wykorzystuje istniejącą metodę wysyłania
    try {
      await this.postReply(review.id, replyContent);
      await this.logAutoReply(review.id, template.id, 'sent', replyContent);
    } catch (e) {
      await this.logAutoReply(review.id, template.id, 'failed', replyContent, e.message);
    }
  }
}
```

---

## 13. Podsumowanie - Co Wykorzystujemy

### **Komponenty Vue (100% gotowe):**
- ✅ `DataTable`, `Column`, `Button`, `ToggleSwitch`, `Tag`, `Badge`
- ✅ `TinyEditor` z obsługą zmiennych
- ✅ `Drawer`, `Dialog`, `Rating`, `Select`, `InputText`
- ✅ `ReviewsDashboard`, `ReviewsOverview` - struktura gotowa

### **Metody ReviewsService (100% gotowe):**
- ✅ `getTemplates()` - pobieranie szablonów
- ✅ `saveTemplate()` - zapisywanie szablonów
- ✅ `canUseTemplate()` - sprawdzanie dopasowania
- ✅ `replaceTemplateVariables()` - zamiana zmiennych
- ✅ `postReply()` - wysyłanie odpowiedzi na opinie
- ✅ `replyToInternalFeedback()` - wysyłanie odpowiedzi na feedbacki
- ✅ `getReviews()` - pobieranie opinii
- ✅ `getInternalFeedbacks()` - pobieranie feedbacków
- ✅ `analyzeSentiment()` - analiza sentymentu (dla zaawansowanych reguł)

### **Struktury Danych (100% gotowe):**
- ✅ Szablony: `id`, `name`, `content`, `rating`, `active`, `auto_reply`
- ✅ Opinie: `id`, `source`, `author_name`, `rating`, `content`, `date`, `status`
- ✅ Feedbacki: `id`, `name`, `surname`, `email`, `phone`, `rating`, `status`

### **Co Trzeba Zbudować (Nowe):**
1. `AutoReplySettings.vue` - formularz konfiguracji (używa istniejących komponentów)
2. `AutoReplyHistory.vue` - lista historii (używa istniejących komponentów)
3. Rozszerzenie `ReviewsService.js` - nowe metody przetwarzania (używa istniejących metod)
4. Routing - dodanie nowej zakładki (używa istniejącej struktury)
5. Mock data - `MOCK_AUTO_REPLY_SETTINGS`, `MOCK_AUTO_REPLY_RULES`, `MOCK_AUTO_REPLY_HISTORY`

**Wniosek: 80% kodu już istnieje, trzeba tylko zbudować warstwę konfiguracji i logikę przetwarzania!**

### **Atrakcyjność dla Klienta:**
- 🎯 **Jasna wartość:** "Oszczędź 5h/miesiąc, zwiększ Response Rate do 95%"
- 🎨 **Łatwa konfiguracja:** Wizualne reguły, drag-and-drop (w przyszłości)
- 🔒 **Bezpieczeństwo:** Zatwierdzanie, limity, zabezpieczenia
- 📊 **Transparentność:** Historia, statystyki, logi
- 🚀 **Skalowalność:** Działa dla 10 i 1000 opinii/miesiąc

---

**Dokument utworzony:** 2025-01-XX  
**Ostatnia aktualizacja:** 2025-01-XX  
**Status:** Plan do implementacji

