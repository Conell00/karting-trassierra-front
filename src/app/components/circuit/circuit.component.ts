import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CircuitoService } from '../../servicios/circuito.service';
import { ActivatedRoute } from '@angular/router';
import { Circuito } from '../../modelos/circuito';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-circuit',
  standalone: true,
  imports: [],
  templateUrl: './circuit.component.html',
  styleUrl: './circuit.component.css'
})
export class CircuitComponent implements OnInit {
  constructor(private titulo:Title){
    titulo.setTitle('Circuito Karting Trassierra')
  }
  private serv_circuito = inject(CircuitoService);
  private _activedRouter=inject(ActivatedRoute);
  private cookies = inject(CookieService)
  private idCircuito!:number;
  idioma!:string
  circuito!:Circuito;
  ngOnInit(): void {
   this._activedRouter.params.subscribe(
    params=>{
      this.idCircuito=params['id'];
      if (this.idCircuito) {
        this.cargarCircuito();
        this.idiomaEstablecido()
      }
    }
   )
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

  cargarCircuito(){
    this.serv_circuito.getCircuito(this.idCircuito).subscribe(
      res=>{
        if (res) {
          this.circuito = res;
        }
      }
    )
  }

}
