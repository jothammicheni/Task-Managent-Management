const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Cooper', email: 'alice@example.com' },
];

function displayTeamMembers() {
    const memberSelectionContainer = document.getElementById('member-selection-container');
    memberSelectionContainer.innerHTML = '';

    teamMembers.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.classList.add('member-item');

        memberItem.innerHTML = `
            <label for="member-${member.id}">
                <input type="checkbox" id="member-${member.id}" name="team-members" value="${member.email}">
                ${member.name} (${member.email})
            </label>
        `;

        memberSelectionContainer.appendChild(memberItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    displayTeamMembers();
});

document.getElementById('create-team-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const selectedMembers = [];
    document.querySelectorAll('input[name="team-members"]:checked').forEach(checkbox => {
        selectedMembers.push(checkbox.value);
    });

    if (selectedMembers.length === 0) {
        alert('Please select at least one team member to invite.');
        return;
    }

    const teamName = document.getElementById('team-name').value;
    const teamDescription = document.getElementById('team-description').value;

    document.getElementById('message').innerHTML = `
        <p class="success-message">Team <strong>${teamName}</strong> created successfully with the following members:</p>
        <ul>${selectedMembers.map(member => `<li>${member}</li>`).join('')}</ul>
    `;
});
