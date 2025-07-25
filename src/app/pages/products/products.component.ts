import { Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoaderCircle, LucideAngularModule, RotateCw } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../../core/interfaces/productinterface/product';
import { ProductsService } from '../../core/services/products/products.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-products',
  imports: [RouterLink, LucideAngularModule,],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  private _ProductsService = inject(ProductsService);
  private _ToastrService = inject(ToastrService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  readonly RotateCw = RotateCw
  readonly LoaderCircle = LoaderCircle
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  products: Product[] = [];
  categories: string[] = [];
  isLoading!: boolean;
  cancelFetchProducts!: Subscription;
  fakeArray: any = new Array(20);
  retryConnection: boolean = false;
  isConnected!: any;
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      window.addEventListener('online', () => {
        if(navigator.onLine) {
        this.fetchAllProducts();
      }
    })

  }
    this.fetchAllProducts();
  }
fetchAllProducts(): void {
  this.isLoading = true;
  this.retryConnection = false;
  this.cancelFetchProducts = this._ProductsService.fetchProducts().subscribe({
    next: (res) => {
      this.products = res;
      this.isLoading = false;
    },
    error: (err) => {
      console.log(err);
      this.isLoading = false;
      this.retryConnection = true;
      this._ToastrService.error(`${err.error.message}`);
    }
  });
}
retryFetchProducts(): void {
  if(isPlatformBrowser(this._PLATFORM_ID)) {
  if (!navigator.onLine) {
    this._ToastrService.error('No Internet Connection');
    return;
  }
  this.fetchAllProducts();
}

  }
fetchCategories(): void {
  this.categories = Array.from(new Set(this.products.map(p => p.category)));
}
toggleDropdown() {
  const dropdown = this.dropdownMenu.nativeElement;
  dropdown.classList.toggle('hidden');
}
ngOnDestroy(): void {
  this.cancelFetchProducts?.unsubscribe();
}
}
