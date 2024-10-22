
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch all projects from the API
        const projectsResponse = await fetch('http://localhost:3005/api/project/getAll');
        const projectsData = await projectsResponse.json();
        
        // Get the length of the projects array
        const totalProjects = projectsData.length;
        
        // Update the Total Projects card with the correct number
        document.getElementById('total-projects').textContent = totalProjects;

        // You can also handle teams, pending tasks, and completed tasks similarly
    } catch (error) {
        console.error('Error fetching projects:', error);
        document.getElementById('total-projects').textContent = 'Error';
    }
});


