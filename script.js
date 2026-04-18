// --- Matter.js Setup ---
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

const engine = Engine.create();
engine.world.gravity.y = 0; // Float initially
const runner = Runner.create();
const domElements = []; 

function initPhysics() {
    const screenArea = document.getElementById('screen-area');
    // We bind physics to the #screen-area size, not full window (so it fits inside phone frame)
    const width = screenArea.clientWidth;
    const height = screenArea.clientHeight;

    // Walls
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, { isStatic: true });
    const topWall = Bodies.rectangle(width / 2, -50, width * 2, 100, { isStatic: true });
    
    Composite.add(engine.world, [leftWall, rightWall, topWall]);

    // Spawn 150 mixed items (Cherries and Dogs)
    const totalItems = 150;
    
    for (let i = 0; i < totalItems; i++) {
        const isCherry = Math.random() > 0.5;
        // Make sizes smaller since there are so many
        const size = Math.random() * 20 + 30; // 30px to 50px
        const x = Math.random() * (width - 40) + 20;
        const y = Math.random() * (height - 100) + 20;

        const body = Bodies.rectangle(x, y, size, size, {
            restitution: 0.9, // Very bouncy
            frictionAir: 0.05,
            density: 0.005,
            angle: Math.random() * Math.PI * 2
        });

        // Drift
        Matter.Body.setVelocity(body, { 
            x: (Math.random() - 0.5) * 3, 
            y: (Math.random() - 0.5) * 3 
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

        Composite.add(engine.world, body);

        // Create DOM element
        const el = document.createElement('div');
        el.className = 'physics-item ';
        el.className += isCherry ? 'cherry-item' : 'dog-item';
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        
        document.getElementById('splash-screen').appendChild(el);
        domElements.push({ body: body, el: el });
    }

    Runner.run(runner, engine);

    function updateDOM() {
        domElements.forEach(item => {
            item.el.style.transform = `translate(${item.body.position.x}px, ${item.body.position.y}px) translate(-50%, -50%) rotate(${item.body.angle}rad)`;
        });
        
        if(engine.world.gravity.y > 0) {
            // Check if all are below screen
            const allBelow = domElements.every(item => item.body.position.y > height + 100);
            if (allBelow && hasTapped) {
                endPhase1();
                return;
            }
            // Failsafe in case some get stuck
            if(hasTapped && Date.now() - fallbackTimer > 8000) {
                endPhase1();
                return;
            }
        }
        
        requestAnimationFrame(updateDOM);
    }
    
    requestAnimationFrame(updateDOM);
}

let hasTapped = false;
let phaseActive = 1;
let fallbackTimer = 0;

document.getElementById('splash-overlay').addEventListener('click', () => {
    if (hasTapped) return;
    hasTapped = true;
    fallbackTimer = Date.now();
    
    document.querySelector('.tap-hint').style.display = 'none';

    // Gravity On
    engine.world.gravity.y = 1.5;
    
    // Initial push
    domElements.forEach(item => {
        Matter.Body.setVelocity(item.body, {
            x: (Math.random() - 0.5) * 10,
            y: 5 + Math.random() * 10
        });
    });
});

function endPhase1() {
    if(phaseActive > 1) return;
    phaseActive = 2;

    const splash = document.getElementById('splash-screen');
    splash.style.opacity = '0';
    
    setTimeout(() => {
        splash.classList.add('hidden');
        Runner.stop(runner); // Stop physics
        startPhase2();
    }, 1000);
}

function startPhase2() {
    const introContainer = document.getElementById('intro-container');
    introContainer.classList.remove('hidden');
    
    const textTarget = "JIHYO YOON's\nwebsite";
    const textEl = document.getElementById('intro-text');
    let idx = 0;
    
    function typeChar() {
        if (idx < textTarget.length) {
            let char = textTarget.charAt(idx);
            if(char === '\n') {
                textEl.innerHTML += '<br>';
                textEl.setAttribute('data-text', textEl.getAttribute('data-text') + '\n');
            } else {
                textEl.innerHTML += char;
                textEl.setAttribute('data-text', textEl.getAttribute('data-text') + char);
            }
            idx++;
            setTimeout(typeChar, 80); // Speed
        } else {
            setTimeout(endPhase2, 1500);
        }
    }
    
    // reset
    textEl.setAttribute('data-text', '');
    typeChar();
}

function endPhase2() {
    if(phaseActive > 3) return;
    phaseActive = 3;

    const introContainer = document.getElementById('intro-container');
    introContainer.style.transition = 'opacity 1s ease';
    introContainer.style.opacity = '0';
    
    setTimeout(() => {
        introContainer.classList.add('hidden');
        startPhase3();
    }, 1000);
}

function startPhase3() {
    const mainUi = document.getElementById('main-ui');
    mainUi.classList.remove('hidden');
    void mainUi.offsetWidth; // reflow
    mainUi.classList.add('visible');
}

// Modal handling
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.add('open');
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 400); // Matches CSS transition duration
    }
};

window.onload = initPhysics;
