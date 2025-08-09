// src/app/security/service/adminservice.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { catchError } from 'rxjs/operators';
import { throwError,of } from 'rxjs';

export interface Category {
  id: number;
  type: string;
}
// Define product interface
export interface Product {
   id?: number;
  category_id: number;
  product_name: string;
  quantity: number;
  cost_price: number | string;
  sell_price: number | string;
  banner_img: string;
  description:string;
  category: {
    id?: number;
    type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Adminservice {
 
  private APIurl: string = 'https://smallmarketbackendlaravel-production.up.railway.app/api/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
  return this.http.get<{ data: Product[] }>(this.APIurl + 'products').pipe(
    map(res => res.data)
  )}

  // addProduct(product: Product): Observable<Product> {
  //   return this.http.post<Product>(this.APIurl + 'products', product);
  // }

  // updateProduct(id: number, product: Product): Observable<Product> {
  //   return this.http.put<Product>(`${this.APIurl}products/${id}`, product);
  // }

  // deleteProduct(id: number): Observable<any> {
  //   return this.http.delete(`${this.APIurl}products/${id}`);
  // }

   addProduct(product: FormData): Observable<any> {
  return this.http.post(`${this.APIurl}products`, product).pipe(
    catchError(this.handleError)
  );
}

 updateProduct(id: number, product: Partial<Product>, file?: File): Observable<Product> {
  const url = `${this.APIurl}products/${id}`;
  if (file) {
    const formData = new FormData();
    if (product.category?.type) formData.append('category_type', product.category.type);
    if (product.product_name) formData.append('product_name', product.product_name);
    if (product.quantity !== undefined) formData.append('quantity', product.quantity.toString());
    if (product.cost_price !== undefined) formData.append('cost_price', product.cost_price.toString());
    if (product.sell_price !== undefined) formData.append('sell_price', product.sell_price.toString());
    if (product.description) formData.append('description', product.description);
    formData.append('banner_img', file);
    return this.http.post<Product>(url, formData).pipe(
      catchError(this.handleError)
    );
  }
  const payload: any = {};
  if (product.category?.type) payload.category_type = product.category.type;
  if (product.product_name) payload.product_name = product.product_name;
  if (product.quantity !== undefined) payload.quantity = product.quantity;
  if (product.cost_price !== undefined) payload.cost_price = product.cost_price;
  if (product.sell_price !== undefined) payload.sell_price = product.sell_price;
  if (product.description) payload.description = product.description;
  return this.http.post<Product>(url, payload).pipe(
    catchError(this.handleError)
  );
}

  deleteProduct(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.APIurl}products/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  //category
  getCategory():Observable<any>{
  return this.http.get<any>(this.APIurl + 'category').pipe(
    map(res => res.data)
  )}
  getProductbyCategory(categoryid:any):Observable<any>{
    return this.http.get<any>(this.APIurl+ `category/${categoryid}/products`).pipe(
      map(res => res.data)
    )
  }

//localhost:8000/api/dataanalyst/totalproducts?period=year

  getTotalProduct(period:string):Observable<any>{
    
    return this.http.get<any>(this.APIurl+ 'dataanalyst/allproductinstock?period='+period).pipe(
      
      map(res => res)
      
    )
  }
  getTotalProductSaled():Observable<any>{
    
    return this.http.get<any>(this.APIurl+ 'dataanalyst/totalallsaleproducts').pipe(
      
      map(res => res)
      
    )
  }

  getTotlOrder(period:string):Observable<any>{
    return this.http.get<any>(this.APIurl+ 'dataanalyst/totalorders?period='+period).pipe(
      map(res => res)
    )
  }
  getTotalRevenue(period:string):Observable<any>{
    return this.http.get<any>(this.APIurl+ 'dataanalyst/totalrevenue?period='+period).pipe(
      map(res => res)
    )
  }

  getTotalCustomer():Observable<any>{
    return this.http.get<any>(this.APIurl+ 'dataanalyst/allcustomer').pipe(
      map(res => res)
    )
  }

  getCustomer(period:string): Observable<any> {
    return this.http.get<any>(this.APIurl + 'dataanalyst/totalusers?period='+period).pipe(
      map(res => res)
    );
  }

  getBuyer(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'dataanalyst/buyer').pipe(
      map(res => res)
    );
  }

