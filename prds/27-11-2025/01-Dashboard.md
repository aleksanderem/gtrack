# Dashboard — Podsumowanie

## Cel

Dashboard jest stroną startową i centrum zarządzania, która zapewnia szybki przegląd stanu wizytówek, reputacji, aktywności użytkowników, zadań oraz alertów. Ma umożliwić użytkownikowi natychmiastowe zorientowanie się w kondycji lokalnego SEO firmy oraz podejmowanie szybkich decyzji.

## Nawigacja

> **Ścieżka:** Menu główne → Dashboard  
> **Dostęp:** Dla zalogowanych użytkowników z rolą _admin_, _owner_ lub _user_.  

Po kliknięciu „Dashboard” w menu aplikacji, użytkownik zostaje przeniesiony do strony podsumowania. Dashboard powinien być zawsze dostępny, niezależnie od planu taryfowego, stanowiąc centralne miejsce zarządzania.

## Layout / Układ

Struktura jest oparta na _boxed layout_ (maksymalna szerokość `7xl`). Główne sekcje w kolejności od góry:

1. **Nagłówek** – zawiera tytuł strony („Dashboard”) oraz globalne elementy nawigacji (np. przełącznik profilu, ikony powiadomień).
2. **KPI / Summary Cards** – rząd/kolejne rzędy kart z kluczowymi wskaźnikami (liczba opinii, średnia ocena, nowe/utracone opinie, aktywne zadania, posty). Karty powinny używać komponentu _Card_ z design systemu, z ikoną, liczbą i krótkim opisem.
3. **Alerts / Notifications Feed** – widżet w formie listy ostatnich alertów (najnowsze na górze), które można kliknąć, aby przejść do odpowiedniego modułu. Zmień kolor/podkreśl nieprzeczytane alerty.
4. **Activity Stream / Timeline** – przewijany strumień działań pokazujący ostatnie zdarzenia (dodanie opinii, publikacja posta, zmiana konfiguracji, wykonanie zadania). Każdy wpis ma ikonę, opis, datę/godzinę. Użyj listy z nagłówkami dat do grupowania zdarzeń.
5. **Mini Charts / Trends** – zestaw małych wykresów (np. wykres liniowy z liczbą opinii w czasie, średnią oceną w czasie, histogram usuniętych opinii, status profilów). Wykresy powinny być responsywne; w wersji mobilnej można je ułożyć w pionie.
6. **Quick Actions** – grupa przycisków, które wywołują najczęstsze operacje (np. „Poproś o opinię”, „Dodaj post”, „Uruchom audyt”, „Porównaj konkurencję”). Akcje mogą otwierać modale lub przekierowywać do innych modułów.

### Responsywność

- Na ekranach desktopowych KPI Cards powinny być w jednym lub dwóch rzędach (w zależności od liczby kart). Na tablecie zmniejsz liczbę kart w jednym rzędzie, na mobile układaj karty pojedynczo.
- Wersja mobilna układa sekcje jedna pod drugą (KPI → Alerts → Activity → Charts → Quick Actions).

## Komponenty / Widżety

| Komponent | Opis / Funkcja |
|-----------|----------------|
| **KPI Cards** | Każda karta prezentuje kluczową metrykę: `total_reviews`, `avg_rating`, `new_reviews` (7 dni), `removed_reviews` (7 dni), `active_tasks`, `scheduled_posts` (w kolejce), `recent_posts`, `profile_status`. Karty mają ikonę (np. pi gwiazdka dla ocen), liczbę (duża typografia) i etykietę. |
| **Alerts Feed** | Lista komunikatów w kolejności od najnowszych. Dane: `id`, `type`, `message`, `created_at`, `link`. Typ (np. `review_deleted`, `profile_changed`, `post_failed`) może determinować kolor tła / ikonę. Kliknięcie przenosi użytkownika do odpowiedniego modułu.|
| **Activity Stream** | Chronologiczna lista zdarzeń z danymi: `id`, `type` (np. `new_review`, `post_published`, `task_completed`), `summary`, `timestamp`, `related_object_id`. Grupuj wpisy według daty, wyświetl ikonę odpowiadającą typowi. |
| **Trend Charts** | Wykresy (wykres liniowy lub słupkowy) z danych historycznych: `reviews_history` (date, count), `rating_history` (date, avg), `removed_reviews_history`, `status_changes`. Wykresy powinny korzystać z biblioteki zgodnej z designem (np. Chart.js, ApexCharts). |
| **Quick Actions** | 3–4 przyciski CTA: „Poproś o recenzje” (link do modułu pozyskiwania opinii), „Dodaj post” (przeniesienie do Postów z formularzem), „Uruchom audyt” (uruchamia audit SEO i otwiera raport), „Sprawdź konkurencję” (przenosi do raportu konkurencji). Każdy przycisk używa stylu Primary z design systemu. |

