/**
 * API service to handle requests to the backend with authentication
 */
const API = {
    /**
     * Get the stored JWT token
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Store login data
     */
    setAuth(token, userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    },

    /**
     * Clear auth data (Logout)
     */
    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login.html';
    },

    /**
     * Base fetch utility
     */
    async fetch(endpoint, options = {}) {
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();

            // Handle 401 Unauthorized globally
            if (response.status === 401 && endpoint !== '/user/login') {
                this.clearAuth();
                throw new Error('Session expired');
            }

            if (!response.ok) {
                // If it's a validation error object
                if (data.error && typeof data.error === 'object' && data.error._errors) {
                    throw new Error("Validation Failed");
                }
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};

// Protect pages that require auth
const currentPath = window.location.pathname;
const isAuthPage = currentPath === '/login.html' || currentPath === '/register.html';

if (!API.getToken() && !isAuthPage) {
    window.location.href = '/login.html';
} else if (API.getToken() && isAuthPage) {
    window.location.href = '/';
}
