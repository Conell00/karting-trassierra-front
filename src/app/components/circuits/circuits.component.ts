import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CircuitoService } from '../../servicios/circuito.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [],
  templateUrl: './circuits.html',
  styleUrl: './circuits.component.css'
})
export class TournamentsComponent implements OnInit {
  constructor(private titulo:Title){
    titulo.setTitle('Circuitos Karting Trassierra')
  }
  private serv_circuito = inject(CircuitoService);
  private _router = inject(Router);
  private cookies = inject(CookieService)
  idioma!:string
  aCircuitos:any[] = [];
ngOnInit(): void {
  this.idiomaEstablecido();
 this.cargarCircuitos();
}

/**
   * Método empleado para establecer como idioma por defecto el castellano y crear la cookie.
   * En caso de ya estar creada la cookie se establece la variable idioma según el valor de estar.
   */

idiomaEstablecido(){
  if (!this.cookies.check('idioma')){
    this.cookies.set('idioma',`es`);
    this.idioma = 'es'
  }else{
    this.idioma = this.cookies.get('idioma')
  }
}

/**
 * @description Método empleado para cargar todos los circuitos
 */

cargarCircuitos(){
  this.serv_circuito.getCircuitos().subscribe(res=>{
     this.aCircuitos = res;
     console.log(this.aCircuitos);
  })
}

mostrarCircuito(id:number){
  this._router.navigate([`/circuito/${id}`]);
}


}
