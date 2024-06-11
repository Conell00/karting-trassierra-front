import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-cruds',
  standalone: true,
  imports: [],
  templateUrl: './cruds.component.html',
  styleUrl: './cruds.component.css'
})
export class CrudsComponent implements OnInit {
  private _router=inject(Router);
  private serv_usuarios = inject(UsuarioService);
  private cookies = inject(CookieService)
  idioma!:string
  admin!:Usuario
  ngOnInit(): void {
    this.idiomaEstablecido();
    this.verificarUsuario();
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
   * @description Método empleado para llevar al usuario al crud de circuitos
   */

  circuitos(){
     this._router.navigate(['/circuitsCrud']);
  }
  /**
   * @description Método empleado para llevar al usuario al crud de usuarios
   */

  usuarios(){
    this._router.navigate(['/usersCrud']);
  }

  /**
   * @description Método empleado para llevar al usuario al crud de torneos
   */

  torneos(){
    this._router.navigate(['/toursCrud']);

  }

  /**
  * @description Método empleado para saber si el usuario que ha entrado es administrador o no.
  * En caso de que sea administrador no se permitirá su acceso a esta página
  */

  verificarUsuario(){
      this.serv_usuarios.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(
        res=>{
          if (res) {
            if (res.rol != 'admin') {
              this._router.navigate(['/body']);
            }else{
              this.admin = res
            }
          }else{
            this._router.navigate(['/body']);
          }
        }
      )
  }
}
