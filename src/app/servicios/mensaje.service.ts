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

  /** 
   *  @returns Todas los mensajes de un usuario
  */

  getMensajesUsuario(id_participante:number):Observable<getMensaje[]>{
    return this.http.get<getMensaje[]>(`${this.url}mensajes/${id_participante}`).pipe(
      catchError(error=>{
        return of([]);
      })
    );
  }

  /**
   * @returns True si el mensaje ha sido creado. False si ha ocurrido algún problema
   */

  addMensaje(mensaje:Mensaje):Observable<boolean>{
    return this.http.post<Mensaje>(`${this.url}mensaje`,mensaje).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        return of(false);
      })
    );
  }

  /**
   * @returns True si el mensaje ha sido borrado. False si ha ocurrido algún problema
   */

  deleteMensaje(id:number):Observable<boolean>{
    return this.http.delete(`${this.url}mensaje/${id}`).pipe(
      map(()=>true),
      catchError(error=>{
        return of(false);
      })
    );
  }

  constructor() { }
}