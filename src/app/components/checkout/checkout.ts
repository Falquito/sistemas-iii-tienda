import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderPayload } from '../../interfaces/Product.interface';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'cart-checkout',
    templateUrl: 'checkout.html',
    imports: [
      DrawerModule,
    CommonModule,
    RouterLink, // Para el enlace de "Paso anterior"
    FormsModule // Para [(ngModel)] en checkbox y textarea
  ]
})

export class CheckoutComponent implements OnInit {
// Inyectamos el servicio de productos
  productsService = inject(ProductService);
  step = signal(1)
  router = inject(Router)
  visibleDrawer=signal(false)
  // --- 2. NUEVO: Signal de estado de carga ---
  isLoading = signal(false);
  // Exponemos las señales del servicio directamente al template
  // para que se actualicen reactivamente.
  productsCart = this.productsService.carrito;
  subtotal = this.productsService.totalCarrito; // Renombrado a subtotal para el cálculo

  // Simulación del descuento (puedes ajustarlo o traerlo de un servicio)
  readonly discountPercentage = 0.10; // 10% de descuento

  // Computed signal para el descuento
  discountAmount = computed(() => {
    return this.subtotal() * this.discountPercentage;
  });

  // Computed signal para el total final con descuento
  totalWithDiscount = computed(() => {
    return this.subtotal();
  });

  // --- SIGNALS PARA LOS DATOS DEL FORMULARIO ---
  
  // Signals para Datos de Facturación
  billingName = signal('');
  billingLastName = signal('');
  billingEmail = signal('');

  // Signals para Datos de Tarjeta
  cardName = signal('');
  cardNumber = signal(''); // Almacenará el número formateado "0000 0000..."
  cardExpiryMonth = signal('');
  cardExpiryYear = signal('');
  cardCVC = signal('');
  isCvcFocused = signal(false); // Para la animación de la tarjeta

  // --- NUEVO: Computed signal para detectar el tipo de tarjeta ---
  cardType = computed(() => {
    const num = this.cardNumber().replace(/\s+/g, ''); // Quita espacios
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'unknown';
  });
  // ---------------------------------------------------


  ngOnInit(): void {
    // Aquí puedes cargar datos adicionales si es necesario, 
    // pero el carrito ya se carga desde el servicio y se mantiene reactivo.
    console.log('Productos en el carrito:', this.productsCart());
  }

  // --- NUEVO: Método para formatear el número de tarjeta mientras se escribe ---
  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // 1. Limpiar valor (quitar no-dígitos)
    let value = input.value.replace(/\D/g, ''); 
    
    // 2. Limitar a 16 dígitos
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    
    // 3. Añadir espacios cada 4 dígitos
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    
    // 4. Actualizar la señal y el valor del input
    this.cardNumber.set(formattedValue);
    // Asignamos el valor formateado de vuelta al input
    input.value = formattedValue;
  }
  // ---------------------------------------------------------------------

  // Puedes añadir lógica para seleccionar opciones de pago, etc.
  selectPaymentOption(option: string) {
    console.log('Opción de pago seleccionada:', option);
    // Aquí podrías tener una signal para la opción de pago seleccionada
    // Por ejemplo: this.selectedPaymentOption.set(option);
  }

  // Método para manejar el botón "Siguiente"
  proceedToNextStep() {
    console.log('Procediendo al siguiente paso...');
    console.log('Productos:', this.productsCart());
    console.log('Total a pagar:', this.totalWithDiscount());
    
    // Log de los nuevos datos de facturación y tarjeta
    console.log('--- Datos de Facturación ---');
    console.log('Nombre:', this.billingName());
    console.log('Apellido:', this.billingLastName());
    console.log('Email:', this.billingEmail());

    console.log('--- Datos de Tarjeta ---');
    console.log('Titular:', this.cardName());
    // --- MODIFICADO: Loguear el número sin formato ---
    console.log('Número:', this.cardNumber().replace(/\s+/g, '')); 
    console.log('Vencimiento:', `${this.cardExpiryMonth()}/${this.cardExpiryYear()}`);
    console.log('CVC:', this.cardCVC());
    
    // Aquí iría la lógica para navegar a la siguiente etapa o enviar el pedido
    // Por ejemplo: this.router.navigate(['/checkout/review']);
    this.step.update(currentValue=>(currentValue+1))
    if(this.step()==3){
        console.log("COMPRANDOOO")
        this.handleSubmitOrder()

    }

  }
  handleSubmitOrder() {
    console.log('Iniciando envío de pedido...');
    this.isLoading.set(true); // Activar estado de carga (puedes usar esto para deshabilitar el botón)

    // 1. Construir el payload con los datos de las signals
    const orderPayload: OrderPayload = {
      billingInfo: {
        name: this.billingName(),
        lastName: this.billingLastName(),
        email: this.billingEmail()
      },
      cardInfo: {
        name: this.cardName(),
        number: this.cardNumber().replace(/\s+/g, ''), // Enviar número limpio
        expMonth: this.cardExpiryMonth(),
        expYear: this.cardExpiryYear()
        // Como dijimos, omitimos el CVC del payload a nuestro backend
      },
      items: this.productsCart(),
      total: this.totalWithDiscount()
    };

    // 2. Llamar al servicio y suscribirnos a la respuesta
    this.productsService.submitOrder(orderPayload).subscribe({
      next: (response) => {
        // ¡Éxito!
        console.log('Pedido enviado con éxito', response);
        this.isLoading.set(false);
        
        // Opcional: Limpiar el carrito en el servicio
        this.productsService.clearCart(); 

        // Redirigir a una página de "gracias"
        setTimeout(()=>{
          this.visibleDrawer.set(false)
          this.router.navigate(['/']); // (Asegúrate de que esta ruta exista)
        },5000)
        this.visibleDrawer.set(true)
      },
      error: (err) => {
        // Error
        console.error('Error al enviar el pedido', err);
        this.isLoading.set(false);
        // (Aquí deberías mostrar un mensaje de error al usuario en la UI)
      }
    });
  }

  goBack() {
    // Lógica para ir al paso anterior, por ejemplo, navegar al carrito
    // this.router.navigate(['/cart']);
    

    if(this.step()==1){
        this.router.navigate(['/cart'])
    }else{
        this.step.update(currentValue=>(currentValue-1))
    }
  }
}

