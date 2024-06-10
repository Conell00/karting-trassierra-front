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

  // getUsuarios():Observable<Usuario[]>{
  //   return this.http.get<Usuario[]>(`${this.url}usuarios`).pipe(
  //     catchError(error=>{
  //       console.log(`Error al obtener las tareas`);
  //       return of([]);
  //     })
  //   );
  // }

  getTorneos():Observable<getTorneo[]>{
    return this.http.get<getTorneo[]>(`${this.url}torneos`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los torneos`);
        return of([]);
      })
    );
  }

   getTorneo(id:number):Observable<Torneo>{
     return this.http.get<Torneo>(`${this.url}torneo/${id}`).pipe(
       map(res=>{
        return res;
       }),
       catchError(error=>{
         console.log(`Error al obtener el torneo ${error}`);
         return of({} as Torneo);
       })
     );
   }

   getTorneoNombre(nombre:string):Observable<Torneo>{
    return this.http.get<Torneo>(`${this.url}torneoNombre/${nombre}`).pipe(
      map(res=>{
       return res;
      }),
      catchError(error=>{
        console.log(`Error al obtener el torneo ${error}`);
        return of({} as Torneo);
      })
    );
  }

  getTorneosTerminados():Observable<getTorneo[]>{
    return this.http.get<getTorneo[]>(`${this.url}torneosTerminados`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los torneos`);
        return of([]);
      })
    );
  }

  getTorneosPorTerminar():Observable<getTorneo[]>{
    return this.http.get<getTorneo[]>(`${this.url}torneosPorTerminar`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los torneos`);
        return of([]);
      })
    );
  }

  addTorneo(torneo:Torneo):Observable<boolean>{
    return this.http.post<Torneo>(`${this.url}torneo`,torneo).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al obtener el torneo ${error}`);
        return of(false);
      })
    );
  }

  deleteTorneo(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}torneo/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar el torneo ${error}`);
        return of(false);
      })
    );
  }

  updateTorneo(torneo:Torneo, id:number):Observable<boolean>{
    return this.http.patch<Torneo>(`${this.url}torneo/${id}`,torneo).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar el torneo ${error}`);
        return of(false);
      })
    );
  }

  constructor() { }
}