// Premium Fluid Particle Effect - Ocean Theme
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth Fluid Particle
class FluidParticle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx + (Math.random() - 0.5) * 0.5;
        this.vy = vy + (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.maxLife = 1;
        this.size = Math.random() * 25 + 15;
        this.baseSize = this.size;
        this.hue = 180 + Math.random() * 20;
        this.saturation = 100;
        this.lightness = 50 + Math.random() * 30;
        this.alpha = 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
        this.wave = Math.random() * Math.PI * 2;
        this.waveSpeed = 0.15 + Math.random() * 0.1;
    }

    update() {
        // Smooth deceleration
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        // Gentle wave motion
        this.wave += this.waveSpeed;
        const waveX = Math.sin(this.wave) * 0.5;
        const waveY = Math.cos(this.wave * 0.7) * 0.5;
        
        this.x += this.vx + waveX;
        this.y += this.vy + waveY;
        
        // Smooth rotation
        this.rotation += this.rotationSpeed;
        
        // Life decay
        this.life -= 0.012;
        
        // Size pulsing
        const pulse = Math.sin(this.wave * 2) * 0.15 + 0.85;
        this.size = this.baseSize * pulse * (this.life * 0.5 + 0.5);
        
        // Brightness variation
        this.lightness = 50 + Math.sin(this.wave * 1.5) * 20 + 10;
    }

    draw() {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const alpha = this.life * this.alpha;
        
        // Large soft glow
        const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.5);
        outerGradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness + 20}%, ${alpha * 0.3})`);
        outerGradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${alpha * 0.15})`);
        outerGradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness - 10}%, 0)`);
        
        ctx.filter = `blur(${this.size * 0.8}px)`;
        ctx.fillStyle = outerGradient;
        ctx.fillRect(-this.size * 2.5, -this.size * 2.5, this.size * 5, this.size * 5);
        
        // Medium glow
        const midGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.2);
        midGradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness + 30}%, ${alpha * 0.6})`);
        midGradient.addColorStop(0.6, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness + 10}%, ${alpha * 0.3})`);
        midGradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
        
        ctx.filter = `blur(${this.size * 0.4}px)`;
        ctx.fillStyle = midGradient;
        ctx.fillRect(-this.size * 1.2, -this.size * 1.2, this.size * 2.4, this.size * 2.4);
        
        // Bright core
        ctx.globalCompositeOperation = 'lighter';
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.6);
        coreGradient.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${alpha * 0.9})`);
        coreGradient.addColorStop(0.5, `hsla(${this.hue}, 100%, ${this.lightness + 20}%, ${alpha * 0.5})`);
        coreGradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
        
        ctx.filter = `blur(${this.size * 0.15}px)`;
        ctx.fillStyle = coreGradient;
        ctx.fillRect(-this.size * 0.6, -this.size * 0.6, this.size * 1.2, this.size * 1.2);
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Elegant Wave Ripple
class WaveRipple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 150;
        this.life = 1;
        this.speed = 6;
    }

    update() {
        this.radius += this.speed;
        this.life = 1 - (this.radius / this.maxRadius);
        this.speed *= 0.97;
    }

    draw() {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Outer wave
        ctx.strokeStyle = `hsla(180, 100%, 70%, ${this.life * 0.25})`;
        ctx.lineWidth = 3;
        ctx.filter = 'blur(10px)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Main wave
        ctx.strokeStyle = `hsla(180, 100%, 60%, ${this.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.filter = 'blur(4px)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner bright wave
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `hsla(180, 100%, 80%, ${this.life * 0.7})`;
        ctx.lineWidth = 1;
        ctx.filter = 'blur(2px)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.95, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

let particles = [];
let ripples = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let lastX = mouseX;
let lastY = mouseY;
let isMoving = false;

// Smooth mouse tracking
window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    if (distance > 1) {
        const speed = Math.min(distance * 0.15, 8);
        const angle = Math.atan2(dy, dx);
        
        // Create smooth trail
        const count = Math.ceil(distance / 10);
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const px = lastX + dx * t;
            const py = lastY + dy * t;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particles.push(new FluidParticle(px, py, vx, vy));
        }
        
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

// Click ripple
window.addEventListener('click', (e) => {
    ripples.push(new WaveRipple(e.clientX, e.clientY));
    
    // Radial burst
    for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const speed = 3 + Math.random() * 2;
        particles.push(new FluidParticle(
            e.clientX,
            e.clientY,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        ));
    }
});

// Touch support
let lastTouchX = 0;
let lastTouchY = 0;

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchX;
    const dy = touch.clientY - lastTouchY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 1) {
        const speed = Math.min(distance * 0.15, 8);
        const angle = Math.atan2(dy, dx);
        
        const count = Math.ceil(distance / 10);
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const px = lastTouchX + dx * t;
            const py = lastTouchY + dy * t;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particles.push(new FluidParticle(px, py, vx, vy));
        }
        
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
    }
}, { passive: false });

window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    ripples.push(new WaveRipple(touch.clientX, touch.clientY));
});

// Optimized animation loop
function animate() {
    // Clear completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].isDead()) {
            ripples.splice(i, 1);
        }
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
    
    // Limit particles
    if (particles.length > 100) {
        particles.splice(0, particles.length - 100);
    }
    
    requestAnimationFrame(animate);
}

animate();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.style.display = 'none';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Failed');
            }
        } catch (error) {
            formStatus.textContent = 'Error! Please email me directly at madancodes09@gmail.com';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Form animations
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateX(5px)';
    });
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateX(0)';
    });
});

// Skill tags animation
const skillTags = document.querySelectorAll('.tag');
const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
        }
    });
}, { threshold: 0.5 });

skillTags.forEach(tag => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
    tag.style.transition = 'all 0.5s ease';
    tagObserver.observe(tag);
});

// Project cards animation
const projectCards = document.querySelectorAll('.projects-grid .card');
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
        }
    });
}, { threshold: 0.2 });

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    projectObserver.observe(card);
});

// Typing effect
const subtitle = document.querySelector('.hero .subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    setTimeout(typeWriter, 500);
}

console.log('%c🌊 Ocean Portfolio', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%chttps://github.com/madan-design', 'color: #06b6d4; font-size: 14px;');
