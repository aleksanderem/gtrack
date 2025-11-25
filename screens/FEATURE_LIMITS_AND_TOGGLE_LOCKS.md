# Dokumentacja: Limity Funkcji i Blokowanie Toggle Switchów

## Data: 2024-11-25

## Przegląd

Ten dokument opisuje implementację systemu limitów funkcji opartych na planach subskrypcyjnych oraz mechanizm blokowania toggle switchów, gdy funkcje są niedostępne w danym planie.

## Główne Zmiany

### 1. System Limitów Funkcji

#### 1.1. Ograniczenie Szablonów Odpowiedzi

**Lokalizacja:** `src/components/gtrack/reviews/ResponseTemplates.vue`

**Funkcjonalność:**
- Sprawdzanie limitu aktywnych szablonów na podstawie planu użytkownika
- Automatyczne wyłączanie nadmiarowych szablonów przy przekroczeniu limitu
- Wyświetlanie komunikatu o przekroczeniu limitu nad tabelą
- Blokowanie toggle switchów "Aktywny" gdy limit jest osiągnięty
- Wyświetlanie ikony kłódki i tooltipa przy zablokowanych toggle switchach

**Kluczowe funkcje:**
- `isActiveToggleLocked(template)` - sprawdza czy toggle aktywności jest zablokowany
- `getActiveToggleLockReason(template)` - zwraca komunikat o przyczynie blokady
- `enforceTemplateLimit()` - wymusza limit poprzez wyłączenie nadmiarowych szablonów
- `isTemplateDisabled(template)` - sprawdza czy szablon jest wyłączony z powodu limitu

**Limity:**
- Basic: 3 aktywne szablony
- Professional: 5 aktywnych szablonów
- Enterprise: nieograniczone

#### 1.2. Ograniczenie Szablonów w TemplateSelector

**Lokalizacja:** `src/components/gtrack/reviews/TemplateSelector.vue`

**Funkcjonalność:**
- Filtrowanie tylko aktywnych szablonów
- Sortowanie po ID dla spójności
- Ograniczenie do pierwszych N szablonów zgodnie z limitem pakietu
- Oznaczanie szablonów poza limitem jako "Limit pakietu"
- Blokowanie wyboru szablonów poza limitem

**Kluczowe funkcje:**
- `filteredTemplates` - computed property filtrujące i ograniczające szablony
- `canUseTemplate(template)` - sprawdza czy szablon może być użyty

#### 1.3. Ograniczenie Reguł Auto-Odpowiedzi

**Lokalizacja:** `src/components/gtrack/reviews/AutoReplySettings.vue`

**Funkcjonalność:**
- Sprawdzanie limitu reguł przed dodaniem nowej reguły
- Wyświetlanie komunikatu o limicie
- Blokowanie przycisku "Dodaj regułę" gdy limit jest osiągnięty

**Limity:**
- Basic: 2 reguły
- Professional: 5 reguł
- Enterprise: nieograniczone

### 2. Blokowanie Toggle Switchów

#### 2.1. Toggle Switchy w ResponseTemplates.vue

**Toggle "Aktywny":**
- Wymusza wartość `false` gdy limit jest osiągnięty (`isActiveToggleLocked`)
- Wyłączony (`disabled`) gdy limit jest osiągnięty
- Wyświetla ikonę kłódki i tooltip z informacją o limicie

**Toggle "Auto-odpowiedź":**
- Wymusza wartość `false` gdy funkcja auto-odpowiedzi jest niedostępna (`!isAutoReplyAvailable`)
- Wyłączony (`disabled`) gdy funkcja jest niedostępna
- Wyświetla ikonę kłódki i tooltip z informacją o braku dostępu
- Automatycznie wyłącza wszystkie auto-odpowiedzi w szablonach gdy funkcja jest niedostępna

**Lokalizacje toggle switchów:**
1. Tabela szablonów (kolumna "Aktywny" i "Auto-odpowiedź")
2. Drawer ze szczegółami szablonu
3. Dialog tworzenia nowego szablonu
4. Bulk actions (zmiana aktywności i auto-odpowiedzi)

**Funkcja `saveTemplateToggle`:**
- Wymusza `false` w bazie danych gdy toggle jest zablokowany
- Wyświetla komunikaty ostrzegawcze gdy próba włączenia jest zablokowana
- Automatycznie wyłącza auto-odpowiedzi gdy funkcja jest niedostępna

