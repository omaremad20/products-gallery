import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
export const routes: Routes = [
  {
    path: '',
    title: 'Products',
    component: ProductsComponent,
  },
  {
    path: 'products',
    title: 'Products',
    component: ProductsComponent,
  },
  {
    title: 'ProductDetails',
    path: 'productdetails/:productId',
    loadComponent: () => import('./pages/productdetails/productdetails.component')
      .then((classes) => classes.ProductdetailsComponent),
  },
  {
    path: '**',
    title: 'pagenotfound',
    loadComponent: () => import('./pages/notfound/notfound.component')
      .then((classes) => classes.NotfoundComponent),
  }
];
