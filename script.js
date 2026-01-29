const buttons = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
const niveis = document.querySelectorAll('.nivel');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        contents.forEach(c => c.classList.remove('active'));
        const tab = document.getElementById(btn.dataset.tab);
        tab.classList.add('active');

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

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);
reveals.forEach(reveal => observer.observe(reveal));

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = scrollY / docHeight;

    const g1 = 20 + progress * 60;
    const g2 = 10 + progress * 70;
    const g3 = 80 + progress * 40;

    document.body.style.setProperty("--g1", `${g1}%`);
    document.body.style.setProperty("--g2", `${g2}%`);
    document.body.style.setProperty("--g3", `${g3}%`);
});