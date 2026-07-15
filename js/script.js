const worksGrid = document.querySelector('.works-grid');
const workCards = document.querySelectorAll('.works-grid .work-card');
const carouselDots = document.querySelector('.carousel-dots');

if (worksGrid && workCards.length) {
    let currentIndex = 0;
    let touchStartX = 0;

    const isPhoneView = () => window.innerWidth <= 480;

    const updateCarousel = () => {
        if (!isPhoneView()) {
            worksGrid.style.transform = 'none';
            if (carouselDots) {
                carouselDots.innerHTML = '';
            }
            return;
        }

        worksGrid.style.transform = `translateX(-${currentIndex * 100}%)`;
        if (!carouselDots) {
            return;
        }

        const dots = Array.from(carouselDots.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentIndex);
        });
    };

    const goToSlide = (index) => {
        if (!workCards.length) {
            return;
        }
        currentIndex = (index + workCards.length) % workCards.length;
        updateCarousel();
    };

    const buildDots = () => {
        if (!carouselDots) {
            return;
        }

        carouselDots.innerHTML = '';
        if (!isPhoneView()) {
            updateCarousel();
            return;
        }

        workCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `${index + 1}枚目へ切り替える`);
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });

        updateCarousel();
    };

    worksGrid.addEventListener('touchstart', (event) => {
        if (!isPhoneView()) {
            return;
        }
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    worksGrid.addEventListener('touchend', (event) => {
        if (!isPhoneView()) {
            return;
        }

        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (deltaX < -50) {
            goToSlide(currentIndex + 1);
        } else if (deltaX > 50) {
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        buildDots();
    });

    buildDots();
}
