// Handle User Registration
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    fetch('http://localhost:5000/auth/register', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            window.location.href = 'login.html';  // Redirect to login page
        } else {
            alert('Registration failed: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});
