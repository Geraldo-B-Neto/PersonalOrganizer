/**
 * github-db.js
 * Módulo para interação com a GitHub API, atuando como um Serverless Database.
 */

const GitHubDB = (function () {
    const API_BASE = 'https://api.github.com';

    function getSettings() {
        return {
            token: localStorage.getItem('gh_token') || '',
            owner: localStorage.getItem('gh_owner') || '',
            repo: localStorage.getItem('gh_repo') || '',
            path: localStorage.getItem('gh_path') || 'database.json',
            branch: localStorage.getItem('gh_branch') || 'main'
        };
    }

    function isConfigured() {
        const s = getSettings();
        return s.token && s.owner && s.repo && s.path;
    }

    /**
     * Faz fetch do database.json diretamente do GitHub.
     * Retorna { data: Object, sha: string } ou lança um erro.
     */
    async function fetchDatabase() {
        if (!isConfigured()) {
            throw new Error('Configurações do GitHub ausentes.');
        }

        const { token, owner, repo, path, branch } = getSettings();
        const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'If-None-Match': '' // Evita cache
            }
        });

        if (response.status === 404) {
            // Arquivo não existe ainda
            return {
                data: { last_update: new Date().toISOString(), kits: [] },
                sha: null
            };
        }

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `Erro ao carregar o banco de dados (${response.status})`);
        }

        const result = await response.json();
        const contentStr = decodeURIComponent(escape(atob(result.content)));
        
        try {
            const data = JSON.parse(contentStr);
            return { data, sha: result.sha };
        } catch (e) {
            throw new Error('Falha ao interpretar o arquivo JSON do banco de dados.');
        }
    }

    /**
     * Salva o objeto no database.json no GitHub.
     */
    async function saveDatabase(dataObj, currentSha) {
        if (!isConfigured()) {
            throw new Error('Configurações do GitHub ausentes.');
        }

        const { token, owner, repo, path, branch } = getSettings();
        const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}`;

        // Atualiza a data
        dataObj.last_update = new Date().toISOString();

        const jsonStr = JSON.stringify(dataObj, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonStr)));

        const body = {
            message: `CMS: Atualização do banco de dados (${new Date().toLocaleString()})`,
            content: encodedContent,
            branch: branch
        };

        if (currentSha) {
            body.sha = currentSha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `Erro ao salvar no GitHub (${response.status})`);
        }

        const result = await response.json();
        return { data: dataObj, sha: result.content.sha };
    }

    return {
        getSettings,
        isConfigured,
        fetchDatabase,
        saveDatabase
    };
})();
