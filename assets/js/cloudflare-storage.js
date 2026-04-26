/**
 * cloudflare-storage.js
 * Upload direto de imagens para Cloudflare Worker + R2.
 * Uso:
 *   const url = await handleImageUpload(file);
 */
(function () {
    'use strict';

    const ACCEPTED_MIME_TYPES = new Set([
        'image/jpeg',
        'image/png',
        'image/webp',
    ]);
    const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

    function getCloudflareSettings() {
        return {
            workerUrl: (localStorage.getItem('cf_worker_url') || '').trim(),
            apiKey: (localStorage.getItem('cf_api_key') || '').trim(),
        };
    }

    async function handleImageUpload(file, options = {}) {
        const { onStatusChange } = options;

        if (!file) {
            throw new Error('Nenhum arquivo selecionado para upload.');
        }

        if (!ACCEPTED_MIME_TYPES.has(file.type)) {
            throw new Error('Formato inválido. Use JPG, PNG ou WEBP.');
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new Error('Arquivo muito grande. Limite de 8 MB.');
        }

        const { workerUrl, apiKey } = getCloudflareSettings();
        if (!workerUrl || !apiKey) {
            throw new Error('Configure Cloudflare Worker URL e API Key nas configurações.');
        }

        if (typeof onStatusChange === 'function') {
            onStatusChange('loading');
        }

        const formData = new FormData();
        formData.append('file', file);

        let response;
        try {
            response = await fetch(workerUrl, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                },
                body: formData,
            });
        } catch (error) {
            throw new Error('Falha de conexão com o serviço de upload.');
        }

        let payload = null;
        try {
            payload = await response.json();
        } catch (error) {
            throw new Error('Resposta inválida do servidor de upload.');
        }

        if (!response.ok) {
            throw new Error(payload && payload.error ? payload.error : 'Erro ao enviar imagem para o R2.');
        }

        if (!payload || !payload.url) {
            throw new Error('Upload concluído, mas sem URL retornada.');
        }

        if (typeof onStatusChange === 'function') {
            onStatusChange('success', payload.url);
        }

        return payload.url;
    }

    window.CloudflareStorage = {
        getCloudflareSettings,
        handleImageUpload,
    };
    window.handleImageUpload = handleImageUpload;
})();
