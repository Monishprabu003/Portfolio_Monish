document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.innerHTML = '<i class="fa-solid fa-location-arrow"></i>';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Detect if hovering over a clickable element
        const target = e.target;
        const isClickable = target.closest('a') ||
            target.closest('button') ||
            window.getComputedStyle(target).cursor === 'pointer';

        if (isClickable) {
            cursor.innerHTML = '<i class="fa-solid fa-hand-pointer"></i>';
            cursor.classList.add('pointer-active');
        } else {
            cursor.innerHTML = '<i class="fa-solid fa-location-arrow"></i>';
            cursor.classList.remove('pointer-active');
        }
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.2)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });

    // Nexus Animation for Background
    class NexusAnimation {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: -100, y: -100, radius: 250 };
            this.time = 0;

            this.init();
        }

        init() {
            this.canvas.id = 'bg-animation-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.zIndex = '2'; // Above split-bg (z-index 1) but below content
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.opacity = '1';
            this.canvas.style.background = 'transparent';
            document.body.prepend(this.canvas);

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });

            this.resize();
            this.animate();
        }

        resize() {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.createParticles();
        }

        createParticles() {
            this.particles = [];
            const count = Math.min(80, Math.floor((this.width * this.height) / 15000));

            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    z: Math.random() * 3 + 1,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 4 + 2,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.02 + Math.random() * 0.03
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.time += 0.01;
            const mid = this.width / 2;

            this.particles.forEach((p, i) => {
                // Determine color based on position (Left side mild white, Right side black)
                const isLeft = p.x < mid;
                const baseColor = isLeft ? '255, 255, 255' : '0, 0, 0';

                // Movement
                p.x += p.vx * (1 / p.z);
                p.y += p.vy * (1 / p.z);

                // Wrap
                if (p.x < -50) p.x = this.width + 50;
                if (p.x > this.width + 50) p.x = -50;
                if (p.y < -50) p.y = this.height + 50;
                if (p.y > this.height + 50) p.y = -50;

                // Mouse interaction
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let extraSize = 0;
                if (dist < this.mouse.radius) {
                    const force = (1 - dist / this.mouse.radius);
                    p.x -= dx * force * 0.03;
                    p.y -= dy * force * 0.03;
                    extraSize = force * 8;
                }

                // Pulse & Opacity
                p.pulse += p.pulseSpeed;
                const pulseFactor = Math.sin(p.pulse) * 0.4 + 0.6;
                const opac = (0.4 + (1 / p.z) * 0.5) * pulseFactor;

                // Draw Particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, (p.size + extraSize) * (2 / p.z), 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${baseColor}, ${opac})`;
                this.ctx.fill();

                // Connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const ldx = p.x - p2.x;
                    const ldy = p.y - p2.y;
                    const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

                    if (ldist < 180) {
                        const lineOpac = (1 - ldist / 180) * 0.3 * (1 / p.z);

                        // Line color logic: If cross midline, fade out or blend. 
                        // For better visuals, we use the color of the side p is currently on.
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(${baseColor}, ${lineOpac})`;
                        this.ctx.lineWidth = 0.8;
                        this.ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize Nexus Animation
    new NexusAnimation();

    console.log("Nexus Animation Active with Split Colors");
});