#### 2.2. Toggle Switchy w AutoReplySettings.vue

**Toggle dla reguł auto-odpowiedzi:**
- Wymusza wartość `false` gdy funkcja auto-odpowiedzi jest niedostępna
- Wyłączony (`disabled`) gdy funkcja jest niedostępna
- Wyświetla ikonę kłódki i tooltip z informacją o braku dostępu

**Funkcja `saveRule`:**
- Wymusza `false` w bazie danych gdy funkcja jest niedostępna
- Wyświetla komunikaty ostrzegawcze gdy próba włączenia jest zablokowana

**Funkcja `loadRules`:**
- Automatycznie wyłącza wszystkie włączone reguły gdy funkcja jest niedostępna
- Wyświetla komunikat informujący o wyłączeniu reguł

### 3. Komponenty i Composables

#### 3.1. useFeatureLimits.js

**Lokalizacja:** `src/composables/useFeatureLimits.js`

**Funkcjonalność:**
- Centralne zarządzanie limitami funkcji
- Sprawdzanie limitów na podstawie planu użytkownika
- Obsługa lokalnych nadpisów z debug bara

**Kluczowe funkcje:**
- `getCurrentLimit(featureKey, limitKey)` - pobiera aktualny limit dla funkcji
- `isLimitExceeded(featureKey, limitKey, currentCount)` - sprawdza czy limit jest przekroczony
- `getLimitMessage(featureKey, limitKey, currentCount)` - zwraca komunikat o limicie

#### 3.2. useFeatureFlags.js

**Lokalizacja:** `src/composables/useFeatureFlags.js`

**Funkcjonalność:**
- Centralne zarządzanie flagami funkcji
- Sprawdzanie dostępności funkcji na podstawie planu
- Obsługa hierarchii planów (Basic < Professional < Enterprise)

**Kluczowe funkcje:**
- `isFeatureAvailable(feature)` - sprawdza czy funkcja jest dostępna w planie
- `isFeatureLocked(feature)` - sprawdza czy funkcja jest zablokowana
- `navigateToFeatureSettings(feature)` - nawiguje do ustawień funkcji

#### 3.3. featureHierarchy.js

**Lokalizacja:** `src/composables/featureHierarchy.js`

**Funkcjonalność:**
- Definiuje hierarchiczną strukturę funkcji
- Zawiera limity dla każdego planu
- Eksportuje funkcje pomocnicze do konwersji i sprawdzania

**Struktura:**
```javascript
FEATURE_HIERARCHY = {
  templates: {
    requiredPlan: 'basic',
    limits: {
      maxTemplates: {
        basic: 3,
        professional: 5,
        enterprise: null // nieograniczone
      }
    }
  },
  // ...
}
```

### 4. Komunikacja z Użytkownikiem

#### 4.1. Komunikaty o Limitach

**Komunikaty nad tabelą:**
- Wyświetlane gdy limit jest przekroczony
- Informują o liczbie nadmiarowych elementów
- Zawierają link do zwiększenia pakietu

**Komunikaty w Toast:**
- Ostrzeżenia przy próbie przekroczenia limitu
- Informacje o automatycznym wyłączeniu elementów
- Potwierdzenia zapisania zmian

#### 4.2. Wizualne Wskaźniki

**Ikony kłódki:**
- Wyświetlane przy zablokowanych toggle switchach
- Tooltip z informacją o przyczynie blokady

**Tag "Wyłączona":**
- Wyświetlany przy wyłączonych regułach
- Wyświetlany gdy funkcja jest niedostępna

**Wyszarzenie:**
- Szablony poza limitem są wyszarzone
- Toggle switchy są wyszarzone gdy są zablokowane

### 5. Integracja z Debug Barem

**Lokalizacja:** `src/components/gtrack/debug/FeatureDebugBar.vue`

**Funkcjonalność:**
- Pozwala na zmianę planu użytkownika
- Pozwala na zmianę limitów funkcji
- Pozwala na przypisanie funkcji do różnych planów
- Zapisuje zmiany w localStorage

**Użycie:**
- Otwieranie: `Ctrl+Shift+D` lub przycisk w lewym dolnym rogu
- Zmiana planu: SelectButton w nagłówku
- Zmiana limitów: InputNumber w TreeTable
- Zapis: Przycisk "Zapisz" w nagłówku

