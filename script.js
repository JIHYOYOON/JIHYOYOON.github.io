document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.glass-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Interaction effect: subtle scale press
            button.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                // Navigate to a new blank page
                window.location.href = 'about:blank';
            }, 100);
        });
    });

    // Optional: Follow mouse subtle movement for extra premium feel
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
});
