import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../servicios/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  frm!:FormGroup
  esVisible:boolean = false;
  esVisible2:boolean = false;
  idioma!:string
  constructor(private fb:FormBuilder){} //se inyecta el servicio. Es una practica habitual de angular.
  private serv_usuarios = inject(UsuarioService);
  private _activedRouter=inject(ActivatedRoute)
  private _router=inject(Router);
  private cookies = inject(CookieService)
  ngOnInit(): void {
    this.idiomaEstablecido()
    //Establecer las validaciones al formulario register
    this.frm= this.fb.group({
      email:['',[Validators.required,Validators.email]],
      contra:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
      recontra:['',[Validators.required,this.repetirContra.bind(this)]],
      nombre:['',[Validators.required,Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+(([' -][A-Za-záéíóúÁÉÍÓÚñÑ ])?[A-Za-záéíóúÁÉÍÓÚñÑ]*)*$/)]],
      terminos:['',[Validators.requiredTrue]],
    })
  }

  //Getters del formuario

  get email(){
    return this.frm.get('email') as FormControl
  }
  get contra(){
    return this.frm.get('contra') as FormControl
  }
  get recontra(){
    return this.frm.get('recontra') as FormControl
  }
  get nombre(){
    return this.frm.get('nombre') as FormControl
  }
  get terminos(){
    return this.frm.get('terminos') as FormControl
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
   * @description Método empleado para comprobar que las contraseñas coincidan.
   * @param control
   * @returns True si coinciden las contraseñas y false si no coinciden
   */

  repetirContra(control:AbstractControl){
    if (this.frm) { //Verificar si frm está defenido antes de acceder a los controles.
      const password = this.frm.get('contra')?.value;
    const repassword = control.value;
    return password === repassword ?null : {passwordIdem:true}
    }else{
      return null
    }
  }

  /**
   * @description Método empleado para comprobar si existe el usuario introducido.
   * Si es así, salta un error y se resetea el formulario.
   * Si no, se registra el usuario introducido.
   */

  comprobarDatos(){
     this.serv_usuarios.getUsuarioEmail(this.frm.value.email).subscribe(res=>{
      if (!res) {
        const usuario:Usuario = {
         email: this.frm.value.email,
         nombre: this.frm.value.nombre,
         contra: this.frm.value.contra,
         rol: 'participante'
        }
        this.serv_usuarios.addUsuario(usuario).subscribe(
          resAdd=>{
            if (resAdd) {
              let timerInterval:number
              if (this.idioma == 'es') {
                Swal.fire({
                  position: 'top-end',
                  title: "Ya eres un piloto. Suerte para tus próximas carreras",
                  imageUrl: '../../../assets/img/piloto.png',
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
          this._router.navigate(['/login']);
        }
      });
          }else{
            Swal.fire({
            position: 'top-end',
             title: "You are already a pilot. Good luck for your next races",
             imageUrl: '../../../assets/img/piloto.png',
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
          this._router.navigate(['/login']);
        }
      });
              }
            }else{
              if (this.idioma == 'es') {
                Swal.fire({
                  icon: "success",
                  title: "Ups, ha ocurrido un error al registrarte. Inténtalo de nuevo",
                });
              }else{
                Swal.fire({
                  icon: "success",
                  title: "Oops, an error occurred while registering. try again",
                });
              }
            }
          }
        )
      }else{
        let timerInterval:number
        if (this.idioma == 'es') {
          Swal.fire({
            position: 'top-end',
             title: "Ya estás registrado. Inicia Sesión para continuar",
             imageUrl: '../../../assets/img/piloto.png',
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
          this._router.navigate(['/login']);
        }
      });
        }else{
          Swal.fire({
            position: 'top-end',
             title: "You are already registered. Sign in to continue",
             imageUrl: '../../../assets/img/piloto.png',
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
          this._router.navigate(['/login']);
        }
      });
        }
      }
     })
  }

  /**
   * @description Método empleado para mostrar y ocultar la contraseña mediante el icono al lado del input
   * @param id campo que se quiere mostrar
   */

  mostrarContra(id:string){
    if (id == 'contra') {
      if (document.getElementById('contra')?.getAttribute('type') == 'password') {
        document.getElementById('contra')?.setAttribute('type','text');
        this.esVisible = true;
      }else{
        document.getElementById('contra')?.setAttribute('type','password');
        this.esVisible = false;
      }
    }else{
      if (document.getElementById('recontra')?.getAttribute('type') == 'password') {
        document.getElementById('recontra')?.setAttribute('type','text');
        this.esVisible2 = true;
      }else{
        document.getElementById('recontra')?.setAttribute('type','password');
        this.esVisible2 = false;
      }
    }
  }

  /**
   * @description Método empleado para redirigir al componente login
   */

  rederigirInicarSesion(){
    this._router.navigate(['/login']);
  }
}
