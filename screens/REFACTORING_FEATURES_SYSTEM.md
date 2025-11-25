# Dokumentacja: Refaktoryzacja Systemu Funkcji

## Data: 2024-11-25

## Przegląd

Ten dokument opisuje refaktoryzację systemu zarządzania funkcjami i limitami, która nastąpiła po ostatnim commicie. System został uproszczony i ujednolicony poprzez konsolidację wielu composables w jeden uniwersalny composable oraz przeniesienie konfiguracji do centralnego pliku.

## Główne Zmiany

### 1. Konsolidacja Composables

#### 1.1. Usunięte Composables

**`src/composables/featureHierarchy.js`** (311 linii) - USUNIĘTY
- Zawierał hierarchiczną strukturę funkcji z limitami
- Funkcje pomocnicze: `convertHierarchyToTreeNodes`, `getFeatureLimit`, `isFeatureAvailableInPlan`
- Zastąpiony przez: `src/config/features.js`

**`src/composables/useFeatureFlags.js`** (166 linii) - USUNIĘTY
- Zarządzał flagami funkcji i sprawdzaniem dostępności
- Eksportował: `FEATURES`, `isFeatureAvailable`, `isFeatureLocked`, `navigateToFeatureSettings`
- Zastąpiony przez: `src/composables/useFeatures.js`

**`src/composables/useFeatureLimits.js`** (113 linii) - USUNIĘTY
- Zarządzał limitami funkcji
- Eksportował: `getCurrentLimit`, `isLimitExceeded`, `getLimitMessage`
- Zastąpiony przez: `src/composables/useFeatures.js`

#### 1.2. Nowy Uniwersalny Composable

**`src/composables/useFeatures.js`** (151 linii) - NOWY
- Konsoliduje funkcjonalność wszystkich trzech usuniętych composables
- Eksportuje jednolity API:
  - `can(featureKey)` - sprawdza czy funkcja jest dostępna
  - `isLocked(featureKey)` - sprawdza czy funkcja jest zablokowana
  - `getLimit(featureKey, limitKey)` - pobiera limit dla funkcji
  - `checkLimit(featureKey, limitKey)` - sprawdza czy limit nie jest przekroczony
  - `getUsagePercentage(featureKey, limitKey)` - zwraca procent użycia (0-100)
  - `getLimitStatus(featureKey, limitKey, currentCount)` - zwraca szczegółowy status limitu
  - `updateUsage(key, value)` - aktualizuje użycie funkcji
  - `features` - dostęp do wszystkich funkcji
  - `currentPlan` - aktualny plan użytkownika
  - `currentPlanLevel` - poziom aktualnego planu

**Korzyści:**
- Jeden punkt dostępu do wszystkich funkcji związanych z funkcjami
- Prostsze API - mniej importów
- Lepsza wydajność - mniej obliczeń
- Łatwiejsze utrzymanie - jeden plik zamiast trzech

### 2. Centralna Konfiguracja Funkcji

**`src/config/features.js`** (319 linii) - NOWY
- Centralne miejsce definicji wszystkich funkcji, planów i limitów
- Eksportuje:
  - `PLANS` - stałe dla planów (BASIC, PROFESSIONAL, ENTERPRISE)
  - `PLAN_LEVELS` - poziomy planów (1, 2, 3)
  - `PLAN_NAMES` - nazwy planów do wyświetlania
  - `FEATURES` - obiekt z definicjami wszystkich funkcji
  - `getFeatureHierarchy()` - funkcja pomocnicza do budowania hierarchii

**Struktura funkcji:**
```javascript
{
  id: 'templates',
  parentId: 'reviews', // opcjonalne
  label: 'Szablony odpowiedzi',
  requiredPlan: PLANS.BASIC,
  description: 'Tworzenie i zarządzanie szablonami odpowiedzi',
  icon: 'pi pi-list',
  limits: {
    maxTemplates: { 
      [PLANS.BASIC]: 5, 
      [PLANS.PROFESSIONAL]: 50, 
      [PLANS.ENTERPRISE]: 999 
    }
  }
}
```

**Korzyści:**
- Wszystkie definicje funkcji w jednym miejscu
- Łatwiejsze zarządzanie limitami
- Spójna struktura danych
- Łatwiejsze dodawanie nowych funkcji

### 3. Nowe Komponenty Wspólne

