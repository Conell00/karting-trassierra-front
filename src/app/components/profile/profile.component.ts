import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../modelos/usuario';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MensajeService } from '../../servicios/mensaje.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TorneoService } from '../../servicios/torneo.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit,OnDestroy {
  frm!:FormGroup
  constructor(private fb:FormBuilder){}
  private serv_usuarios = inject(UsuarioService);
  private serv_mensajes = inject(MensajeService);
  private serv_torneo = inject(TorneoService);
  usuario!:Usuario
  aMensajesUsuario:any[] = []
  private cookies = inject(CookieService)
  private _router=inject(Router);
  isUser:boolean = false
  esVisible:boolean = false;
  esVisible2:boolean = false;
  esVisible3:boolean = false;
  idioma!:string
  torneosDisponibles!:boolean
  ngOnDestroy(): void {
    if (this.cookies.check('token2')) {
     this.cookies.delete('token2')
    }
  }
  ngOnInit(): void {
   this.idiomaEstablecido()
   this.mostrarBotonTorneo()
   this.frm= this.fb.group({
    nombre:['',[Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+(([' -][A-Za-záéíóúÁÉÍÓÚñÑ ])?[A-Za-záéíóúÁÉÍÓÚñÑ]*)*$/)]],
    email:['',[Validators.email]],
    contraVieja:['',[Validators.required]],
    contra:['',[Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
    recontra:['',[this.repetirContra.bind(this)]],
  })
  this.cargarUsuario()
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
  cargarUsuario(){
    if (this.cookies.check('token2')) {
      this.serv_usuarios.getUsuarioEmail(this.cookies.get('token2')).subscribe(res=>{
        if (res) {
          this.usuario = res
        }else{
          Swal.fire({
            icon: "error",
            title: "Error al cargar los datos del usuario seleccionado",
          });
          this._router.navigate(['/body']);
        }
       })
    }else{
      this.isUser = true
      this.serv_usuarios.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(res=>{
        if (res) {
          this.usuario = res
          this.serv_mensajes.getMensajesUsuario(parseInt(this.cookies.get('token'))).subscribe(res=>{
            if (res) {
              this.aMensajesUsuario = res
            }else{
              this._router.navigate(['/body']);
            }
           })
        }else{
          this._router.navigate(['/body']);
        }
       })
    }
  }
  mensajeLeido(id:number){
    this.serv_mensajes.deleteMensaje(id).subscribe(res=>{
      if (res) {
        let timerInterval:number
        if (this.idioma == 'es') {
          Swal.fire({
            position: 'top-end',
            title: "Mensaje leído",
            imageUrl: '../../../assets/img/carta.png',
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
    this.cargarUsuario()
  }
});
    }else{
          Swal.fire({
            position: 'top-end',
            title: "Read message",
            imageUrl: '../../../assets/img/carta.png',
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
    this.cargarUsuario()
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

  cargarModal(){
    this.frm.controls['nombre'].setValue(this.usuario.nombre);
    this.frm.controls['email'].setValue(this.usuario.email);
  }

  modalComprobar(){
    let modal = document.getElementById("myModal")
    modal!.style.display = "block"
  }

  validarContra(){
    this.serv_usuarios.getUsuario(this.usuario.email,this.frm.value.contraVieja).subscribe(res=>{
      if (res.id != null) {
        this.modalEditar()
        let modal = document.getElementById("myModal")
      }else{
        let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Contraseña incorrecta",
              imageUrl: '../../../assets/img/falla.png',
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
      this.frm.controls['contraVieja'].setValue('')
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "Incorrect password",
              imageUrl: '../../../assets/img/falla.png',
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
      this.frm.controls['contraVieja'].setValue('')
    }
  });
        }
      }
     })
  }

  cerrarModalComprobar(){
    let modal = document.getElementById("myModal")
    modal!.style.display = "none"
  }



  /**
   * Método empleado para abrir el modal si la contraseña es correcta
   */

  modalEditar(){
    this.cerrarModalComprobar()
    this.cargarModal()
    let modal = document.getElementById("myModal2")
    modal!.style.display = "block"
    }

  cerrarModal(){
    let modal = document.getElementById("myModal2")
    modal!.style.display = "none"
  }
  torneos(){
    this._router.navigate(['/tours']);
  }

  volverAtras(){
    this._router.navigate(['/body']);
  }

  //Getter para modal

  get email(){
    return this.frm.get('email') as FormControl
  }
  get nombre(){
    return this.frm.get('nombre') as FormControl
  }
  get contraVieja(){
    return this.frm.get('contraVieja') as FormControl
  }
  get contra(){
    return this.frm.get('contra') as FormControl
  }
  get recontra(){
    return this.frm.get('recontra') as FormControl
  }

  //Método empleado para comprobar si la contraseña coincide

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
   * Método empleado para mostrar las 3 contraseñas del modal por separado
   * @param id contraseña a mostrar
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
    }else if (id == 'recontra') {
      if (document.getElementById('recontra')?.getAttribute('type') == 'password') {
        document.getElementById('recontra')?.setAttribute('type','text');
        this.esVisible2 = true;
      }else{
        document.getElementById('recontra')?.setAttribute('type','password');
        this.esVisible2 = false;
      }
    }else{
      if (document.getElementById('contraActual')?.getAttribute('type') == 'password') {
        document.getElementById('contraActual')?.setAttribute('type','text');
        this.esVisible3 = true;
      }else{
        document.getElementById('contraActual')?.setAttribute('type','password');
        this.esVisible3 = false;
      }
    }
  }

  /**
   * Método empleado para editar los datos del usuario (los datos provienen de la ventana modal).
   */

  editarUsuario(){
    this.comprobarModal()
    this.serv_usuarios.updateUsuario(this.frm.value,parseInt(this.cookies.get('token'))).subscribe(
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
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      this.frm.controls['contraVieja'].setValue('')
      this.cargarUsuario()
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "User successfully updated",
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
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      this.frm.controls['contraVieja'].setValue('')
      this.cargarUsuario()
    }
  });
        }
          this.frm.reset()
        }else{
          Swal.fire({
            title: "Ha habido algún error al actulizar su cuenta",
            icon: "error"
          });
        }
      }
    )
    this.cargarUsuario()
    this.frm.reset()
    this.cerrarModal()
  }

  eliminarUsuario(){
    if (this.idioma == 'es') {
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`¿Va a dejar su carrera como piloto?`,
        showCancelButton:true,
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_usuarios.deleteUsuario(parseInt(this.cookies.get('token'))).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Cuenta borrada. Esperamos verlo pronto en la pista!",
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
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        this.cookies.delete('token')
        location.reload()
        // this._router.navigate(['/body']);

      }
    });
            }
          )
        }
      })
    }else{
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`Are you going to leave your career as a pilot?`,
        showCancelButton:true,
        confirmButtonText:'Delete',
        cancelButtonText:'Cancel',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_usuarios.deleteUsuario(parseInt(this.cookies.get('token'))).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Deleted account. We hope to see you soon on the track!",
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
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        this.cookies.delete('token')
        location.reload()
      }
    });
            }
          )
        }
      })
    }
  }

/**
 * Método empleado para si hay un campo en blanco, que conserve su valor original.
 */

  comprobarModal(){
    if (this.frm.value.contra == '') {
      delete  this.frm.value.contra
    }
    if (this.frm.value.nombre == '') {
      this.frm.controls['nombre'].setValue(this.usuario.nombre)
    }
    if (this.frm.value.email == '') {
      this.frm.controls['email'].setValue(this.usuario.email)
    }
  }

  /**
   * Método empleado para mostrar el botón 'torneos' si hay torneos disponibles.
   * @returns true o false, dependiendo si hay torneos disponibles.
   */

  mostrarBotonTorneo(){
    this.serv_torneo.getTorneosPorTerminar().subscribe(res=>{
      if (res.length > 0) {
        this.torneosDisponibles = true
      }else{
        this.torneosDisponibles = false
      }
    })
  }

  }

