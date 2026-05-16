document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners to borrow buttons
    document.querySelectorAll('.borrow-btn').forEach(button => {
        // Remove any existing event listeners before adding a new one
        button.replaceWith(button.cloneNode(true));
        button = document.querySelector(`.borrow-btn[data-book-id="${button.getAttribute('data-book-id')}"]`);

        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
            if (!bookId) {
                console.error('Book ID is null or undefined.');
                alert('An error occurred. Please try again.');
                return;
            }
            borrowBook(bookId, button);
        });
    });

    // Add event listeners to wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
            if (!bookId) {
                console.error('Book ID is null or undefined.');
                alert('An error occurred. Please try again.');
                return;
            }
            toggleWishlist(bookId, button);
        });
    });

// Function to borrow a book
function borrowBook(bookId, button) {
    fetch(`/borrow-book/${bookId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);

                // Update the book card UI
                const bookCard = button.closest('.book-card');
                bookCard.querySelector('.status').textContent = 'Borrowed';
                bookCard.querySelector('.status').classList.remove('available');
                bookCard.querySelector('.status').classList.add('borrowed');

                // Remove the borrow button
                button.remove();

                // Add the wishlist button
                const wishlistButton = document.createElement('button');
                wishlistButton.classList.add('wishlist-btn');
                wishlistButton.setAttribute('data-book-id', bookId);
                wishlistButton.textContent = 'Add to Wishlist';
                wishlistButton.addEventListener('click', function () {
                    toggleWishlist(bookId, wishlistButton);
                });
                bookCard.querySelector('.book-actions').appendChild(wishlistButton);
            } else {
                alert(data.error || 'Failed to borrow the book. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
}

    // Function to toggle wishlist
    function toggleWishlist(bookId, button) {
        fetch(`/toggle-wishlist/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.added) {
                    alert('Book added to your wishlist!');
                    button.textContent = 'Remove from Wishlist';
                } else {
                    alert('Book removed from your wishlist!');
                    button.textContent = 'Add to Wishlist';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }

    // Helper function to get CSRF token
    function getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return null;
    }
});
