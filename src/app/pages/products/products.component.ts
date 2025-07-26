import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, LucideAngularModule, Search } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../../core/interfaces/productinterface/product';
import { ProductsService } from '../../core/services/products/products.service';
import { NointernetHandlerComponent } from "../nointernet-handler/nointernet-handler.component";
import { ServerErrorComponent } from "../server-error/server-error.component";
@Component({
  selector: 'app-products',
  imports: [RouterLink, NointernetHandlerComponent, ServerErrorComponent, LucideAngularModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  readonly ArrowDownNarrowWide = ArrowDownNarrowWide;
  readonly ArrowUpNarrowWide = ArrowUpNarrowWide;
  readonly Search = Search;
  readonly sortPriceOptions: string[] = ['highprice', 'lowprice'];
  readonly sortCharsOptions: string[] = ['a-z', 'z-a'];
  private _ProductsService = inject(ProductsService);
  private _ToastrService = inject(ToastrService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  private onlineHandler = () => {
    this._ToastrService.success('Connection Restored');
    this.fetchAllProducts();
  };
  private offlineHandler = () => {
    this._ToastrService.error('No Internet Connection !');
  };
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: string[] = [];
  cancelFetchProducts!: Subscription;
  cancelDetectChanegs!: Subscription;
  fakeArray: any = new Array(16);
  cancelIsRetryTimeOut: any;
  isRetry: boolean = false;
  isFetched: boolean = false;
  isFilters: boolean = false;
  isLoading!: boolean;
  isConnected!: boolean;
  serverError!: boolean;
  search: FormGroup = new FormGroup({
    search: new FormControl(''),
    category: new FormControl('all'),
    sortPrice: new FormControl(''),
    sortChars: new FormControl(''),
    rate: new FormControl(false),
  })
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const savedFilters = sessionStorage.getItem('filters');
      if (savedFilters) {
        this.search.setValue(JSON.parse(savedFilters));
      }
      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);
    }
    this.fetchAllProducts()
    this.applySearch();
    this.cancelDetectChanegs = this.search.valueChanges.subscribe(v => {
      sessionStorage.setItem('filters', JSON.stringify(v));
      this.applySearch();
    });
  }
  fetchAllProducts(): void {
    if (this.cancelFetchProducts) {
      this.cancelFetchProducts?.unsubscribe();
    }
    this.isLoading = true;
    this.cancelFetchProducts = this._ProductsService.fetchProducts().subscribe({
      next: (res) => {
        this.responseHandler(res);
      },
      error: (err) => {
        this.errorHandler(err)
      }
    });
  }
  responseHandler(res: any): void {
    this.isConnected = true;
    this.serverError = false;
    this.allProducts = res;
    this.products = [...this.allProducts];
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
          this._ToastrService.error('Something went wrong.try again later!');
        }
      }
    }
    this.isRetry = false;
  }
  fetchCategories(): void {
    this.categories = Array.from(new Set(this.allProducts.map(p => p.category)));
  }
  applySearch(): void {
    const searchControl = this.search.get('search')?.value;
    const categoryControl = this.search.get('category')?.value;
    const sortPriceControl = this.search.get('sortPrice')?.value;
    const sortCharsControl = this.search.get('sortChars')?.value;
    const rateControl = this.search.get('rate')?.value;
    this.products = this.allProducts
      .filter(product => {
        return searchControl ?
          product.title.toLowerCase().includes(searchControl.trim().toLowerCase()) : true;
      })
      .filter(product => {
        return (!categoryControl || categoryControl === 'all') ?
          true : product.category === categoryControl;
      })
      .sort((a, b) => {
        if (sortPriceControl === 'highprice') return b.price - a.price;
        if (sortPriceControl === 'lowprice') return a.price - b.price;
        if (sortCharsControl === 'a-z') return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
        if (sortCharsControl === 'z-a') return b.title.localeCompare(a.title, undefined, { sensitivity: 'base' });
        if (rateControl) return b.rating.rate - a.rating.rate;
        return 0;
      });
  }
  resetAsDefult(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      sessionStorage.removeItem('filters')
    }
    this.search.patchValue({
      search: (''),
      category: ('all'),
      sortPrice: (''),
      sortChars: (''),
      rate: (false)
    })
  }
  retryFetchProducts(): void {
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
    this.fetchAllProducts();
  }
  showFilters(): void {
    this.isFilters = !this.isFilters;
    this.fetchCategories();
  }
  ngOnDestroy(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
    }
    this.cancelFetchProducts?.unsubscribe();
    this.cancelDetectChanegs?.unsubscribe();
    clearTimeout(this.cancelIsRetryTimeOut);
  }
}
