import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar } from './components/shared/navbar/navbar'; // Asegúrate que la ruta a tu Navbar sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  // Importa CommonModule (para ngIf/ngClass), RouterOutlet y tu NavbarComponent
  imports: [CommonModule, RouterOutlet, Navbar], 
  templateUrl: './app.html',
  styleUrl: './app.css' // o .scss
})
export class App {
  
  // 1. Inyectamos el Router
  private router = inject(Router);

  // 2. Creamos una signal para controlar la visibilidad del navbar
  // Por defecto, se muestra.
  showNavbar = signal(true);

  constructor() {
    // 3. Nos suscribimos a los eventos del router
    this.router.events.pipe(
      // Filtramos solo los eventos de 'NavigationEnd' (cuando la navegación termina)
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      
      // 4. Comprobamos la URL
      if (event.urlAfterRedirects === '/checkout') {
        // Si estamos en '/checkout', ocultamos el navbar
        this.showNavbar.set(false);
      } else {
        // Para cualquier otra ruta, lo mostramos
        this.showNavbar.set(true);
      }
    });
  }
}
