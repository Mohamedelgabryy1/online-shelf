document.addEventListener('DOMContentLoaded', function () {
    const borrowButton = document.getElementById('borrow-btn');
    const wishlistButton = document.getElementById('wishlist-btn');

    // Add event listener for the borrow button
    if (borrowButton) {
        borrowButton.addEventListener('click', function () {
            borrowBook(bookId, borrowButton);
        });
    }

    // Add event listener for the wishlist button
    if (wishlistButton) {
        wishlistButton.addEventListener('click', function () {
            toggleWishlist(bookId, wishlistButton);
        });
    }

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
                    button.textContent = 'Currently Unavailable';
                    button.disabled = true;
                    alert('Book borrowed successfully!');
                } else {
                    alert(data.error || 'Failed to borrow the book. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }

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
                    button.textContent = 'Remove from Wishlist';
                    alert('Book added to your wishlist!');
                } else {
                    button.textContent = 'Add to Wishlist';
                    alert('Book removed from your wishlist!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }

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