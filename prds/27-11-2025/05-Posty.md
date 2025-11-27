# Posty — Google Posts

## Cel

Moduł „Posty” umożliwia tworzenie, planowanie i zarządzanie wpisami Google Posts dla wizytówek (Google Business Profile). Użytkownik może dodawać posty jednorazowe lub kampanie, planować ich publikację, przeglądać status publikacji oraz monitorować wyniki (impressions, clicks, actions).

## Nawigacja

> **Ścieżka:** Zarządzanie → Posty  
> **Dostęp:** Rola _admin_ i _owner_ (a jeśli masz uprawnienia do publikacji na GBP). Pozostałe role mogą mieć jedynie podgląd.  

W module mogą znajdować się zakładki: _Lista postów_ (domyślnie), _Kalendarz / Kampanie_, _Statystyki_.

## Layout / Układ

1. **Nagłówek i toolbar** – tytuł „Posty (Google Posts)”, przyciski „Dodaj post” / „Nowa kampania”, filtr po lokalizacjach, statusach i dacie. 
2. **Widok listy** – tabela z postami (domyślny widok). 
3. **Widok kalendarza / kampanii** – kalendarz (miesięczny/tygodniowy) z zaznaczonymi planowanymi i przeszłymi postami (opcjonalnie).  
4. **Widok statystyk** – wykresy i raporty pokazujące efektywność opublikowanych postów. 

### Tabela postów

| Kolumna | Opis |
|---------|-----|
| **Post ID** | Unikalny identyfikator posta (z GBP API, np. `post_id`). |
| **Lokalizacja** | Nazwa lokalizacji (jeśli obsługujesz wiele wizytówek). |
| **Tytuł / nagłówek** | Skrócony tekst posta (np. pierwsze 30 znaków). |
| **Status** | `planned`, `publishing`, `published`, `failed`. Pozwala szybko ocenić, które posty zostały opublikowane, a które czekają w kolejce. |
| **Scheduled at / Published at** | Termin planowanej publikacji (jeśli `status = planned`) lub data rzeczywistego opublikowania. |
| **Impressions** | Liczba wyświetleń wpisu (dane z GBP API, Google Insights). |
| **Clicks / CTA** | Liczba kliknięć (w link, w przycisk) – jeśli dostępne. |
| **Akcje** | Edycja (edit), duplikuj, usuń, retry (w przypadku statusu `failed`). |

### Widok edycji / dodawania postu

- **Format posta**: Google dopuszcza kilka typów wpisów (Oferty, Wydarzenia, Aktualności). Wybór typu determinować będzie dostępne pola (termin ważności, przycisk CTA etc.).
- **Pola formularza**: 
  - Tekst / opis postu (max ok. 1500 znaków, zalecane krótsze wpisy). 
  - Media (URL, upload zdjęcia w formacie JPG/PNG; w wersji API `media.create` w GBP) – możliwość podglądu. 
  - Przycisk CTA (Call to action) – wybór spośród dostępnych opcji (np. „Learn more”, „Order online”, „Call now”, „Book”, „Sign up”). 
  - Link docelowy CTA. 
  - Daty (w przypadku ofert / wydarzeń – data rozpoczęcia i zakończenia). 
  - Harmonogram publikacji (data/godzina) – w momencie zapisania post jest dodawany do kolejki i worker Cron publikuje go w odpowiednim czasie. 
- **Podgląd** – panel pokazujący, jak wpis będzie wyglądał w Google (na desktopie i mobile). 
- **Przyciski**: `Zapisz & publikuj teraz`, `Zapisz & zaplanuj`, `Anuluj`. 

### Widok statystyk

- Wykresy i tabele pokazujące liczbę wyświetleń (`impressions`), kliknięć (`clicks`), kliknięć w CTA (`actions`) w czasie. 
- Możliwość porównania wariantów A/B (jeśli stosujesz testy). 
- Filtry: lokalizacja, typ posta, zakres dat. 

## Dane / Model danych

Poniżej przykładowa struktura danych przechowywanych w bazie (Convex) dla postów. Kluczowe pola zgodne z GBP API `localPosts.create`【349133258761552†L100-L117】.

