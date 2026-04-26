/**
 * responsivo.js
 * Lógica para elementos responsivos do framework
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle para os Headers
    const headers = document.querySelectorAll('.ds-header-demo-inner');
    
    headers.forEach(headerInner => {
        // Criar o botão hamburger
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Menu Principal');
        toggleBtn.innerHTML = '<span></span><span></span><span></span>';
        
        // Encontrar os elementos de navegação
        const nav = headerInner.querySelector('.demo-nav');
        const actions = headerInner.querySelector('.demo-nav-actions');
        
        // Inserir o botão no header logo após o logo, se possível, ou no final
        if (nav) {
            headerInner.insertBefore(toggleBtn, nav);
        } else {
            headerInner.appendChild(toggleBtn);
        }
        
        // Adicionar o evento de clique
        toggleBtn.addEventListener('click', () => {
            if (nav) nav.classList.toggle('is-active');
            if (actions) actions.classList.toggle('is-active');
            
            // Animação simples do ícone hamburger
            const spans = toggleBtn.querySelectorAll('span');
            if (nav && nav.classList.contains('is-active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
});
