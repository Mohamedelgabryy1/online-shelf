document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const sortBy = document.getElementById('sort-by');
    const userRows = document.querySelectorAll('.users-table tbody tr');

    // Filter users based on search query
    function filterUsers() {
        const query = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        userRows.forEach(row => {
            const name = row.children[1].textContent.toLowerCase();
            const email = row.children[2].textContent.toLowerCase();
            const userStatus = row.children[3].textContent.toLowerCase();

            const matchesQuery = name.includes(query) || email.includes(query);
            const matchesStatus = status === 'all' || userStatus === status;

            if (matchesQuery && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Sort users based on selected criteria
    function sortUsers() {
        const rowsArray = Array.from(userRows);
        const sortValue = sortBy.value;

        rowsArray.sort((a, b) => {
            const nameA = a.children[1].textContent.toLowerCase();
            const nameB = b.children[1].textContent.toLowerCase();
            const dateA = new Date(a.dataset.joinDate);
            const dateB = new Date(b.dataset.joinDate);

            if (sortValue === 'name') {
                return nameA.localeCompare(nameB);
            } else if (sortValue === 'name-desc') {
                return nameB.localeCompare(nameA);
            } else if (sortValue === 'recent') {
                return dateB - dateA;
            }
            return 0;
        });

        const tbody = document.querySelector('.users-table tbody');
        tbody.innerHTML = '';
        rowsArray.forEach(row => tbody.appendChild(row));
    }

    // Event listeners
    searchInput.addEventListener('input', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
    sortBy.addEventListener('change', sortUsers);
});