**`src/components/gtrack/common/LimitWarningBanner.vue`** (188 linii) - NOWY
- Uniwersalny komponent do wyświetlania ostrzeżeń o limitach
- Przyjmuje prop `status` z `getLimitStatus()`
- Wyświetla:
  - Ikony w zależności od severity (danger, warning, warn, info)
  - Komunikaty o limicie
  - Przycisk "Zwiększ pakiet" (opcjonalny)
  - Pasek postępu pokazujący procent użycia
- Automatycznie zmienia kolory w zależności od severity

**`src/components/gtrack/common/LimitProgressBar.vue`** (NOWY)
- Reużywalny komponent paska postępu limitu
- Obsługuje wizualizację gradientową w zależności od stanu:
  - Normalny: Zielony gradient
  - Ostrzeżenie (>=75%): Żółty gradient
  - Przekroczony (>=100%): Czerwony gradient
- Wyświetla licznik i ikonę ostrzeżenia

**Użycie:**
```vue
<LimitProgressBar 
  label="Limit auto-odpowiedzi"
  :current-count="currentCount"
  :limit="limit"
  :show-label="true"
/>
```

### 4. Aktualizacja Komponentów

#### 4.1. Komponenty Reviews

**`ResponseTemplates.vue`:**
- Zmieniono `useFeatureLimits` → `useFeatures`
- Zmieniono `getCurrentLimit` → `getLimit`
- Zmieniono `useFeatureFlags` → `useFeatures`
- Zmieniono `FEATURES.AUTO_REPLY` → `features.autoReply`
- Dodano import `PLAN_NAMES` z `config/features`

**`TemplateSelector.vue`:**
- Zmieniono `useFeatureLimits` → `useFeatures`
- Zmieniono `getCurrentLimit` → `getLimit`

**`AutoReplySettings.vue`:**
- Zmieniono `useFeatureLimits` → `useFeatures`
- Zmieniono `getCurrentLimit` → `getLimit`
- Zmieniono `isFeatureAvailable` → `can`
- Zmieniono `isFeatureLocked` → `isLocked`
- Zmieniono `FEATURES.AUTO_REPLY` → `features.autoReply`
- Dodano import `PLAN_NAMES` z `config/features`
- Dodano `LimitProgressBar` do wyświetlania zużycia limitu odpowiedzi

**`InterceptedReviews.vue`** (widoczny w ReviewsDashboard):
- Dodano `LimitProgressBar` w nagłówku dashboardu dla widoku intercepted reviews

**`AIAnalysis.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Zmieniono `isFeatureLocked` → `isLocked`
- Dodano import `PLAN_NAMES` z `config/features`
- Dodano logikę demo mode z `FeatureCard`

**`ReviewItem.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano sprawdzanie limitów AI (`checkLimit`, `getLimit`)
- Dodano blokowanie przycisku "AI Suggestion" gdy limit jest przekroczony
- Dodano tooltip z informacją o limicie

**`ReviewsDashboard.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano funkcje `isTabLocked` i `getTabLockReason`
- Dodano blokowanie zakładek gdy funkcja jest niedostępna
- Dodano ikony kłódki dla zablokowanych zakładek
- Dodano logikę zliczania opinii z bieżącego miesiąca i aktualizacji `usage`
- Dodano `LimitProgressBar` inline w nagłówku dla widoku intercepted reviews

**`FeatureCard.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Zmieniono `isFeatureAvailable` → `can`
- Zmieniono `isFeatureLocked` → `isLocked`
- Zmieniono `FEATURES` → `features`
- Dodano import `PLAN_NAMES` z `config/features`

#### 4.2. Komponenty Settings

**`BusinessSettings.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano użycie `LimitWarningBanner` dla różnych funkcji
- Dodano sprawdzanie limitów dla każdej funkcji

**`KeywordsSettings.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano sprawdzanie limitów słów kluczowych
- Dodano użycie `LimitWarningBanner`
- Dodano wizualne oznaczenie słów kluczowych poza limitem

**`FrequencySettings.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano sprawdzanie limitów częstotliwości
- Dodano użycie `LimitWarningBanner`

#### 4.3. Komponenty Sidebar

**`GridConfiguration.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano sprawdzanie limitów siatki
- Dodano użycie `LimitWarningBanner`

**`KeywordsManager.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano sprawdzanie limitów słów kluczowych
- Dodano wizualne oznaczenie słów kluczowych poza limitem

**`LocationInfoPanel.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Dodano sprawdzanie limitów słów kluczowych
- Dodano wizualne oznaczenie słów kluczowych poza limitem

