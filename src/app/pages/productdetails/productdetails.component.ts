import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../core/interfaces/productinterface/product';
import { ProductdetailsService } from '../../core/services/productdetails/productdetails.service';
import { ToastrService } from 'ngx-toastr';
import { CarrotIcon, CarTaxiFront, HeartIcon, LucideAngularModule, ShoppingBasket, ShoppingCart } from 'lucide-angular';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-productdetails',
  imports: [LucideAngularModule],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css'
})
export class ProductdetailsComponent implements OnInit, OnDestroy {
  private _ProductdetailsService = inject(ProductdetailsService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _ToastrService = inject(ToastrService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  readonly HeartIcon = HeartIcon;
  readonly ShoppingCart = ShoppingCart
  isLoading!: boolean;
  productId!: number;
  cancelFetchProductId!: Subscription;
  cancelFetchProduct!: Subscription;
  product!: Product;
  isFreeShipping!: boolean;
  ngOnInit(): void {
    this.fetchProductId();
    this.fetchProduct(this.productId);
  }
  fetchProductId(): void {
    this.cancelFetchProductId = this._ActivatedRoute.paramMap.subscribe({
      next: (value) => {
        this.productId = Number(value.get('productId'));
      }, error: (err) => {
        this._ToastrService.error('Something went wrong. Try again shortly.');
      }
    })
  }
  retryProductId: number | null = null;
  fetchProduct(productId: number): void {
    this.isLoading = true;
    this.retryProductId = null;
    this._ProductdetailsService.fetchProductDetails(productId).subscribe({
      next: (res) => {
        this.product = res;
        if (this.product.price > 500) {
          this.isFreeShipping = true;
        } else {
          this.isFreeShipping = false;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = true;
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          if (!navigator.onLine) {
            this.retryProductId = productId;
            this._ToastrService.error('No Internet Connection !');
          } else if (err.status === 0) {
            this._ToastrService.error('Something went wrong. Try again shortly.');
          } else {
            this._ToastrService.error(`${err.error.message}`);
          }
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.cancelFetchProductId?.unsubscribe();
    this.cancelFetchProduct?.unsubscribe()
  }
}
