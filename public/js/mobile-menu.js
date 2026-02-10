/**
 * Mobile Menu Controller
 * Maneja la funcionalidad del menú hamburguesa responsive
 */

class MobileMenu {
  constructor() {
    this.navLinks = null;
    this.menuToggle = null;
    this.menuIcon = null;
    this.overlay = null;
    this.body = document.body;
    
    this.init();
  }
  
  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.navLinks = document.getElementById('navLinks');
    this.menuToggle = document.querySelector('.mobile-menu-toggle');
    this.menuIcon = this.menuToggle?.querySelector('.material-icons');
    
    if (!this.navLinks || !this.menuToggle) {
      console.error('Mobile menu elements not found:', {
        navLinks: !!this.navLinks,
        menuToggle: !!this.menuToggle
      });
      return;
    }
    
    console.log('Mobile menu initialized successfully');
    this.createOverlay();
    this.bindEvents();
  }
  
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'mobile-menu-overlay';
    this.body.appendChild(this.overlay);
    
    // Cerrar menú al hacer clic en overlay
    this.overlay.addEventListener('click', () => this.close());
  }
  
  bindEvents() {
    // Toggle del menú
    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Menu toggle clicked');
      this.toggle();
    });
    
    // Cerrar menú al hacer clic en enlaces
    this.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close());
    });
    
    // Cerrar menú al redimensionar ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.close();
      }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
    
    // Prevenir scroll en móvil cuando el menú está abierto
    this.overlay.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }
  
  toggle() {
    console.log('Toggle called, current state:', this.isOpen() ? 'open' : 'closed');
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    console.log('Opening menu');
    this.navLinks.classList.remove('mobile-hidden');
    this.navLinks.classList.add('mobile-visible');
    this.menuToggle.classList.add('active');
    this.overlay.classList.add('active');
    this.body.classList.add('menu-open');
    
    if (this.menuIcon) {
      this.menuIcon.textContent = 'close';
    }
    
    // Enfocar el primer enlace para accesibilidad
    const firstLink = this.navLinks.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  close() {
    console.log('Closing menu');
    this.navLinks.classList.remove('mobile-visible');
    this.navLinks.classList.add('mobile-hidden');
    this.menuToggle.classList.remove('active');
    this.overlay.classList.remove('active');
    this.body.classList.remove('menu-open');
    
    if (this.menuIcon) {
      this.menuIcon.textContent = 'menu';
    }
  }
  
  isOpen() {
    return this.navLinks.classList.contains('mobile-visible');
  }
}

// Función global para compatibilidad con onclick
function toggleMobileMenu() {
  if (window.mobileMenu) {
    window.mobileMenu.toggle();
  }
}

// Inicializar cuando se carga el script
window.mobileMenu = new MobileMenu();