## Dane / Model danych

Przykładowa struktura JSON, jaką backend powinien zwracać do wypełnienia dashboardu:

```json
{
  "kpi": {
    "total_reviews": 124,
    "avg_rating": 4.7,
    "new_reviews_7d": 5,
    "removed_reviews_7d": 1,
    "active_tasks": 3,
    "scheduled_posts": 2,
    "recent_posts": 5,
    "profile_status": "ok"
  },
  "alerts": [
    {"id": "a1", "type": "review_deleted", "message": "Usunięto 1 opinię", "created_at": "2025-11-26T10:15:00Z", "link": "/opinie"},
    {"id": "a2", "type": "post_failed", "message": "Błąd publikacji posta", "created_at": "2025-11-25T16:00:00Z", "link": "/posty"}
  ],
  "activity_stream": [
    {"id": "e1", "type": "new_review", "summary": "Nowa recenzja od \"Jan Kowalski\"", "timestamp": "2025-11-25T08:30:00Z", "related_object_id": "r789"},
    {"id": "e2", "type": "post_published", "summary": "Opublikowano post \"Promocja Zima\"", "timestamp": "2025-11-24T12:00:00Z", "related_object_id": "p101"}
  ],
  "trend_data": {
    "reviews_history": [ {"date": "2025-10-01", "count": 12}, {"date": "2025-11-01", "count": 15} ],
    "rating_history": [ {"date": "2025-10-01", "avg": 4.5}, {"date": "2025-11-01", "avg": 4.7} ],
    "removed_reviews_history": [ {"date": "2025-10-15", "count": 0}, {"date": "2025-11-15", "count": 1} ],
    "status_changes": [ {"date": "2025-10-20", "status": "Suspended"}, {"date": "2025-11-10", "status": "OK"} ]
  }
}
```

## Akcje / Flow użytkownika

- **Wczytanie strony:** Frontend wysyła zapytania do API (Backend/Convex, DataForSEO, GBP) i pobiera dane KPI, alerty, aktywności oraz trendy. W czasie ładowania wyświetlane są skeletony.
- **Kliknięcie alertu:** Router przenosi użytkownika do sekcji, która dotyczy alertu (np. Opinie → Lista recenzji w przypadku `review_deleted`).
- **Kliknięcie szybkiej akcji:** Uruchamia daną funkcjonalność – np. otwiera modal do wysyłki prośby o recenzję lub przenosi do modułu Postów z przygotowanym formularzem.
- **Powiadomienia real-time:** Jeżeli aplikacja korzysta z subskrypcji (Convex `onUpdate`) lub WebSocketów, nowe alerty i aktywności pojawiają się na dashboardzie w czasie rzeczywistym.

## Stany UI

- **Loading:** Przy pierwszym otwarciu strony – skeletony kart, placeholdery list i wykresów.
- **Empty:** Jeżeli brak opinii – puste karty z informacją i przyciskiem „Poproś o recenzje”. Jeżeli brak aktywności – informacja „Brak aktywności”.
- **Error:** W przypadku błędu API – wyświetl komunikat „Błąd ładowania danych” i przycisk „Spróbuj ponownie”.
- **Success:** Po otrzymaniu danych – pełne wypełnienie kart, list, wykresów. Toasty z potwierdzeniami działań (np. „Zadanie utworzone” przy dodaniu zadania). 

## Powiązania z innymi modułami

- Kliknięcia alertów, przycisków z sekcji Quick Actions oraz elementów z Activity Stream prowadzą do dedykowanych podstron (Opinie, Posty, Zadania, Raporty). 
- Metryki KPI i trendy są generowane na podstawie danych z innych modułów (opinie, posty, zadania, audyty) – zmiana w jednym module powinna odzwierciedlić się w metrykach dashboardu.

## Notyfikacje / Feedback dla użytkownika

- Używaj toastów (`severity=success`, `severity=error`) do krótkich komunikatów po wykonanych akcjach (np. „Opinie pobrane”, „Nie udało się pobrać danych”).
- Dla alertów, które mogą wymagać natychmiastowej reakcji (np. zawieszenie wizytówki), zastosuj kolorowe badge/ikonę (np. `bg-red-50`, `text-red-600`).


