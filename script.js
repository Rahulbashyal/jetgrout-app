// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    // Add click event to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });

    // Highlight active section on scroll
    const sections = document.querySelectorAll('.doc-section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);

                if (correspondingLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle direct URL navigation (e.g., /docs#login)
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetSection = document.querySelector(targetId);
        const targetLink = document.querySelector(`.nav-link[href="${targetId}"]`);

        if (targetSection && targetLink) {
            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active to target
            targetLink.classList.add('active');

            // Scroll to section after a short delay to ensure page is loaded
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Add copy button to code blocks if any
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(button);
    });

    // Mobile menu toggle (for responsive design)
    const createMobileToggle = () => {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');

            if (!document.querySelector('.mobile-toggle')) {
                const toggleButton = document.createElement('button');
                toggleButton.className = 'mobile-toggle';
                toggleButton.innerHTML = '☰ Menu';
                toggleButton.style.cssText = `
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    z-index: 1000;
                    background: #1a1a2e;
                    color: #fff;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                `;

                toggleButton.addEventListener('click', () => {
                    sidebar.classList.toggle('mobile-open');
                    if (sidebar.classList.contains('mobile-open')) {
                        sidebar.style.display = 'block';
                        toggleButton.innerHTML = '✕ Close';
                    } else {
                        sidebar.style.display = 'none';
                        toggleButton.innerHTML = '☰ Menu';
                    }
                });

                document.body.appendChild(toggleButton);

                // Hide sidebar by default on mobile
                sidebar.style.display = 'none';
            }
        }
    };

    createMobileToggle();
    window.addEventListener('resize', createMobileToggle);

    // Add search functionality
    const addSearchBox = () => {
        const sidebarHeader = document.querySelector('.sidebar-header');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" class="search-input" placeholder="Search documentation..." />
        `;
        searchContainer.style.cssText = `
            margin-top: 1rem;
        `;

        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            color: #fff;
            font-size: 0.9rem;
            outline: none;
        `;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const navLinks = document.querySelectorAll('.nav-link');
            const navSections = document.querySelectorAll('.nav-section');

            navSections.forEach(section => {
                let hasVisibleLinks = false;
                const links = section.querySelectorAll('.nav-link');

                links.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        link.style.display = 'block';
                        hasVisibleLinks = true;
                    } else {
                        link.style.display = 'none';
                    }
                });

                // Hide section header if no links match
                const sectionHeader = section.querySelector('h3');
                if (sectionHeader) {
                    sectionHeader.style.display = hasVisibleLinks ? 'block' : 'none';
                }
            });
        });

        sidebarHeader.appendChild(searchContainer);
    };

    addSearchBox();

    // Add "Back to Top" button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background: #4a90e2;
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTopButton);

    // Show/hide back to top button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Print functionality
    const addPrintButton = () => {
        const sections = document.querySelectorAll('.doc-section');
        sections.forEach(section => {
            const printButton = document.createElement('button');
            printButton.className = 'print-section-button';
            printButton.innerHTML = '🖨️ Print Section';
            printButton.style.cssText = `
                background: #6c757d;
                color: #fff;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.875rem;
                cursor: pointer;
                margin-top: 1rem;
                display: inline-block;
            `;

            printButton.addEventListener('click', () => {
                const printWindow = window.open('', '', 'height=600,width=800');
                printWindow.document.write('<html><head><title>Print</title>');
                printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:2rem;}</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(section.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            });

            section.appendChild(printButton);
        });
    };

    // Uncomment to enable print buttons
    // addPrintButton();
});
