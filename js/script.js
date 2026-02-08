document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Navigation Buttons Logic
    prevBtn.addEventListener('click', () => {
        const currentSlide = getCurrentSlide();
        const prevSlide = currentSlide.previousElementSibling;
        if (prevSlide && prevSlide.classList.contains('slide')) {
            prevSlide.scrollIntoView({ behavior: 'smooth' });
        }
    });

    nextBtn.addEventListener('click', () => {
        const currentSlide = getCurrentSlide();
        const nextSlide = currentSlide.nextElementSibling;
        if (nextSlide && nextSlide.classList.contains('slide')) {
            nextSlide.scrollIntoView({ behavior: 'smooth' });
        }
    });

    const sidebarItems = document.querySelectorAll('.sidebar li');

    // Sidebar Click Logic
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSlide = document.getElementById(targetId);
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Helper to find the slide currently most visible in the viewport
    function getCurrentSlide() {
        let maxVisibleHeight = 0;
        let activeSlide = slides[0];

        slides.forEach(slide => {
            const rect = slide.getBoundingClientRect();
            // Calculate visible height of the slide
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            
            if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                activeSlide = slide;
            }
        });
        return activeSlide;
    }

    // Intersection Observer for Fade-in effects
    const observerOptions = {
        root: container,
        threshold: 0.5 // Trigger when 50% of the slide is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                entry.target.classList.add('active');
                
                // Update sidebar active state
                const id = entry.target.id;
                sidebarItems.forEach(item => {
                    if (item.getAttribute('data-target') === id) {
                        item.classList.add('active');
                        // Ensure sidebar scroll follows selection
                        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    } else {
                        item.classList.remove('active');
                    }
                });
            } else {
                entry.target.classList.remove('active');
                // Optional: keep 'in-view' if you want them to stay visible once seen
            }
        });
    }, observerOptions);

    slides.forEach(slide => {
        observer.observe(slide);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
});
