/**
 * Mock Data Service for GMB Application
 * Provides simulated data for Posts, Content, Media, Timeline, and Products views.
 */

export const MockDataService = {
    // --- Posts ---
    getPosts() {
        return Promise.resolve([
            {
                id: 1,
                content: "Zapraszamy na naszą nową ofertę lunchową! 🥗 Codziennie inne danie dnia w promocyjnej cenie.",
                type: "OFFER",
                status: "ACTIVE",
                views: 1245,
                clicks: 56,
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                startDate: "2023-10-25",
                endDate: "2023-11-01",
                cta: { type: "ORDER", url: "https://example.com/menu" }
            },
            {
                id: 2,
                content: "Wielkie otwarcie naszego ogródka letniego! ☀️ Przyjdź i zrelaksuj się przy zimnym napoju.",
                type: "EVENT",
                status: "EXPIRED",
                views: 3420,
                clicks: 120,
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                startDate: "2023-06-01",
                endDate: "2023-06-02",
                cta: { type: "BOOK", url: "https://example.com/book" }
            },
            {
                id: 3,
                content: "Nowe godziny otwarcia w weekendy. Jesteśmy dla Was dłużej! 🕰️",
                type: "STANDARD",
                status: "ACTIVE",
                views: 890,
                clicks: 12,
                image: null,
                date: "2023-10-20",
                cta: { type: "LEARN_MORE", url: "https://example.com/hours" }
            }
        ]);
    },

    // --- Business Content ---
    getBusinessContent() {
        return Promise.resolve({
            name: "Restauracja Smaki Świata",
            category: "Restauracja",
            description: "Najlepsza restauracja w mieście serwująca dania z całego świata. Nasza kuchnia to połączenie tradycji z nowoczesnością. Zapraszamy na niezapomniane doznania kulinarne.",
            phone: "+48 123 456 789",
            website: "https://smakiswiata.pl",
            address: {
                street: "ul. Główna 15",
                city: "Warszawa",
                zip: "00-001"
            },
            attributes: [
                { id: 'has_wifi', label: 'Wi-Fi', value: true },
                { id: 'has_outdoor_seating', label: 'Ogródek', value: true },
                { id: 'serves_alcohol', label: 'Alkohol', value: true },
                { id: 'wheelchair_accessible', label: 'Dostęp dla niepełnosprawnych', value: true }
            ],
            hours: {
                monday: { open: "10:00", close: "22:00" },
                tuesday: { open: "10:00", close: "22:00" },
                wednesday: { open: "10:00", close: "22:00" },
                thursday: { open: "10:00", close: "23:00" },
                friday: { open: "10:00", close: "00:00" },
                saturday: { open: "11:00", close: "00:00" },
                sunday: { open: "11:00", close: "22:00" }
            }
        });
    },

    getSeoSuggestions() {
        return Promise.resolve([
            { id: 1, type: 'missing_keyword', message: 'Brakuje słowa kluczowego "kuchnia włoska" w opisie.', impact: 'HIGH' },
            { id: 2, type: 'attribute_opportunity', message: 'Klienci często szukają "dania wegańskie". Dodaj ten atrybut.', impact: 'MEDIUM' },
            { id: 3, type: 'photo_update', message: 'Dodaj nowe zdjęcia wnętrza, ostatnie są sprzed roku.', impact: 'LOW' }
        ]);
    },

    // --- Media ---
    getMedia() {
        return Promise.resolve([
            { id: 1, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE", category: "INTERIOR", views: 1500, date: "2023-10-01" },
            { id: 2, url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE", category: "FOOD", views: 2300, date: "2023-10-05" },
            { id: 3, url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE", category: "EXTERIOR", views: 900, date: "2023-09-15" },
            { id: 4, url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE", category: "DRINK", views: 1100, date: "2023-10-10" },
            { id: 5, url: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE", category: "ATMOSPHERE", views: 1800, date: "2023-10-12" }
        ]);
    },

    // --- Timeline ---
    getTimeline() {
        return Promise.resolve([
            { id: 1, type: 'CHANGE_SUGGESTION', source: 'GOOGLE_USER', status: 'PENDING', date: '2023-11-26T10:30:00', details: 'Sugerowana zmiana godzin otwarcia w niedzielę na 12:00 - 20:00' },
            { id: 2, type: 'POST_PUBLISHED', source: 'SYSTEM', status: 'COMPLETED', date: '2023-11-25T14:15:00', details: 'Opublikowano post: "Oferta lunchowa"' },
            { id: 3, type: 'REVIEW_REPLIED', source: 'USER:jan.kowalski', status: 'COMPLETED', date: '2023-11-24T09:45:00', details: 'Odpowiedź na opinię użytkownika Anna Nowak' },
            { id: 4, type: 'INFO_UPDATE', source: 'USER:admin', status: 'COMPLETED', date: '2023-11-20T11:20:00', details: 'Zaktualizowano numer telefonu' },
            { id: 5, type: 'CHANGE_SUGGESTION', source: 'GOOGLE_ALGO', status: 'REJECTED', date: '2023-11-18T16:00:00', details: 'Sugerowana zmiana kategorii na "Bar szybkiej obsługi"' }
        ]);
    },

    // --- Products ---
    getProducts() {
        return Promise.resolve([
            { id: 1, name: "Pizza Margherita", price: "32.00 PLN", description: "Sos pomidorowy, mozzarella, bazylia", category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { id: 2, name: "Spaghetti Carbonara", price: "38.00 PLN", description: "Guanciale, pecorino, jajko, pieprz", category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-98280d20748b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { id: 3, name: "Tiramisu", price: "24.00 PLN", description: "Klasyczny włoski deser", category: "Desery", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
        ]);
    },
    // --- Performance ---
    getPerformanceData() {
        return Promise.resolve({
            labels: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'],
            datasets: [
                {
                    label: 'Wyświetlenia',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: true,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Kliknięcia',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: true,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }
            ]
        });
    }
};
