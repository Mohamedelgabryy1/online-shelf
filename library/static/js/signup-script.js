// signup-script.js

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Redirect to home page
        window.location.href = '../index.html';
        return;
    }

    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('signup-error');

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                e.preventDefault();
                errorMessage.textContent = 'Passwords do not match.';
                errorMessage.style.display = 'block';
            }
        });
    }
});