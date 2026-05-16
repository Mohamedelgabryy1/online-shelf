document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners to return buttons
    document.querySelectorAll('.return-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default form submission

            if (confirm('Are you sure you want to return this book?')) {
                const form = button.closest('form');
                const formData = new FormData(form);

                // Send the form data via AJAX
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message); // Alert the user with the success message
                            const bookCard = button.closest('.book-card');
                            bookCard.remove(); // Remove the book card from the DOM
                        } else {
                            alert(data.error || 'Failed to return the book. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again.');
                    });
            }
        });
    });
});