```json
{
  "posts": [
    {
      "id": "p101",
      "locationId": "loc1",
      "title": "Promocja Zima",
      "content": "Skorzystaj z 20% zniżki na wszystkie usługi!",
      "mediaUrl": "https://example.com/image.jpg",
      "cta": "ORDER_ONLINE",
      "ctaUrl": "https://twojsklep.pl/promocja",
      "type": "OFFER",
      "startTime": "2025-11-28T08:00:00Z",
      "endTime": "2025-12-05T23:59:00Z",
      "scheduledAt": "2025-11-27T09:00:00Z",
      "publishedAt": "2025-11-27T09:01:00Z",
      "status": "published",
      "impressions": 512,
      "clicks": 20,
      "actions": 5
    }, …
  ]
}
```

Zwróć uwagę, że `status` i wyniki (`impressions`, `clicks`, `actions`) są pobierane z Google Business Profile API (Insights) lub synchronizowane w tle przez worker.

## Harmonogram (scheduler)

Publikacja zaplanowanych postów odbywa się poprzez worker Cron w backendzie (np. w Convex). Proces:

1. Użytkownik tworzy post, ustawia `scheduledAt`. Dane są zapisywane w bazie z `status=planned`. 
2. Scheduler (job) uruchamia się np. co minutę; sprawdza, które posty mają `scheduledAt <= now` i `status=planned`. 
3. Worker wywołuje `accounts.locations.localPosts.create` w Google Business Profile API, przekazując treść, typ, daty, CTA i media. 
4. Po otrzymaniu sukcesu, backend aktualizuje `status=published` i zapisuje `publishedAt`. 
5. W przypadku błędu (np. quota exceeded, invalid media) – ustawia `status=failed` i zapisuje komunikat błędu do logów. 

W razie potrzeby można dodać mechanizm powtórnej próby (retry) oraz powiadomienie użytkownika o błędach.

## Akcje / Flow użytkownika

1. **Dodawanie posta** – użytkownik klika „Dodaj post”, wypełnia formularz (teksty, media, CTA, daty). Wybiera publikację natychmiastową („Publikuj teraz”) albo planuje datę. Po zapisaniu pojawia się w tabeli z `status=planned` lub `status=publishing`.
2. **Edycja posta** – w tabeli kliknięcie w wiersz otwiera formularz z danymi posta. Użytkownik może edytować treść, media, daty (o ile post nie został opublikowany). 
3. **Duplikacja** – przycisk „Duplikuj” tworzy nowy wpis z tymi samymi danymi (status=planned) – można szybko powtarzać kampanie. 
4. **Usuwanie** – przycisk „Usuń” (dla `planned` lub `failed`) – modal potwierdzenia. 
5. **Retry / wznowienie** – dla statusu `failed` użytkownik klika „Retry” – system ponawia próbę publikacji. 
6. **Podgląd statystyk** – kliknięcie w ikonę statystyk pokazuje wyniki wpisu (wyświetlenia, kliknięcia, konwersje). 

## Stany UI

- **Loading** – skeleton tabeli, placeholdery formularza. 
- **Empty** – jeśli brak postów – komunikat „Brak postów. Kliknij ‚Dodaj post’, aby utworzyć pierwszy wpis.” 
- **Error** – komunikat, jeśli nie uda się pobrać listy postów lub zaplanować wpisu. 
- **Success** – toast po opublikowaniu posta, zmianie statusu, usunięciu etc. 

## Powiązania z innymi modułami

- **Dashboard:** liczba zaplanowanych / opublikowanych postów jest prezentowana jako KPI na dashboardzie. 
- **Smart Tasks:** zadania mogą sugerować publikację postu (np. „Opublikuj post co tydzień”). 
- **Wizytówka:** sekcja edycji profilu (np. kategorie) może wpływać na treści postów (sugestie). 
- **Raporty:** efektywność kampanii postów (impressions, clicks, CTR) powinna być dostępna w raportach. 

## Notyfikacje / Feedback

- **Toast** informujący o sukcesie publikacji, duplikacji, usunięcia. 
- **Modal** potwierdzający publikację zaplanowaną (z informacją, że wpis zostanie opublikowany w wybranym terminie). 
- **Alert** w przypadku błędu API (np. „Nie udało się opublikować – przekroczony limit API” + link do powtórki). 


