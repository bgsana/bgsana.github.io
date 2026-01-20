const buttons = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
const niveis = document.querySelectorAll('.nivel');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {

        // ativa botão
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // mostra conteúdo
        contents.forEach(c => c.classList.remove('active'));
        const tab = document.getElementById(btn.dataset.tab);
        tab.classList.add('active');

        // anima barras apenas no soft skills
        if (btn.dataset.tab === 'soft') {
            niveis.forEach(nivel => {
                nivel.style.width = nivel.dataset.nivel;
            });
        } else {
            niveis.forEach(nivel => {
                nivel.style.width = '0';
            });
        }
    });
});
