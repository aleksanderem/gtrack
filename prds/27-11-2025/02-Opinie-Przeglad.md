# Opinie → Przegląd (Reviews Overview)

## Cel

Ekran „Przegląd opinii” służy do szybkiej oceny reputacji firmy i przeglądu aktywności związanej z opiniami. Użytkownik znajdzie tu skondensowane informacje o liczbie recenzji, średniej ocenie, trendach, alertach reputacji oraz skróty do najważniejszych akcji dotyczących opinii.

## Nawigacja

> **Ścieżka:** Zarządzanie → Opinie → Przegląd  
> **Dostęp:** Użytkownicy z rolą _admin_, _owner_ lub _user_, posiadający uprawnienia do odczytu opinii.  
> **Taby:** W module Opinie, „Przegląd” jest pierwszym tabem w `ReviewsDashboard.vue` (kontenerze), co jest zgodne z dokumentacją GTRACK【718814200998643†L100-L121】.

## Layout

Strona „Przegląd opinii” jest podzielona na sekcje:

1. **Nagłówek** – tytuł „Opinie – Przegląd” oraz ewentualne filtrowanie po dacie (np. ostatnie 7/30/90 dni). 
2. **Statystyki recenzji** – zestaw kart z kluczowymi statystykami. 
3. **Wykresy / trendy** – kilka wykresów (słupkowy, liniowy, kołowy) z rozkładem ocen, dynamiką opinii i sentymentem. 
4. **Alerty reputacji** – lista z zauważonymi problemami (nagły spadek oceny, duża liczba recenzji bez odpowiedzi).  
5. **Szybkie akcje** – przyciski umożliwiające bezpośrednie przejście do listy opinii, modułu pozyskiwania opinii, eksportu, lub odpowiedzi na recenzje.

### Responsywność

- Na desktopie statystyki i wykresy powinny być obok siebie (siatka 2×2 lub 3×2). Na mobile układaj sekcje pionowo.
- Wersja mobilna może ukryć niektóre szczegółowe wykresy i przenieść je do rozwijalnych sekcji.

## Komponenty / Widżety

| Komponent | Opis |
|-----------|-----|
| **Statystyki recenzji (cards)** | Karty z informacjami: całkowita liczba recenzji, średnia ocena (rating), liczba nowych recenzji (ostatnie 30 dni), liczba recenzji bez odpowiedzi (brak reply), liczba usuniętych recenzji (od ostatniego snapshotu). Każda karta ma ikonę i liczbę. |
| **Wykres liczby recenzji w czasie** | Wykres (liniowy lub słupkowy) pokazujący liczbę recenzji per dzień/tydzień/miesiąc w wybranym zakresie czasu. Dane z `ReviewsService.getStats()` (obecnie mock)【718814200998643†L129-L143】. |
| **Wykres średniej oceny w czasie** | Liniowy wykres prezentujący zmianę średniej oceny (4.0–5.0) w czasie. Pomaga zauważyć trend spadku lub wzrostu ocen. |
| **Rozkład ocen / sentiment** | Histogram (bar chart) z liczbą recenzji w poszczególnych wartościach 1–5 gwiazdek; ewentualnie wykres kołowy pokazujący stosunek pozytywnych / neutralnych / negatywnych recenzji (jeśli robisz analizę sentymentu). |
| **Alerty reputacji** | Lista alertów generowanych na podstawie heurystyk (np. spadek średniej oceny, zniknięcie > X recenzji w ciągu tygodnia, wysoki procent recenzji bez odpowiedzi). Każdy alert zawiera opis i link do odpowiedniego działania (np. „Odpowiedz na recenzje”, „Pozyskaj opinie”). |
| **Szybkie akcje** | Przyciski: „Odpowiedz na recenzje bez odpowiedzi” (przekierowanie do `Reviews List` z filtrem), „Poproś o recenzje” (przekierowanie do `Pozyskiwanie opinii`), „Eksport recenzji” (generowanie CSV/JSON), „Filtrowanie / Range date” (otwarcie panelu filtra). |

## Dane / Model danych

Przykładowe dane wejściowe (backend / Convex lub mock):

```json
{
  "stats": {
    "total_reviews": 234,
    "avg_rating": 4.6,
    "new_reviews_30d": 12,
    "unanswered_reviews": 8,
    "removed_reviews": 2
  },
  "reviews_history": [
    {"date": "2025-10-01", "count": 3}, {"date": "2025-10-31", "count": 6}
  ],
  "rating_history": [
    {"date": "2025-10-01", "avg": 4.5}, {"date": "2025-10-31", "avg": 4.7}
  ],
  "sentiment_distribution": {
    "5": 120, "4": 70, "3": 25, "2": 10, "1": 9
  },
  "alerts": [
    {"id": "ar1", "type": "rating_drop", "message": "Średnia ocena spadła poniżej 4.5 w ciągu ostatnich 14 dni", "created_at": "2025-11-20T09:00:00Z", "link": "/opinie/lista"}
  ]
}
```

## Akcje / Flow użytkownika

1. **Wczytanie danych** – po wejściu na zakładkę „Przegląd” komponent `ReviewsOverview` wykonuje zapytanie do API (np. `ReviewsService.getStats()`, `getHistory()`, `getSentiment()`) i wypełnia karty oraz wykresy【718814200998643†L129-L143】.
2. **Zmiana zakresu czasu** – filtr dat (np. suwak / date picker) pozwala użytkownikowi wybrać zakres (7, 30, 90 dni). Komponenty wykresów powinny reagować na zmianę zakresu i odświeżać dane.
3. **Kliknięcie alertu** – przekierowanie do `Reviews List` z ustawionym filtrem (np. tylko oceny < 3) albo do `Monitoring` (jeśli alert dotyczy usuniętych recenzji).
4. **Kliknięcie szybkiej akcji** – wykonanie odpowiedniej operacji (przejście do listy, wywołanie eksportu, otwarcie modala). 

## Stany UI

- **Loading** – skeleton kart statystyk i wykresów do czasu otrzymania danych.
- **Empty** – jeśli firma nie ma jeszcze żadnych recenzji – wyświetl komunikat „Brak recenzji” i przycisk „Poproś o recenzje” lub „Dodaj recenzję testową”.
- **Error** – w przypadku błędu API – pokaż informację „Nie udało się pobrać danych o recenzjach” i przycisk „Spróbuj ponownie”.

## Powiązania z innymi modułami

- **Lista opinii (Reviews List):** Użytkownik może kliknąć w karty statystyk albo alerty, aby zobaczyć pełną listę recenzji spełniających dany warunek (np. tylko bez odpowiedzi). 
- **Pozyskiwanie opinii:** Przyciski „Poproś o recenzje” przekierowują do sekcji, gdzie można wygenerować link / QR do pozostawienia opinii.
- **Monitoring & Protection:** Jeśli w alertach pojawi się informacja o usuniętych recenzjach, kliknięcie przekierowuje do modułu monitorowania (gdzie możesz zobaczyć log zmian i odtworzyć zarchiwizowane opinie).
- **Smart Tasks:** Może powstać zadanie „Odpowiedz na recenzje”, jeśli liczba recenzji bez odpowiedzi przekroczy próg.

## Notyfikacje / Feedback

- Pokaż toast (success / error), gdy użytkownik skorzysta z szybkiej akcji (np. eksport zakończony sukcesem). 
- Użyj kolorowych badge’y przy alertach reputacyjnych, aby podkreślić ich wagę (np. `bg-red-50 text-red-600` dla spadku ratingu). 


