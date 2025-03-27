document.addEventListener('DOMContentLoaded', function() {
    // Get the token at the beginning
    const token = localStorage.getItem('authToken');

    // Check if the token exists
    if (!token) {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html';  // Redirect to login page if no token
        return;
    }

    // Call the fetchCategories function to populate the dropdown
    fetchCategories(token);

    // Handle form submission for new entry
    document.getElementById('journal-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const category = document.getElementById('category').value;

        const data = { title, content, category };

        fetch('http://localhost:5000/entries', {
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

    // Fetch user categories from the backend
    function fetchCategories(token) {
        fetch('http://localhost:5000/entries/categories', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log(response); // Log the full response to check the structure

            if (response.success && Array.isArray(response.categories)) {
                const categorySelect = document.getElementById('category');
                // Clear existing options
                categorySelect.innerHTML = '';

                // Add an option for each category
                response.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.categoryid; // categoryid from the response
                    option.textContent = category.categoryname; // categoryname from the response
                    categorySelect.appendChild(option);
                });
            } else {
                console.error('Error: Categories data is not in the expected format');
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            alert('Error fetching categories');
        });
    }
});
