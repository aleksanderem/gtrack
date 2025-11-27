# Raporty i Analiza

Moduł Raporty ma na celu dostarczenie pogłębionej analizy rezultatów działań optymalizacyjnych, widoczności w wyszukiwarce, pozycji w lokalnych rankingach oraz porównania z konkurencją. Raporty są kluczowym elementem w pracy agencji i właścicieli firm, pomagają zrozumieć, jakie działania przynoszą rezultaty, a które wymagają poprawy.

## Nawigacja
Menu główne → **Raporty / Analiza**. Wewnątrz modułu występują trzy podstrony: **Pozycje / Rankingi**, **Konkurencja**, **Audyt wizytówki**.

## Layout ogólny

- Pasek nagłówka z tytułem i wyborem podstron (tabs). Każda podstrona posiada własny zestaw widgetów, wykresów i tabel.
- Możliwość wyboru lokalizacji (jeżeli użytkownik ma wiele wizytówek) oraz zakresu dat (np. ostatnie 7 dni, 30 dni, 3 miesiące). Dane dostosowują się do wybranego zakresu.

---

## Pozycje / Rankingi lokalne

### Cel
Prezentuje pozycję wizytówki w wynikach wyszukiwania lokalnego (Local Finder / Maps) dla zdefiniowanych słów kluczowych oraz jej zmiany w czasie. Umożliwia analizę widoczności w wielu punktach geograficznych (geo-grid).

### Komponenty / Widżety

| Komponent | Zawartość / Funkcja |
|-----------|--------------------|
| **GeoGrid Heatmap** | Mapa / siatka 5x5 lub 7x7 punktów wokół lokalizacji. Każdy punkt przedstawia pozycję wizytówki na dane słowo kluczowe (1, 2, 3, …, >20). Kolor skali od zielonego (wysoka pozycja) po czerwony (pozycja poza top). Użytkownik może przełączać między słowami kluczowymi. |
| **Table of Rankings** | Tabela z listą słów kluczowych i kolumnami: średnia pozycja w danym okresie, najlepsza pozycja, najgorsza pozycja, trend (strzałka), odchylenie. Możliwość sortowania i filtrowania. |
| **Trend Chart** | Wykres liniowy pokazujący pozycję dla wybranego słowa kluczowego w czasie (np. w skali tygodniowej). |
| **Keyword Selector** | Komponent pozwalający wybrać słowo kluczowe z listy monitorowanych fraz. |
| **Location & Date Range Selector** | Wybór lokalizacji (dla użytkowników z wieloma wizytówkami) oraz zakresu dat do analizy. |

### Dane / Model danych

Pozycje są pobierane z dwóch źródeł:

1. **Convex / DataForSEO** – API planowania siatki (Local Finder SERP) zwraca listę punktów z rankingiem. Każdy wpis zawiera: `gridPointLat`, `gridPointLng`, `rank`, `keyword`, `timestamp`.
2. **Tabela `keywords`** w bazie – przechowuje listę monitorowanych słów kluczowych i konfigurację siatki (rozmiar, promień, lokalizacja). Pozwala użytkownikowi definiować nowe frazy w module Ustawień.

Przykładowa struktura danych dla mapy:

```json
{
  "keyword": "dentysta kraków",
  "points": [
    { "lat": 50.06143, "lng": 19.93658, "rank": 3 },
    …
  ],
  "fetchedAt": "timestamp"
}
```

### Stany UI

- **Loading** – skeleton mapy, tabel i wykresów.
- **Empty** – brak danych (np. brak ustawionych słów kluczowych) → CTA do dodania słów kluczowych w ustawieniach.
- **Data** – normalne wyświetlanie mapy i tabel.
- **Error** – błąd pobrania rankingów → komunikat + możliwość ponowienia.

---

## Konkurencja (porównanie profili)

### Cel
Umożliwia analizę konkurentów z lokalnego rynku: pokazuje listę firm, które pojawiają się w wynikach lokalnych na te same słowa kluczowe, oraz porównuje parametry profili (rating, liczba recenzji, kategorie, godziny, atrybuty, media, posty). Pozwala zidentyfikować luki w profilu oraz przewagi konkurencji.

### Komponenty / Widżety

| Komponent | Funkcja |
|-----------|---------|
| **Competitors Table** | Lista konkurentów z danymi: nazwa, adres, kategorie, rating, liczba recenzji, godziny otwarcia, atrybuty, liczba zdjęć, aktywność postów. Możliwość sortowania i filtrowania (np. po ocenie). |
| **Comparison Radar Chart** | Porównanie Twojej wizytówki z wybraną liczbą konkurentów w kilku wymiarach (rating, liczba recenzji, kompletny profil, aktywność postów, liczba zdjęć). |
| **Competitor Details Drawer** | Panel boczny z pełnymi danymi konkurenta (pobranymi z DataForSEO Business Data API) – zawiera listę kategorii, pełny opis, atrybuty, popular hours, recenzje. |
| **Keyword Filter** | Wybór słowa kluczowego do określenia konkurentów (zmiana listy konkurencji zależnie od frazy). |
| **Benchmark Panel** | Karty z uśrednionymi wartościami top3 / top5 – np. średni rating top3, średnia liczba recenzji top3, średnia liczba zdjęć top3 – porównane do Twojej wizytówki. |

