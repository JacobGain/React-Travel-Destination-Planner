import DOMPurify from "dompurify";

// Validate input to ensure it contains only letters and spaces
export function validateTextInput(input) {
    const textOnlyRegex = /^[A-Za-z\s]+$/; // allow only alphabet characters, case insensitive
    return textOnlyRegex.test(input);
}

// Sanitize input using DOMPurify to prevent injection attacks
export function sanitizeInput(input) {
    return DOMPurify.sanitize(input);
}

// Function to search destinations
export async function searchDestinations(
    field,
    pattern,
    resultsPerPage,
    updateResults,
    updatePages,
    updateError
) {
    try {
        // Client-side input validation
        if (!validateTextInput(pattern)) {
            updateError("Search pattern should only contain text (letters and spaces).");
            return;
        }

        // Sanitize the input
        pattern = sanitizeInput(pattern);

        // Fetch search results from the backend
        const response = await fetch(`/api/open/destinations/search/${field}/${encodeURIComponent(pattern)}`);
        if (!response.ok) {
            throw new Error(`Error fetching search results: ${response.statusText}`);
        }

        const data = await response.json(); // Parse response as JSON

        // Pagination logic
        const pages = [];
        for (let i = 0; i < data.length; i += resultsPerPage) {
            const pageData = data.slice(i, i + resultsPerPage);

            const destinations = [];
            for (const id of pageData) {
                const destinationResponse = await fetch(`/api/open/destinations/${id}`);
                if (destinationResponse.ok) {
                    const destination = await destinationResponse.json();
                    destinations.push({ ...destination, id }); // Assign the ID to each destination
                } else {
                    console.error(`Failed to fetch destination with ID ${id}`);
                }
            }
            pages.push(destinations);
        }

        // Update results and navigation
        updateResults(pages[0] || []);
        updatePages(pages);
    } catch (error) {
        console.error(error);
        updateError(error.message);
    }
}

// Function to handle page navigation
export function changePage(pages, direction, currentPage, setCurrentPage, updateResults) {
    if (pages.length === 0) return;

    const newPage = Math.max(0, Math.min(currentPage + direction, pages.length - 1));
    setCurrentPage(newPage);
    updateResults(pages[newPage]);
}
