/**
 * UTILS & UI HELPERS
 * Feedback de cópia e outros helpers.
 */
export function initTokenCopy() {
  const COPYABLE = '.ds-color-hex, .ds-type-spec, .ds-color-name';

  document.querySelectorAll(COPYABLE).forEach(el => {
    el.style.cursor = 'copy';
    el.title = 'Clique para copiar';

    el.addEventListener('click', () => {
      const text = el.textContent.trim();

      if (!navigator.clipboard) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showCopyFeedback(el);
        return;
      }

      navigator.clipboard.writeText(text).then(() => showCopyFeedback(el));
    });
  });

  function showCopyFeedback(el) {
    const original = el.textContent;
    el.textContent = '✓ Copiado!';
    el.style.color = 'var(--color-success, #64a85e)';

    setTimeout(() => {
      el.textContent = original;
      el.style.color = '';
    }, 1500);
  }
}
