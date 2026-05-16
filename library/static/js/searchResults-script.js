document.addEventListener('DOMContentLoaded', function () {
    // Get all search forms on the page
    const searchForms = document.querySelectorAll('#search-form');
    
    searchForms.forEach(searchForm => {
        const searchInput = searchForm.querySelector('#search-input');
        const resultsContainer = document.getElementById('results-container');
        const searchTermElement = document.getElementById('search-term');
        
        // Get query from URL if we're on search results page
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('query') || urlParams.get('q');
        
        // If we have a query param and we're on search results page, perform search
        if (queryParam && resultsContainer) {
            if (searchTermElement) searchTermElement.textContent = queryParam;
            if (searchInput) searchInput.value = queryParam;
            performSearch(queryParam);
        }
        
        // Handle form submission
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // If we're on search results page, update via AJAX
                if (resultsContainer) {
                    window.history.pushState({}, '', `?query=${encodeURIComponent(query)}`);
                    if (searchTermElement) searchTermElement.textContent = query;
                    performSearch(query);
                } 
                // If we're on home page, navigate to search results
                else {
                    window.location.href = `/search-results/?query=${encodeURIComponent(query)}`;
                }
            } else {
                alert('Please enter a search term.');
            }
        });
    });
    
    function performSearch(query) {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) return;
        
        // Clear existing results
        resultsContainer.innerHTML = '';
        
        // Fetch books from the server
        fetch(`/search-results/?query=${encodeURIComponent(query)}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(response => response.json())
        .then(data => {
            // ... rest of your existing performSearch code ...
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>An error occurred while fetching search results. Please try again later.</p>
                </div>
            `;
        });
    }
});