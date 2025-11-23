# Gemini Memory

**Data**: 2025-11-22
**Kontekst**: Rozpoczęcie pracy (Initial Session)

## Status Projektu (na podstawie ANALIZA_STANU_PROJEKTU.md)
- **Typ**: Vue 3 + Vite + Tailwind + PrimeVue.
- **Stan**: Frontend z mockowanymi danymi (hardcoded w komponentach). API w planach.
- **Analiza**: Szczegółowy raport z "2025-01-03" (data w pliku; systemowa: 2025-11-22). Projekt jest w fazie zaawansowanego frontend-u z brakami w logice biznesowej (journeys) i warstwie danych.

## Kluczowe ustalenia
1. **Brak Testów**: Mimo zapisów w `AGENTS.md`, analiza wskazuje, że testy Playwright zostały usunięte jako "legacy". Należy to traktować jako aktualny stan (brak CI/tests).
2. **Mock Data**: Dane są rozproszone w komponentach. Priorytetem jest ich centralizacja (`src/services/mockData.js`).
3. **API Layer**: Należy stworzyć warstwę abstrakcji (`src/services/api.js`), aby oddzielić UI od danych i ułatwić przyszłą integrację z backendem.
4. **Brakujące Funkcje (Journey 1, 2, 4)**:
    - **Onboarding**: Brak w ogóle.
    - **Keyword Wizard**: Częściowy brak UI.
    - **Quota UI**: Brak modali i walidacji.

## Plan Działania (Next Steps)
1. **Organizacja Danych**: Utworzyć `src/services/mockData.js` i przenieść tam dane z komponentów (`BusinessPanel`, `FarLeftNavbar` itp.).
2. **Service Layer**: Utworzyć `src/services/api.js` podłączony pod mocki.
3. **Onboarding**: Zaimplementować User Journey 1 (Modal z autocomplete, Status Banner).
4. **Refactor**: Usunąć hardcoded data z `App.vue` i innych głównych komponentów.

## Reguły (z AGENTS.md)
- **Struktura**: `src/components/gtrack/` (podkatalogi: `map/`, `sidebar/`, top-level panels).
- **Style**: Tailwind (`utility-first`) > bespoke CSS (`styles.css`).
- **Komponenty**: PascalCase, `<script setup>`, Composition API.
- **Referencja**: `example/` katalog zawiera wzorcowe implementacje PrimeVue - sprawdzać przed tworzeniem nowych komponentów.