  getCustomerData(): Observable<any[]> {
    return this.http.get<any>(this.APIurl + 'user').pipe(
      map((res) => {
        // Log the raw response for debugging
        console.log('API Response:', res);

        // Ensure res.data is an array, fallback to empty array if not
        const data = Array.isArray(res.data) ? res.data : [];
        return data.map((item: any) => ({
          id: item.id,
          name: `${item.first_name} ${item.last_name}`,
          gender: item.gender === 'm' ? 'Male' : item.gender === 'f' ? 'Female' : item.gender,
          gmail: item.gmail,
          phoneNumber: item.phone_number,
          location: item.location?.location || 'Unknown', // Use item.location.location
          registeredDate: item.reg_date,
        }));
      }),
      catchError((error) => {
        console.error('Error fetching customer data:', error);
        return of([]); // Return empty array on error
      })
    );
  }
// transaction
getTransaction():Observable<any>{
  return this.http.get<any>(`${this.APIurl}orders/all`)
}
getTransactionByusername(username:string):Observable<any>{
  return this.http.get<any>(`${this.APIurl}searchorderbyname/${username}`)
}
getTransactionByPeriod(period:string):Observable<any>{
  return this.http.get<any>(`${this.APIurl}orders-by-period?period=${period}`)
}
 getUserOrders(userID: number): Observable<any> {
    try {
      return this.http.get<any>(this.APIurl + `user/${userID}/orders`).pipe(
        map(res => res.data),
        catchError((error) => {
          console.error('Error fetching user orders:', error);
          return of([]); // Return empty array on error
        })
      );
    } catch (error) {
      console.error('Unexpected error in getUserOrders:', error);
      return of([]); // Ensure an Observable is always returned
    }
  }

  
addCategory(formData: FormData): Observable<any> {
  return this.http.post(`${this.APIurl}category`, formData);
}

updateCategory(id: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.APIurl}category/${id}?_method=PUT`, formData);
}
 

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.APIurl}category/${id}`).pipe(
        catchError(this.handleError)
    );
}



 login(data:any){
  return this.http.post(`${this.APIurl}login`,data);
 }
 signup(data: {
    first_name: string;
    last_name: string;
    gender: string;
    gmail: string;
    password: string;
    phone_number: string;
    location_id: number;
    is_admin: boolean;
  }): Observable<any> {
    return this.http.post(`${this.APIurl}register`, data);
  }

  getLocations(): Observable<any> {
    return this.http.get<any>(`${this.APIurl}locations`);
  }

  logout() {
    
    return this.http.post(`${this.APIurl}logout`, {});
  }


  postLocation(location:string){
    console.log(location)
     return this.http.post(`${this.APIurl}locations`,{location});
  }
  editLocation(location:string,location_id:number){
    return this.http.put<any>(`${this.APIurl}locations/${location_id}`,{location});
  }
  deleteLocation(location_id:number){
     return this.http.delete<any>(`${this.APIurl}locations/${location_id}`);
  }

  getWeeklychartData(metric: string = 'revenue') {
  return this.http.get(`${this.APIurl}weekly-sales-chart?metric=${metric}`);
}

// In your Adminservice
getPieChartData(limit: number = 5, period: string = 'this_month', metric: string = 'quantity') {
  return this.http.get(`${this.APIurl}pie-chart-products?limit=${limit}&period=${period}&metric=${metric}`);
}

getPieChartCategories(limit: number = 5, period: string = 'this_month', metric: string = 'revenue') {
  return this.http.get(`${this.APIurl}pie-chart-categories?limit=${limit}&period=${period}&metric=${metric}`);
}
}