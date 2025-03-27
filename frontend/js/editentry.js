document.addEventListener('DOMContentLoaded', function() {
    // Function to logout
    function logout() {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    }

    // Get the entry ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const entryId = urlParams.get('id');  // Get the entry ID from the query string

    if (!entryId) {
        alert('No entry ID found');
        window.location.href = 'index.html'; // Redirect to home if no ID is found
        return;
    }

    // Fetch the entry data from the backend
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please log in');
        window.location.href = 'login.html';
        return;
    }

        // Fetch user categories from the backend
        fetch(`http://localhost:5000/entries/categories`, {  
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
        

    fetch(`http://localhost:5000/entries/${entryId}`, {  
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    .then(response => {
        return response.json(); // Parse the response as JSON
    })
    .then(response => {
        // Check if the response indicates success
        if (response.success) {
            // Populate the form fields with the entry data
            document.getElementById('title').value = response.data.title;
            document.getElementById('content').value = response.data.content;
            document.getElementById('category').value = response.data.Category || ''; // Handle possible null category
        } else {
            alert('Error fetching entry data');
            window.location.href = 'index.html'; // Redirect to home if there's an error
        }
    })
    .catch(error => {
        console.error('Error fetching entry:', error);
        alert('Error fetching entry data');
    });

    // Handle form submission to save changes
    const form = document.getElementById('edit-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedEntry = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            category: document.getElementById('category').value,
        };


        // Send the updated data to the backend
        fetch(`http://localhost:5000/entries/${entryId}`, {
            method: 'PUT', // Update request
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEntry),
        })
        .then(response => response.json())
        .then(result => {

            if (result.success) {
                alert('Entry updated successfully');
                window.location.href = 'index.html'; // Redirect back to the home page
            } else {
                alert('Error updating entry');
            }
        })
        .catch(error => {
            console.error('Error updating entry:', error);
            alert('Error updating entry');
        });
    });
});
