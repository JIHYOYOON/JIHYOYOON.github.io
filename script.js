document.addEventListener('DOMContentLoaded', () => {
    initIridescentBeads();
    initNavigation();
    initCanvasTriggers();
    
    // Restore the fade-in delay for the main content
    setTimeout(() => {
        const board = document.getElementById('image-board');
        if (board) board.classList.add('visible');
    }, 1000);
});

function initCanvasTriggers() {
    // 1. Keyboard Trigger (Spacebar)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page jumping
            const paintSection = document.getElementById('paint-screen');
            if (paintSection) {
                paintSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // 2. Mouse Wheel Scroll Down Trigger
    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 50) { // Significant scroll down
            const paintSection = document.getElementById('paint-screen');
            if (paintSection) {
                // The scroll-snap CSS will naturally snap
            }
        }
    }, { passive: true });

    // 3. Paint Blob Clicks
    const blobs = document.querySelectorAll('.paint-blob');
    const paintPages = ['paint_hub.html', 'HaliGalli.html'];
    
    blobs.forEach((blob, index) => {
        blob.addEventListener('click', () => {
            const target = paintPages[index];
            if (target) {
                window.location.href = target;
            } else {
                // For unassigned blobs, just go to hub
                window.location.href = 'paint_hub.html';
            }
        });
    });
}

function initIridescentBeads() {
    const container = document.getElementById('bead-container');
    if (!container) return;
    
    const count = 15;
    const beads = [];

    for (let i = 0; i < count; i++) {
        const bead = document.createElement('div');
        bead.className = 'iridescent-bead';
        
        const size = Math.random() * 40 + 20;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        bead.style.width = `${size}px`;
        bead.style.height = `${size}px`;
        bead.style.left = `${x}%`;
        bead.style.top = `${y}%`;
        
        container.appendChild(bead);
        
        beads.push({
            el: bead,
            x: x,
            y: y,
            factor: Math.random() * 20 + 10
        });
    }

    // Zero-Gravity mouse reaction
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        beads.forEach(bead => {
            const moveX = (mouseX - 0.5) * bead.factor;
            const moveY = (mouseY - 0.5) * bead.factor;
            bead.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

function initNavigation() {
    const buttons = document.querySelectorAll('.convex-glass-btn');
    const pages = ['info.html', 'hobbies.html', 'classes.html'];
    
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                const target = pages[index] || 'info.html';
                window.location.href = target;
            }, 100);
        });
    });

    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            window.location.href = 'info.html';
        });
    }
}