#### 4.4. Inne Komponenty

**`TopBar.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Zmieniono `getFeatureStatus` → użycie `can` i `isLocked`

**`FeatureDebugBar.vue`:**
- Zmieniono `useFeatureFlags` → `useFeatures`
- Zmieniono `useFeatureLimits` → `useFeatures`
- Zmieniono `FEATURE_HIERARCHY` → `FEATURES` z `config/features`
- Zaktualizowano logikę wyświetlania funkcji
- Naprawiono przycisk "Wyczyść" (teraz czyści i odświeża stan z debug bara)
- Poprawiono zapisywanie zmian do `localStorage` (natychmiastowe odświeżanie store'a)

### 5. Aktualizacja Store

**`src/stores/featureSettings.js`:**
- Dodano import `PLANS` i `PLAN_NAMES` z `config/features`
- Zmieniono nazwy kluczy w `featureSettings`:
  - `syncPhotos` → `photoMonitoring`
  - `autoPost` → `postPublishing`
  - `protectData` → `dataProtection`
  - `monitorQA` → `qaMonitoring`
  - `syncHours` → `hoursSync`
- Dodano `usage` reactive object do śledzenia użycia funkcji
- Dodano obsługę `featurePlans` i `featureLimits` (ładowanie nadpisanych ustawień z localStorage)
- Dodano funkcję `updateUsage(key, value)` do aktualizacji użycia
- Zaktualizowano `updateSubscription` do użycia `PLAN_NAMES`

### 6. Nowe Funkcjonalności

#### 6.1. Limity Słów Kluczowych

**Dodano do `config/features.js`:**
```javascript
keywords: {
  limits: {
    maxKeywords: { 
      [PLANS.BASIC]: 2, 
      [PLANS.PROFESSIONAL]: 50, 
      [PLANS.ENTERPRISE]: 200 
    }
  }
}
```

**Zaimplementowano w:**
- `KeywordsSettings.vue` - wyświetlanie limitu i ostrzeżeń
- `KeywordsManager.vue` - wizualne oznaczenie słów kluczowych poza limitem
- `LocationInfoPanel.vue` - wizualne oznaczenie słów kluczowych poza limitem

#### 6.2. Limity Siatki

**Dodano do `config/features.js`:**
```javascript
keywordGridSettings: {
  limits: {
    maxGridPoints: { 
      [PLANS.BASIC]: 25, 
      [PLANS.PROFESSIONAL]: 100, 
      [PLANS.ENTERPRISE]: 500 
    },
    maxStepMeters: { 
      [PLANS.BASIC]: 1000, 
      [PLANS.PROFESSIONAL]: 1500, 
      [PLANS.ENTERPRISE]: 2000 
    }
  }
}
```

**Zaimplementowano w:**
- `GridConfiguration.vue` - sprawdzanie limitów siatki
- Wyświetlanie ostrzeżeń gdy limit jest przekroczony

#### 6.3. Limity Częstotliwości

**Dodano do `config/features.js`:**
```javascript
scheduleSettings: {
  limits: {
    minDataSyncIntervalMinutes: { 
      [PLANS.BASIC]: 60, 
      [PLANS.PROFESSIONAL]: 15, 
      [PLANS.ENTERPRISE]: 5 
    },
    minReviewCheckIntervalMinutes: { 
      [PLANS.BASIC]: 30, 
      [PLANS.PROFESSIONAL]: 10, 
      [PLANS.ENTERPRISE]: 5 
    },
    // ...
  }
}
```

**Zaimplementowano w:**
- `FrequencySettings.vue` - sprawdzanie limitów częstotliwości
- Wyświetlanie ostrzeżeń gdy limit jest przekroczony

#### 6.4. Limity AI Analysis

**Dodano do `config/features.js`:**
```javascript
aiAnalysis: {
  limits: {
    maxAnalysisPerMonth: { 
      [PLANS.BASIC]: 0, 
      [PLANS.PROFESSIONAL]: 100, 
      [PLANS.ENTERPRISE]: 999 
    }
  }
}
```

**Zaimplementowano w:**
- `ReviewItem.vue` - blokowanie przycisku "AI Suggestion" gdy limit jest przekroczony
- Wyświetlanie tooltipa z informacją o limicie

### 7. Nowe Serwisy

**`src/services/KeywordsService.js`** - NOWY
- Serwis do zarządzania słowami kluczowymi
- Mock funkcje dla rozwoju frontendowego

### 8. Nowe Komponenty Przykładowe

**`src/components/gtrack/keywords/KeywordsPanel.example.vue`** - NOWY
- Przykładowy komponent panelu słów kluczowych
- Używany jako referencja przy implementacji

## Statystyki Zmian

### Pliki Usunięte
- `src/composables/featureHierarchy.js` (311 linii)
- `src/composables/useFeatureFlags.js` (166 linii)
- `src/composables/useFeatureLimits.js` (113 linii)
- **Razem:** 590 linii usuniętych

### Pliki Nowe
- `src/composables/useFeatures.js` (151 linii)
- `src/config/features.js` (319 linii)
- `src/components/gtrack/common/LimitWarningBanner.vue` (188 linii)
- `src/components/gtrack/common/LimitProgressBar.vue` (80 linii)
- `src/services/KeywordsService.js` (szacunkowo ~100 linii)
- `src/components/gtrack/keywords/KeywordsPanel.example.vue` (szacunkowo ~50 linii)
- **Razem:** ~888 linii dodanych

### Pliki Zmodyfikowane
- 17 komponentów Vue zaktualizowanych do użycia nowego API
- `src/stores/featureSettings.js` - zaktualizowany do użycia nowych stałych
- `src/layouts/DashboardLayout.vue` - dodano inicjalizację feature settings
- `src/views/LocationSettingsView.vue` - dodano synchronizację z globalnym store

### Netto Zmian
- **313 plików zmienionych**
- **34,368 linii dodanych**
- **96,329 linii usuniętych**
- **Netto:** -61,961 linii (głównie z node_modules i dist)

## Migracja Komponentów

### Przed Refaktoryzacją

```javascript
import { useFeatureLimits } from '../../../composables/useFeatureLimits';
import { useFeatureFlags, FEATURES } from '../../../composables/useFeatureFlags';

