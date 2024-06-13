import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Clasificacion, getClasificacion } from '../modelos/clasificacion';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {
  private url='https://karting-trassierra-api-production.up.railway.app/';

  //Inyectar httpClient

  private http=inject(HttpClient);

  /** 
   *  @returns Todas las clasificaciones
  */

  getClasificaciones():Observable<getClasificacion[]>{
    return this.http.get<getClasificacion[]>(`${this.url}clasificaciones`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   *  @returns Clasificación de un usuario en una carrera
  */

  getClasificacion(id_carrera:number,id_participante:number):Observable<getClasificacion>{
    return this.http.get<getClasificacion>(`${this.url}clasificacionCarreraParticipante/${id_carrera}/${id_participante}`).pipe(
      map(res=>{
        return res;
      }),
      catchError(error=>{
        return of({} as getClasificacion);
      })
    );
  }

  /** 
   *  @returns Todas las clasificaciones de una carrera
  */

  getClasificacionCarrera(id_carrera:number):Observable<getClasificacion[]>{
    return this.http.get<getClasificacion[]>(`${this.url}clasificacionCarrera/${id_carrera}`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

   /**
   * @returns True si la clasificación ha sido editado. False si ha ocurrido algún problema
   */

  addClasificacion(clasificacion:Clasificacion):Observable<boolean>{
    return this.http.post<Clasificacion>(`${this.url}clasificacion`,clasificacion).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        return of(false);
      })
    );
  }

   /**
   * @returns True si la clasificación ha sido borrada. False si ha ocurrido algún problema
   */

  deleteClasificacion(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}clasificacion/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        return of(false);
      })
    );
  }

  constructor() { }
}