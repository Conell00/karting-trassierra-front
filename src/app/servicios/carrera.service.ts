import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import {Carrera, getCarrera} from '../modelos/carrera';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private url='https://karting-trassierra-api-production.up.railway.app/';

  //Inyectar httpClient

  private http=inject(HttpClient);

 /**
   * @returns Todas las carreras
   */

  getCarreras():Observable<Carrera[]>{
    return this.http.get<Carrera[]>(`${this.url}carreras`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   *  @returns Todas las carreras de un torneo
  */
  getCarrerasTorneo(id_torneo:number):Observable<getCarrera[]>{
    return this.http.get<getCarrera[]>(`${this.url}carrerasTorneo/${id_torneo}`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   * @returns Todas las carreras terminadas
   */

  getCarrerasAnotadas(id_torneo:number,anotado:number):Observable<getCarrera[]>{
    return this.http.get<getCarrera[]>(`${this.url}carrerasAnotada/${id_torneo}/${anotado}`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   * @returns True si la carrera ha sido creada. False si ha ocurrido algún problema
   */


  addCarrera(carrera:Carrera):Observable<boolean>{
    return this.http.post<Carrera>(`${this.url}carrera`,carrera).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        return of(false);
      })
    );
  }

  /**
   * @returns True si la carrera ha sido editada. False si ha ocurrido algún problema
   */

  updateCarrera(carrera:Carrera, id:number):Observable<boolean>{
    return this.http.patch<Carrera>(`${this.url}carrera/${id}`,carrera).pipe(
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
