document.addEventListener('DOMContentLoaded', function() {
    fetchEntries();
});

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

function fetchEntries() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please log in');
        window.location.href = 'login.html';
        return;
    }

    fetch('http://localhost:5000/entries', {
        headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => response.json())
    .then(entries => {
        const entriesList = document.getElementById('entries-list');
        entriesList.innerHTML = '';
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry-card');
            entryDiv.innerHTML = `
                <p>${entry.content}</p>
                <p class="title">&#9998; ${entry.title}</p>
                <p class="category">&#128193; ${entry.category}</p>
                <p class="date">${new Date(entry.created_at).toLocaleDateString()}</p>
                <div class="buttons">
                    <button class="edit-button" data-id="${entry.id}">Edit</button>
                    <button class="delete-button" data-id="${entry.id}">Delete</button>
                </div>
            `;
            entriesList.appendChild(entryDiv);
        });

        // Attach event listeners after adding buttons to the DOM
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                editEntry(this.dataset.id);
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                deleteEntry(this.dataset.id);
            });
        });
    })
    .catch(error => console.error('Error fetching entries:', error));
}

function editEntry(entryId) {
    window.location.href = `editEntry.html?id=${entryId}`;
}

function deleteEntry(entryId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please log in');
        window.location.href = 'login.html';
        return;
    }
    if (confirm('Are you sure you want to delete this entry?')) {
        fetch(`http://localhost:5000/entries/${entryId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Entry deleted successfully');
                fetchEntries();
            } else {
                alert('Error deleting entry');
            }
        })
        .catch(error => console.error('Error deleting entry:', error));
    }
}
