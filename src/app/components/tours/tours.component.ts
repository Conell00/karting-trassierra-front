import { Component, OnInit, inject } from '@angular/core';
import { TorneoService } from '../../servicios/torneo.service';
import { CarreraService } from '../../servicios/carrera.service';
import { CircuitoService } from '../../servicios/circuito.service';
import { Router } from '@angular/router';
import { ClasificacionService } from '../../servicios/clasificacion.service';
import { Clasificacion } from '../../modelos/clasificacion';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { TimeoutConfig, TimeoutErrorCtor } from 'rxjs/internal/operators/timeout';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent implements OnInit {
  private serv_torneo = inject(TorneoService);
  private serv_carrera = inject(CarreraService);
  private serv_circuito = inject(CircuitoService);
  private serv_clasificacion = inject(ClasificacionService);
  private cookies = inject(CookieService)
  private _router=inject(Router);
  aTorneos:any[] = [];
  aCircuitos:any[] = [];
  aParticipacion:any[] = [];
  aParticipantes:any[] = [];
  apuntar!:Clasificacion
  idioma!:string
  contador:number = 0
  ngOnInit(): void {
    this.idiomaEstablecido()
    if (this.cookies.check('token')) {
      this.cargarTorneos();
    }else{
      this._router.navigate([`/login`]);
    }
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

  cargarTorneos(){
      this.aParticipacion = []
      let indice = 0;
      this.serv_torneo.getTorneosPorTerminar().subscribe(res=>{
         this.aTorneos = res;
         for (let i = 0; i < this.aTorneos.length; i++) {
            this.cargarCircuitosTorneo(res[i].id, indice)
          indice++;
         }
      })
  }

  Formatofecha(fecha:string){
    if (this.idioma == 'es') {
      fecha = `${parseInt(fecha.slice(8,10))}/${fecha.slice(5,7)}/${fecha.slice(0,4)}`
    }else{
      fecha = `${fecha.slice(0,4)}/${fecha.slice(5,7)}/${parseInt(fecha.slice(8,10))+1}`
    }
    return  fecha
  }

  Formatohora(hora:string){
    return `${parseInt(hora.slice(0,2))+2}:${hora.slice(3,5)}`
  }

  cargarCircuitosTorneo(id:number,indice:number){
    this.aCircuitos.push([])
    this.serv_carrera.getCarrerasTorneo(id).subscribe(resCarrera=>{
      for (let x = 0; x < 3; x++) {
        this.Participacion(id,resCarrera[x].id, indice)
        this.serv_circuito.getCircuito(resCarrera[x].id_circuito).subscribe(res=>{
          this.aCircuitos[indice][x] = res
       })
       }
   })
  }
  Participacion(id:number,id_carrera:number,indice:number){
    this.serv_clasificacion.getClasificacion(id_carrera,parseInt(this.cookies.get('token'))).subscribe(res=>{
      if (res) {
       this.aParticipacion[indice] = 1
      }else{
        this.aParticipacion[indice] = 0
      }
   })
  }
  verCircuito(id:number){
    this._router.navigate([`/circuito/${id}`]);
  }
  apuntarseTorneo(id:number){
    this.serv_carrera.getCarrerasTorneo(id).subscribe(res=>{
      for (let i = 0; i < 3; i++) {
        const apuntar:Clasificacion = {
          id_carrera: res[i].id,
          id_participante: parseInt(this.cookies.get('token'))
        }
        this.serv_clasificacion.addClasificacion(apuntar).subscribe(
          res=>{
            if (res) {
              let timerInterval:number;
              if (this.idioma == 'es') {
                Swal.fire({
                  position: 'top-end',
                  title: "¡Todo listo para competir, suerte!",
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
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          this.aParticipantes = []
          this.cargarTorneos()
          this.contador = 0
        }
      });
        }else{
          Swal.fire({
            position: 'top-end',
            title: "Everything ready to compete, good luck!",
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
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    this.aParticipantes = []
    this.cargarTorneos()
    this.contador = 0
  }
});
        }
            }else{
              Swal.fire({
                title: "Ha habido algún error al apuntarse",
                icon: "error"
              });
            }
          }
        )
       }
   })
  this.cargarTorneos();
  }
  anularParticipacion(id:number){
    this.serv_carrera.getCarrerasTorneo(id).subscribe(res=>{
      for (let i = 0; i < 3; i++) {
        this.serv_clasificacion.getClasificacion(res[i].id,parseInt(this.cookies.get('token'))).subscribe(res=>{
          this.serv_clasificacion.deleteClasificacion(res.id).subscribe(
            res=>{
              let timerInterval:number;
              if (this.idioma == 'es') {
                Swal.fire({
                  position: 'top-end',
                  title: "Anula participación a torneo con exito",
                  imageUrl: '../../../assets/img/cancelado.png',
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
          this.aParticipantes = []
          this.cargarTorneos()
          this.contador = 0
        }
      });
        }else{
          Swal.fire({
            position: 'top-end',
            title: "Cancel participation in the tournament with success",
            imageUrl: '../../../assets/img/cancelado.png',
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
    this.aParticipantes = []
    this.cargarTorneos()
    this.contador = 0
  }
});
        }
  }
)
})
}
})
  this.cargarTorneos();
}
}
