import { Component, OnInit, inject } from '@angular/core';
import { CircuitoService } from '../../servicios/circuito.service';
import { Router } from '@angular/router';
import { Circuito } from '../../modelos/circuito';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-circuit-crud',
  standalone: true,
  imports: [],
  templateUrl: './circuit-crud.component.html',
  styleUrl: './circuit-crud.component.css'
})
export class CircuitCrudComponent implements OnInit {
  private _router=inject(Router);
  private serv_usuarios = inject(UsuarioService);
  private serv_circuito = inject(CircuitoService);
  private cookies = inject(CookieService)
  aCircuitos:any[] = [];
  idioma!:string

  ngOnInit(): void {
    this.idiomaEstablecido()
    this.verificarUsuario()
    this.cargarCircuitos();
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
 * @description Método empleado para llevar al formulario de circuitos para crear uno nuevo
 */

  formularioCrear(){
    this._router.navigate(['/circuitForm']);
  }

  /**
   * @description Método empleado para volver a la página anterior
   */

  volverMenu(){
    this._router.navigate(['/cruds']);
  }

  /**
   * @description Método empleado para llevar al formulario de circuitos para editar el circuito seleccionado
   * @param id id del circuito a editar
   */

  formularioEditar(id:number){
    this._router.navigate([`/circuitForm/${id}`]);
  }

  /**
   * @description Método empleado para eliminar el circuito seleccionado
   * @param circuito id del circuito a eliminar
   */

  eliminarCircuito(circuito:Circuito){
    if (this.idioma == 'es') {
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`¿Desea eliminar el circuito ${circuito.nombre}?`,
        showCancelButton:true,
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_circuito.deleteCircuit(Number(circuito.id)).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Circuito eliminado con exito",
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
        this.cargarCircuitos()
      }
    });
            }
          )
        }
      })
    }else{
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`Do you want to delete circuit ${circuito.nombre}?`,
        showCancelButton:true,
        confirmButtonText:'Delete',
        cancelButtonText:'Cancel',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_circuito.deleteCircuit(Number(circuito.id)).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Circuit successfully removed",
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
        this.cargarCircuitos()
      }
    });
            }
          )
        }
      })
    }
  }

  /**
   * @description Método empleado para cargar todos los circuitos
   */
  cargarCircuitos(){
    this.serv_circuito.getCircuitos().subscribe(res=>{
       this.aCircuitos = res;
    })
  }
}
