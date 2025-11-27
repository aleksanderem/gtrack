# Wizytówka (Business Information)

## Cel

Moduł „Wizytówka” (Business Info) pozwala na zarządzanie podstawowymi danymi wizytówki Google Business Profile (GBP): nazwa firmy, adres, dane kontaktowe, kategorie, opis, godziny otwarcia, media (logo/cover), usługi, atrybuty. Użytkownik może tutaj wprowadzać zmiany, przeglądać historię zmian, oraz chronić wizytówkę przed nieautoryzowanymi edycjami.

## Nawigacja

> **Ścieżka:** Zarządzanie → Wizytówka  
> **Dostęp:** Użytkownicy z uprawnieniami do edycji profilu (rola _owner_, _admin_). Użytkownicy _viewer_ mają jedynie podgląd.  
> W Settings Module (Gitbook), „Business Settings” oraz „Keywords”, „Grid Configuration”, „Frequency” i „Notifications” są sekcjami ustawień【821247880328350†L135-L199】. Ten plik opisuje głównie zarządzanie samą wizytówką.

## Layout / Układ

Strona jest podzielona na zakładki (tabs) lub sekcje w panelu bocznym (drawer) — w zależności od implementacji. Główne sekcje:

1. **Informacje ogólne (General)** – nazwa firmy, adres, numer telefonu, strona WWW, opis. 
2. **Kategorie i usługi** – kategoria główna oraz dodatkowe kategorie (z autouzupełnianiem); lista usług / produktów (opcjonalnie). 
3. **Godziny otwarcia** – standardowe godziny, godziny specjalne, dni wolne, 24/7. 
4. **Media (Logo & Cover)** – przesyłanie / aktualizacja logo, zdjęcia tła (cover) oraz innych zdjęć powiązanych z profilem (pogląd z modułu Media). 
5. **Atrybuty (Attributes)** – dostępność (np. _dostępność dla wózków inwalidzkich_), udogodnienia (np. _Wi-Fi_, _Dostawa_, _Parking_), płatności.  
6. **Historia zmian** – lista wszystkich zmian wykonanych w profilu z informacją kto, co, kiedy; możliwość porównania przed/po i ewentualnego przywrócenia. 
7. **Ochrona / Alerty** – miejsce, gdzie można zobaczyć, czy Google wprowadził nieautoryzowane zmiany (Google updates) i je zaakceptować/odrzucić【821247880328350†L135-L148】.  

### Responsywność

- W widoku desktop – sekcje mogą być rozmieszczone w 2 kolumnach (np. informacje ogólne po lewej, godziny i kategorie po prawej). W widoku mobile – sekcje układane są w pionie.

## Komponenty / Widżety

| Komponent | Opis |
|-----------|-----|
| **Formularz edycji pola** | Każde pole (nazwa, adres, telefon) ma: etykietę, wartość oraz ikonę edycji. Kliknięcie ikonki otwiera tryb edycji (Inplace) – pole wejściowe, walidacja i przyciski „Zapisz” / „Anuluj”. Używaj komponentu `Inplace` (PrimeVue) z design systemu. |
| **Autocomplete kategorii** | Pole, które wyszukuje kategorie Google (główna i dodatkowe). Z listy można dodać więcej niż jedną kategorię. |
| **Lista usług / produktów** | Tabela lub lista, w której można dodawać/usuwać usługi wraz z opisem i ceną (opcjonalnie). |
| **Godziny otwarcia** | Komponent z listą dni tygodnia. Każdy dzień ma pola „Od” i „Do” + opcja „Zamknięte”. Możliwość kopiowania godzin na inne dni. Dodawanie godzin specjalnych (holidays). |
| **Upload logo/cover** | Komponent do przesyłania pliku (drag & drop) lub wprowadzenia URL. Podgląd pliku oraz walidacja formatu (JPEG/PNG) i rozmiaru. |
| **Atrybuty** | Lista przełączników / checkboxów do zaznaczania (np. „Wi-Fi”, „Dostawa”, „Dla wegan”). Możliwość rozwijania sekcji. |
| **Historia zmian** | DataTable z kolumnami: data, użytkownik, pole, stara wartość, nowa wartość, akcja (przywróć). Wiersze pogrupowane według daty. |
| **Google Updates / Ochrona** | Lista proponowanych zmian (od Google lub innych użytkowników) – np. `diffMask` z pola `getGoogleUpdated`. Dla każdego – przyciski „Zaakceptuj” / „Odrzuć” / „Przywróć poprzednią wersję”. |

## Dane / Model danych

Przykładowa struktura danych dla wizytówki (bazująca na Google Business Profile API):

