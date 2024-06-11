import { Component, OnInit, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit {
  private cookies = inject(CookieService)
  private serv_usuarios = inject(UsuarioService);
  idioma!:string;
  rol!:number
  ngOnInit(): void {
    this.rolEstablecido()
    this.idiomaEstablecido()
  }

  /**
   * @description Método empleado para establecer como idioma por defecto el castellano y crear la cookie.
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
   * @description Método empleado para saber el rol del usuario
   */

  rolEstablecido(){
    if (this.cookies.check('token')) {
      this.serv_usuarios.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(
        res=>{
          if (res) {
            if (res.rol == 'admin') {
              this.rol = 2
            }else{
              this.rol = 1
            }
          }
        }
      )
    }else{
      this.rol = 0
    }
  }

}
