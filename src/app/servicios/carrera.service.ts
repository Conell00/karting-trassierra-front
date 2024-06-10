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


  getCarreras():Observable<Carrera[]>{
    return this.http.get<Carrera[]>(`${this.url}carreras`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las carreras`);
        return of([]);
      })
    );
  }

  getCarrerasTorneo(id_torneo:number):Observable<getCarrera[]>{
    return this.http.get<getCarrera[]>(`${this.url}carrerasTorneo/${id_torneo}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las carreras`);
        return of([]);
      })
    );
  }

  getCarrerasAnotadas(id_torneo:number,anotado:number):Observable<getCarrera[]>{
    return this.http.get<getCarrera[]>(`${this.url}carrerasAnotada/${id_torneo}/${anotado}`).pipe(
      catchError(error=>{
        console.log(`Error al obtener las carreras`);
        return of([]);
      })
    );
  }


  addCarrera(carrera:Carrera):Observable<boolean>{
    return this.http.post<Carrera>(`${this.url}carrera`,carrera).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al obtener la carrera ${error}`);
        return of(false);
      })
    );
  }


  updateCarrera(carrera:Carrera, id:number):Observable<boolean>{
    return this.http.patch<Carrera>(`${this.url}carrera/${id}`,carrera).pipe(
      map(res=>{
        return true;
      }),
      catchError(error=>{
        console.log(`Error al actualizar la carrera ${error}`);
        return of(false);
      })
    );
  }

  constructor() { }
}
