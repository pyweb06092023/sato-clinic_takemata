const galleryTrack = document.querySelector('.gallery-track');
const gallerySlides = document.querySelectorAll('.gallery-track .gallery-slide');
const galleryDots = document.querySelector('.gallery-dots');
const contactMap = document.querySelector('.contact-map');
const mapZoomInputs = document.querySelectorAll('input[name="map-zoom"]');

if (galleryTrack && gallerySlides.length) {
    let galleryIndex = 0;
    let galleryTouchStartX = 0;
    let galleryTimer = null;

    const updateGalleryCarousel = () => {
        const slideWidth = galleryTrack.parentElement?.clientWidth || galleryTrack.clientWidth || galleryTrack.offsetWidth;
        galleryTrack.style.transition = 'transform 0.8s ease';
        galleryTrack.style.transform = `translateX(-${galleryIndex * slideWidth}px)`;

        gallerySlides.forEach((slide, index) => {
            slide.classList.toggle('is-hidden', index !== galleryIndex);
        });

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
            dot.setAttribute('aria-label', `${index + 1}枚目へ移動`);
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

if (contactMap && mapZoomInputs.length) {
    const mapBaseUrl = 'https://www.google.com/maps?q=35.7102564661031,139.78121598301541';

    const applyMapZoom = (zoomLevel) => {
        // ラジオボタンの選択にあわせて、埋め込み地図の拡大率を切り替えます。
        contactMap.src = `${mapBaseUrl}&z=${zoomLevel}&output=embed`;
    };

    mapZoomInputs.forEach((input) => {
        input.addEventListener('change', () => {
            if (input.checked) {
                applyMapZoom(input.value);
            }
        });
    });

    const checkedInput = document.querySelector('input[name="map-zoom"]:checked');
    if (checkedInput) {
        applyMapZoom(checkedInput.value);
    }
}
