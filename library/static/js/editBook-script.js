document.addEventListener('DOMContentLoaded', function () {
    const coverUrlInput = document.getElementById('cover-url');
    const coverPreview = document.getElementById('cover-preview');
    const deleteButton = document.getElementById('delete-btn');
    const statusSelect = document.getElementById('status');
    const saveButton = document.querySelector('.save-btn');

    // Preview cover image when URL changes
    coverUrlInput.addEventListener('input', function () {
        const url = this.value.trim();
        if (url) {
            coverPreview.src = url;
        } else {
            coverPreview.src = 'https://via.placeholder.com/150x210?text=Book+Cover';
        }
    });

    // Handle delete button
    deleteButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this book?')) {
            fetch(`/delete-book/${bookId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
            })
                .then(response => {
                    if (response.ok) {
                        alert('Book deleted successfully.');
                        window.location.href = '/admin-dashboard/';
                    } else {
                        alert('Failed to delete the book. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
        }
    });

    // Update save button color based on availability
    statusSelect.addEventListener('change', function () {
        const isAvailable = this.value === 'available';
        updateSaveButtonState(isAvailable);
    });

    function updateSaveButtonState(isAvailable) {
        if (isAvailable) {
            saveButton.classList.add('available');
            saveButton.classList.remove('unavailable');
            saveButton.disabled = false;
        } else {
            saveButton.classList.add('unavailable');
            saveButton.classList.remove('available');
            saveButton.disabled = true;
        }
    }

    // Initialize save button state on page load
    updateSaveButtonState(statusSelect.value === 'available');

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