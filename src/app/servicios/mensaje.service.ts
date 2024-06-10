import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import {Mensaje,getMensaje} from '../modelos/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private url='https://karting-trassierra-api-production.up.railway.app/';

  //Inyectar httpClient

  private http=inject(HttpClient);

  getMensajesUsuario(id_participante:number):Observable<getMensaje[]>{
    return this.http.get<getMensaje[]>(`${this.url}mensajes/${id_participante}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las carreras`);
        return of([]);
      })
    );
  }

  addMensaje(mensaje:Mensaje):Observable<boolean>{
    return this.http.post<Mensaje>(`${this.url}mensaje`,mensaje).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al obtener el mensaje ${error}`);
        return of(false);
      })
    );
  }

  deleteMensaje(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}mensaje/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        console.log(`Error al eliminar el mensaje ${error}`);
        return of(false);
      })
    );
  }

  constructor() { }
}