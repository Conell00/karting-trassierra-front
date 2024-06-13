import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TorneoService } from '../../servicios/torneo.service';
import { Torneo } from '../../modelos/torneo';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../servicios/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { CarreraService } from '../../servicios/carrera.service';
import { CircuitoService } from '../../servicios/circuito.service';

@Component({
  selector: 'app-tours-crud',
  standalone: true,
  imports: [],
  templateUrl: './tours-crud.component.html',
  styleUrl: './tours-crud.component.css'
})
export class ToursCrudComponent implements OnInit {
  private _router=inject(Router);
  private serv_torneo = inject(TorneoService);
  private serv_usuarios = inject(UsuarioService);

  private cookies = inject(CookieService)
  idioma!:string
  aTorneos:any[] = [];
  aCarreras:any[] = [];
  ngOnInit(): void {
    this.idiomaEstablecido();
    this.cargarTorneos();
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
  * @description Método empleado para llevar al formulario de torneos para crear uno nuevo
  */

  formularioCrear(){
    this._router.navigate(['/tourForm']);
  }

  /**
   * @description Método empleado para ir hacía atrás
   */

  volverMenu(){
    this._router.navigate(['/cruds']);
  }

  /**
   * @description Método empleado para llevar al formulario de torneos para editar el circuito seleccionado
   * @param id id del torneo a editar
   */

  formularioEditar(id:number){
    this._router.navigate([`/tourForm/${id}`]);
  }

  /**
   * @description Método empleado para formatear la fecha
   * @param fecha Fecha procedente de la base de datos
   * @returns Fecha formateada
   */

  formatoFecha(fecha:string){
    return `${parseInt(fecha.slice(8,10))}/${fecha.slice(5,7)}/${fecha.slice(0,4)}`
  }
    /**
     * @description Método empleado para ajustar la hora a España (ya que la base de datos está alojada en europa del este
     * y la función CURDATE() de MySql coge la hora local)
     * @param time hora europa del este
     * @returns hora española
     */

  formatoHora(time:string){
    return `${parseInt(time.slice(0,2))+2}:${time.slice(3,5)}:00`;
  }

  /**
   * @description Método empleado para borrar el torneo seleccionado
   * @param torneo Torneo a borrar
   */

  eliminarCircuito(torneo:Torneo){
    if (this.idioma == 'es') {
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`¿Desea eliminar el torneo ${torneo.nombre}?`,
        showCancelButton:true,
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_torneo.deleteTorneo(Number(torneo.id)).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Torneo eliminado con exito",
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
        this.cargarTorneos()
      }
    });
            }
          )
        }
      })
    }else{
      Swal.fire({
        imageUrl: "../../../assets/img/signo-de-interrogacion.png",
        title:`Do you want to delete tournament ${torneo.nombre}?`,
        showCancelButton:true,
        confirmButtonText:'Delete',
        cancelButtonText:'Cancel',
        focusConfirm:false
      }).then(result=>{
        if (result.isConfirmed) {
          this.serv_torneo.deleteTorneo(Number(torneo.id)).subscribe(
            res=>{
              let timerInterval:number
              Swal.fire({
                position: 'top-end',
                title: "Tournament successfully removed",
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
        this.cargarTorneos()
      }
    });
            }
          )
        }
      })
    }
  }

  /**
   * @description Método empleado para mostrar todos los torneos
   */

  cargarTorneos(){
    let torneo = 0;
    this.serv_torneo.getTorneos().subscribe(resTorneo=>{
      if (resTorneo) {
        this.aTorneos = resTorneo;
        console.log(this.aTorneos);
      }else{
        Swal.fire({
          title: "Ha ocurrido algún error al cargar los torneos",
          icon: "error"
        });
      }
    })
  }
}
