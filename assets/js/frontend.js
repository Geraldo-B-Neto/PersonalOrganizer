/**
 * frontend.js
 * Script para renderização dinâmica dos kits a partir do database.json
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('dynamic-kits-container');
    if (!container) return; // Não está na página de kits

    const DB_URL = 'database.json';

    // Skeleton loader function
    function showLoading() {
        container.innerHTML = Array(3).fill(0).map(() => `
            <div class="card" style="pointer-events: none;">
                <div class="card__media" style="background: var(--color-bg-alt); animation: pulse 1.5s infinite;"></div>
                <div class="card__body">
                    <div style="height: 12px; width: 40%; background: var(--color-bg-alt); margin-bottom: 16px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
                    <div style="height: 24px; width: 80%; background: var(--color-bg-alt); margin-bottom: 12px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
                    <div style="height: 16px; width: 100%; background: var(--color-bg-alt); margin-bottom: 24px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
                    <div style="height: 120px; width: 100%; background: var(--color-bg-alt); margin-bottom: 24px; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
                    <div style="height: 48px; width: 100%; background: var(--color-bg-alt); border-radius: 4px; animation: pulse 1.5s infinite;"></div>
                </div>
            </div>
        `).join('');

        // Adiciona a keyframe se não existir
        if (!document.getElementById('pulse-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-style';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Escape HTML function to prevent XSS
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function loadKits() {
        showLoading();

        try {
            // Adiciona um timestamp na query para evitar cache pesado (opcional, ou depende da CDN)
            const response = await fetch(`${DB_URL}?t=${new Date().getTime()}`);
            if (!response.ok) throw new Error('Falha ao carregar os dados dos kits.');
            
            const data = await response.json();
            const kits = data.kits || [];

            if (kits.length === 0) {
                container.innerHTML = '<p class="type--body text-muted" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">Nenhum kit disponível no momento.</p>';
                return;
            }

            container.innerHTML = kits.map(kit => {
                const name = kit.name || 'Kit Sem Nome';
                const num = kit.number || '';
                const cat = kit.category || '';
                const catLbl = kit.categoryLabel || '';
                const price = kit.price ? (kit.price.startsWith('R$') ? kit.price : `R$ ${kit.price}`) : 'Consultar';
                const desc = kit.description || '';
                const status = kit.status || 'disponivel';
                const sLabel = kit.statusLabel || 'Disponível';
                const imgUrl = kit.imageUrl || '';
                const imgAlt = kit.imageAlt || name;
                
                const waMsg = encodeURIComponent(`Olá, tenho interesse no ${name}`);
                const waUrl = `https://wa.me/5534999890649?text=${waMsg}`;

                // Imagem
                const imgHtml = imgUrl
                    ? `<img src="${escHtml(imgUrl)}" alt="${escHtml(imgAlt)}" class="preview-card-image" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;">`
                    : `<div class="card__media-placeholder type--label tracking-widest text-muted uppercase">Foto do Kit — ${escHtml(name)}</div>`;

                // Badge
                const statusBadge = status === 'disponivel'
                    ? `<span class="tag tag--green">${escHtml(sLabel)}</span>`
                    : status === 'reserva'
                        ? `<span class="tag tag--purple">${escHtml(sLabel)}</span>`
                        : `<span class="tag tag--default">${escHtml(sLabel)}</span>`;

                const ctaText = status === 'indisponivel' ? 'Entrar na Lista de Espera' : 'Reservar Este Kit';

                // Lista de Itens
                const checklistHtml = (kit.items && kit.items.length)
                    ? kit.items.map(i => `<li class="type--body-sm">✓ &nbsp;${escHtml(i)}</li>`).join('')
                    : '<li class="type--body-sm">✓ &nbsp;Itens não especificados</li>';

                return `
                <div class="card anim--scale-up" 
                     data-kit="${escHtml(num)}" 
                     data-category="${escHtml(cat)}" 
                     data-price="${escHtml(kit.price ? kit.price.replace(',', '.') : '0')}" 
                     data-status="${escHtml(status)}">
                    
                    <div class="card__media img-zoom">
                        ${imgHtml}
                    </div>

                    <div class="card__body">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">
                            <p class="card__eyebrow">${num ? `Kit ${escHtml(num)} · ` : ''}${escHtml(catLbl)}</p>
                            ${statusBadge}
                        </div>

                        <h3 class="card__title">${escHtml(name)}</h3>
                        <p class="card__desc">${escHtml(desc)}</p>

                        <div style="margin-bottom:var(--space-4);padding:var(--space-4);background:var(--color-bg-alt)">
                            <p class="type--label tracking-widest text-muted uppercase" style="margin-bottom:var(--space-3)">Incluso no kit:</p>
                            <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--space-2)">
                                ${checklistHtml}
                            </ul>
                        </div>

                        <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:var(--space-5)">
                            <span class="type--h2 font-serif" style="font-weight:300">${escHtml(price)}</span>
                        </div>

                        <a href="${waUrl}" class="btn btn--primary btn--full" target="_blank" rel="noopener">
                            ${escHtml(ctaText)}
                        </a>
                    </div>
                </div>
                `;
            }).join('');

            // Re-inicializa os observers de animação para os novos cards, caso o ds-core.js suporte isso de alguma forma.
            // O ds-core.js normalmente roda no DOMContentLoaded, então podemos precisar forçar.
            if (typeof IntersectionObserver !== 'undefined') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('#dynamic-kits-container .anim--scale-up').forEach(el => observer.observe(el));
            } else {
                document.querySelectorAll('#dynamic-kits-container .anim--scale-up').forEach(el => el.classList.add('is-visible'));
            }

        } catch (error) {
            console.error('Erro no frontend.js:', error);
            container.innerHTML = `
                <div style="grid-column: 1/-1; padding: 2rem; border: 1px solid var(--color-border); text-align: center; color: var(--color-text-muted);">
                    <p>Ocorreu um erro ao carregar os kits de decoração.</p>
                    <p style="font-size: 12px; margin-top: 8px;">Por favor, atualize a página ou tente novamente mais tarde.</p>
                </div>
            `;
        }
    }

    loadKits();
});
