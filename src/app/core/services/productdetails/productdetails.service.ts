import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../shared/enviroment/enviro';

@Injectable({
  providedIn: 'root'
})
export class ProductdetailsService {
  private _HttpClient = inject(HttpClient);
  private baseUrl: string = enviroment.baseUrl;
  fetchProductDetails(productId: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}products/${productId}`)
  }
}
