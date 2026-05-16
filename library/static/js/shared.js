// shared.js

// User roles
const ROLE_GUEST = 'guest';
const ROLE_USER = 'user';
const ROLE_ADMIN = 'admin';

// Get current user role from the DOM or backend
function getUserRole() {
    const roleElement = document.getElementById('user-role');
    return roleElement ? roleElement.dataset.role : ROLE_GUEST;
}

document.addEventListener('DOMContentLoaded', function () {
    // Borrow a book
    document.querySelectorAll('.borrow-btn').forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
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
                        location.reload(); // Reload the page to update the status
                    } else {
                        alert(data.error || 'Failed to borrow the book. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
        });
    });

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

// Check if the current user can borrow books (not suspended)
function canUserBorrow() {
    const statusElement = document.getElementById('user-status');
    return statusElement && statusElement.dataset.status !== 'suspended';
}

// Update user display name
function updateUserDisplayName() {
    const userElement = document.getElementById('user-display-name');
    const welcomeElement = document.querySelector('.dashboard h2');

    if (userElement && welcomeElement) {
        welcomeElement.textContent = `Welcome, ${userElement.dataset.fullName}!`;
    }
}

// Initialize the layout (navigation, highlighting, etc.)
function initializeLayout() {
    updateUserDisplayName();
}

// Initialize layout on page load
document.addEventListener('DOMContentLoaded', initializeLayout);