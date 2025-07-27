import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../shared/enviroment/enviro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _HttpClient = inject(HttpClient);
  private baseUrl: string = enviroment.baseUrl;
  fetchProducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}products`)
  }
}
