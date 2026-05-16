document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners to borrow buttons
    document.querySelectorAll('.borrow-btn').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        updateButtonColor(newButton);

        newButton.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
            borrowBook(bookId, newButton);
        });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
            removeFromWishlist(bookId, button);
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
                    button.textContent = 'Not Available';
                    button.setAttribute('data-available', 'false');
                    button.disabled = true;
                    updateButtonColor(button);
                } else {
                    alert(data.error || 'Failed to borrow the book. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }

    // Function to remove a book from the wishlist
    function removeFromWishlist(bookId, button) {
        fetch(`/toggle-wishlist/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        })
            .then(response => response.json())
            .then(data => {
                if (!data.added) {
                    alert('Book removed from your wishlist!');
                    const bookCard = button.closest('.book-card');
                    bookCard.remove(); // Remove the book card from the DOM
                } else {
                    alert('Failed to remove the book from your wishlist. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }

    // Function to update button color based on availability
    function updateButtonColor(button) {
        const isAvailable = button.getAttribute('data-available') === 'true';
        if (isAvailable) {
            button.style.backgroundColor = '#a0d468'; // Green
            button.style.color = 'white';
            button.classList.add('available');
            button.classList.remove('unavailable');
        } else {
            button.style.backgroundColor = '#696969'; // Gray
            button.style.color = 'white';
            button.classList.add('unavailable');
            button.classList.remove('available');
        }
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