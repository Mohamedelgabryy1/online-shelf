document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const availabilityFilter = document.getElementById('availability-filter');
    const sortBy = document.getElementById('sort-by');
    const bookGrid = document.querySelector('.book-grid');

    // Filter and render books
    function filterBooks() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedAvailability = availabilityFilter.value;
        const selectedSort = sortBy.value;

        // Get all book cards
        const bookCards = Array.from(bookGrid.querySelectorAll('.book-card'));

        bookCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.author').textContent.toLowerCase();
            const category = card.querySelector('.category').textContent.toLowerCase();
            const status = card.querySelector('.status').textContent.toLowerCase();

            // Filter by search query
            const matchesSearch = title.includes(searchQuery) || author.includes(searchQuery);

            // Filter by category
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory.toLowerCase();

            // Filter by availability
            const matchesAvailability =
                selectedAvailability === 'all' ||
                (selectedAvailability === 'available' && status === 'available') ||
                (selectedAvailability === 'borrowed' && status === 'borrowed');

            // Show or hide the card based on filters
            if (matchesSearch && matchesCategory && matchesAvailability) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort books
        const sortedCards = bookCards.filter(card => card.style.display !== 'none');
        sortedCards.sort((a, b) => {
            const titleA = a.querySelector('h3').textContent.toLowerCase();
            const titleB = b.querySelector('h3').textContent.toLowerCase();
            const authorA = a.querySelector('.author').textContent.toLowerCase();
            const authorB = b.querySelector('.author').textContent.toLowerCase();

            switch (selectedSort) {
                case 'title':
                    return titleA.localeCompare(titleB);
                case 'title-desc':
                    return titleB.localeCompare(titleA);
                case 'author':
                    return authorA.localeCompare(authorB);
                case 'recent':
                    return 0; // No sorting for "recent" in this example
                default:
                    return 0;
            }
        });

        // Reorder the book grid
        sortedCards.forEach(card => bookGrid.appendChild(card));
    }

    // Add event listeners
    searchBtn.addEventListener('click', filterBooks);
    categoryFilter.addEventListener('change', filterBooks);
    availabilityFilter.addEventListener('change', filterBooks);
    sortBy.addEventListener('change', filterBooks);
});