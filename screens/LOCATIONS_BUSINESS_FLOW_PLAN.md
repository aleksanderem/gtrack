# Locations Module – Business Flow Specification

## Overview
This document defines the end-to-end journey for customers managing Google Business Profile locations inside Concord CRM. It covers onboarding, keyword tracking, grid-based ranking reports, competitive insights, and subscription gating so that the module delivers a coherent workflow backed by measurable limits.

## Primary Personas
- **Marketing Manager** – Configures locations, tracks visibility, communicates results to stakeholders.
- **Agency Specialist** – Maintains many clients, needs quota transparency, and repeatable reporting.
- **SMB Owner** – Has 1–3 locations, expects guided onboarding and automated insights.

## User Journeys
### 1. Onboard New Location
1. User selects `Dodaj lokalizację` from the Locations index.
2. Modal collects location basics with Google Places autocomplete.
3. After successful create, redirect to `LocationDetail` with a status banner summarising next steps:
   - Add keywords to monitor.
   - Configure review syncing.
   - Create first visibility report (grid scan).
4. Checklist persists until each step is completed (stored per location: `has_keywords`, `has_grid_report`, `reviews_sync_enabled`).
5. Quota check: if location cap is reached, modal displays upgrade prompt instead of create button.

### 2. Configure Keyword Tracking
1. In `Pozycje` tab, onboarding state shows empty illustration, CTA `Dodaj słowa kluczowe`.
2. Keyword wizard:
   - Step 1: choose language and search engine (default `pl`, Maps).
   - Step 2: enter keywords manually or request AI suggestions (limit determined by quota).
   - Step 3: pick default monitoring location (city/coordinates reused by grid reports).
3. Confirmation screen lists estimated daily cost (based on `config('locations.dataforseo.cost_rates')`).
4. After submission, wizard returns to keywords table populated with first tasks queued.

### 3. Create Grid Ranking Reports
1. Bazowy skan 9×9 (kroki ok. 250 m) jest uruchamiany automatycznie przy pierwszym dodaniu fraz; wynik zapisujemy jako `base_grid_scan` i używamy do wykrywania konkurencji.
2. Użytkownik może zapisać dodatkowe profile raportów z polami:
   - `title` (domyślnie `Fraza + Miasto`),
   - `grid_size` (domyślnie 9×9, alternatywy 5×5, 7×7 dostępne według planu),
   - `step_meters` (250 m – 5 km),
   - `frequency` (`jednorazowy`, `cotygodniowy`, `comiesięczny`).
3. Raporty (w tym bazowy) pojawiają się w sekcji `Raporty widoczności` z ostatnim uruchomieniem, statusem, następnym terminem i linkiem do historii.
4. Nad mapą umieszczamy poziomą oś czasu (kapsuły z datami, np. ostatnie 30 skanów). Przewijanie poziome lub strzałki pozwalają szybko przełączać się między dniami; wybrany dzień jest wyróżniony wskaźnikiem.
5. Widok mapy renderuje siatkę w gradiencie zieleni (ciemniejszy = lepsza pozycja) oraz centralny pin, tooltipy pokazują pozycję, odległość i zmiany względem poprzedniego skanu.
6. Panel akcji przy osi czasu oferuje: `Generuj raport pozycji`, `Generuj raport PDF/CSV`, `Porównaj skany`.
7. Uruchomienie raportu wysyła job do kolejki, a `SyncStatusBadge` pokazuje postęp.
8. Historia raportu przechowuje średnią pozycję, surowe dane siatki i umożliwia eksport CSV/PDF.

### 4. Manage Quotas & Subscription Limits
- Pobieramy limity i zużycie z modułu SaaS (np. `GET /saas/usage`), a nagłówek listy pokazuje `2/5 lokalizacji`, `18/50 słów`, `3/5 raportów`.
- Przy próbie przekroczenia limitu:
  - Wyświetlamy modal z informacją o pozostałych zasobach.
  - CTA `Zarządzaj planem` prowadzi do istniejącego flow billingowego.
  - Akcje tworzenia (przyciski) otrzymują flagę `disabled` wraz z krótkim komunikatem.
- Zużycie aktualizujemy po każdej operacji (dodanie fraz, zapis raportu, uruchomienie skanu) korzystając z obecnego `QuotaServiceInterface`.

### 5. Monitor Reviews & Posts
1. `Opinie` tab indicates last sync and contains CTA `Włącz automatyczną synchronizację`, toggling backend flag.
2. Surface AI response credits (if applicable) and usage.
3. `Posty` tab shows scheduler timeline; onboarding text guides user to connect social channels when empty.

