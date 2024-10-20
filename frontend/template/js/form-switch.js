document.addEventListener('DOMContentLoaded', function () {
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    showSignupLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });

    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });
});