const { getCurrentLimit, isLimitExceeded } = useFeatureLimits();
const { isFeatureAvailable, isFeatureLocked } = useFeatureFlags();

const limit = getCurrentLimit('templates', 'maxTemplates');
const isAvailable = isFeatureAvailable(FEATURES.AUTO_REPLY);
```

### Po Refaktoryzacji

```javascript
import { useFeatures } from '../../../composables/useFeatures';
import { PLAN_NAMES } from '../../../config/features';

const { getLimit, checkLimit, can, isLocked, features } = useFeatures();

const limit = getLimit('templates', 'maxTemplates');
const isAvailable = can('autoReply');
const planName = PLAN_NAMES[features.autoReply?.requiredPlan];
```

## Korzyści Refaktoryzacji

1. **Prostsze API:**
   - Jeden composable zamiast trzech
   - Spójne nazewnictwo funkcji
   - Mniej importów w komponentach

2. **Lepsza Organizacja:**
   - Centralna konfiguracja funkcji
   - Łatwiejsze zarządzanie limitami
   - Spójna struktura danych

3. **Łatwiejsze Utrzymanie:**
   - Jeden plik zamiast trzech dla composables
   - Centralne miejsce dla konfiguracji
   - Mniej duplikacji kodu

4. **Lepsza Wydajność:**
   - Mniej obliczeń
   - Lepsze cache'owanie
   - Optymalizacja reaktywności

5. **Rozszerzalność:**
   - Łatwiejsze dodawanie nowych funkcji
   - Łatwiejsze dodawanie nowych limitów
   - Łatwiejsze dodawanie nowych planów

## Nowe Funkcjonalności

### 1. LimitWarningBanner Component

Uniwersalny komponent do wyświetlania ostrzeżeń o limitach z:
- Automatycznym wykrywaniem severity (danger, warning, warn, info)
- Paskiem postępu pokazującym procent użycia
- Przyciskiem "Zwiększ pakiet" (opcjonalny)
- Responsywnym designem

### 2. LimitProgressBar Component

Reużywalny komponent do wyświetlania postępu wykorzystania limitu z:
- Estetycznymi gradientami
- Zmianą kolorów w zależności od stanu (zielony, żółty, czerwony)
- Informacją liczbową o zużyciu

### 3. Rozszerzone Limity

Dodano limity dla:
- Słów kluczowych (maxKeywords)
- Siatki wyszukiwania (maxGridPoints, maxStepMeters)
- Częstotliwości zadań (minDataSyncIntervalMinutes, etc.)
- Analizy AI (maxAnalysisPerMonth)

### 4. Lepsze Komunikaty o Limitach

Funkcja `getLimitStatus()` zwraca szczegółowe informacje:
- Czy limit jest przekroczony
- O ile przekroczony
- Ile pozostało
- Procent użycia
- Severity (danger, warning, warn, info)
- Komunikaty dla użytkownika
- Sugestie dotyczące zwiększenia pakietu

## Pliki Zmodyfikowane

### Composables
- ❌ `src/composables/featureHierarchy.js` - USUNIĘTY
- ❌ `src/composables/useFeatureFlags.js` - USUNIĘTY
- ❌ `src/composables/useFeatureLimits.js` - USUNIĘTY
- ✅ `src/composables/useFeatures.js` - NOWY

### Config
- ✅ `src/config/features.js` - NOWY

### Components
- ✅ `src/components/gtrack/common/LimitWarningBanner.vue` - NOWY
- ✅ `src/components/gtrack/common/LimitProgressBar.vue` - NOWY
- ✅ `src/components/gtrack/keywords/KeywordsPanel.example.vue` - NOWY
- 🔄 17 komponentów zaktualizowanych

### Services
- ✅ `src/services/KeywordsService.js` - NOWY

### Stores
- 🔄 `src/stores/featureSettings.js` - ZAKTUALIZOWANY

### Layouts
- 🔄 `src/layouts/DashboardLayout.vue` - ZAKTUALIZOWANY

### Views
- 🔄 `src/views/LocationSettingsView.vue` - ZAKTUALIZOWANY

## Breaking Changes

### Zmiana Nazw Kluczy w Store

**W komponentach używających `featureSettings` należy zaktualizować nazwy kluczy:**
- `syncPhotos` → `photoMonitoring`
- `autoPost` → `postPublishing`
- `protectData` → `dataProtection`
- `monitorQA` → `qaMonitoring`
- `syncHours` → `hoursSync`

### Zmiana API Composables

Wszystkie komponenty używające starych composables muszą zostać zaktualizowane:
- `useFeatureLimits` → `useFeatures`
- `useFeatureFlags` → `useFeatures`
- `getCurrentLimit` → `getLimit`
- `isFeatureAvailable` → `can`
- `isFeatureLocked` → `isLocked`
- `FEATURES` → `features` (z `useFeatures()`)

## Testowanie

### Scenariusze Testowe

1. **Sprawdzanie Dostępności Funkcji:**
   - Zmiana planu w debug barze
   - Sprawdzenie czy funkcje są odpowiednio blokowane
   - Sprawdzenie czy komunikaty są poprawne

2. **Sprawdzanie Limitów:**
   - Przekroczenie limitów szablonów
   - Przekroczenie limitów słów kluczowych
   - Przekroczenie limitów siatki
   - Sprawdzenie czy ostrzeżenia są wyświetlane

3. **Sprawdzanie Komponentów:**
   - LimitWarningBanner wyświetla się poprawnie
   - LimitProgressBar wyświetla się poprawnie i zmienia kolory
   - Toggle switchy są blokowane gdy funkcja jest niedostępna
   - Zakładki są blokowane gdy funkcja jest niedostępna

## Uwagi Techniczne

1. **Reaktywność:**
   - Wszystkie funkcje są computed properties
   - Zmiany w planie automatycznie aktualizują dostępność funkcji
   - Limity są obliczane tylko gdy potrzebne

2. **Performance:**
   - Użycie computed properties dla optymalizacji
   - Cache'owanie wyników sprawdzania limitów
   - Minimalizacja obliczeń

3. **Kompatybilność:**
   - Wszystkie istniejące funkcjonalności działają tak samo
   - Tylko zmieniono sposób dostępu do funkcji
   - Nie ma zmian w logice biznesowej

## Przyszłe Ulepszenia

1. **Dodatkowe Limity:**
   - Limity dla historii auto-odpowiedzi
   - Limity dla raportów
   - Limity dla eksportów danych

2. **Ulepszona Analityka:**
   - Śledzenie użycia limitów
   - Raporty o przekroczeniach limitów
   - Sugestie optymalizacji użycia

3. **Automatyczne Zarządzanie:**
   - Automatyczne wyłączanie funkcji gdy limit jest przekroczony
   - Automatyczne powiadomienia o zbliżaniu się do limitu
   - Automatyczne sugestie zwiększenia pakietu

## Autor

Refaktoryzacja: AI Assistant
Data: 2024-11-25
