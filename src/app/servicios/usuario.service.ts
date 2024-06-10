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

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuarios`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las tareas`);
        return of([]);
      })
    );
  }

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

  getUsuariosRol(rol:string):Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuarios/${rol}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usurios`);
        return of([]);
      })
    );
  }

  getUsuariosPoints():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosPoints`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usurios`);
        return of([]);
      })
    );
  }

  getUsuariosTours():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosTours`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios`);
        return of([]);
      })
    );
  }

  getUsuariosRaces():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosRaces`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios`);
        return of([]);
      })
    );
  }

  getUsuariosPodiums():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}usuariosPodiums`).pipe(
      catchError(error=>{
        console.log(`Error al obtener los usuarios`);
        return of([]);
      })
    );
  }

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

  deleteUsuario(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}usuario/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar al  cliente ${error}`);
        return of(false);
      })
    );
  }

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
