# Dokumentacja: Pozyskiwanie Opinii (Review Gating)

## 1. Cel Biznesowy
System ma na celu **maksymalizację pozytywnych opinii** w Google Maps oraz **przechwytywanie negatywnych opinii** do wewnętrznego systemu obsługi klienta. Daje to właścicielowi firmy szansę na reakcję i poprawę jakości usług bez uszczerbku na publicznym wizerunku.

## 2. Przepływ Użytkownika (User Flow)
1.  Klient skanuje kod QR (w lokalu, na ulotce).
2.  Trafia na **Landing Page (Stronę Oceny)**.
3.  Wybiera liczbę gwiazdek (1-5).
4.  **Logika Warunkowa (Bramka):**
    *   **Ocena Wysoka (>= Próg):** Automatyczne przekierowanie do formularza opinii w Google.
    *   **Ocena Niska (< Próg):** Wyświetlenie wewnętrznego formularza kontaktowego ("Powiedz nam co moglibyśmy zrobić lepiej").

## 3. Specyfikacja Funkcjonalna

### 3.1. Landing Page (Publiczny Widok)
*   **Adres URL:** `/feedback/:locationId`
*   **Elementy:** Logo, Nazwa Firmy, Nagłówek ("Daj znać jak nam poszło"), Gwiazdki.
*   **Formularz Negatywny:**
    *   Pole "Opinia" (Zawsze widoczne, Zawsze wymagane).
    *   Pola dodatkowe (Konfigurowalne: Widoczność + Wymagalność):
        *   Imię
        *   Nazwisko
        *   Telefon
        *   Email
        *   Numer zamówienia
        *   Nazwa usługi
        *   Imię pracownika

### 3.2. Panel Konfiguracyjny (AcquisitionPanel)
*   **Wizualizacja procesu:** Diagram (OrganizationChart) pokazujący przepływ.
*   **Podgląd na żywo:** Sekcja pokazująca 1:1 jak wygląda landing page.
*   **Personalizacja:**
    *   Wybór pól formularza (Tabela: Pole | Pokaż | Wymagane).
    *   Style: Kolor wiodący, Fonty, Logo.
*   **Generator Materiałów:** (Istniejąca funkcjonalność) - generowanie PDF/PNG z QR codem prowadzącym do Landing Page'a.

## 4. Model Danych (Mock API)

### 4.1. Ustawienia (AcquisitionSettings)
Główne źródło prawdy dla wyglądu i zachowania bramki.

```json
{
  "location_id": "123",
  "google_place_id": "ChIJ...", // ID do przekierowania Google
  "min_rating_for_google": 4,   // Próg (np. 4 gwiazdki)
  "headline": "Daj znać jak nam poszło",
  "logo_url": "...",
  "theme_color": "3B82F6",
  "font_family": "Inter",
  "form_fields": [
    { "key": "name", "label": "Imię", "visible": true, "required": false },
    { "key": "phone", "label": "Telefon", "visible": true, "required": false },
    { "key": "email", "label": "Email", "visible": true, "required": true },
    { "key": "order_no", "label": "Numer zamówienia", "visible": false, "required": false },
    { "key": "service_name", "label": "Nazwa usługi", "visible": false, "required": false },
    { "key": "employee_name", "label": "Pracownik", "visible": false, "required": false }
  ]
}
```

## 5. Status Realizacji & TODO

### Wykonane (Done)
- [x] Podstawowa struktura panelu `AcquisitionPanel.vue` (Generator Grafik).
- [x] Mockowanie serwisu `ReviewsService`.
- [x] Poprawki UI generatora grafik (wyrównanie, linijki).

### Do zrobienia (Pending)
- [ ] **Router:** Dodać ścieżkę `/feedback/:locationId`.
- [ ] **Backend/Service:** Zaktualizować `ReviewsService` o nowe pola konfiguracji i metodę zapisu feedbacku.
- [ ] **Widok Publiczny (`PublicFeedbackView.vue`):** Implementacja logiki bramki i formularza.
- [ ] **Rozbudowa Panelu (`AcquisitionPanel.vue`):**
    - [ ] Dodać Tabs: "Generator Grafik" vs "Konfiguracja Strony".
    - [ ] Implementacja `OrganizationChart` (wizualizacja).
    - [ ] Konfigurator pól formularza (Toggle/Checkbox).
    - [ ] Podgląd Live Landing Page'a.
    - [ ] Stylowanie (Color picker).

## 6. Notatki Techniczne
*   **QR Code:** Musi wskazywać na `window.location.origin + '/feedback/' + id`.
*   **Google Redirect:** `https://search.google.com/local/writereview?placeid={PLACE_ID}`.
*   **Biblioteki:** Używamy `primevue/organizationchart` do wizualizacji.

