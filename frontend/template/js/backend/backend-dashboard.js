
document.addEventListener("DOMContentLoaded", async () => {
    try {

        // Fetch all users from the API
        const userResponse = await fetch('http://localhost:3005/api/users/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const users = await userResponse.json();

        const userId = localStorage.getItem('userId');
        // const userRole = localStorage.getItem('userRole');

        const currentUserName = users.find(user => user.email === userId);

        if (currentUserName) {
            document.getElementById('user-name').textContent = `Welcome, ${currentUserName.name}!`;
        } else {
            console.error('User not found');
            document.getElementById('user-name').textContent = 'User not found';
        }

        const projectsData = await projectsResponse.json();

        // Get the length of the projects array
        const totalProjects = projectsData.length;

        // Update the Total Projects card with the correct number
        document.getElementById('total-projects').textContent = totalProjects;
        // Fetch total teams and update the UI
        async function fetchTotalTeams() {
            try {
                const response = await fetch('http://localhost:3005/teams', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch total teams');
                }

                const totalTeams = await response.json();
                const totalTeamsCount = totalTeams.length;
                document.getElementById('total-teams').textContent = totalTeamsCount;
            } catch (error) {
                console.error('Error fetching total teams:', error);
            }
        }

        fetchTotalTeams();

        // Fetch all pending tasks for the user



    } catch (error) {
        console.error('Error fetching projects:', error);
        document.getElementById('total-projects').textContent = 'Error';
    }
});