```json
{
  "business_profile": {
    "locationId": "loc1",
    "name": "Kawiarnia Róża",
    "address": {
      "street": "ul. Kwiatowa 5",
      "city": "Warszawa",
      "postalCode": "00-123",
      "country": "PL"
    },
    "phone": "+48 123 456 789",
    "website": "https://kawiarnia-roza.pl",
    "description": "Przytulna kawiarnia serwująca świeżo paloną kawę.",
    "primaryCategory": "Coffee shop",
    "additionalCategories": ["Cafe", "Patisserie"],
    "services": [ {"id": "s1", "name": "Espresso", "price": "10 PLN"}, … ],
    "hours": [
      {"day": "MONDAY", "open": "08:00", "close": "20:00"},
      …
    ],
    "specialHours": [ {"date": "2025-12-25", "open": "", "close": "", "closed": true} ],
    "attributes": ["Wi-Fi", "Parking", "Wheelchair Accessible"],
    "logoUrl": "https://.../logo.jpg",
    "coverUrl": "https://.../cover.jpg"
  },
  "change_history": [
    {
      "id": "ch1",
      "timestamp": "2025-11-20T08:00:00Z",
      "user": "admin@kawiarnia.pl",
      "field": "phone",
      "oldValue": "+48 987 654 321",
      "newValue": "+48 123 456 789"
    }, …
  ],
  "google_updates": [
    {
      "locationId": "loc1",
      "diffMask": "primaryPhone,primaryCategory",
      "googleData": { "primaryPhone": "+48 987 000 000", "primaryCategory": "Coffee shop" },
      "lastModifiedTime": "2025-11-22T10:00:00Z"
    }
  ]
}
```

## Akcje / Flow użytkownika

1. **Edycja pola** – użytkownik kliknie ikonę edycji obok pola (np. numer telefonu), pojawia się `Inplace` z polem input i przyciskami „Zapisz” / „Anuluj”. Po wprowadzeniu zmiany – walidacja (format numeru, długość opisu). Kliknięcie „Zapisz” wywołuje mutację Convex (`api.organizations.updateSettings` lub analogiczne w twoim backendzie)【821247880328350†L100-L127】. 
2. **Zmiana kategorii** – w autouzupełnianiu wybór nowej kategorii; zapisana po kliknięciu „Zapisz”. 
3. **Dodanie/usunięcie usługi** – w tabeli usług przyciski „Dodaj” (otwarcie modala), „Edytuj” (edycja wiersza), „Usuń” (modal z potwierdzeniem). 
4. **Aktualizacja godzin** – wprowadzenie godzin dla każdego dnia; możliwość kopiowania na kolejne dni; zapisanie. 
5. **Upload logo/cover** – drag & drop pliku lub wklejenie URL; zapisanie generuje nowe `MediaItem` w module media i aktualizuje profil. 
6. **Akceptacja/Odrzucenie Google Update** – w sekcji ochrony kliknięcie w propozycję zmian; możesz wybrać `Zaakceptuj` (aktualizuje profil) lub `Odrzuć` (wysyła patch przywracający poprzednie wartości). 
7. **Podgląd historii** – użytkownik może sortować / filtrować historię po dacie, polu, użytkowniku; kliknięcie w wiersz pokazuje szczegóły (stara vs nowa wartość) i ewentualnie pozwala przywrócić starą wartość (Rollback). 

## Stany UI

- **Loading** – skeletony pól i list. 
- **Empty** – jeżeli profil nie jest kompletny (np. brak kategorii) – wyświetl informację i CTA „Dodaj kategorię”. 
- **Error** – w przypadku błędu API (np. nie udało się zapisać zmiany) – komunikat i przycisk „Spróbuj ponownie”. 
- **Success** – toast informujący o zapisaniu danych. 

## Powiązania z innymi modułami

- **Media** – przesyłane pliki są widoczne w module Media. Zmiana logo lub covera powinna od razu odzwierciedlić się w galerii. 
- **Audyt / Smart Tasks** – brak uzupełnionych pól (np. brak opisu, brak godzin) będzie generował rekomendacje w audycie i zadania SEO. 
- **Monitoring & Protection** – zmiany profilu (szczególnie wrażliwe pola: nazwa, telefon, adres) będą monitorowane; nieautoryzowane zmiany będą zgłaszane w module ochrony. 

## Notyfikacje / Feedback

- **Toast** po udanym zapisaniu zmian („Zapisano zmiany w profilu”). 
- **Alert** w sekcji ochrony, jeśli Google wprowadził zmiany – np. zmiana telefonu. 
- **Modal** przy potwierdzaniu usunięcia usługi lub przywróceniu poprzedniej wersji. 


