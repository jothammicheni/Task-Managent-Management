document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is logged in by checking if the token exists
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token, redirect to login page
        window.location.href = 'login.html';
        alert('You are not logged in! Redirecting to login page...');
        return;
    }

    // const userRole = localStorage.getItem('userRole');

    // // Check if the user is an admin
    // if (userRole !== 'admin') {
    //     alert('Access denied. Admins only.');
    //     window.location.href = 'login.html';
    // } else {
    //     // Show the Manage Users link if the user is an admin
    //     const manageUsersLink = document.createElement('li');
    //     manageUsersLink.innerHTML = '<a href="manage-users.html" class="active">Manage Users</a>';
    //     document.querySelector('.sidebar ul').appendChild(manageUsersLink);
    // }
});

document.getElementById('logout').addEventListener('click', () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Optionally, clear other session data if necessary
    // localStorage.clear(); // To clear everything in localStorage

    // Redirect to login page after logout
    alert('Logged out successfully! Redirecting to login page...');
    window.location.href = 'login.html';
});