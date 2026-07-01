document.addEventListener('DOMContentLoaded', () => {
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

    // Short links resolve through the backend (redirect lives there)
    const SHORT_BASE = API_BASE + '/';
    const apiHost = new URL(API_BASE).host;
    document.getElementById('baseUrlDisplay').textContent = apiHost + '/';

    if (API.getToken()) {
        logoutBtn.classList.remove('hidden');
        document.getElementById('user-initial').classList.remove('hidden');
        document.getElementById('user-initial').textContent = 'U';
        fetchUrls();
    } else {
        window.location.href = '/login.html';
    }

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

    logoutBtn.addEventListener('click', () => {
        API.clearAuth();
    });

    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.add('visible');
        setTimeout(() => errorContainer.classList.remove('visible'), 5000);
    };

    shortenForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const url = urlInput.value.trim();
        const code = customAliasInput.value.trim() || undefined;

        if (!url) return;

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

            const shortUrl = `${SHORT_BASE}${response.shortCode}`;
            resultLink.href = shortUrl;
            resultLink.textContent = shortUrl;
            resultBox.classList.remove('hidden');

            fetchUrls();

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

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(resultLink.href);
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DB8D4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });

    async function fetchUrls() {
        try {
            const response = await API.fetch('/codes');
            renderUrls(response.codes || []);
        } catch (error) {
            urlsList.innerHTML = `<div class="empty-state"><p>Failed to load links. Please refresh.</p></div>`;
        }
    }

    function renderUrls(urls) {
        linksCount.textContent = urls.length;

        if (urls.length === 0) {
            urlsList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <h3>No links yet</h3>
                    <p>Shorten your first URL using the form above!</p>
                </div>`;
            return;
        }

        urlsList.innerHTML = '';

        urls.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).forEach(link => {
            const shortUrl = `${SHORT_BASE}${link.shortCode}`;
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
                </div>`;
            urlsList.appendChild(card);
        });

        attachCardEventListeners();
    }

    function attachCardEventListeners() {
        document.querySelectorAll('.copy-action-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const url = e.currentTarget.getAttribute('data-url');
                try {
                    await navigator.clipboard.writeText(url);
                    const oldHtml = e.currentTarget.innerHTML;
                    e.currentTarget.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DB8D4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    setTimeout(() => { e.currentTarget.innerHTML = oldHtml; }, 2000);
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            });
        });

        document.querySelectorAll('.delete-action-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (!confirm('Are you sure you want to delete this short link?')) return;
                const id = e.currentTarget.getAttribute('data-id');
                const card = e.currentTarget.closest('.url-card');
                try {
                    card.style.opacity = '0.5';
                    await API.fetch(`/${id}`, { method: 'DELETE' });
                    card.remove();
                    const current = parseInt(linksCount.textContent);
                    linksCount.textContent = current - 1;
                    if (current - 1 === 0) renderUrls([]);
                } catch (error) {
                    alert(error.message);
                    card.style.opacity = '1';
                }
            });
        });
    }
});
