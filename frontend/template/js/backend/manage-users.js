document.addEventListener('DOMContentLoaded', function () {
    const apiBaseUrl = 'http://localhost:3005/api/users';

    // Fetch and display all users
    async function loadUsers() {
        const response = await fetch(`${apiBaseUrl}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            console.log(users)

            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';

            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user-item');
                userDiv.innerHTML = `
                <div class="user-info">
                    <h5>${user.name}</h5>
                    <p>Email: ${user.email}</p>
                    <p>Role: ${user.role}</p>
                </div>
                <div class="user-actions">
                    <button class="view-btn" data-id="${user.xata_id}">View Details</button>
                    <button class="delete-btn" data-id="${user.xata_id}">Delete</button>
                </div>
                `;
                usersList.appendChild(userDiv);
            });

            // Attach event listeners to view and delete buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', viewUserDetails);
            });
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', deleteUser);
            });
        } else {
            alert('Error fetching users');
        }
    }

    // View single user details
    async function viewUserDetails(event) {
        const userId = event.target.getAttribute('data-id');
        const response = await fetch(`${apiBaseUrl}/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            const userDetails = document.getElementById('user-details');
            userDetails.innerHTML = `
                <h4>${user.username}</h4>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role}</p>
                <p>ID: ${user._id}</p>
            `;
        } else {
            alert('Error fetching user details');
        }
    }

    // Delete a user
    async function deleteUser(event) {
        const userId = event.target.getAttribute('data-id');
        const confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation) {
            const response = await fetch(`${apiBaseUrl}/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('User deleted successfully');
                loadUsers();  // Reload users after deletion
            } else {
                alert('Error deleting user');
            }
        }
    }

    // Load all users when the page loads
    loadUsers();
});
