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

  // getUsuarios():Observable<Usuario[]>{
  //   return this.http.get<Usuario[]>(`${this.url}usuarios`).pipe(
  //     catchError(error=>{
  //       console.log(`Error al obtener las tareas`);
  //       return of([]);
  //     })
  //   );
  // }

  getCircuitos():Observable<Circuito[]>{
    return this.http.get<Circuito[]>(`${this.url}circuitos`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los circuitos`);
        return of([]);
      })
    );
  }

   getCircuito(id:number):Observable<Circuito>{
     return this.http.get<Circuito>(`${this.url}circuito/${id}`).pipe(
       map(res=>{
        return res;
       }),
       catchError(error=>{
         console.log(`Error al obtener el cliente ${error}`);
         return of({} as Circuito);
       })
     );
   }

//   getUsuarioEmail(email:string):Observable<Usuario>{
//     return this.http.get<Usuario>(`${this.url}usuarioEmail/${email}`).pipe(
//       map(res=>{
//         return res;
//       }),
//       catchError(error=>{
//         console.log(`Error al obtener al usuario ${error}`);
//         return of({} as Usuario);
//       })
//     );
//   }

  addCircuit(circuito:Circuito):Observable<boolean>{
    return this.http.post<Circuito>(`${this.url}circuito`,circuito).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al obtener el circuito ${error}`);
        return of(false);
      })
    );
  }

  deleteCircuit(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}circuito/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar el circuito ${error}`);
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



  updateCircuito(circuito:Circuito, id:number):Observable<boolean>{
    return this.http.patch<Circuito>(`${this.url}circuito/${id}`, circuito).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar el circuito ${error}`);
        return of(false);
      })
    );
  }

  constructor() { }
}
