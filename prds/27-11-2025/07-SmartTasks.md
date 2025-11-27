# Smart Tasks / Zadania SEO

## Cel
Moduł Smart Tasks ma za zadanie dostarczać użytkownikowi listę priorytetowych, mierzalnych zadań, które mają poprawić widoczność lokalnego profilu w Google oraz przyczynić się do wzrostu reputacji firmy. Zadania są generowane automatycznie na podstawie danych z audytu wizytówki, analizy konkurencji, aktywności użytkownika (np. posty, recenzje) oraz rankingów lokalnych.

## Nawigacja
Menu główne → **Zarządzanie** → **Smart Tasks / Zadania SEO**. Strona dostępna dla użytkowników z uprawnieniami `owner` lub `manager`.

## Layout / Układ

- **Nagłówek** z tytułem modułu oraz krótkim opisem celu.
- **Lista zadań** w formie tabeli lub listy kart z informacjami o nazwie zadania, typie, priorytecie, statusie oraz sugerowanych działaniach.
- **Filtry i sortowanie** po statusie (nowe, w toku, zakończone, zignorowane), priorytecie (wysoki/średni/niski), typie zadania (posty, recenzje, dane profilu, konkurencja, analiza), dacie utworzenia i dacie wykonania.
- **Panel szczegółów** – po kliknięciu zadania otwiera się panel boczny (drawer) z szczegółowym opisem, dowodami (evidence pack), sugerowanym działaniem oraz przewidywanym efektem. Zawiera przyciski „Wykonaj teraz”, „Oznacz jako wykonane”, „Ignoruj”.
- **Sekcja statystyk** – wizualizuje postępy w realizacji zadań: liczba zadań wykonanych, w toku, odrzuconych; średni czas od stworzenia do wykonania (lead time) oraz wpływ (np. wzrost pozycji, średniej oceny).

## Komponenty / Widżety

| Komponent | Zawartość / Funkcja |
|-----------|--------------------|
| **DataTable / Lista zadań** | Kolumny: `task_id`, `name`, `type`, `priority` (High/Medium/Low), `status` (new/in_progress/done/ignored), `created_at`, `due_at` (opcjonalnie), `suggested_action` (link). Możliwość sortowania i filtrowania. |
| **Task Card** | Alternatywna prezentacja w widoku mobilnym; karta z nazwą, opisem skróconym, priorytetem (badge), status, oraz przyciskiem do wykonania. |
| **Task Details Drawer** | Wyświetla szczegółowe informacje o zadaniu: opis, powód rekomendacji, dane z audytu / konkurencji, przewidywany wpływ, krok po kroku. Zawiera przyciski „Wykonaj”, „Oznacz jako wykonane”, „Ignoruj”. |
| **Filters & Sort Bar** | Komponent z listą filtrów i menu sortowania (status, priorytet, typ, daty). |
| **Statistics Panel** | Widgety prezentujące wskaźniki: liczba zadań w poszczególnych statusach, współczynnik wykonania (adoption rate), średni czas realizacji (lead time), zmiana pozycji/oceny po wykonaniu zadań (jeśli możliwe do zmierzenia). |
| **Bulk Actions Bar** | Pokazuje się po zaznaczeniu wielu zadań – umożliwia masowe oznaczenie jako wykonane/ignorowane. |

## Dane / Model danych

Każde zadanie jest reprezentowane w bazie (Convex) przez rekord o schemacie:

```json
{
  "taskId": "string",             // unikatowy identyfikator zadania
  "locationId": "string",         // powiązana lokalizacja (wizytówka)
  "name": "string",               // krótki tytuł zadania, np. "Dodaj kategorię 'Dentysta'"
  "type": "enum",                 // typ zadania: POST, REVIEW, PROFILE, COMPETITION, AUDIT, MEDIA, OTHER
  "priority": "enum",             // HIGH, MEDIUM, LOW
  "status": "enum",               // NEW, IN_PROGRESS, DONE, IGNORED
  "suggestedAction": "string",    // rekomendowana akcja (np. URL do modułu Postów, link do formularza edycji profilu)
  "evidence": "object",           // zestaw danych do wglądu (np. wyniki audytu, dane konkurencji)
  "description": "string",         // szczegółowy opis i uzasadnienie
  "createdAt": "timestamp",
  "dueAt": "timestamp | null",     // termin realizacji (opcjonalnie)
  "updatedAt": "timestamp"
}
```

### Źródła danych

- **Audyt wizytówki** – moduł audyt generuje listę braków i rekomendacji; te trafiają do generatora zadań.
- **Analiza konkurencji** – wyniki z DataForSEO (SERP Local Finder, Business Data) dostarczają różnic względem konkurentów; z tego powstają zadania typu „Dodaj kategorię X”, „Zmień godziny” itp.
- **Monitoring** – incydenty z modułu Monitoring & Protection mogą tworzyć zadania (np. „Sprawdź usunięte zdjęcia”, „Zaktualizuj telefon po zmianie Google”).
- **Użytkownik** – użytkownik może ręcznie tworzyć zadania (manual tasks) w systemie – np. custom note / to-do.

## Stany UI

- **Loading** – ładowanie listy zadań, skeleton table.
- **Empty** – brak zadań → komunikat „Brak zadań do wykonania” + CTA do uruchomienia audytu lub analizy konkurencji.
- **Error** – błąd w pobieraniu zadań → komunikat + przycisk „Ponów”.
- **New** – zadania oczekujące; wyświetlane z badge „Nowe”.
- **In progress** – zadania w trakcie – można „zakończyć” lub „przerwać”.
- **Done** – zadania wykonane – można je ukryć lub filtrować.
- **Ignored** – zadania odrzucone – domyślnie ukrywane; można je przywrócić.

## Flows / Przebiegi

1. **Generowanie zadań** – scheduler (np. cron co tydzień) uruchamia moduł generatora zadań. Zbiera dane z audytu, konkurencji i monitoringu → tworzy/aktualizuje rekordy w tabeli zadań.
2. **Wyświetlanie listy** – strona ładuje zadania z bazy, stosuje filtry i sortowanie.
3. **Realizacja** – użytkownik otwiera zadanie → zapoznaje się z opisem → klika „Wykonaj” → zostaje przekierowany do odpowiedniego modułu (Posty, Opinie, Wizytówka) → po zakończeniu akcji wraca i oznacza zadanie jako wykonane. Backend aktualizuje status `DONE` oraz `updatedAt`.
4. **Ignorowanie** – użytkownik może kliknąć „Ignoruj” → zadanie zmienia status na `IGNORED`; w razie potrzeby może zostać przywrócone.
5. **Bulk actions** – użytkownik może zaznaczyć wiele zadań i masowo zmienić status (DONE / IGNORED). Potwierdzenie w modalu.
6. **Statystyki** – moduł zadań oblicza, ile zadań wykonano, ile w toku, średni czas realizacji etc. Dane te są prezentowane w panelu statystyk.

## Integracja z planami

Zgodnie z systemem funkcji (Feature Flags) zdefiniowanym w pliku `features.js` systemu GTRACk, niektóre funkcje zadań mogą być dostępne tylko w wyższych planach. Przykładowo, w planie BASIC auto‑odpowiedzi (`autoReply`) i monitorowanie zdjęć (`photoMonitoring`) są wyłączone, natomiast w planie PROFESSIONAL są dostępne【785274141478433†screenshot】. Generator zadań powinien uwzględniać, które funkcje są aktywne dla danego planu i generować tylko zadania z obszarów dostępnych dla użytkownika.
