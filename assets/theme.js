/* ===== Heart to Soul — Theme JS ===== */
document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Menu --- */
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        document.querySelectorAll('[data-mobile-menu-toggle]').forEach(btn => {
            btn.addEventListener('click', () => mobileMenu.classList.add('is-open'));
        });
        document.querySelectorAll('[data-mobile-menu-close]').forEach(btn => {
            btn.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
        });
    }

    /* --- Cart Drawer --- */
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                cartDrawer.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });
        document.querySelectorAll('[data-cart-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                cartDrawer.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }

    /* --- Hero Slider --- */
    document.querySelectorAll('[data-hero-slider]').forEach(slider => {
        const slides = slider.querySelectorAll('.hero-slide');
        const dots = slider.querySelectorAll('.hero-slider__dot');
        const speedContainer = slider.querySelector('.hero-slides');
        const speed = speedContainer ? parseInt(speedContainer.dataset.speed) || 7000 : 7000;
        let current = 0;
        let interval;

        if (slides.length <= 1) return;

        const goTo = (index) => {
            slides[current].classList.remove('is-active');
            if (dots[current]) dots[current].classList.remove('is-active');
            current = index;
            slides[current].classList.add('is-active');
            if (dots[current]) dots[current].classList.add('is-active');
        };

        const next = () => goTo((current + 1) % slides.length);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goTo(i);
                clearInterval(interval);
                interval = setInterval(next, speed);
            });
        });

        interval = setInterval(next, speed);

        // Touch support
        let touchStartX = 0;
        slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        slider.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goTo((current + 1) % slides.length);
                else goTo((current - 1 + slides.length) % slides.length);
                clearInterval(interval);
                interval = setInterval(next, speed);
            }
        });
    });

    /* --- Quick Add to Cart (AJAX) --- */
    document.querySelectorAll('.product-card__quick-add form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const body = JSON.stringify({
                id: formData.get('id'),
                quantity: 1
            });
            fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
                .then(res => res.json())
                .then(() => {
                    // Open cart drawer
                    const cartDrawer = document.getElementById('cart-drawer');
                    if (cartDrawer) {
                        // Refresh cart drawer content
                        fetch('/?sections=cart-drawer')
                            .then(r => r.json())
                            .catch(() => { });
                        cartDrawer.classList.add('is-open');
                        document.body.style.overflow = 'hidden';
                    }
                    // Update cart count
                    fetch('/cart.js')
                        .then(r => r.json())
                        .then(cart => {
                            document.querySelectorAll('[data-cart-count]').forEach(el => {
                                el.textContent = cart.item_count;
                            });
                        });
                })
                .catch(err => console.error('Add to cart error:', err));
        });
    });

});
