document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorContainer = document.getElementById('auth-error');
    const submitBtn = document.getElementById('submit-btn');

    // Utility to show error
    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    };

    const setLoading = (isLoading) => {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    };

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading(true);

            try {
                const response = await API.fetch('/user/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                if (response.token) {
                    API.setAuth(response.token, response.userId);
                    window.location.href = '/';
                }
            } catch (error) {
                showError(error.message);
                setLoading(false);
            }
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading(true);

            try {
                const body = { firstname, email, password };
                if (lastname) body.lastname = lastname;

                const response = await API.fetch('/user/sign-up', {
                    method: 'POST',
                    body: JSON.stringify(body)
                });

                if (response.userId) {
                    // Registration successful, auto-login or redirect
                    // For simplicity, redirecting to login
                    window.location.href = '/login.html?registered=true';
                }
            } catch (error) {
                // Formatting Zod errors roughly
                showError(error.message === "Validation Failed" ? "Please check your input format" : error.message);
                setLoading(false);
            }
        });

        // Show success message if redirected from register
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registered')) {
            errorContainer.style.color = '#DB8D4E';
            errorContainer.style.backgroundColor = 'rgba(219, 141, 78, 0.1)';
            errorContainer.style.borderColor = 'rgba(219, 141, 78, 0.2)';
            showError('Registration successful! Please sign in.');
            
            // Reset colors back to error style after showing
            setTimeout(() => {
                errorContainer.style.color = '';
                errorContainer.style.backgroundColor = '';
                errorContainer.style.borderColor = '';
            }, 5000);
        }
    }
});
