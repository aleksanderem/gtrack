## PRD brakujacych widokow
Każdy plik opisuje jedną stronę lub moduł, definiując jej cel, układ,komponenty, model danych, przepływy użytkownika i integracje. W miarę rozwoju aplikacji, należy aktualizować odpowiedni plik.

1. [Dashboard](01-Dashboard.md)
2. Opinie
   - pozostałe elementy poza Lista opinii bez zmian
   - [Lista opinii](03-Opinie-Lista.md)
3. [Posty (Google Posts)](05-Posty.md)
4. [Wizytówka (Business Info)](06-Wizytowka.md)
5. [Zadania SEO / Smart Tasks](07-SmartTasks.md)
6. [Monitoring & Protection](08-MonitoringProtection.md)
7. [Media / Zdjęcia / Wideo](09-Media.md)
8. [Raporty i Analiza](10-Raporty.md)

---

## 🎯 Cel dokumentacji

Celem tej dokumentacji jest:

- Zebrać w jednym miejscu specyfikacje UI/UX/danych/przepływów dla kluczowych modułów aplikacji.
- Ułatwić frontendowi przygotowanie makiet i wstępnych interfejsów.
- Stworzyć spójny kontrakt pomiędzy zespołem frontend, backend i design.
- Zapewnić jasną komunikację między projektantami, deweloperami i Product Ownerem.

## 📚 Jak korzystać z dokumentacji

- Każdy plik odpowiada jednej stronie lub modułowi – zawiera układ, komponenty, dane wejściowe/wyjściowe, stany, akcje.
- W trakcie implementacji należy:
  1. Dopasować pola danych do rzeczywistych API (Convex, DataForSEO, Google Business Profile API).
  2. Stworzyć mocki danych, jeśli backend nie jest jeszcze gotowy.
  3. W przypadku zmian wymagań – aktualizować odpowiedni plik .md.
  4. Przed wdrożeniem – sprawdzić zgodność z design systemem oraz przeprowadzić testy UI.
