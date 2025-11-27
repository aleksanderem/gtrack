# Opinie → Pozyskiwanie opinii (Reviews Acquisition)

## Cel

Celem modułu „Pozyskiwanie opinii” jest ułatwienie właścicielom firm zdobywania nowych recenzji od klientów. Użytkownik może wygenerować link, kod QR, lub materiały marketingowe, które zachęcą klientów do pozostawienia opinii w Google. Moduł ten stanowi też miejsce do monitorowania skuteczności kampanii pozyskiwania recenzji.

## Nawigacja

> **Ścieżka:** Zarządzanie → Opinie → Pozyskiwanie opinii  
> **Dostęp:** Użytkownicy z rolą _owner_ lub _admin_; pracownicy (np. _user_) mogą mieć ograniczone opcje tylko do podglądu linków.  
> **Z dokumentacji:** Ten moduł jest obecnie makietą; wykorzystuje lokalny stan, nie jest połączony z backendem【718814200998643†L161-L174】.

## Layout / Układ

1. **Nagłówek / Panel wprowadzający** – krótki opis (np. „Zdobądź więcej opinii od swoich klientów. Wygeneruj link lub kod QR do recenzji i udostępnij go klientom.”) z ewentualną grafiką.
2. **Generator linków** – formularz z polem do wprowadzenia danych klienta lub nazwy kampanii oraz generowania spersonalizowanego linku do recenzji (skrócony URL). 
3. **Generator kodu QR / materiałów** – możliwość wygenerowania plakatu, ulotki, lub wizytówki z kodem QR. Użytkownik wybiera szablon, wprowadza tekst nagłówka i generuje plik PDF/PNG.
4. **Historia próśb / kampanii** – tabela/ lista wysłanych zaproszeń lub kampanii z informacją o dacie, metodzie wysyłki (SMS, e-mail, link), statusie (wysłane / dostarczone), liczbie otrzymanych opinii i konwersją (%). 
5. **Statystyki skuteczności** – wykres słupkowy/kołowy pokazujący liczbę wysłanych zaproszeń vs liczbę recenzji, konwersję według kanału (SMS vs e-mail vs QR offline).

### Responsywność

- Formularze generowania linków/QR powinny być czytelne również na urządzeniach mobilnych.
- Historię można ukrywać w akordeonie na mobile.

## Komponenty / Widżety

| Komponent | Funkcja / Zawartość |
|-----------|--------------------|
| **Link Generator Form** | Pola: nazwa kampanii / tag, opcjonalnie adres e-mail/telefon klienta (jeśli planujesz wysyłkę), przycisk „Generuj link”. Po wygenerowaniu wyświetla się link (np. `https://g.page/r/abc123`) z przyciskiem „Kopiuj”. |
| **QR Code Generator** | Formularz: wybór szablonu (np. plakat 210×297 mm, ulotka 100×150 mm), wprowadzenie tytułu/nagłówka, opcjonalnie logo firmy. Przycisk „Generuj” tworzy plik PDF/PNG z kodem QR. |
| **Historia próśb** | Tabela: kolumny – Data, Nazwa kampanii, Kanał (SMS/e-mail/offline/URL), Wysłane (liczba), Opinie pozyskane, Konwersja (%). Sortowanie po dacie, konwersji. |
| **Statystyki konwersji** | Wykres kołowy / słupkowy – pokazuje konwersję dla różnych kanałów: _e-mail_, _SMS_, _QR offline_. |
| **Toolbar & Quick Actions** | Przyciski do szybkiego kopiowania linku, generowania nowych materiałów, wysyłki testowej. |

## Dane / Model danych

Mock data / API response może wyglądać tak:

```json
{
  "generated_links": [
    {"id": "camp1", "title": "Promocja Wiosna", "created_at": "2025-04-15T10:00:00Z", "method": "URL", "link": "https://g.page/r/abc123", "sent": 50, "reviews_received": 10},
    {"id": "camp2", "title": "SMS do stałych klientów", "created_at": "2025-05-01T12:00:00Z", "method": "SMS", "sent": 100, "reviews_received": 25}
  ],
  "conversion_stats": {
    "email": 0.10,
    "sms": 0.25,
    "qr": 0.05
  }
}
```

W docelowej wersji dane te powinny pochodzić z backendu (Convex) i łączyć się z innymi modułami (np. powiązanie kampanii z recenzjami). 

## Akcje / Flow użytkownika

1. **Generowanie linku:** Użytkownik wprowadza nazwę/etykietę kampanii, opcjonalnie dane klienta. Kliknięcie „Generuj link” powoduje wygenerowanie linku do recenzji (np. z użyciem Google Maps `place_id` i parametru `review`); system zapisuje kampanię w historii. Link jest wyświetlany i można go skopiować do schowka.
2. **Generowanie kodu QR / materiału:** Użytkownik wybiera szablon, wprowadza tytuł, logo. Po kliknięciu „Generuj” – front-end może wysłać dane do backendu/serwera, który tworzy PDF/PNG z wygenerowanym kodem QR i odsyła plik do pobrania. W historii zapisywana jest informacja o kampanii offline. 
3. **Wysłanie maila/SMS (opcjonalnie):** Jeśli w aplikacji zaimplementujesz wysyłkę – użytkownik wprowadza adres/telefon; po kliknięciu „Wyślij” system generuje zaproszenie i wysyła (może wymagać integracji z zewnętrznym dostawcą SMS/e-mail). 
4. **Podgląd historii:** Tabela z kampaniami umożliwia kliknięcie danej kampanii – można zobaczyć szczegóły (kto otrzymał zaproszenie, ile opinii). 

## Stany UI

- **Loading:** placeholder w tabeli historii i wykresie konwersji. 
- **Empty:** jeśli brak kampanii – komunikat „Nie masz jeszcze kampanii. Wygeneruj link, aby zacząć pozyskiwać recenzje.” 
- **Error:** w przypadku problemów z generowaniem linku/QR – komunikat „Nie udało się wygenerować linku/Kodu QR. Spróbuj ponownie.” 

## Powiązania z innymi modułami

- **Lista opinii:** po pozyskaniu opinii w kampanii, nowe recenzje pojawiają się w `Reviews List` z tagiem kampanii. 
- **Przegląd opinii:** statystyki pozyskiwania (np. wzrost liczby recenzji) powinny być uwzględnione w wykresach na przeglądzie. 
- **Smart Tasks:** może powstać zadanie „Uruchom kampanię pozyskiwania recenzji”, jeśli liczba recenzji jest niska względem konkurencji.
- **Raporty**: dane o pozyskanych recenzjach, konwersji, kampaniach powinny być dostępne w sekcji raportów (np. segment „Pozyskiwanie opinii”).

## Notyfikacje / Feedback

- **Toast** informujący o pomyślnym wygenerowaniu linku, wysłaniu zaproszenia, wygenerowaniu pliku QR. 
- **Modal** potwierdzający wysyłkę do większej grupy kontaktów (jeśli integrujesz e-mail/SMS). 
- **Alert** w przypadku błędu generowania / braku połączenia z API.


