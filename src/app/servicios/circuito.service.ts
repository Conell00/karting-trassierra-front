import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Circuito } from '../modelos/circuito';

@Injectable({
  providedIn: 'root'
})
export class CircuitoService {
  private url='https://karting-trassierra-api-production.up.railway.app/';

  //Inyectar httpClient

  private http=inject(HttpClient);

  /**
   * @returns Todas las circuitos
   */

  getCircuitos():Observable<Circuito[]>{
    return this.http.get<Circuito[]>(`${this.url}circuitos`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   * @returns Circuito por Id
   */

   getCircuito(id:number):Observable<Circuito>{
     return this.http.get<Circuito>(`${this.url}circuito/${id}`).pipe(
       map(res=>{
        return res;
       }),
       catchError(error=>{
         return of({} as Circuito);
       })
     );
   }

   /**
   * @returns True si el circuito ha sido creado. False si ha ocurrido algún problema
   */

  addCircuit(circuito:Circuito):Observable<boolean>{
    return this.http.post<Circuito>(`${this.url}circuito`,circuito).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        return of(false);
      })
    );
  }

  /**
   * @returns True si el circuito ha sido borrado. False si ha ocurrido algún problema
   */

  deleteCircuit(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}circuito/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        return of(false);
      })
    );
  }

  /**
   * @returns True si el circuito ha sido editado. False si ha ocurrido algún problema
   */

  updateCircuito(circuito:Circuito, id:number):Observable<boolean>{
    return this.http.patch<Circuito>(`${this.url}circuito/${id}`, circuito).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        return of(false);
      })
    );
  }

  constructor() { }
}