### 6. Competitive Intelligence
1. `Analiza Konkurencji` staje się zakładką w `LocationDetail`, zawsze w kontekście wybranej lokalizacji.
2. System automatycznie wykrywa konkurentów na podstawie danych z bazowego skanu 9×9, zapisuje listę w DB (nazwa, pozycja, rating, liczba opinii, fragmenty opisów) i odświeża ją zgodnie z planem subskrypcji (np. co tydzień dla planu Pro).
3. Użytkownik może oznaczać rekordy jako „priorytetowe” lub wykluczać z monitoringu; wybory są respektowane przy kolejnych odświeżeniach.
4. Raport konkurencji zbiera dla każdej frazy pozycję lokalizacji i konkurentów, opinie, teksty wizytówek, dane firmowe; generuje PDF/CSV oraz udostępnia link w historii.
5. Panel pokazuje datę ostatniego zaciągnięcia danych i najbliższy termin kolejnego odświeżenia ustalony przez moduł SaaS.

### 7. Scheduled Rankings Report
1. Widok raportu z harmonogramu prezentuje tabelę `Keyword Rankings` z kolumnami: `Keyword`, `Business`, `Current Ranking`, `Change`, `Trend`, a dalej kolumny dat (np. 14/07, 13/07…).
2. `Current Ranking` renderujemy jako kapsułę (zielona przy dobrych wynikach, czerwona przy spadkach). `Change` zawiera strzałkę i minimalny napis `+0.9`.
3. Kolumna `Trend` to sparkline (miniwykres liniowy) z ostatnich wartości; brak osi, jedynie płynna niebieska linia.
4. Kolumny dat używają gradientu (jasnozielony → intensywny) oraz subskryptu zmian (`+0.2`, `-1.3`). Kliknięcie w wiersz otwiera szczegóły frazy na mapie.
5. Nad tabelą znajdują się filtry okresu (`Last 7 days`, `Last 28 days`, `Last 3 months`, `Custom Range`, `All Time`) oraz `Export CSV`.

### 8. Smart Tasks Automation
1. Zadania prezentujemy w zakładce `Smart Tasks` jako listę pełnoszerokich kart (stacked list), bez pseudo-kanban. Każda karta zawiera tytuł, opis, kategorię, priorytet i akcje.
2. Karta pokazuje mierzalne kryteria ukończenia (np. liczba brakujących zdjęć) i bieżący postęp.
3. Po oznaczeniu zadania jako zakończone backend planuje ew. follow-up (np. przypomnienie po 30 dniach).
4. Widok globalny Smart Tasks nadal istnieje; filtry umożliwiają wybór lokalizacji, kategorii i priorytetu.

## UI Updates
- Adopt `MainLayout` for all views to ensure consistent navigation.
- Localise labels using `vue-i18n` (`locations::`, `core::`) rather than hard-coded strings.
- Introduce reusable `QuotaCounter` component to display remaining credits.
- Add `EmptyState` variants for each tab with contextual messaging and CTA.
- Przy nowych ekranach stosujemy komponenty [Nuxt UI](https://ui.nuxt.com/docs/getting-started/ai/llms-txt) (np. `NCard`, `NButton`, `NInput`, `NTable`, `NSparkline`, `NSegmentedControl`) zapewniające spójny design i wsparcie dla trybu ciemnego; PrimeVue pozostaje tylko tam, gdzie migracja jest kosztowna.
- Oś czasu i filtry dat korzystają z komponentów Nuxt UI (`NSegmentedControl`, `NCarousel`/custom slider), utrzymując UX zbliżony do referencyjnych ekranów.
- Remove debug logs and standardise toast feedback (`Innoclapps.success/error/info`).

## Backend Touchpoints
- Extend `locations` resource API to return onboarding status flags and quota counters.
- Create endpoints for saved grid reports (`/locations/{id}/grid-reports` CRUD) with schedule support.
- Ensure keyword, competitor, and grid report actions record credit consumption via `QuotaService`.
- Provide job progress updates through broadcasting (consumed by `SyncStatusBadge`).

## Subscription & Quota Integration
- Wykorzystać istniejący moduł `Saas` oraz `Invoices` do pobierania aktywnego planu, limitów i harmonogramów odświeżeń.
- Frontend korzysta z udostępnionych endpointów (np. `GET /saas/usage`, `GET /saas/features`) i aktualizuje UI w czasie rzeczywistym.
- Działania zużywające limity (dodanie lokalizacji, fraz, zapis raportu) raportują się do `QuotaServiceInterface`, który już synchronizuje dane z modułem SaaS.
- Ekrany modułu lokalizacji jedynie prezentują te informacje i kierują użytkownika do modułu SaaS w celu zmiany planu.

## Success Metrics
- Time-to-value: percentage of locations completing onboarding checklist within 24h.
- Keyword engagement: average keywords per location.
- Report adoption: number of saved grid reports per tenant vs quota.
- Retention proxy: recurring smart tasks completion rate.

## Next Steps
1. Align backend model changes (grid reports, quotas) with modules/Locations migrations.
2. Implement frontend onboarding states and layout updates.
3. Integrate quota endpoint and counters.
4. Beta test flow with internal tenant, gather feedback, iterate on copy.
