# Media / Zdjęcia / Wideo

## Cel
Moduł Media umożliwia zarządzanie wszystkimi multimediami powiązanymi z wizytówką Google – zdjęciami i filmami. Pozwala na przegląd, dodawanie, edycję, usuwanie mediów oraz monitorowanie zmian (dodanie, usunięcie, modyfikacja) w kontekście ochrony wizytówki. Stanowi źródło danych dla audytu (ocena kompletności galerii) oraz generatora zadań (np. zadania „dodaj zdjęcia wnętrza”).

## Nawigacja
Menu główne → **Zarządzanie** → **Media / Zdjęcia**. Strona dostępna dla użytkowników posiadających uprawnienia do edycji lokalizacji.

## Layout / Układ

- Pasek nagłówka z tytułem „Media” i przyciskami akcji: „Dodaj media”, „Snapshot now”.
- **Galeria miniaturek** (grid) – domyślny widok: kafelki przedstawiające miniatury zdjęć/filmów z badge określającym kategorię (cover, logo, interior, exterior, product, other) i ikoną typu (foto / wideo).
- **Widok listy** (alternatywa) – tabela z metadanymi dla każdego media: miniatura, kategoria, typ, data dodania/modyfikacji, wymiary, rozmiar, status, akcje.
- **Drawer / Modal szczegółów** – po kliknięciu media otwiera się panel boczny z pełnym obrazem/wideo, informacjami szczegółowymi i przyciskami (usuń, pobierz, ustaw jako cover/logo, edytuj kategorię).
- **Panel historii i snapshotów** – lista snapshotów z datą wykonania oraz log zmian (dodane, usunięte, zmodyfikowane media) z możliwością przywrócenia.
- **Filtry i sortowanie** – panel filtrów (kategoria, typ, data, status) oraz sortowania (data, typ, kategoria). Możliwość wyszukiwania (po tagach/opisie, jeśli dostępne).

## Komponenty / Widżety

| Komponent | Funkcja |
|-----------|---------|
| **GalleryGrid** | Wyświetla media w formie kafelków; każdy kafelek pokazuje miniaturę, ikonę typu (foto/wideo), badge kategorii (cover/logo/interior/exterior/product/other). Kliknięcie otwiera szczegóły. |
| **MediaListTable** | DataTable z kolumnami: miniatura, kategoria, typ (PHOTO/VIDEO), data dodania, wymiary (px), rozmiar (MB/KB), status (LIVE/PENDING/REMOVED), akcje (usuń, pobierz, ustaw jako cover/logo). Umożliwia sortowanie i filtrowanie. |
| **MediaDetailsDrawer** | Panel boczny z pełnym obrazem/wideo, informacjami: `id`, `category`, `mediaType`, `url`, wymiary (`metadata.width`/`height`), `sizeBytes`, data utworzenia/modyfikacji, status. Przyciski: „Usuń”, „Pobierz”, „Ustaw jako cover/logo”, „Edytuj kategorię”. |
| **SnapshotPanel** | Sekcja z listą snapshotów: każda pozycja zawiera datę wykonania i liczbę mediów; kliknięcie pokazuje szczegóły zmian (dodane/usunięte/zmodyfikowane). Możliwość przywrócenia poprzedniego stanu mediów. |
| **HistoryLog** | Lista zmian mediów: `timestamp`, `mediaId`, `changeType` (added/deleted/modified), `oldCategory`, `newCategory`, `oldUrl`, `newUrl`. |
| **FilterBar** | Filtry: kategoria (multi-select), typ media, data (range), status. Pola tekstowe do wyszukiwania (jeśli implementujesz tagi/ opisy). |
| **Bulk Actions Bar** | Pokazuje się po zaznaczeniu wielu mediów; umożliwia masowe usunięcie, pobranie, zmianę kategorii. |

## Dane / Model danych

### MediaItem

Każde medium jest reprezentowane przez strukturę:

