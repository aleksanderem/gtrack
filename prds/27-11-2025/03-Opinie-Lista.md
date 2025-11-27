# Opinie → Lista (Reviews List)

## Cel

Moduł „Lista opinii” służy jako główny inbox do przeglądania i zarządzania wszystkimi recenzjami Google. Pozwala użytkownikowi filtrować recenzje, odpowiadać na nie, oznaczać jako przeczytane, usuwać lub eksportować dane. To tutaj operatorzy spędzają najwięcej czasu w codziennej obsłudze klientów.

## Nawigacja

> **Ścieżka:** Zarządzanie → Opinie → Wszystkie opinie  
> **Dostęp:** Użytkownicy z rolą _admin_, _owner_, _manager_ (również pracownicy biura obsługi).  

## Layout / Układ

1. **Nagłówek / Panel filtrów** – zawiera tytuł „Wszystkie opinie” oraz pasek narzędzi do filtrowania i wyszukiwania recenzji. Filtry obejmują: zakres dat, ocenę (1–5 gwiazd), status odpowiedzi (odpowiedziane / nieodpowiedziane), usunięte recenzje, opinie wewnętrzne (Intercepted), sortowanie (najnowsze / najstarsze). 
2. **Tabela / DataTable** – główny komponent wyświetlający listę recenzji w wierszach; kolumny (mniej na mobile, więcej na desktop). Zobacz szczegóły poniżej. 
3. **Panel akcji** – pojawia się, gdy zaznaczono recenzje (checkboxy w wierszach); umożliwia masowe operacje (np. oznacz jako przeczytane, usuń, eksportuj). 
4. **Drawer / Modal odpowiedzi** – po kliknięciu recenzji otwiera się panel szczegółowy z treścią opinii, informacjami o autorze, datą, oceną i polem do odpowiedzi. Możliwość użycia szablonu lub autoodpowiedzi. 

## Tabela (DataTable)

### Kolumny

- **Checkbox / Selektor** – umożliwia zaznaczanie recenzji w celu wykonania masowej akcji.
- **Data** – data dodania recenzji (sortowalna).
- **Autor / użytkownik** – nazwa nadawcy opinii (i ewentualne oznaczenie _Local Guide_).
- **Ocena** – gwiazdki (1–5) w formie ikon; sortowalna.
- **Treść** – skrócona treść recenzji (pokaż pierwszych 80–100 znaków); po najechaniu lub kliknięciu – rozwinięcie w drawerze.
- **Status odpowiedzi** – etykieta lub ikona informująca, czy odpowiedziano („Odpowiedziano” / „Bez odpowiedzi”).
- **Akcje** – przyciski (małe ikony) do szybkich operacji: _Odpowiedz_, _Usuń_, _Oznacz jako przeczytane_, _Flaguj_. W przypadku wąskiego ekranu, akcje mogą być ukryte w rozwijanym menu (ellipsis). 

### Filtry / Sortowanie

- Zakres dat (date picker). 
- Ocena (1–5 gwiazd, wielokrotne wybory). 
- Status odpowiedzi (odpowiedziane / nieodpowiedziane). 
- Usunięte recenzje (pokaż/ukryj). 
- Wersja mobile: wyszukiwanie po słowach kluczowych w treści. 
- Sortowanie po dacie (domyślnie najnowsze), po ocenie. 

### Paginacja / Ładowanie

- Użyj paginacji (np. 10–25 recenzji na stronę) lub infinite scroll (w zależności od preferencji UX). 
- Gdy lista jest pusta (po filtrze) – wyświetl komunikat „Brak recenzji spełniających kryteria”. 

### Stan

- **Loading:** skeleton wierszy tabeli. 
- **Empty:** informacja „Brak recenzji”. 
- **Error:** komunikat z możliwością ponowienia. 

## Odpowiadanie na recenzję

Po kliknięciu przycisku _Odpowiedz_ w wierszu lub kliknięciu całego wiersza, otwiera się **Panel odpowiedzi** (Drawer lub Modal). Zawiera:

- **Podgląd recenzji**: treść, ocena gwiazdkowa, data, autor, ewentualne zdjęcia. 
- **Pole odpowiedzi**: duże pole tekstowe; przyciski do wstawienia szablonu odpowiedzi lub wygenerowania autoodpowiedzi. 
- **Lista szablonów** (rozwijane menu): szybki wybór gotowego tekstu. 
- **Przycisk Wyślij**: wysyła odpowiedź poprzez API Google Business Profile (jeśli wpięte). 
- **Przycisk Odrzuć / Anuluj**: zamyka drawer bez wysyłania. 
- **Informacja o stanie**: np. „Nie można wysłać odpowiedzi – brak uprawnień” lub „Odpowiedź zostanie opublikowana po zatwierdzeniu”.

Szablony odpowiedzi oraz auto-odpowiedzi są konfigurowane w innych sekcjach (poniżej). 

## Szablony odpowiedzi

