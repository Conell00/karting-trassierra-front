import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../modelos/usuario';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private serv_usuarios = inject(UsuarioService);
  private _router=inject(Router);
  private _activedRouter=inject(ActivatedRoute);
  private cookies = inject(CookieService)
  frm!:FormGroup
  idUsuario!:number;
  textoBoton!:string;
  idioma!:string
  contraVieja!:string
  constructor(private fb:FormBuilder){}
  ngOnInit(): void {
    this.idiomaEstablecido()
    this._activedRouter.params.subscribe(
      params=>{
        this.idUsuario=params['id'];
        if (this.idUsuario) {
          this.frm= this.fb.group({
            nombre:['',[Validators.required,Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+(([' -][A-Za-záéíóúÁÉÍÓÚñÑ ])?[A-Za-záéíóúÁÉÍÓÚñÑ]*)*$/)]],
            email:['',[Validators.required,Validators.email]],
            contra:['',[Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
            rol:['',[Validators.required]],
            torneos_ganados:['0',[Validators.required]],
            puntos:['0',[Validators.required]],
            podios:['0',[Validators.required]],
            carreras_ganadas:['0',[Validators.required]],
          })
          this.cargarUsuario();
          if (this.idioma == 'es') {
            this.textoBoton = 'Editar usuario'
          }else{
            this.textoBoton = 'Edit user'
          }
        }else{
          this.frm= this.fb.group({
            nombre:['',[Validators.required,Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+(([' -][A-Za-záéíóúÁÉÍÓÚñÑ ])?[A-Za-záéíóúÁÉÍÓÚñÑ]*)*$/)]],
            email:['',[Validators.required,Validators.email]],
            contra:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
            rol:['',[Validators.required]],
            torneos_ganados:['0',[Validators.required]],
            puntos:['0',[Validators.required]],
            podios:['0',[Validators.required]],
            carreras_ganadas:['0',[Validators.required]],
          })
          if (this.idioma == 'es') {
            this.textoBoton = 'Añadir usuario'
          }else{
            this.textoBoton = 'Add user'
          }
        }
      }
     )
     this.verificarUsuario()
  }

  //Getters del formulario

  get nombre(){
    return this.frm.get('nombre') as FormControl
  }
  get email(){
    return this.frm.get('email') as FormControl
  }
  get contra(){
    return this.frm.get('contra') as FormControl
  }
  get rol(){
    return this.frm.get('rol') as FormControl
  }
  get torneos_ganados(){
    return this.frm.get('torneos_ganados') as FormControl
  }
  get puntos(){
    return this.frm.get('puntos') as FormControl
  }
  get podios(){
    return this.frm.get('podios') as FormControl
  }
  get carreras_ganadas(){
    return this.frm.get('carreras_ganadas') as FormControl
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
    console.log(this.idioma);
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
          }
        }else{
          this._router.navigate(['/body']);
        }
      }
    )
}
  /**
   * @description Método empleado para cargar los datos de los usuarios
   */

  cargarUsuario(){
    this.serv_usuarios.getUsuarioId(this.idUsuario).subscribe(
      res=>{
        if (res) {
          //Cargar los datos al formulario
          this.frm.controls['nombre'] .setValue(res.nombre);
          this.frm.controls['email'].setValue(res.email);
          this.frm.controls['rol'].setValue(res.rol);
          this.frm.controls['torneos_ganados'].setValue(res.torneos_ganados);
          this.frm.controls['puntos'].setValue(res.puntos);
          this.frm.controls['podios'].setValue(res.podios);
          this.frm.controls['carreras_ganadas'].setValue(res.carreras_ganadas);
          this.contraVieja = res.contra
        }else{
          Swal.fire({
            title: "Cliente no existente",
            icon: "error"
          });
          this._router.navigate(['/circuitsCrud']) //Cargar el componente crud
        }
      }
    )
  }

  /**
   * @description Método empleado para saber si los datos del formulario son para crear o editar
   */

  comprobarDatos(){
    if (this.idUsuario) {
     this.editarUsuario();
    }else{
      this.crearUsuario();
    }
  }

  /**
   * @description Método empleado para crear al usuario
   */

  crearUsuario(){
    delete  this.frm.value.puntos
    delete  this.frm.value.torneos_ganados
    delete  this.frm.value.carreras_ganadas
    delete  this.frm.value.podios
    this.serv_usuarios.addUsuario(this.frm.value).subscribe(
      res=>{
        if (res) {
          let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Usuario creado con exito",
              imageUrl: '../../../assets/img/controlar.png',
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
        this.frm.reset(); //Limpiar formulario
        this._router.navigate(['/usersCrud']) //Cargar el componente crud
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "User created successfully",
              imageUrl: '../../../assets/img/controlar.png',
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
        this.frm.reset(); //Limpiar formulario
        this._router.navigate(['/usersCrud']) //Cargar el componente crud
    }
  });
          }
        }else{
          Swal.fire({
            title: "Ha habido algún error",
            icon: "error"
          });
        }
      }
    )
  }

  /**
   * @description Método empleado para editar al usuario
   */

  editarUsuario(){
    if (this.frm.value.contra == '') {
      delete  this.frm.value.contra
    }
    this.serv_usuarios.updateUsuario(this.frm.value, this.idUsuario).subscribe(
      res=>{
        if (res) {
          let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Usuario actualizado con exito",
              imageUrl: '../../../assets/img/controlar.png',
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
        this.frm.reset(); //Limpiar formulario
        this._router.navigate(['/usersCrud']) //Cargar el componente crud
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "User updated successfully",
              imageUrl: '../../../assets/img/controlar.png',
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
        this.frm.reset(); //Limpiar formulario
        this._router.navigate(['/usersCrud']) //Cargar el componente crud
    }
  });
          }
        }else{
          Swal.fire({
            title: "Ha habido algún error",
            icon: "error"
          });
        }
      }
    )
  }

  /**
   * @description Método empleado para volve hacía atrás
   */

  VolverCrud(){
    this._router.navigate(['/usersCrud']);
  }

}