### Dane / Model danych

Konkurencja jest określana na podstawie wyników Local Finder SERP (DataForSEO). Dla każdego konkurenta pobieramy publiczne dane z Business Data API (nazwa, adres, rating, recenzje, kategorie, itp.)【785274141478433†screenshot】.

Przykładowa struktura konkurenta:

```json
{
  "name": "Klinika Dentystyczna Uśmiech",
  "address": "ul. Przykładowa 1, Kraków",
  "rating": 4.8,
  "reviewsCount": 123,
  "categories": ["Dentist", "Dental Clinic"],
  "hours": { "mon": "8-20", … },
  "attributes": { "wifi": true, "payment_methods": ["cash", "card"] },
  "photosCount": 50,
  "postsCount": 10,
  "rank": 2
}
```

### Stany UI

- **Loading** – skeleton tabeli konkurentów i wykresu radarowego.
- **No Data** – brak wyników konkurencji dla danego słowa kluczowego – informacja i sugestie, by zmienić frazę lub radius.
- **Data** – wyświetlenie tabeli, radar chart i benchmarków.
- **Error** – błąd pobrania danych z API – komunikat + ponów próbę.

---

## Audyt wizytówki

### Cel
Przedstawia wynik audytu wizytówki: ocenia kompletność profilu, jakość recenzji, liczbę i rodzaj mediów, aktywność w postach, wykorzystanie słów kluczowych i atrybutów, a także różnice w porównaniu z konkurencją. Podaje listę rekomendacji wraz z priorytetami i przewidywanym wpływem na ranking.

### Komponenty / Widżety

| Komponent | Funkcja |
|-----------|---------|
| **Audit Score Card** | Główna karta z wynikiem audytu (0–100) oraz przypisaną oceną (np. „Excellent”, „Good”, „Needs Improvement”). |
| **Sections Breakdown** | Lista sekcji audytu (Profil, Opinie, Media, Posty, Kategorie, Godziny, Atrybuty) z procentem kompletności i listą błędów/ braków. |
| **Recommendations List** | Lista rekomendacji: każda zawiera opis, priorytet (High/Medium/Low), przewidywany uplift (jeśli model został wytrenowany), link do odpowiedniego modułu (np. edycja profilu, posty, recenzje). |
| **Comparative Charts** | Wykresy pokazujące Twoją wizytówkę vs konkurencja w poszczególnych obszarach (rating, recenzje, zdjęcia, posty, kategorie) – mogą być prezentowane jako bar charts lub radar. |
| **Audit History** | Lista poprzednich audytów z datą wykonania, wynikiem i linkiem do raportu – aby śledzić postępy. |

### Dane / Model danych

Audyt generowany jest w oparciu o dane z modułu Wizytówki, Recenzji, Mediów, Postów oraz dane konkurencji. Struktura przykładowego wyniku audytu:

```json
{
  "score": 78,
  "sections": [
    { "name": "Profile Completeness", "score": 85, "missing": ["Opis firmy", "Dodatkowa kategoria"] },
    { "name": "Reviews", "score": 72, "missing": [] },
    { "name": "Media", "score": 60, "missing": ["Cover", "Interior photos"] },
    …
  ],
  "recommendations": [
    { "description": "Dodaj opis firmy z kluczowymi frazami (Dentysta, Implanty)", "priority": "High", "module": "Wizytówka", "uplift": 6 },
    { "description": "Zbierz min. 20 nowych recenzji", "priority": "High", "module": "Opinie", "uplift": 10 },
    …
  ],
  "createdAt": "timestamp"
}
```

### Stany UI

- **Loading** – skeleton dla kart i listy rekomendacji.
- **No Audit** – jeśli audyt nie był jeszcze wykonany – CTA „Uruchom audyt”.
- **Data** – pokazuje wynik i listę rekomendacji z możliwością przejścia do modułów w celu ich realizacji.
- **Error** – błąd generowania audytu – komunikat + możliwość ponowienia.

---

## Integracja z planami

Niektóre raporty lub ich szczegółowość mogą być zależne od planu subskrypcyjnego. Np. w planie BASIC raport audytu może nie zawierać danych o Mediach, ponieważ photo monitoring jest wyłączony【785274141478433†screenshot】. W planie PROFESSIONAL raport jest pełny, obejmuje wszystkie sekcje i rekomendacje.
