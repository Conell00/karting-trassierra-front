import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Torneo, getTorneo } from '../modelos/torneo';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  private url='https://karting-trassierra-api-production.up.railway.app/';

  //Inyectar httpClient

  private http=inject(HttpClient);

  /**
   *  @returns Todas los torneos
  */

  getTorneos():Observable<getTorneo[]>{
    return this.http.get<getTorneo[]>(`${this.url}torneos`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   *  @returns Torneo por Id
  */

   getTorneo(id:number):Observable<Torneo>{
     return this.http.get<Torneo>(`${this.url}torneo/${id}`).pipe(
       map(res=>{
        return res;
       }),
       catchError(error=>{
         return of({} as Torneo);
       })
     );
   }

    /**
    *  @returns Torneo por Nombre
    */

   getTorneoNombre(nombre:string):Observable<Torneo>{
    return this.http.get<Torneo>(`${this.url}torneoNombre/${nombre}`).pipe(
      map(res=>{
       return res;
      }),
      catchError(error=>{
        return of({} as Torneo);
      })
    );
  }

  /**
   *  @returns Torneos finalizados
  */

  getTorneosTerminados():Observable<getTorneo[]>{
    return this.http.get<getTorneo[]>(`${this.url}torneosTerminados`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   *  @returns Torneos por finalizar
  */

  getTorneosPorTerminar():Observable<getTorneo[]>{
    return this.http.get<getTorneo[]>(`${this.url}torneosPorTerminar`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   * @returns True si el torneo ha sido creado. False si ha ocurrido algún problema
   */

  addTorneo(torneo:Torneo):Observable<boolean>{
    return this.http.post<Torneo>(`${this.url}torneo`,torneo).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        return of(false);
      })
    );
  }

  /**
   * @returns True si el torneo ha sido borrado. False si ha ocurrido algún problema
   */

  deleteTorneo(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}torneo/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        return of(false);
      })
    );
  }

  /**
   * @returns True si el torneo ha sido editado. False si ha ocurrido algún problema
   */

  updateTorneo(torneo:Torneo, id:number):Observable<boolean>{
    return this.http.patch<Torneo>(`${this.url}torneo/${id}`,torneo).pipe(
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