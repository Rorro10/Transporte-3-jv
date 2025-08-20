// Navegación suave para los enlaces de anclaje
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

// Navbar fijo con efecto de scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset;
	
	if (currentScroll <= 0) {
		navbar.classList.remove('scroll-up');
		return;
	}
	
	if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
		// Scroll hacia abajo
		navbar.classList.remove('scroll-up');
		navbar.classList.add('scroll-down');
	} else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
		// Scroll hacia arriba
		navbar.classList.remove('scroll-down');
		navbar.classList.add('scroll-up');
	}
	lastScroll = currentScroll;
});

// Firebase configuration
const firebaseConfig = {
	// Aquí irán las credenciales de Firebase que necesitarás configurar
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_AUTH_DOMAIN",
	projectId: "YOUR_PROJECT_ID",
	storageBucket: "YOUR_STORAGE_BUCKET",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
	appId: "YOUR_APP_ID"
};

// Initialize Firebase solo si hay credenciales reales
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY");
let db = null;
if (isFirebaseConfigured && typeof firebase !== "undefined") {
	firebase.initializeApp(firebaseConfig);
	db = firebase.firestore();
}

// Form submission handling
document.getElementById('contact-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const formData = {
		nombre: e.target[0].value,
		email: e.target[1].value,
		telefono: e.target[2].value,
		mensaje: e.target[3].value,
		fecha: new Date().toISOString()
	};

	if (!db) {
		alert('Gracias por tu mensaje. Por ahora, el formulario funciona en modo demostración. Escríbenos a: transportes.tres.jv@gmail.com');
		e.target.reset();
		return;
	}

	try {
		await db.collection('contactos').add(formData);
		alert('¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
		e.target.reset();
	} catch (error) {
		console.error('Error al enviar el formulario:', error);
		alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
	}
});

// Animación de aparición para las secciones
const observerOptions = {
	root: null,
	rootMargin: '0px',
	threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			observer.unobserve(entry.target);
		}
	});
}, observerOptions);

// Observar todas las secciones principales
document.querySelectorAll('section').forEach(section => {
	section.classList.add('fade-in');
	observer.observe(section);
});

// Validación de formulario
function validateForm() {
	const inputs = contactForm.querySelectorAll('input, textarea');
	let isValid = true;

	inputs.forEach(input => {
		if (input.hasAttribute('required') && !input.value.trim()) {
			isValid = false;
			input.classList.add('error');
		} else {
			input.classList.remove('error');
		}

		if (input.type === 'email' && input.value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(input.value)) {
				isValid = false;
				input.classList.add('error');
			}
		}
	});

	return isValid;
}

// Agregar estilos CSS para las animaciones
const style = document.createElement('style');
style.textContent = `
	.fade-in {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.fade-in.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.error {
		border-color: #e74c3c !important;
	}

	.scroll-down {
		transform: translateY(-100%);
		transition: transform 0.3s ease-in-out;
	}

	.scroll-up {
		transform: translateY(0);
		transition: transform 0.3s ease-in-out;
	}
`;
document.head.appendChild(style);

// Funcionalidad del botón Quiénes Somos
const aboutToggle = document.querySelector('.about-toggle');
const aboutContainer = document.querySelector('.about-container');

aboutToggle.addEventListener('click', () => {
	aboutToggle.classList.toggle('active');
	aboutContainer.classList.toggle('active');
}); 