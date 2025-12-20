document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);


    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });


    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const items = entry.target.querySelectorAll('.timeline-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 300);
                });
            }
        });
    }, { threshold: 0.2 });

    const timeline = document.querySelector('.timeline');
    if (timeline) timelineObserver.observe(timeline);


    const spotlight = document.querySelector('.spotlight-overlay');
    if (spotlight) {
        window.addEventListener('mousemove', (e) => {
            spotlight.style.setProperty('--x', `${e.clientX}px`);
            spotlight.style.setProperty('--y', `${e.clientY}px`);
        });
    }


    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '魂갓匠人業統脈傳技職誠藝美善線漆笠冠冒織結絲竹鬃針飾禮士義志氣靜修虛實固秀德鑑傳世壽';
            this.specialChars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40) + 80;
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (to === ' ' || to === '\n') {
                        output += to;
                    } else {
                        if (!char || Math.random() < 0.015) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += `<span class="dud">${char}</span>`;
                    }
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output.replace(/\n/g, '<br>');
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            if (Math.random() < 0.3) {
                return this.specialChars[Math.floor(Math.random() * this.specialChars.length)];
            }
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }


    const scrambleElements = document.querySelectorAll('h2, h3, .large-vertical');
    const scrambledInstances = [];

    scrambleElements.forEach(el => {
        const fx = new TextScramble(el);
        scrambledInstances.push({ element: el, fx: fx, originalText: el.innerText });


        const scrambleObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !el.classList.contains('scrambled')) {
                    el.classList.add('scrambled');
                    fx.setText(el.innerText);
                    scrambleObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        scrambleObserver.observe(el);
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero-full');

        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    const stampBtn = document.getElementById('stamp-btn');
    const commitmentInput = document.getElementById('commitment-input');
    const seal = document.getElementById('digital-seal');

    if (stampBtn && commitmentInput && seal) {
        stampBtn.addEventListener('click', () => {
            if (commitmentInput.value.trim() === '') {
                alert('응원의 한마디를 입력해주세요.');
                return;
            }

            seal.classList.add('stamped');
            stampBtn.textContent = '서약 완료';
            stampBtn.style.backgroundColor = '#555';
            stampBtn.style.cursor = 'default';
            stampBtn.disabled = true;
            commitmentInput.disabled = true;
            commitmentInput.classList.add('completed');
            commitmentInput.value = `"${commitmentInput.value}" - 서약해주셔서 감사합니다. 확인되었습니다.`;
        });
    }


    const legacySection = document.querySelector('.legacy-section');
    const legacyBg = document.querySelector('.legacy-bg-layer');

    if (legacySection && legacyBg) {
        window.addEventListener('scroll', () => {
            const rect = legacySection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = legacySection.offsetHeight;


            if (rect.top < viewportHeight && rect.bottom > 0) {

                if (rect.top <= 0) {

                    const scrolledPastTop = Math.abs(rect.top);

                    const fadeDistance = sectionHeight * 0.7;


                    let newOp = 0.4 - (scrolledPastTop / fadeDistance) * 0.4;
                    newOp = Math.max(0, newOp);

                    legacyBg.style.opacity = newOp;
                } else {
                    legacyBg.style.opacity = 0.4;
                }
            }
        });
    }



    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
    }
});
