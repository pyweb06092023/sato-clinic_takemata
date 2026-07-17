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

const galleryTrack = document.querySelector('.gallery-track');
const gallerySlides = document.querySelectorAll('.gallery-track .gallery-slide');
const galleryDots = document.querySelector('.gallery-dots');

if (galleryTrack && gallerySlides.length) {
    let galleryIndex = 0;
    let galleryTouchStartX = 0;
    let galleryTimer = null;

    const updateGalleryCarousel = () => {
        const slideWidth = galleryTrack.parentElement?.clientWidth || galleryTrack.clientWidth || galleryTrack.offsetWidth;
        galleryTrack.style.transition = 'transform 0.35s ease';
        galleryTrack.style.transform = `translateX(-${galleryIndex * slideWidth}px)`;
        if (!galleryDots) {
            return;
        }

        const dots = Array.from(galleryDots.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === galleryIndex);
        });
    };

    const goToGallerySlide = (index) => {
        if (!gallerySlides.length) {
            return;
        }
        galleryIndex = (index + gallerySlides.length) % gallerySlides.length;
        updateGalleryCarousel();
    };

    const startGalleryAutoPlay = () => {
        clearInterval(galleryTimer);
        galleryTimer = window.setInterval(() => {
            goToGallerySlide(galleryIndex + 1);
        }, 4000);
    };

    const buildGalleryDots = () => {
        if (!galleryDots) {
            return;
        }

        galleryDots.innerHTML = '';
        gallerySlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `${index + 1}枚目へ切り替える`);
            dot.addEventListener('click', () => goToGallerySlide(index));
            galleryDots.appendChild(dot);
        });

        updateGalleryCarousel();
        startGalleryAutoPlay();
    };

    galleryTrack.addEventListener('mouseenter', () => {
        clearInterval(galleryTimer);
    });

    galleryTrack.addEventListener('mouseleave', () => {
        startGalleryAutoPlay();
    });

    galleryTrack.addEventListener('touchstart', (event) => {
        galleryTouchStartX = event.touches[0].clientX;
    }, { passive: true });

    galleryTrack.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - galleryTouchStartX;

        if (deltaX < -50) {
            goToGallerySlide(galleryIndex + 1);
        } else if (deltaX > 50) {
            goToGallerySlide(galleryIndex - 1);
        }
    }, { passive: true });

    buildGalleryDots();
}
