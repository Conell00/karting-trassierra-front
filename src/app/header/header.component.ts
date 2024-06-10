import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  private serv_usuarios = inject(UsuarioService);
  private cookies = inject(CookieService)
  isLogin!:boolean
  idioma!:string
  admin:boolean = false
  ngOnInit(): void {
    this.idiomaEstablecido()
    this.esAdministrador()
    this.cambiarNavBar()
  }

  cambiarNavBar(){
     if (this.cookies.get('token') == '') {
      this.isLogin = false;
     }else{
      this.isLogin = true
     }
  }

  cerrarSesion(){
    this.cookies.delete('token')
    location.reload()
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
   * Método empleado para cambiar el idioma a la opción que escoja es usuario.
   * @param lengua idioma al que quiere ser cambiada la página
   */

  cambiarIdioma(lengua:string){
    if(lengua == 'en'){
      this.cookies.set('idioma',`en`);
      this.idioma = 'en'
    }else{
      this.cookies.set('idioma',`es`);
      this.idioma = 'es'
    }
    location.reload()
  }

  esAdministrador(){
    this.serv_usuarios.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(
      res=>{
        if (res) {
          if (res.rol == 'admin') {
            this.admin = true
          }else{
            this.admin = false
          }
        }
      }
    )
  }

}