### 6. Automatyczne Wyłączanie Funkcji

#### 6.1. Szablony Odpowiedzi

**Gdy funkcja auto-odpowiedzi jest niedostępna:**
- Wszystkie szablony z włączoną auto-odpowiedzią są automatycznie wyłączane
- Wyświetlany jest komunikat informujący o wyłączeniu
- Toggle switchy są wymuszone na `false`

**Gdy limit szablonów jest przekroczony:**
- Nadmiarowe szablony są automatycznie wyłączane
- Wyświetlany jest komunikat informujący o wyłączeniu
- Szablony są sortowane po ID i pierwsze N pozostaje aktywnych

#### 6.2. Reguły Auto-Odpowiedzi

**Gdy funkcja auto-odpowiedzi jest niedostępna:**
- Wszystkie włączone reguły są automatycznie wyłączane
- Wyświetlany jest komunikat informujący o wyłączeniu
- Toggle switchy są wymuszone na `false`

## Pliki Zmodyfikowane

### Komponenty Vue
- `src/components/gtrack/reviews/ResponseTemplates.vue`
- `src/components/gtrack/reviews/TemplateSelector.vue`
- `src/components/gtrack/reviews/AutoReplySettings.vue`
- `src/components/gtrack/reviews/FeatureCard.vue` (nowy)

### Composables
- `src/composables/useFeatureLimits.js` (nowy)
- `src/composables/useFeatureFlags.js` (nowy)
- `src/composables/featureHierarchy.js` (nowy)

### Stores
- `src/stores/featureSettings.js` (nowy)

### Debug
- `src/components/gtrack/debug/FeatureDebugBar.vue` (nowy)

## Testowanie

### Scenariusze Testowe

1. **Limit Szablonów:**
   - Utworzenie więcej szablonów niż limit
   - Sprawdzenie czy nadmiarowe są wyłączone
   - Sprawdzenie czy toggle switchy są zablokowane

2. **Funkcja Auto-Odpowiedzi Niedostępna:**
   - Zmiana planu na Basic (bez auto-odpowiedzi)
   - Sprawdzenie czy toggle switchy są zablokowane
   - Sprawdzenie czy istniejące auto-odpowiedzi są wyłączone

3. **TemplateSelector:**
   - Sprawdzenie czy tylko pierwsze N szablonów jest dostępnych
   - Sprawdzenie czy szablony poza limitem są oznaczone jako "Limit pakietu"

4. **Reguły Auto-Odpowiedzi:**
   - Sprawdzenie czy limit reguł jest sprawdzany
   - Sprawdzenie czy toggle switchy są zablokowane gdy funkcja jest niedostępna

## Uwagi Techniczne

1. **Reaktywność:**
   - Wszystkie limity są computed properties
   - Zmiany w planie automatycznie aktualizują limity
   - Toggle switchy reagują na zmiany dostępności funkcji

2. **Persystencja:**
   - Limity są sprawdzane przy każdym zapisie
   - Automatyczne wyłączanie jest wykonywane przy ładowaniu danych
   - Zmiany są zapisywane w bazie danych

3. **Performance:**
   - Limity są obliczane tylko gdy potrzebne
   - Użycie computed properties dla optymalizacji
   - Debounce dla automatycznego zapisywania

## Przyszłe Ulepszenia

1. **Dodatkowe Limity:**
   - Limit reguł auto-odpowiedzi per źródło
   - Limit szablonów per typ (pozytywne/negatywne)
   - Limit historii auto-odpowiedzi

2. **Ulepszona Komunikacja:**
   - Więcej szczegółowych komunikatów o limitach
   - Wizualne wskaźniki zbliżania się do limitu
   - Proaktywne ostrzeżenia przed osiągnięciem limitu

3. **Analityka:**
   - Śledzenie użycia limitów
   - Raporty o przekroczeniach limitów
   - Sugestie optymalizacji użycia

## Zależności

- Vue 3 Composition API
- PrimeVue Components (ToggleSwitch, Tag, Tooltip)
- Vue Router (nawigacja do ustawień)
- LocalStorage (debug bar overrides)

## Autor

Implementacja: AI Assistant
Data: 2024-11-25

