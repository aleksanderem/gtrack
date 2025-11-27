# Monitoring & Protection

## Cel
Moduł Monitoring & Protection pełni rolę strażnika wizytówki. Odpowiada za wykrywanie i rejestrowanie wszelkich zmian w profilu, incydentów dotyczących opinii, postów i mediów oraz powiadamianie użytkownika o nietypowych zdarzeniach. Umożliwia szybkie reagowanie na nieautoryzowane zmiany i przywracanie poprzedniego stanu danych.

## Nawigacja
Menu główne → **Zarządzanie** → **Monitoring & Protection**. Dostęp dla ról `owner` oraz `manager`.

## Layout / Układ

- **Nagłówek** z krótkim opisem funkcji modułu i licznikiem otwartych incydentów.
- **Alert Center / Log incydentów** – tabela z wszystkimi zdarzeniami wykrytymi przez system wraz z typem, datą, statusami i możliwością przejścia do szczegółów.
- **Sekcja Historia zmian profilu** – prezentuje chronologiczną listę zmian w profilu (nazwa, adres, telefon, kategorie, opis, godziny, atrybuty, media) wraz z informacją o tym, czy zmiana była autoryzowana i możliwością przywrócenia starej wartości.
- **Sekcja Usunięte / zmienione recenzje** – log recenzji, które zniknęły lub uległy zmianie, z informacją o dacie i szczegółach treści. Możliwość eksportu.
- **Panel statystyk ochrony** – wykresy i wskaźniki obrazujące liczbę incydentów w czasie, średni czas reakcji (Mean Time To Respond – MTTR) oraz liczbę zmian przywróconych vs zaakceptowanych.
- **Filtry i sortowanie** – dostępne we wszystkich listach: filtr po typie incydentu (zmiana profilu, usunięta recenzja, błąd posta, zmiana mediów), statusie (nowy, w toku, rozwiązany), dacie i powiązanej lokalizacji.

## Komponenty / Widżety

| Komponent | Funkcja |
|-----------|---------|
| **IncidentTable** | tabela z listą incydentów; kolumny: `date`, `type` (profil, recenzja, post, media, inne), `description`, `status` (new/in-progress/resolved), `location`, `actions` (view, resolve, ignore). |
| **IncidentDetail Drawer** | szczegóły incydentu: pełny opis, powiązane elementy (np. recenzja, pole profilu), proponowane działanie (przywróć/zaakceptuj/oznacz), notatki i historię zmian statusu. |
| **ChangeHistory Table** | chronologiczna lista zmian w wizytówce: `timestamp`, `field`, `oldValue`, `newValue`, `changedBy` (system/user), `status` (auto/authorized/unrecognized). |
| **RemovedReviews List** | lista recenzji znikniętych lub zmienionych: `reviewId`, `author`, `rating`, `createdAt`, `removedAt`, `oldContent`, `newContent (if edited)` – możliwość eksportu do CSV. |
| **ProtectionStats Cards** | karty statystyk: liczba incydentów (7 dni / 30 dni), MTTR, liczba incydentów przywróconych, liczba incydentów zaakceptowanych. |
| **Filters Bar** | wybór zakresu dat, typów incydentów, statusu, lokalizacji. |
| **Bulk Actions Bar** | dla wielu zaznaczonych incydentów: akcje zbiorcze (oznacz jako rozwiązane, zignorowane). |

## Dane / Model danych

### Incident

```json
{
  "id": "string",              // unikatowy identyfikator incydentu
  "locationId": "string",      // powiązana wizytówka
  "type": "enum",              // PROFILE_CHANGE, REVIEW_REMOVED, POST_ERROR, MEDIA_CHANGE, OTHER
  "description": "string",      // opis incydentu
  "field": "string | null",     // np. 'phone', 'category', 'media'
  "oldValue": "any | null",     // poprzednia wartość (jeśli dotyczy)
  "newValue": "any | null",     // nowa wartość (jeśli dotyczy)
  "createdAt": "timestamp",    // data wykrycia incydentu
  "status": "enum",            // NEW, IN_PROGRESS, RESOLVED, IGNORED
  "evidence": "object | null", // dodatkowe dane (np. snapshoty, treść recenzji)
  "updatedAt": "timestamp"
}
```

### ReviewChangeLog

```json
{
  "reviewId": "string",
  "locationId": "string",
  "author": "string",
  "rating": 1-5,
  "oldContent": "string",
  "newContent": "string | null",
  "createdAt": "timestamp",
  "removedAt": "timestamp | null"
}
```

### ChangeEntry

```json
{
  "locationId": "string",
  "timestamp": "timestamp",
  "field": "string",            // np. 'name', 'phone', 'category', 'hours', 'media'
  "oldValue": "any",
  "newValue": "any",
  "changedBy": "enum",         // USER, GOOGLE_UPDATE, SYSTEM
  "authorized": "boolean"       // czy zmiana była autoryzowana
}
```

## Stany UI

- **Loading** – skeleton tabel i kart w trakcie pobierania danych.
- **Empty** – brak incydentów → komunikat „Brak nowych incydentów” oraz link do historii zmian.
- **New incidents** – incydenty oczekujące; w tabeli wyróżnione kolorystycznie. Po kliknięciu otwierają panel szczegółów.
- **Resolved / Ignored** – incydenty rozwiązane lub odrzucone; domyślnie ukrywane w głównej liście, dostępne w historii.
- **Error** – błąd pobierania / przetwarzania incydentów; komunikat z możliwością ponowienia.

## Flows / Przebiegi

1. **Detekcja zdarzeń** – system monitoringowy (np. scheduler co X godzin lub event-driven via notifications) analizuje profil i recenzje. Gdy wykryje zmianę (np. inny numer telefonu) lub zniknięcie recenzji, tworzy rekord `Incident` oraz `ChangeEntry` w bazie.
2. **Powiadomienie** – na panelu Monitoring & Protection pojawia się nowy alert; dodatkowo system może wysłać powiadomienie e-mail/SMS/webhook w zależności od ustawień.
3. **Analiza i akcja** – użytkownik otwiera incydent w panelu. Widzi stare i nowe wartości, może podjąć decyzję: zaakceptować zmianę (oznaczyć jako RESOLVED), zignorować (IGNORED), albo przywrócić starą wartość (np. poprzez moduł Wizytówki – edycja profilu). W przypadku recenzji usuniętych – może zapisać do archiwum. Po podjęciu akcji system aktualizuje status incydentu.
4. **Historia zmian** – w zakładce „Historia zmian profilu” użytkownik może przejrzeć wszystkie zmiany (autoryzowane i nieautoryzowane) oraz cofnąć się do snapshotu bazowego.

## Integracja z planami

Zgodnie z konfiguracją funkcji w systemie GTRACk, niektóre możliwości monitoringu mogą być dostępne tylko w wyższych planach. Przykładowo, funkcje auto‑odpowiedzi i monitorowania zdjęć są włączone w planie PROFESSIONAL【785274141478433†screenshot】. Moduł monitoringu powinien brać to pod uwagę i wyświetlać odpowiednie alerty oraz generować incydenty tylko dla aktywnych funkcji planu.
