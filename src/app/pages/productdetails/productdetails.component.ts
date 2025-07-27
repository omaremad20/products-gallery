import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeartIcon, LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../../core/interfaces/productinterface/product';
import { ProductdetailsService } from '../../core/services/productdetails/productdetails.service';
import { NointernetHandlerComponent } from "../nointernet-handler/nointernet-handler.component";
import { NotfoundComponent } from "../notfound/notfound.component";
import { ServerErrorComponent } from "../server-error/server-error.component";
@Component({
  selector: 'app-productdetails',
  imports: [LucideAngularModule, NointernetHandlerComponent, ServerErrorComponent, NotfoundComponent],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css'
})
export class ProductdetailsComponent implements OnInit, OnDestroy {
  private _ProductdetailsService = inject(ProductdetailsService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _ToastrService = inject(ToastrService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  private onlineHandler = () => {
    this.fetchProduct(this.productId);
    this._ToastrService.success('Connection Restored');
  };
  private offlineHandler = () => {
    this._ToastrService.error('No Internet Connection !');
  };
  readonly HeartIcon = HeartIcon;
  readonly ShoppingCart = ShoppingCart;
  product: Product | null = null;
  productId!: number;
  cancelFetchProductId!: Subscription;
  cancelFetchProduct!: Subscription;
  cancelPopTimeOut: any;
  cancelIsRetryTimeOut: any;
  isRetry: boolean = false;
  isFetched: boolean = false;
  isInWishList: boolean = false;
  iconPopped = false;
  isFreeShipping!: boolean;
  isLoading!: boolean;
  isConnected!: boolean;
  serverError!: boolean;
  ngOnInit(): void {
    this.fetchProductId();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      window.scrollTo(0, 0);
      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);
    }
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
  fetchProduct(productId: number): void {
    if (this.cancelFetchProduct) {
      this.cancelFetchProduct?.unsubscribe();
    }
    this.isLoading = true;
    this.cancelFetchProduct = this._ProductdetailsService.fetchProductDetails(productId).subscribe({
      next: (res) => {
        this.responseHandler(res);
      },
      error: (err) => {
        this.errorHandler(err);
      }
    })
  }
  responseHandler(res: any): void {
    this.isConnected = true;
    this.serverError = false;
    this.product = res;
    if (this.product !== null) {
      if (this.product.price > 500) {
        this.isFreeShipping = true;
      } else {
        this.isFreeShipping = false;
      }
    }
    this.isLoading = false;
    this.isFetched = true;
    this.isRetry = false;
  }
  errorHandler(err: any): void {
    this.isFetched = true;
    this.isLoading = false;
    if (err.error.message === 'fetch failed') {
      return;
    } else {
      if (isPlatformBrowser(this._PLATFORM_ID)) {
        if (err.error?.message === 'Failed to fetch' && err.status === 0 && !navigator.onLine) {
          this.isConnected = false;
          this.serverError = false;
          this._ToastrService.error('No Internet Connection !');
        } else {
          this.serverError = true;
          this.isConnected = true;
          // this._ToastrService.error('Something went wrong.try again later!') || Show err.error.message(trust backend messages?) ;
          this._ToastrService.error('Something went wrong.try again later!')
        }
      }
    }
    this.isRetry = false;
  }
  retryFetchProduct(): void {
    if (this.isRetry) return;
    this.isRetry = true;
    this.cancelIsRetryTimeOut = setTimeout(() => {
      this.isRetry = false
    }, 5000);
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (!navigator.onLine) {
        this._ToastrService.error('No Internet Connection !');
        return;
      }
    }
    this.fetchProduct(this.productId);
  }
  addToWishList(): void {
    this.iconPopped = true;
    this.isInWishList = !this.isInWishList;
    this.cancelPopTimeOut = setTimeout(() => (this.iconPopped = false), 300);
    this.isInWishList ? this._ToastrService.success('Product Added To Wish list !') : this._ToastrService.success('Product Removed !')
  }
  ngOnDestroy(): void {
    this.cancelFetchProductId?.unsubscribe();
    this.cancelFetchProduct?.unsubscribe();
    clearTimeout(this.cancelIsRetryTimeOut);
    clearTimeout(this.cancelPopTimeOut);
  }
}
