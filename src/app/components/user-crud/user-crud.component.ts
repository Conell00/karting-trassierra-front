import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../modelos/usuario';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MensajeService } from '../../servicios/mensaje.service';
import { Mensaje } from '../../modelos/mensaje';

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css'
})
export class UserCrudComponent {
  frm!:FormGroup
  constructor(private fb:FormBuilder){}
  private _router=inject(Router);
  private serv_usuarios = inject(UsuarioService);
  private serv_mensajes = inject(MensajeService);
  private cookies = inject(CookieService)
  aUsuarios:any[] = [];
  idioma !:string
  admin!:number
  receptorMensaje!:number
  receptorMensajeNombre!:string

  ngOnInit(): void {
    this.frm= this.fb.group({
      cuerpo:['',[Validators.required]],
      cuerpo_en:['',[Validators.required]],
    })
    this.idiomaEstablecido()
    this.verificarUsuario()
    this.cargarUsuarios()
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
 * Getter de modal mensaje
 */

get cuerpo(){
  return this.frm.get('cuerpo') as FormControl
}
get cuerpo_en(){
  return this.frm.get('cuerpo_en') as FormControl
}

/**
 * @description Método empleado para verificar si el usuario que ha accedido es admin.
 * también cojo el id del usuario para evitar que el mismo se pueda enviar un mensaje
 */

  verificarUsuario(){
    this.serv_usuarios.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(
      res=>{
        if (res) {
            this.admin = res.id
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
   * @description Método empleado para llevar al formulario usuarios para crear
   */

  formularioCrear(){
    this._router.navigate(['/userForm']);
  }

  /**
   * @description Método empleado para volver hacía atrás
   */

  volverMenu(){
    this._router.navigate(['/cruds']);
  }

  /**
   * @description Método empleado para llevar al formulario usuarios para editar
   */

  formularioEditar(id:number){
    this._router.navigate([`/userForm/${id}`]);
  }

  /**
   * @description Método empleado para mostrar el rol según el idioma
   * @param rol Rol procedente de la base de datos
   * @returns Rol traducido
   */

  traducirRol(rol:string){
    if (rol == 'participante') {
      rol = 'competitor'
    }
    return rol
  }

  /**
   * Método empleado para borrar el usuario seleccionado
   * @param usuario Id usuario
   */

  eliminarUsuario(usuario:Usuario){
    if (this.idioma == 'es') {
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`¿Desea eliminar el usuario ${usuario.nombre}?`,
        showCancelButton:true,
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_usuarios.deleteUsuario(Number(usuario.id)).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Usuario eliminado con exito",
                imageUrl: '../../../assets/img/boton-eliminar.png',
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
        this.cargarUsuarios()
      }
    });
            }
          )
        }
      })
    }else{
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`Do you want to delete user ${usuario.nombre}?`,
        showCancelButton:true,
        confirmButtonText:'Delete',
        cancelButtonText:'Cancel',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_usuarios.deleteUsuario(Number(usuario.id)).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "User successfully removed",
                imageUrl: '../../../assets/img/boton-eliminar.png',
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
        this.cargarUsuarios()
      }
    });
            }
          )
        }
      })
    }
  }

  /**
   * @description Método empleado para cargar los usuarios.
   */

  cargarUsuarios(){
    this.serv_usuarios.getUsuarios().subscribe(res=>{
       this.aUsuarios = res;
       console.log(this.aUsuarios);
    })
  }

  /**
   * @description Método empleado para abrir el modal de enviar mensaje
   * @param id de receptor de mensaje
   */

  modalMensaje(id:number,nombre:string){
    let modal = document.getElementById("myModal")
    modal!.style.display = "block"
    this.receptorMensaje = id
    this.receptorMensajeNombre = nombre
  }

  /**
   * @description Método empleado para cerrar modal
   */

  cerrarModalMensaje(){
    let modal = document.getElementById("myModal")
    modal!.style.display = "none"
    this.frm.reset()
  }

/**
 * @description Método empleado para enviar el mensaje al usuario
 */
  enviarMensaje(){
    const mensaje:Mensaje ={
      id_participante: this.receptorMensaje,
      cuerpo: this.frm.value.cuerpo,
      cuerpo_en: this.frm.value.cuerpo_en
    }
    this.serv_mensajes.addMensaje(mensaje).subscribe(res=>{
      if (res) {
        let timerInterval:number
        if (this.idioma == 'es') {
          Swal.fire({
            position: 'top-end',
            title: "Mensaje enviado",
            imageUrl: '../../../assets/img/enviar.png',
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
    this.cerrarModalMensaje()
  }
});
    }else{
          Swal.fire({
            position: 'top-end',
            title: "Message sent",
            imageUrl: '../../../assets/img/enviar.png',
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
    this.cerrarModalMensaje()
  }
});
        }
      }else{
        Swal.fire({
          icon: "error",
          title: "ha ocurrido algún error",
        });
      }
     })
  }

}