```json
{
  "id": "string",            // ID zwracany przez GBP API
  "locationId": "string",    // ID wizytówki
  "category": "string",      // COVER, LOGO, INTERIOR, EXTERIOR, PRODUCT, OTHER
  "mediaType": "string",     // PHOTO lub VIDEO
  "url": "string",           // adres URL (jeśli API zwraca)
  "metadata": {
    "width": 1920,
    "height": 1080,
    "sizeBytes": 234567
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "status": "string"         // LIVE, PENDING, REMOVED
}
```

### MediaSnapshot

```json
{
  "id": "string",
  "locationId": "string",
  "fetchedAt": "timestamp",
  "mediaItems": [MediaItem, ...]
}
```

### MediaChangeLog

```json
{
  "id": "string",
  "locationId": "string",
  "snapshotBefore": "snapshotId",
  "snapshotAfter": "snapshotId",
  "changes": [
    {
      "mediaId": "string",
      "type": "added | deleted | modified",
      "oldValue": "object | null",
      "newValue": "object | null"
    }
  ],
  "timestamp": "timestamp",
  "resolved": false
}
```

## Stany UI

- **Loading** – skeleton dla galerii i tabeli podczas pobierania mediów.
- **Empty** – brak mediów → pokazuje komunikat „Brak zdjęć/wideo” z przyciskiem „Dodaj media”.
- **Pending** – media w statusie `PENDING` (oczekujące na weryfikację Google) – wyróżnione specjalnym badge i ikoną. Po zatwierdzeniu zmieniają status na `LIVE`.
- **Error** – błąd pobrania mediów / usunięcia – komunikat + możliwość ponowienia.

## Flows / Przebiegi

1. **Pobranie mediów** – przy wejściu do modułu strona wykonuje zapytanie do API Convex/GBP, które zwraca listę mediów. Zapisuje listę w stanie i wyświetla galerię oraz tabelę.
2. **Dodawanie mediów** – użytkownik klika „Dodaj media”, wybiera plik(i) lub podaje URL. Wybiera kategorię (cover/logo/inne). Następnie system wykonuje `media.create` (GBP API), a po sukcesie – aktualizuje listę mediów i wysyła do audytu / historii. Po dodaniu plik otrzymuje status `PENDING` do czasu zatwierdzenia przez Google.
3. **Usuwanie mediów** – użytkownik klika „Usuń” na kafelku/tabeli. Pojawia się modal potwierdzenia. Po potwierdzeniu aplikacja wykonuje `media.delete` (GBP API), zapisuje tę zmianę w `MediaChangeLog`, aktualizuje stan i generuje incydent w module Monitoring & Protection.
4. **Edycja kategorii / ustawienie jako cover/logo** – w panelu szczegółów można zmienić kategorię. Dla cover/logo może wymagać specyficznego endpointu lub parametru w `media.create` / `update`. Po zmianie system aktualizuje listę, zapisuje do logu zmian i generuje incydent.
5. **Snapshot & Historia** – scheduler (np. co 6-24h) lub ręcznie (Snapshot now) wykonuje snapshot aktualnej listy mediów i porównuje z poprzednim snapshotem. Jeśli wykryte są różnice (media dodane, usunięte, zmodyfikowane), system tworzy wpis w `MediaChangeLog` oraz incydent w Monitoring & Protection, aby użytkownik mógł zareagować. Możliwość porównania snapshotów i przywrócenia poprzedniego stanu (rollback) dla poszczególnych mediów.

## Integracja z planami i audytem

W systemie funkcji GTRACk foto monitoring (`photoMonitoring`) jest dostępny w planie PROFESSIONAL, natomiast w planie BASIC jest wyłączony【785274141478433†screenshot】. Oznacza to, że:

- W planie BASIC użytkownik może przeglądać i dodawać media, ale automatyczne monitorowanie zmian (snapshots i incydenty) oraz notyfikacje o usunięciu zdjęć mogą być ograniczone.
- W planie PROFESSIONAL moduł Media w pełni współpracuje z Monitoring & Protection: snapshoty są wykonywane automatycznie, zmiany mediów generują incydenty, a zadania w Smart Tasks mogą być tworzone w oparciu o wykryte braki w galerii.
