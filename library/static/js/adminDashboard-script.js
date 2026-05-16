document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-book-btn').addEventListener('click', function () {
        window.location.href = 'addBook.html';
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
            window.location.href = `/edit-book/${bookId}/`;
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            if (!confirm('Are you sure you want to delete this book?')) {
                e.preventDefault();
            }
        });
    });

    document.querySelectorAll('.suspend-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            if (!confirm('Are you sure you want to change this user\'s status?')) {
                e.preventDefault();
            }
        });
    });
});