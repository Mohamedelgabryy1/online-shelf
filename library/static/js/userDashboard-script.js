document.addEventListener('DOMContentLoaded', function () {
    // Fetch borrowed books and wishlist items from the server
    fetch('/user-dashboard-data/')
        .then(response => response.json())
        .then(data => {
            renderBooks(data.borrowed_books, 'my-books-grid');
            renderBooks(data.wishlist_items, 'my-wishlist-grid');
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });

    function renderBooks(books, containerId) {
        const container = document.getElementById(containerId);

        // Clear existing content
        container.innerHTML = '';

        if (books.length === 0) {
            container.innerHTML = '<p class="no-books-message">No books found.</p>';
            return;
        }

        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';

            bookCard.innerHTML = `
                <img src="${book.cover}" alt="${book.title}">
                <p>${book.title}</p>
            `;

            container.appendChild(bookCard);
        });
    }
});