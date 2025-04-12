// 复制功能实现
function initCopy() {
    const toast = document.querySelector('.copy-toast');
    let timer = null;

    // 创建隐藏的textarea
    const copyArea = document.createElement('textarea');
    copyArea.style.position = 'fixed';
    copyArea.style.opacity = 0;

    document.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', async (e) => {
            try {
                const text = el.dataset.copy;
                
                // 新方法（推荐）
                if(navigator.clipboard) {
                    await navigator.clipboard.writeText(text);
                } 
                // 兼容旧方法
                else {
                    copyArea.value = text;
                    document.body.appendChild(copyArea);
                    copyArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(copyArea);
                }

                // 显示提示
                if(timer) clearTimeout(timer);
                toast.classList.add('show');
                timer = setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
                
            } catch (err) {
                alert('复制失败');
            }
        });
    });
}

class CanvasBackground {
    constructor() {
        this.canvas = document.getElementById('canvasBg');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initParticles();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initParticles() {
        const colors = ['#418D42', 'rgba(255,203,51,0.8)', '#A3C497'];
        for(let i = 0; i < 120; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            if(particle.x < 0 || particle.x > this.width) particle.dx *= -1;
            if(particle.y < 0 || particle.y > this.height) particle.dy *= -1;
        });
    }

    draw() {
        this.ctx.fillStyle = '#F5F9F3';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.particles.forEach(p => this.drawParticle(p));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw();
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
}

class ScrollHandler {
    constructor() {
        this.container = document.querySelector('.phone-container');
        this.isDown = false;
        this.startX;
        this.scrollLeft;

        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mouseleave', () => this.handleMouseUp());
        this.container.addEventListener('mouseup', () => this.handleMouseUp());
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.container.addEventListener('touchend', () => this.handleTouchEnd());
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }

    handleMouseDown(e) {
        this.isDown = true;
        this.container.classList.add('grabbing');
        this.startX = e.pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
    }

    handleMouseUp() {
        this.isDown = false;
        this.container.classList.remove('grabbing');
    }

    handleMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.container.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.container.scrollLeft = this.scrollLeft - walk;
    }

    handleTouchStart(e) {
        this.isDown = true;
        this.startX = e.touches[0].pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
    }

    handleTouchEnd() {
        this.isDown = false;
    }

    handleTouchMove(e) {
        if (!this.isDown) return;
        const x = e.touches[0].pageX - this.container.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.container.scrollLeft = this.scrollLeft - walk;
    }
}

class ScrollAnimator {
    constructor() {
        this.sections = document.querySelectorAll('.scroll-section');
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        entry.target.querySelectorAll('.phone-mockup').forEach((phone, index) => {
                            setTimeout(() => phone.classList.add('active'), index * 100);
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );
        this.sections.forEach(section => this.observer.observe(section));
    }
}

 // 弹窗控制函数
 function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    
    // 点击背景关闭
    modal.onclick = function(e) {
        if(e.target === modal) closeModal();
    }
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new CanvasBackground();
    new ScrollAnimator();
    new ScrollHandler();
    initCopy()

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onselectstart = () => false;

    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        window.scrollBy({
            top: e.deltaY > 0 ? 500 : -500,
            behavior: 'smooth'
        });
    }, { passive: false });
});