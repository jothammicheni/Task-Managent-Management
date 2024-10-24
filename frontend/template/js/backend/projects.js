document.addEventListener('DOMContentLoaded', function () {
    const projectForm = document.getElementById('create-project-form');
    const projectNameInput = document.getElementById('project-name');
    const projectsList = document.getElementById('projects-list');
    const searchInput = document.getElementById('search-projects');
    const searchBtn = document.getElementById('search-btn-p');

    // Fetch and display all projects
    async function fetchProjects(searchTerm = '') {
        try {
            const response = await fetch('http://localhost:3005/api/project/getAll');
            const projects = await response.json();

            // Clear existing list
            projectsList.innerHTML = '';

            let filteredProjects = projects;

            if (searchTerm) {
                filteredProjects = projects.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
            }

            if (filteredProjects.length === 0) {
                projectsList.innerHTML = '<p>No projects found.</p>';
                return;
            }

            filteredProjects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.classList.add('project-item');

                projectItem.innerHTML = `
                    <h4>${project.name}</h4>
                    <button class="view-btn" data-id="${project.projectId}">View</button>
                    <button class="update-btn" data-id="${project.xata_id}">Update</button>
                    <button class="delete-btn" data-id="${project.xata_id}">Delete</button>
                `;

                projectsList.appendChild(projectItem);
            });

            // Add event listeners for delete, view, and update buttons
            document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDeleteProject));
            document.querySelectorAll('.view-btn').forEach(button => button.addEventListener('click', handleViewProject));
            document.querySelectorAll('.update-btn').forEach(button => button.addEventListener('click', handleUpdateProject));
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    // Handle create project
    projectForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const projectName = projectNameInput.value.trim();

        if (projectName === '') {
            alert('Please enter a project name.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3005/api/project/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Project created successfully!');
                projectNameInput.value = '';
                fetchProjects(); // Refresh project list
            } else {
                alert('Error creating project:', result.message);
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    });

    // Handle delete project
    async function handleDeleteProject(e) {
        const projectId = e.target.getAttribute('data-id');

        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`http://localhost:3005/api/project/delete/${projectId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Project deleted successfully!');
                fetchProjects(); // Refresh project list
            } else {
                alert('Error deleting project.');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }

    // Handle view project by id
    async function handleViewProject(e) {
        const projectId = e.target.getAttribute('data-id');

        // Redirect to a new HTML page, passing the projectId as a query parameter
        window.location.href = `viewProject.html?projectId=${projectId}`;
    }
    // Handle update project
    async function handleUpdateProject(e) {
        const projectId = e.target.getAttribute('data-id');
        const newName = prompt('Enter the new project name:');

        if (!newName) return;

        try {
            const response = await fetch(`http://localhost:3005/api/project/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });

            if (response.ok) {
                alert('Project updated successfully!');
                fetchProjects(); // Refresh project list
            } else {
                alert('Error updating project.');
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    }

    // Handle search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        fetchProjects(searchTerm);
    });

    // Fetch all projects on page load
    fetchProjects();
});
