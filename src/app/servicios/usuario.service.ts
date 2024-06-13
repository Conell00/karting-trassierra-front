import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Usuario, getUsuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url='https://karting-trassierra-api-production.up.railway.app/';

  //Inyectar httpClient

  private http=inject(HttpClient);

  /**
   *  @returns Todas los usuarios
  */

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuarios`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las tareas`);
        return of([]);
      })
    );
  }

  /**
   *  @returns Usuario por email y contra
  */

  getUsuario(email:string,contra:string):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}usuario/${email}/${contra}`).pipe(
      map(res=>{
        return res;
      }),
      catchError(error=>{
        console.log(`Error al obtener al usuario ${error}`);
        return of({} as Usuario);
      })
    );
  }

  /**
   *  @returns Usuario por id
  */

  getUsuarioId(id:number):Observable<getUsuario>{
    return this.http.get<getUsuario>(`${this.url}usuario/${id}`).pipe(
      map(res=>{
        return res;
      }),
      catchError(error=>{
        console.log(`Error al obtener al usuario ${error}`);
        return of({} as getUsuario);
      })
    );
  }

  /**
   *  @returns Usuario por email
  */

  getUsuarioEmail(email:string):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}usuarioEmail/${email}`).pipe(
      map(res=>{
        return res;
      }),
      catchError(error=>{
        console.log(`Error al obtener al usuario ${error}`);
        return of({} as Usuario);
      })
    );
  }

  /**
   *  @returns Usuario por rol
  */

  getUsuariosRol(rol:string):Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuarios/${rol}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usurios`);
        return of([]);
      })
    );
  }

  /**
   *  @returns Top 5 usuarios ordenador por puntos
  */

  getUsuariosPoints():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosPoints`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usurios`);
        return of([]);
      })
    );
  }

  /**
   *  @returns Top 5 usuarios ordenador por torneos
  */

  getUsuariosTours():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosTours`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios`);
        return of([]);
      })
    );
  }

  /**
   *  @returns Top 5 usuarios ordenador por carreras
  */

  getUsuariosRaces():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosRaces`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios`);
        return of([]);
      })
    );
  }

  /**
   *  @returns Top 5 usuarios ordenador por podios
  */

  getUsuariosPodiums():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosPodiums`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios`);
        return of([]);
      })
    );
  }

  /**
   * @returns True si el usuario ha sido creado. False si ha ocurrido algún problema
   */

  addUsuario(usuario:Usuario):Observable<boolean>{
    return this.http.post<Usuario>(`${this.url}usuario`,usuario).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al obtener al usuario ${error}`);
        return of(false);
      })
    );
  }

  /**
   * @returns True si el usuario ha sido borrado. False si ha ocurrido algún problema
   */

  deleteUsuario(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}usuario/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar al  cliente ${error}`);
        return of(false);
      })
    );
  }

  /**
   * @returns True si el usuario ha sido editado. False si ha ocurrido algún problema
   */

  updateUsuario(usuario:Usuario,id:number):Observable<boolean>{
    return this.http.patch<Usuario>(`${this.url}usuario/${id}`,usuario).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar al usuario ${error}`);
        return of(false);
      })
    );
  }

  constructor() { }
}
