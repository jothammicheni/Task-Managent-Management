document.addEventListener('DOMContentLoaded', function () {
    const navBtns = document.querySelectorAll('.nav-btn');
    const projectContainer = document.getElementById('project-cards-container');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedTab = btn.getAttribute('data-tab');
            projectContainer.innerHTML = '';

            if (selectedTab === 'pending-projects') {
                projectContainer.innerHTML = `
                    <div class="project-card">
                        <div class="project-header">
                            <h4>Pending Project 1</h4>
                            <span class="deadline">Due: 2024-10-30</span>
                        </div>
                        <p class="description">This is a pending project that requires attention.</p>
                        <div class="toggle-container">
                            <label class="switch">
                                <input type="checkbox" id="toggle-1">
                                <span class="slider"></span>
                            </label>
                            <span class="status-label">Pending</span>
                        </div>
                        <div class="action-buttons">
                            <button class="view-btn">View</button>
                            <button class="complete-btn" id="complete-btn-1">Mark as Complete</button>
                        </div>
                    </div>`;
            } else if (selectedTab === 'completed-tasks') {
                projectContainer.innerHTML = `
                    <div class="project-card">
                        <div class="project-header">
                            <h4>Completed Task 1</h4>
                            <span class="deadline">Completed on: 2024-10-15</span>
                        </div>
                        <p class="description">This task was completed successfully.</p>
                        <div class="toggle-container">
                            <label class="switch">
                                <input type="checkbox" id="toggle-2" checked disabled>
                                <span class="slider"></span>
                            </label>
                            <span class="status-label">Completed</span>
                        </div>
                        <div class="action-buttons">
                            <button class="view-btn">View</button>
                        </div>
                    </div>`;
            } else if (selectedTab === 'all-projects') {
                projectContainer.innerHTML = `
                    <div class="project-card">
                        <div class="project-header">
                            <h4>Project A</h4>
                            <span class="deadline">Due: 2024-11-01</span>
                        </div>
                        <p class="description">This project is currently in progress.</p>
                        <div class="toggle-container">
                            <label class="switch">
                                <input type="checkbox" id="toggle-3" checked>
                                <span class="slider"></span>
                            </label>
                            <span class="status-label">In Progress</span>
                        </div>
                        <div class="action-buttons">
                            <button class="view-btn">View</button>
                            <button class="complete-btn" id="complete-btn-3">Mark as Complete</button>
                        </div>
                    </div>`;
            }

            attachEventListeners();
        });
    });

    function attachEventListeners() {
        document.querySelectorAll('.toggle-container input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (event) => {
                const statusLabel = event.target.closest('.toggle-container').querySelector('.status-label');
                const completeButton = event.target.closest('.project-card').querySelector('.complete-btn');

                if (event.target.checked) {
                    statusLabel.textContent = 'In Progress';
                    completeButton.disabled = false;
                    completeButton.classList.remove('completed');
                    completeButton.textContent = 'Mark as Complete';
                } else {
                    statusLabel.textContent = 'Pending';
                    completeButton.disabled = true;
                    completeButton.classList.add('completed');
                    completeButton.textContent = 'Mark as Complete';
                }
            });
        });

        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const toggle = event.target.closest('.project-card').querySelector('input[type="checkbox"]');
                const statusLabel = event.target.closest('.project-card').querySelector('.status-label');
                
                toggle.checked = false;
                statusLabel.textContent = 'Completed';
                event.target.disabled = true;
                event.target.textContent = 'Completed';
                event.target.classList.add('completed');
            });
        });
    }

    attachEventListeners();
});
