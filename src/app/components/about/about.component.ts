import { Component, OnInit, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private cookies = inject(CookieService)
  gmail:string = 'esteban00ah@gmail.com'
  idioma!:string
  rolUsario!:number
  ngOnInit(): void {
    this.rol()
    this.idiomaEstablecido()
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

  rol(){

    if (!this.cookies.check('token')) {
      this.rolUsario = 0;
    }

  }
}
