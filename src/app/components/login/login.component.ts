import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginRegisterComponent implements OnInit {
  frm!:FormGroup
  esVisible:boolean = false;
  usuario!:Usuario
  constructor(private fb:FormBuilder){}
  private serv_usuarios = inject(UsuarioService);
  private _router=inject(Router);
  private cookies = inject(CookieService)
  idioma!:string
  ngOnInit(): void {
    this.existeToken()
    this.idiomaEstablecido()
    //Establecer las validaciones al formulario login
    this.frm= this.fb.group({
      email:['',[Validators.required,Validators.email]],
      contra:['',[Validators.required]],
    })
  }

  get email(){
    return this.frm.get('email') as FormControl
  }
  get contra(){
    return this.frm.get('contra') as FormControl
  }

   /**
    * @description Método empleado para saber si se ha iniciado sesión o no.
    * Si se ha iniciado sesión lleva para el menú de administración o al home, dependiendo si es administrador o participante
    */

  existeToken(){
    if (this.cookies.check('token')) {
     this.serv_usuarios.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(res=>{
      if (res.rol == 'admin') {
        this._router.navigate(['/cruds']);
      }else{
        this._router.navigate(['/body']);
      }
     })
    }
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
   * @description Método empleado para comprobar si existe el usuario introducido.
   * Si es así,se rederige a la pag principal.
   * Si no, salta un alerta avisando de que no existe el usuario introducido.
   */

  comprobarDatos(){
     this.serv_usuarios.getUsuario(this.frm.value.email,this.frm.value.contra).subscribe(res=>{
      if (res.id != null) {
        this.usuario = res
        this.cookies.set('token',`${this.usuario.id}`);
        location.reload();
      }else{
        let timerInterval:number
        if (this.idioma == 'es') {
              Swal.fire({
                position: 'top-end',
                title: "Usuario no encontrado",
                imageUrl: '../../../assets/img/pagina-de-error.png',
                timer: 1300,
                timerProgressBar: true,
                width: '500px',
                background: 'white',
                color:'red',
              didOpen: () => {
             Swal.showLoading();
            const timer = Swal.getPopup()!.querySelector("b");
            timerInterval = window.setInterval(() => {
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        this.frm.reset();
      }
    });
        }else{
          Swal.fire({
            position: 'top-end',
            title: "User not found",
            imageUrl: '../../../assets/img/pagina-de-error.png',
            timer: 1300,
            timerProgressBar: true,
            width: '500px',
            background: 'white',
            color:'red',
          didOpen: () => {
         Swal.showLoading();
        const timer = Swal.getPopup()!.querySelector("b");
        timerInterval = window.setInterval(() => {
    }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    this.frm.reset();
  }
});
        }
      }
     })
  }

  /**
   * @description Método empleado para redirigir al componente register
   */

  rederigirRegistrar(){
    this._router.navigate(['/register']);
  }

  /**
   * @description Método empleado para mostrar y ocultar la contraseña mediante el icono al lado del input
   */

  mostrarContra(){
    if (document.getElementById('contra')?.getAttribute('type') == 'password') {
      document.getElementById('contra')?.setAttribute('type','text');
      this.esVisible = true;
    }else{
      document.getElementById('contra')?.setAttribute('type','password');
      this.esVisible = false;
    }
  }

}
