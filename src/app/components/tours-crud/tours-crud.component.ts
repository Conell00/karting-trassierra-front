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

  formularioCrear(){
    this._router.navigate(['/tourForm']);
  }

  volverMenu(){
    this._router.navigate(['/cruds']);
  }

  formularioEditar(id:number){
    this._router.navigate([`/tourForm/${id}`]);
  }

  formatoFecha(fecha:string){
    return `${parseInt(fecha.slice(8,10))+1}/${fecha.slice(5,7)}/${fecha.slice(0,4)}`
  }
    /**
     * Método empleado para ajustar la hora a España (ya que la base de datos está alojada en europa del este
     * y la función CURDATE() de MySql coge la hora local)
     * @param time hora europa del este
     * @returns hora española
     */

  formatoHora(time:string){
    return `${parseInt(time.slice(0,2))+2}:${time.slice(3,5)}:00`;
  }

  /**
   * Método empleado para borrar el torneo seleccionado
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
      /* Read more about handling dismissals below */
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
      /* Read more about handling dismissals below */
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

  cargarTorneos(){
    let torneo = 0;
    this.serv_torneo.getTorneos().subscribe(resTorneo=>{
      if (resTorneo) {
        this.aTorneos = resTorneo;
      }else{
        Swal.fire({
          title: "Ha ocurrido algún error al cargar los torneos",
          icon: "error"
        });
      }
    })
  }
}
