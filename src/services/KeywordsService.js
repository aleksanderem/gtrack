/**
 * Mock Keywords Service
 * Simulates API for managing keywords for locations
 */

// Mock keywords data - different counts to test limits
const mockKeywordsByLocation = {
    'demo-location': [
        'restaurant dublin',
        'best food dublin',
        'italian restaurant',
        'pizza delivery',
        'fine dining dublin'
    ],
    'location-2': [
        'coffee shop',
        'cafe near me'
    ],
    'location-3': [
        'hair salon',
        'hairdresser dublin',
        'hair coloring',
        'hair extensions',
        'bridal hair',
        'men haircut',
        'balayage specialist',
        'keratin treatment'
    ]
}

/**
 * Get keywords for a location
 * @param {string} locationId - Location identifier
 * @returns {Promise<string[]>} Array of keyword strings
 */
export async function getKeywords(locationId = 'demo-location') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return mockKeywordsByLocation[locationId] || []
}

/**
 * Add a keyword for a location
 * @param {string} locationId - Location identifier
 * @param {string} keyword - Keyword to add
 * @returns {Promise<string[]>} Updated array of keywords
 */
export async function addKeyword(locationId, keyword) {
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!mockKeywordsByLocation[locationId]) {
        mockKeywordsByLocation[locationId] = []
    }

    if (!mockKeywordsByLocation[locationId].includes(keyword)) {
        mockKeywordsByLocation[locationId].push(keyword)
    }

    return mockKeywordsByLocation[locationId]
}

/**
 * Update keywords for a location
 * @param {string} locationId - Location identifier
 * @param {string[]} keywords - New array of keywords
 * @returns {Promise<string[]>} Updated array of keywords
 */
export async function updateKeywords(locationId, keywords) {
    await new Promise(resolve => setTimeout(resolve, 100))

    mockKeywordsByLocation[locationId] = keywords
    return mockKeywordsByLocation[locationId]
}

/**
 * Delete a keyword for a location
 * @param {string} locationId - Location identifier
 * @param {string} keyword - Keyword to remove
 * @returns {Promise<string[]>} Updated array of keywords
 */
export async function deleteKeyword(locationId, keyword) {
    await new Promise(resolve => setTimeout(resolve, 100))

    if (mockKeywordsByLocation[locationId]) {
        mockKeywordsByLocation[locationId] = mockKeywordsByLocation[locationId].filter(k => k !== keyword)
    }

    return mockKeywordsByLocation[locationId] || []
}

/**
 * Get keyword stats for a location (positions, search volume, etc.)
 * @param {string} locationId - Location identifier
 * @returns {Promise<Object[]>} Array of keyword stats
 */
export async function getKeywordStats(locationId = 'demo-location') {
    await new Promise(resolve => setTimeout(resolve, 150))

    const keywords = mockKeywordsByLocation[locationId] || []

    return keywords.map((keyword, index) => ({
        keyword,
        position: Math.floor(Math.random() * 20) + 1,
        searchVolume: Math.floor(Math.random() * 1000) + 100,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        lastUpdated: new Date().toISOString()
    }))
}
