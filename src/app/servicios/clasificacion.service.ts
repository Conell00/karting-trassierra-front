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

  getClasificaciones():Observable<getClasificacion[]>{
    return this.http.get<getClasificacion[]>(`${this.url}clasificaciones`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las posiciones`);
        return of([]);
      })
    );
  }

  getClasificacion(id_carrera:number,id_participante:number):Observable<getClasificacion>{
    return this.http.get<getClasificacion>(`${this.url}clasificacionCarreraParticipante/${id_carrera}/${id_participante}`).pipe(
      map(res=>{
        return res;
      }),
      catchError(error=>{
        console.log(`Error al obtener la clasificacion ${error}`);
        return of({} as getClasificacion);
      })
    );
  }

  getClasificacionCarrera(id_carrera:number):Observable<getClasificacion[]>{
    return this.http.get<getClasificacion[]>(`${this.url}clasificacionCarrera/${id_carrera}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usurios`);
        return of([]);
      })
    );
  }

  addClasificacion(clasificacion:Clasificacion):Observable<boolean>{
    return this.http.post<Clasificacion>(`${this.url}clasificacion`,clasificacion).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al apuntarse a torneo ${error}`);
        return of(false);
      })
    );
  }

  deleteClasificacion(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}clasificacion/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al anular la participación ${error}`);
        return of(false);
      })
    );
  }

// getCliente(id:number):Observable<Cliente>{
//     return this.http.get<Cliente>(`${this.url}clientes/${id}`).pipe(
//       map(res=>{
//         return res;
//       }),
//       catchError(error=>{
//         console.log(`Error al obtener el cliente ${error}`);
//         return of({} as Cliente);
//       })
//     );
//   }



//   updateCircuito(circuito:Circuito, id:number):Observable<boolean>{
//     return this.http.patch<Circuito>(`${this.url}circuito/${id}`, circuito).pipe(
//       map(res=>{
//         return true;
//       }),
//       catchError(error=>{
//         console.log(`Error al actualizar el circuito ${error}`);
//         return of(false);
//       })
//     );
//   }

  constructor() { }
}