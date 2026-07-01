document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const shortenForm = document.getElementById('shorten-form');
    const urlInput = document.getElementById('url-input');
    const customAliasBtn = document.getElementById('toggle-alias-btn');
    const customAliasGroup = document.getElementById('custom-alias-group');
    const customAliasInput = document.getElementById('custom-alias');
    const shortenBtn = document.getElementById('shorten-btn');
    const errorContainer = document.getElementById('shorten-error');
    
    const resultBox = document.getElementById('result-box');
    const resultLink = document.getElementById('result-link');
    const copyBtn = document.getElementById('copy-btn');
    
    const urlsList = document.getElementById('urls-list');
    const linksCount = document.getElementById('links-count');
    const logoutBtn = document.getElementById('logout-btn');

    // Base URL configuration for display
    const BASE_URL = window.location.origin + '/';
    document.getElementById('baseUrlDisplay').textContent = BASE_URL;

    // Initialization
    if (API.getToken()) {
        logoutBtn.classList.remove('hidden');
        document.getElementById('user-initial').classList.remove('hidden');
        // Initial letter could be fetched from a user profile endpoint if one existed
        document.getElementById('user-initial').textContent = 'U'; 
        fetchUrls();
    } else {
        window.location.href = '/login.html';
    }

    // Toggle Custom Alias input
    customAliasBtn.addEventListener('click', () => {
        customAliasGroup.classList.toggle('collapsed');
        if (!customAliasGroup.classList.contains('collapsed')) {
            customAliasInput.focus();
            customAliasBtn.textContent = 'Remove custom alias';
        } else {
            customAliasInput.value = '';
            customAliasBtn.textContent = 'Add custom alias';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        API.clearAuth();
    });

    // Utility: Show Error
    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.add('visible');
        setTimeout(() => {
            errorContainer.classList.remove('visible');
        }, 5000);
    };

    // Form Submission: Shorten URL
    shortenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        const code = customAliasInput.value.trim() || undefined; // Send undefined if empty to trigger nanoid
        
        if (!url) return;

        // UI Loading State
        shortenBtn.disabled = true;
        shortenBtn.classList.add('loading');
        errorContainer.classList.remove('visible');
        resultBox.classList.add('hidden');

        try {
            const body = { url };
            if (code) body.code = code;

            const response = await API.fetch('/shorten', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            // Display Success Result
            const shortUrl = `${BASE_URL}${response.shortCode}`;
            resultLink.href = shortUrl;
            resultLink.textContent = shortUrl;
            resultBox.classList.remove('hidden');
            
            // Re-fetch the list to update UI
            fetchUrls();
            
            // Clean inputs
            urlInput.value = '';
            if (!customAliasGroup.classList.contains('collapsed')) {
                customAliasInput.value = '';
                customAliasGroup.classList.add('collapsed');
                customAliasBtn.textContent = 'Add custom alias';
            }

        } catch (error) {
            showError(error.message);
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.classList.remove('loading');
        }
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(resultLink.href);
            
            // Visual feedback
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });

    // Fetch URLs Function
    async function fetchUrls() {
        try {
            const response = await API.fetch('/codes', {
                method: 'GET'
            });
            
            renderUrls(response.codes || []);
        } catch (error) {
            urlsList.innerHTML = `<div class="empty-state">
                <p>Failed to load your links. Please refresh.</p>
                <p class="error-text">${error.message}</p>
            </div>`;
        }
    }

    // Render URLs to DOM
    function renderUrls(urls) {
        linksCount.textContent = urls.length;

        if (urls.length === 0) {
            urlsList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <h3>No links yet</h3>
                    <p>Shorten your first URL using the form above!</p>
                </div>
            `;
            return;
        }

        urlsList.innerHTML = ''; // Clear loader

        urls.sort((a, b) => new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date())).forEach(link => {
            const shortUrl = `${BASE_URL}${link.shortCode}`;
            
            const card = document.createElement('div');
            card.className = 'url-card glass';
            
            card.innerHTML = `
                <div class="url-info">
                    <div class="url-short">
                        <a href="${shortUrl}" target="_blank" rel="noopener noreferrer">${shortUrl}</a>
                    </div>
                    <div class="url-target">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        <span title="${link.targetUrl}">${link.targetUrl}</span>
                    </div>
                </div>
                <div class="url-actions">
                    <button class="action-btn copy-action-btn" data-url="${shortUrl}" title="Copy">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button class="action-btn delete-action-btn" data-id="${link.id}" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;
            
            urlsList.appendChild(card);
        });

        // Attach event listeners for dynamic buttons inside the list
        attachCardEventListeners();
    }

    function attachCardEventListeners() {
        // Copy buttons
        document.querySelectorAll('.copy-action-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const url = e.currentTarget.getAttribute('data-url');
                try {
                    await navigator.clipboard.writeText(url);
                    const icon = e.currentTarget.querySelector('svg');
                    const oldHtml = icon.outerHTML;
                    e.currentTarget.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    
                    setTimeout(() => {
                        e.currentTarget.innerHTML = oldHtml;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-action-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmDelete = confirm("Are you sure you want to delete this short link?");
                if (!confirmDelete) return;

                const id = e.currentTarget.getAttribute('data-id');
                const card = e.currentTarget.closest('.url-card');
                
                try {
                    card.style.opacity = '0.5';
                    await API.fetch(`/${id}`, {
                        method: 'DELETE'
                    });
                    
                    // Remove from DOM
                    card.remove();
                    
                    // Update count
                    const currentCount = parseInt(linksCount.textContent);
                    linksCount.textContent = currentCount - 1;

                    // Show empty state if count is 0
                    if (currentCount - 1 === 0) {
                        renderUrls([]); // This will render empty state
                    }
                } catch (error) {
                    alert(error.message);
                    card.style.opacity = '1';
                }
            });
        });
    }
});
