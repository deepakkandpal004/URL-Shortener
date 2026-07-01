const API = {
    getToken() {
        return localStorage.getItem('token');
    },

    setAuth(token, userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    },

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login.html';
    },

    async fetch(endpoint, options = {}) {
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (response.status === 401 && endpoint !== '/user/login') {
                this.clearAuth();
                throw new Error('Session expired');
            }

            if (!response.ok) {
                if (data.error && typeof data.error === 'object' && data.error._errors) {
                    throw new Error('Validation Failed');
                }
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};

const currentPath = window.location.pathname;
const isAuthPage = currentPath === '/login.html' || currentPath === '/register.html';

if (!API.getToken() && !isAuthPage) {
    window.location.href = '/login.html';
} else if (API.getToken() && isAuthPage) {
    window.location.href = '/';
}
