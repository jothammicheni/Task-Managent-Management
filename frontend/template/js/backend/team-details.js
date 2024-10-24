document.addEventListener('DOMContentLoaded', async () => {
    // Get the teamId from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('teamId');

    if (!teamId) {
        console.error('No teamId found in the URL');
        return;
    }

    try {
        // Fetch the team details from the backend
        const teamResponse = await fetch(`http://localhost:3005/teams/${teamId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!teamResponse.ok) {
            throw new Error('Failed to fetch team details');
        }

        const team = await teamResponse.json();

        // Update the DOM with the team's details
        document.getElementById('team-name').textContent = team.name;
        document.getElementById('team-description').textContent = team.description;

        // Fetch the team's projects
        const projectsResponse = await fetch(`http://localhost:3005/api/project/team/${teamId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!projectsResponse.ok) {
            throw new Error('Failed to fetch team projects');
        }

        const projects = await projectsResponse.json();
        const projectsList = document.getElementById('projects-list');

        projectsList.innerHTML = ''; // Clear any existing content


        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');

            projectItem.innerHTML = `
                <h4>${project.name}</h4>
                <button class="view-btn" data-id="${project.xata_id}">View</button>
                <button class="update-btn" data-id="${project.xata_id}">Update</button>
                <button class="delete-btn" data-id="${project.xata_id}">Delete</button>
            `;

            projectsList.appendChild(projectItem);
        });

        // Handle leaving the team
        document.getElementById('leave-team-btn').addEventListener('click', async () => {
            const leaveResponse = await fetch(`http://localhost:3005/teams/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ teamId: parseInt(teamId, 10) }) // Send teamId in the request body
            });

            if (!leaveResponse.ok) {
                console.error('Failed to leave the team');
                return;
            }

            // After leaving, redirect back to the teams list
            window.location.href = 'teams.html';
        });

        // Getting Team Menbers
                // Fetch team members
                const teamMembersResponse = await fetch(`http://localhost:3005/teams/${teamId}/members`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!teamMembersResponse.ok) {
                    throw new Error('Failed to fetch team members');
                }
        
                const teamMembers = await teamMembersResponse.json();
                const teamMembersContainer = document.getElementById('team-members');
        
                teamMembersContainer.innerHTML = ''; // Clear any existing content
        
                teamMembers.forEach(member => {
                    const memberCard = document.createElement('div');
                    memberCard.className = 'member-card';
        
                    memberCard.innerHTML = `
                        <h4>${member.name}</h4>
                        <p>${member.email}</p>
                    `;
        
                    teamMembersContainer.appendChild(memberCard);
                });
        

    } catch (error) {
        console.error('Error fetching team details:', error);
    }
});