Plik `03-Opinie-Lista.md` może zawierać sekcję lub link do konfiguracji szablonów. Szablony są częścią modułu i służą do ujednolicenia tonu odpowiedzi. Konfiguracja obejmuje:

- **Lista szablonów**: nazwa + treść. 
- **Dodawanie / edycja szablonu**: formularz z nazwą i treścią (z placeholderami {imie}, {data}, {nazwa usługi} itp.). 
- **Usuwanie**: opcja usunięcia szablonu. 
- **Podgląd**: przycisk do podglądu, jak szablon będzie wyglądał z przykładowymi danymi. 

Szablony są wykorzystywane przy ręcznej odpowiedzi oraz mogą być podstawą dla auto-odpowiedzi.

## Auto-odpowiedzi

Auto-odpowiedzi są ustawiane w sekcji „Auto-odpowiedzi” w module Opinie. Dostępne opcje:

- **Aktywacja / dezaktywacja** autoodpowiedzi. 
- **Reguły:** definiuj, kiedy automat ma odpowiedzieć (np. na każdą recenzję > 4 gwiazdki, recenzję < 3 gwiazdki, recenzję bez odpowiedzi po X dniach). 
- **Szablon odpowiedzi:** wybór szablonu albo generowanie odpowiedzi AI (jeśli dostępne). 
- **Moderacja:** opcja „Zatwierdzaj automatyczne odpowiedzi przed wysłaniem” lub „Wysyłaj automatycznie”【718814200998643†L189-L198】. 
- **Historia auto-odpowiedzi:** lista recenzji, na które automatycznie odpowiedziano, wraz z datą, treścią i statusem (sukces / błąd). 

## Dane / Model danych

```json
{
  "reviews": [
    {
      "id": "r123",
      "date": "2025-11-24T10:00:00Z",
      "author": "Jan Kowalski",
      "rating": 5,
      "text": "Świetna obsługa i pyszna kawa!",
      "answered": true,
      "deleted": false,
      "sentiment": "positive"
    },
    …
  ],
  "templates": [
    {"id": "t1", "name": "Podziękowanie", "body": "Dziękujemy za wizytę i ciepłe słowa!"}, …
  ],
  "autoReplySettings": {
    "enabled": true,
    "rules": [ {"ratingLessOrEqual": 3, "templateId": "t1"} ],
    "moderate": true
  }
}
```

## Akcje / Flow użytkownika

1. **Filtrowanie** – użytkownik ustawia filtry w panelu (np. ocena = 1–3, status: bez odpowiedzi). Komponent wywołuje zapytanie do API i aktualizuje listę.
2. **Zaznaczanie** – klik na checkbox w wierszu dodaje recenzję do zbioru zaznaczonych. Pojawia się pasek masowych akcji (bulk). 
3. **Odpowiadanie** – kliknięcie w przycisk „Odpowiedz” otwiera panel odpowiedzi z polem tekstowym i listą szablonów. Po wypełnieniu odpowiedzi i naciśnięciu „Wyślij” – zapytanie do API i odświeżenie listy.
4. **Użycie szablonu** – użytkownik wybiera szablon z listy; body odpowiedzi jest wypełniane automatycznie (można edytować przed wysłaniem).
5. **Usuwanie** – przycisk „Usuń” przy recenzji pozwala usunąć recenzję (jeżeli jest to dozwolone, np. w przypadku opinii prywatnych). Powinien pojawić się modal z potwierdzeniem. 
6. **Masowe akcje** – zaznaczenie wielu recenzji otwiera pasek z akcjami (oznacz jako przeczytane, usuń, wyeksportuj CSV). 
7. **Eksport** – kliknięcie „Eksportuj” generuje plik CSV/JSON z filtrami zastosowanymi w danej chwili.

## Stany UI

- **Loading** – skeleton wierszy przy wczytywaniu listy recenzji. 
- **Empty** – jeśli brak recenzji spełniających filtry – pokaz komunikat „Brak recenzji dla wybranych kryteriów”. 
- **Error** – w razie błędu pobierania danych – informacja + przycisk „Spróbuj ponownie”. 

## Powiązania z innymi modułami

- **Pozyskiwanie opinii:** przycisk na górze listy lub w panelu statystyk może przenosić do sekcji, gdzie generuje się linki QR / prośby o recenzje.
- **Auto-odpowiedzi:** link do ustawień auto-odpowiedzi z poziomu listy (np. w przypadku recenzji bez odpowiedzi). 
- **Monitoring & Protection:** usunięte recenzje są prezentowane tutaj z etykietą (np. `deleted: true`) i prowadzą do logów incydentów w module monitoringu.

## Notyfikacje / Feedback

- Po wysłaniu odpowiedzi – toast „Odpowiedź wysłana pomyślnie” lub „Błąd podczas wysyłania”. 
- Po masowych akcjach (np. „Oznacz jako przeczytane”) – toast z liczbą przetworzonych recenzji. 
- Po usunięciu recenzji – modal potwierdzający + toast „Recenzja usunięta (przeniesiona do kosza)”. 


