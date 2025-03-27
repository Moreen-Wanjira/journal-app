
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission for new entry

    document.getElementById('category-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const categoryname = document.getElementById('category-name').value;
        const CategoryDescription = document.getElementById('category-description').value;
        const token = localStorage.getItem('authToken');

        const data = { categoryname, CategoryDescription };

        fetch('http://localhost:5000/entries/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Entry saved!');
                window.location.href = 'index.html';  // Redirect to home page after saving entry
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error saving entry:', error));
    });
});

