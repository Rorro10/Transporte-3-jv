const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', event => {
			const href = anchor.getAttribute('href');
			const target = href ? document.querySelector(href) : null;
			if (!target) return;

			event.preventDefault();
			target.scrollIntoView({
				behavior: prefersReducedMotion ? 'auto' : 'smooth',
				block: 'start'
			});
		});
	});
}

function initNavbarScroll() {
	const navbar = document.querySelector('.navbar');
	if (!navbar) return;

	let lastScroll = 0;
	window.addEventListener('scroll', () => {
		const currentScroll = window.pageYOffset;

		if (currentScroll <= 0) {
			navbar.classList.remove('scroll-up');
			return;
		}

		if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
			navbar.classList.remove('scroll-up');
			navbar.classList.add('scroll-down');
		} else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
			navbar.classList.remove('scroll-down');
			navbar.classList.add('scroll-up');
		}

		lastScroll = currentScroll;
	});
}

function initSectionAnimations() {
	const sections = document.querySelectorAll('section');
	sections.forEach(section => section.classList.add('fade-in'));

	if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
		sections.forEach(section => section.classList.add('visible'));
		return;
	}

	const observer = new IntersectionObserver((entries, currentObserver) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('visible');
			currentObserver.unobserve(entry.target);
		});
	}, {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	});

	sections.forEach(section => observer.observe(section));
}

function initAboutToggle() {
	const aboutToggle = document.querySelector('.about-toggle');
	const aboutContainer = document.querySelector('.about-container');
	if (!aboutToggle || !aboutContainer) return;

	aboutToggle.addEventListener('click', () => {
		const isExpanded = aboutToggle.classList.toggle('active');
		aboutContainer.classList.toggle('active', isExpanded);
		aboutToggle.setAttribute('aria-expanded', String(isExpanded));
	});
}

function init() {
	initSmoothScroll();
	initNavbarScroll();
	initSectionAnimations();
	initAboutToggle();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}