
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
        const userRole = localStorage.getItem('userRole');

        const currentUserName = users.find(user => user.email === userId);

        if (currentUserName) {
            document.getElementById('user-name').textContent = `Welcome, ${currentUserName.name}!`;
        } else {
            console.error('User not found');
            document.getElementById('user-name').textContent = 'User not found';
        }

        // Fetch total projects and update the UI

        async function fetchTotalProjects() {
            if (userRole === 'admin') {
                try {
                    
                    const response = await fetch('http://localhost:3005/api/project/getAll', {
                        headers: {
                            'Authorizaton': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                        });

                    if (!response.ok) {
                        throw new Error('Failed to fetch total projects');
                    }

                    const totalProjects = await response.json();

                    const totalProjectsCount = totalProjects.length;
                    document.getElementById('total-projects').textContent = totalProjectsCount;

                } catch (error) {
                    console.error('Error fetching total projects:', error);
                    document.getElementById('total-projects').textContent = 'Error';
                }   
                } else{
                    try {
                        const response = await fetch(`http://localhost:3005/api/projects?userId=${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Failed to fetch user projects');
                        }

                        const userProjects = await response.json();
                        const userProjectsCount = userProjects.length;
                        document.getElementById('total-projects').textContent = userProjectsCount;

                    } catch (error) {
                        console.error('Error fetching user projects:', error);
                        document.getElementById('total-projects').textContent = 'Error';
                    }
                }
        }

        fetchTotalProjects();

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


        async function fetchPendingTasks() {
            try {
                const response = await fetch(`http://localhost:3005/api/tasks/filter/status/pending`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pending tasks');
                }

                const pendingTasks = await response.json();

                const pendingTasksCount = pendingTasks.length;

                document.getElementById('pending-tasks').textContent = pendingTasksCount;
            }
            catch (error) {
                console.error('Error fetching pending tasks:', error);
                document.getElementById('pending-tasks').textContent = 'Error';
            }
        }

        fetchPendingTasks();

        async function fetchCompletedTasks() {
            try {
                const response = await fetch(`http://localhost:3005/api/tasks/filter/status/completed`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }

                });

                if (!response.ok) {
                    throw new Error('Failed to fetch completed tasks');
                }

                const completedTasks = await response.json();

                const completedTasksCount = completedTasks.length;

                document.getElementById('completed-tasks').textContent = completedTasksCount;
            } catch (error) {
                console.error('Error fetching completed tasks:', error);
                document.getElementById('completed-tasks').textContent = 'Error';
            }
        }

        fetchCompletedTasks();

    } catch (error) {
        console.error('Error fetching projects:', error);
        document.getElementById('total-projects').textContent = 'Error';
    }
});


