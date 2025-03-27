
// Handle User Login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    fetch('http://localhost:5000/auth/login', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Save the token 
            localStorage.setItem('authToken', data.token);
            window.location.href = 'index.html';  // Redirect to main page
        } else {
            alert('Login failed: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});
