export interface Product{
    id:number;
    nombre:string;
    descripcion?:string | "";
    precio:number;
    activo:boolean;
    stock:number;
    nombreCategoria:string;
    fecha_vencimiento:string;
    ImagenURL:string;


}

export interface ProductCart{
    id:number;
    nombre:string;
    precio:number;
    imagenURL:string;
    cantidad?:number;
}

export type OrderPayload = {
  billingInfo: {
    name: string;
    lastName: string;
    email: string;
  };
  cardInfo: { 
    name: string;
    number: string; // Enviar el número limpio (sin espacios)
    expMonth: string;
    expYear: string;
    // ¡ATENCIÓN! No envíes el CVC a tu propio backend a menos que 
    // cumplas con PCI. Normalmente, el CVC y la tarjeta se envían
    // a una pasarela de pago (ej. Stripe, MercadoPago) directamente.
  };
  items: ProductCart[];
  total: number;
}