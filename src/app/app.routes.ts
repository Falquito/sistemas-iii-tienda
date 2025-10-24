import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { GalleriaComponent } from './components/shared/home/gallery/gallery';
import { ProductosComponent } from './components/productos/productos';
import { CartComponent } from './components/shop/carrito';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [

    {
        path:"",
        component:HomeComponent
    },
    {
        path:"productos",
        component:ProductosComponent
    },
    {
        path:"cart",
        component:CartComponent
    },
    {
        path:"checkout",
        component:CheckoutComponent
    }
];
