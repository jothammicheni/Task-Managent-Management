document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch all teams
        const response = await fetch('http://localhost:3005/teams', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch teams');
        }

        const teams = await response.json();
        const teamsListContainer = document.getElementById('teams-list');

        teamsListContainer.innerHTML = ''; // Clear any existing content

        teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';

            teamCard.innerHTML = `
                <h4>${team.name}</h4>
                <p>${team.description}</p>
                <button class="join-team-btn" data-team-id="${team.teamId}">Join Team</button>
            `;

            teamsListContainer.appendChild(teamCard);
        });

        // Add event listeners for "Join Team" buttons
        const joinTeamButtons = document.querySelectorAll('.join-team-btn');
        joinTeamButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const teamId = event.currentTarget.getAttribute('data-team-id');
                const teamIdInt = parseInt(teamId);
                const errorMessageContainer = document.getElementById('error-message');

                try {
                    const joinResponse = await fetch(`http://localhost:3005/teams/join`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ teamId: teamIdInt })
                    });

                    if (!joinResponse.ok) {
                        const errorData = await joinResponse.json();
                        throw new Error(errorData.message || 'Failed to join the team');
                    }

                    // After joining, redirect back to the teams list
                    window.location.href = 'teams.html';
                } catch (error) {
                    console.error('Error joining the team:', error);
                    errorMessageContainer.textContent = error.message;
                }
            });
        });

        // Fetch user-specific teams
        const myTeamsResponse = await fetch('http://localhost:3005/teams/user', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!myTeamsResponse.ok) {
            throw new Error('Failed to fetch user teams');
        }

        const myTeams = await myTeamsResponse.json();
        const myTeamsListContainer = document.getElementById('user-teams');

        myTeamsListContainer.innerHTML = ''; // Clear any existing content

        myTeams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';

            teamCard.innerHTML = `
                <h4>${team.name}</h4>
                <button class="view-team-btn" data-team-id="${team.teamId}">View Team</button>
            `;

            myTeamsListContainer.appendChild(teamCard);
        });

        // Add event listeners for user-specific "View Team" buttons
        const userViewTeamButtons = document.querySelectorAll('#user-teams .view-team-btn');
        userViewTeamButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const teamId = event.currentTarget.getAttribute('data-team-id');
                // Navigate to team details page with the teamId in the query string
                window.location.href = `team-details.html?teamId=${teamId}`;
            });
        });


        // Fetch all users to populate the "Add Members" select options
        const usersResponse = await fetch('http://localhost:3005/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!usersResponse.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await usersResponse.json();
        const addMembersSelect = document.getElementById('add-members');

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.xata_id;
            option.textContent = `${user.name}`;
            addMembersSelect.appendChild(option);
        });

        // Handle form submission for creating a team
        const createTeamForm = document.getElementById('create-team-form');
        createTeamForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const errorMessageContainer = document.getElementById('error-message');

            const teamName = document.getElementById('team-name').value;
            const teamDescription = document.getElementById('team-description').value;
            const selectedMembers = Array.from(addMembersSelect.selectedOptions).map(option => option.value);

            try {
                const createResponse = await fetch('http://localhost:3005/teams/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: teamName,
                        description: teamDescription,
                        members: selectedMembers
                    })
                });

                if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    throw new Error(errorData.message || 'Failed to create team');
                }

                // After creating the team, redirect to the teams list
                window.location.href = 'teams.html';
            } catch (error) {
                console.error('Error creating team:', error);
                errorMessageContainer.textContent = error.message;
            }
        });

    } catch (error) {
        console.error('Error fetching teams:', error);
        document.getElementById('error-message').textContent = error.message;
    }
});