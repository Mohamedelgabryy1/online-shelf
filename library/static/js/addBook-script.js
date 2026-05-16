document.addEventListener('DOMContentLoaded', function () {
    // Preview cover image when URL changes
    const coverUrlInput = document.getElementById('cover-url');
    const coverPreview = document.getElementById('cover-preview');

    coverUrlInput.addEventListener('input', function () {
        const url = this.value.trim();
        if (url) {
            // Validate if the URL is a valid image URL
            coverPreview.onerror = function () {
                coverPreview.src = 'https://via.placeholder.com/150x210?text=Invalid+Image';
            };
            coverPreview.src = url;
        } else {
            coverPreview.src = 'https://via.placeholder.com/150x210?text=Book+Cover';
        }
    });

    // Handle cancel button
    const cancelButton = document.getElementById('cancel-btn');
    cancelButton.addEventListener('click', function () {
        const cancelUrl = this.getAttribute('data-cancel-url');
        if (cancelUrl) {
            if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                window.location.href = cancelUrl; // Redirect to the admin dashboard
            }
        } else {
            console.error('Cancel URL is missing or invalid.');
        }
    });
});