import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../servicios/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario} from '../modelos/usuario';
import { CookieService } from 'ngx-cookie-service';
import { ClasificacionService } from '../servicios/clasificacion.service';
import { TorneoService } from '../servicios/torneo.service';
import { CarreraService } from '../servicios/carrera.service';
import { identifierName } from '@angular/compiler';
import { Clasificacion } from '../modelos/clasificacion';
import { MensajeService } from '../servicios/mensaje.service';
import { Mensaje } from '../modelos/mensaje';
import { Carrera, getCarrera } from '../modelos/carrera';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent implements OnInit{
  private serv_usuarios = inject(UsuarioService);
  private serv_clasificacion = inject(ClasificacionService);
  private serv_torneo = inject(TorneoService);
  private serv_carrera = inject(CarreraService);
  private serv_mensaje = inject(MensajeService);
  private _router=inject(Router);
  private cookies = inject(CookieService)
  aUsuarios:Usuario[][] = [[],[],[],[]]
  aPuntosCarrera:any[][] = []
  aClasificacionTorneo:any[][] = []
  aCarrerasGanadas:Map<number,number> = new Map()
  categoria:number = 0
  clave!:number
  tipoMensaje!:Mensaje
  actUsuario!:Usuario
  idioma!:string
  nombreTorneo!:string
  numParticipantes!:number
  login!:string
  apuntarTorneo!:boolean

  ngOnInit(): void {
    this.idiomaEstablecido()
    this.usuariosTop();
    this.comprobarTorneo();
    this.apuntarseTorneo()
    if (this.cookies.check('token')) {
      this.mensajesUsuario()
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
  /**
   * Método empleado para cargar el top 5 de usuarios de cada categoria
   */

  usuariosTop(){
    this.serv_usuarios.getUsuariosPoints().subscribe(res=>{
    if (res) {
      this.aUsuarios[0] = res;
    }else{
      Swal.fire({
        icon: "error",
        title: "Usuario no encontrado",
      });
    }
      })

    this.serv_usuarios.getUsuariosRaces().subscribe(res=>{
      if (res) {
        this.aUsuarios[1] = res;
      }else{
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
        });
      }
        })

      this.serv_usuarios.getUsuariosTours().subscribe(res=>{
        if (res) {
          this.aUsuarios[2] = res;
        }else{
          Swal.fire({
            icon: "error",
            title: "Usuario no encontrado",
          });
        }
          })

      this.serv_usuarios.getUsuariosPodiums().subscribe(res=>{
        if (res) {
          this.aUsuarios[3] = res;
        }else{
          Swal.fire({
            icon: "error",
            title: "Usuario no encontrado",
          });
        }
          })
    }

    /**
     * Método empleado para ir cambiando el top 5.
     * @param numero Puede ser 1 o -1, dependiendo si se pulsa la flecha para la derecha o izquierda
     */

    cambiarCategoria(numero:number){
      this.categoria += numero
      if (this.categoria == 4) {
        this.categoria = 0
      }else if(this.categoria == -1){
        this.categoria = 3
      }
    }

    /**
     * Método empleado para visualizar el perfil de un usuario cuando se clika sobre él
     * @param email clave usuario
     */

    verPerfil(email:string){
      this.cookies.set('token2',email);
      this._router.navigate(['/profile']);
    }

    /**
     * Método empleado para redirigir a los torneos disponibles cuando se clicka sobre el banner
     */

    torneos(){
      this._router.navigate(['/tours']);
    }

    /**
     * Método empleado para comprobar si hay torneos terminados, si los hay se simula este
     * añadiendo a los participantes sus correspondientes estadísticas y mandando los mensajes correspondientes a estos.
     */

    comprobarTorneo(){
      //Obtener los torneos ya finalizados
      this.serv_torneo.getTorneosTerminados().subscribe(resTorneo=>{
        if (resTorneo) {
          for (let iTorneo = 0; iTorneo < resTorneo.length; iTorneo++) {
            this.nombreTorneo = resTorneo[iTorneo].nombre
            //Obtener las 3 carreras de cada torneo (segundo parámetro es para obtener las que no están puntuadas)
            this.serv_carrera.getCarrerasAnotadas(resTorneo[iTorneo].id,0).subscribe(resCarreras=>{
              if (resCarreras) {
                for (let i = 0; i < 3; i++) {
                  //Obtener la clasificación de cada carrera del torneo
                  this.serv_clasificacion.getClasificacionCarrera(resCarreras[i].id).subscribe(resClasificacion=>{
                    if (resClasificacion) {
                      //Ordenar aleatoriamente el orden de la carrera
                      resClasificacion.sort(function() { return Math.random() - 0.5 });
                      //Ortogar puntos a los participantes de la carrera
                      for (let x = 0; x < resClasificacion.length; x++) {
                        this.aPuntosCarrera.push([resClasificacion[x].id_participante, (x-Math.trunc(resClasificacion.length/2))*2])
                      }
                      //Calcular clasificacion de torneo
                      for (let x = 0; x < this.aPuntosCarrera.length; x++) {
                        if (i > 0) {
                          //En la segunda carrera y tercera sumo los puntos a los que tenía de las carreras anteriores
                          this.aClasificacionTorneo[x] = [this.aPuntosCarrera[x][0],this.aClasificacionTorneo[x][1]+this.aPuntosCarrera[x][1]]
                        }else{
                          //En la primera carrera simplemente aplico los puntos obtenidos
                          this.aClasificacionTorneo.push([this.aPuntosCarrera[x][0],this.aPuntosCarrera[x][1]])
                        }
                      }
                      //Limpiar la clasificacion de la carrera anterior para la siguiente
                      this.aPuntosCarrera = []
                      //Ordeno la clasificación del torneo por puntuación
                      this.aClasificacionTorneo.sort(function(a,b){
                        return a[1]-b[1]
                       });
                       this.cargarMapa()
                       //If empleado para que no entre al método hasta que se haya asignado la clasificación de todas las carreras
                       if (i > 1) {
                        // If empleado para comprobar que el torneo contiene el número de participantes para poder disputarse.
                        // En caso de cumplirlo pasa a realizar todas las actualizaciones pertinentes, en caso de que no envia una alerta a los usuarios y se anula el torneo.
                        this.numParticipantes = resClasificacion.length
                        console.log('participantes',resClasificacion.length);
                        if (resClasificacion.length > 4) {
                           this.sumarVictoriaCarreras(resTorneo[iTorneo].nombre)
                           this.AsignarPuntosTorneo(resTorneo[iTorneo].nombre,resClasificacion.length)
                        }else{
                          for (let y = 0; y < resClasificacion.length; y++) {
                            const mensaje:Mensaje ={
                              id_participante: resClasificacion[y].id_participante,
                              cuerpo: `Torneo ${resTorneo[iTorneo].nombre} anulado por no llegar a los participantes mínimos.`,
                              cuerpo_en:`Tournament ${resTorneo[iTorneo].nombre} canceled due to not reaching the minimum participants.`
                            }
                            this.serv_mensaje.addMensaje(mensaje).subscribe(
                              res=>{
                                if (!res) {
                                  Swal.fire({
                                    title: "Ha habido algún error al crear el mensaje",
                                    icon: "error"
                                  });
                                }
                              }
                            )
                          }
                        }
                       }
                    }
                  })
                }
                this.marcarCarreras(resCarreras)
              }
            })
          }
        }
      })
    }

    /**
     * Método empleado para cargar el mapa que va a contener los ganadores de las carreras del torneo
     * Introduzco la carrera ganada de cada partipante en un mapa
     * (hago esto porque si un participante gana más de una carrera, en la actualización solamente suma 1 por el tiempo de respuesta)
     */

    cargarMapa(){
      if (this.aCarrerasGanadas.has(this.aClasificacionTorneo[this.aClasificacionTorneo.length-1][0])) {
        const clave = this.aCarrerasGanadas.get(this.aClasificacionTorneo[this.aClasificacionTorneo.length-1][0])!;
        this.aCarrerasGanadas.set(this.aClasificacionTorneo[this.aClasificacionTorneo.length-1][0],clave+1)
       }else{
        this.aCarrerasGanadas.set(this.aClasificacionTorneo[this.aClasificacionTorneo.length-1][0],1)
       }
    }

    /**
     * Método empleado para actualizar las carreras ganadas de los participantes y para notificarlos de esto mismo
     * @param torneo Nombre del torneo
     */

    sumarVictoriaCarreras(torneo:string){
      for (const [clave,valor] of this.aCarrerasGanadas.entries()) {
        this.serv_usuarios.getUsuarioId(clave).subscribe(res=>{
          if (res) {
            const usuario:Usuario = {
              nombre:res.nombre,
              email:res.email,
              rol:res.rol,
              carreras_ganadas: res.carreras_ganadas+valor
            }
            const mensaje:Mensaje ={
              id_participante: clave,
              cuerpo: `Felicidades, has ganado ${valor} carrera/s en el torneo ${torneo}`,
              cuerpo_en: `Congratulations, you have won ${valor} race/s in the tournament ${torneo}` 
            }
            this.servidorUsuario(usuario,mensaje,clave)
          }else{
            Swal.fire({
              icon: "error",
              title: "Usuario no encontrado",
            });
          }
            })
      }
    }

    /**
     * Método empleado par asignar puntos y torneo ganado a los usuarios participantes del torneo
     * @param torneo Nombre torneo
     */

    AsignarPuntosTorneo(torneo:string,numeroParticipantes:number){
      for (let i = 0; i < this.aClasificacionTorneo.length; i++) {
        this.serv_usuarios.getUsuarioId(this.aClasificacionTorneo[i][0]).subscribe(res=>{
          if (res) {
            //If para saber quien ha ganado el torneo y sumarle la victoria
            if (i == this.aClasificacionTorneo.length-1) {
              const usuario:Usuario = {
                nombre:res.nombre,
                email:res.email,
                rol:res.rol,
                puntos: res.puntos + this.aClasificacionTorneo[i][1],
                torneos_ganados: res.torneos_ganados+1,
                podios: res.podios+1
              }
              const mensaje:Mensaje ={
                id_participante: this.aClasificacionTorneo[i][0],
                cuerpo: `Felicidades, has ganado el torneo ${torneo} con ${this.aClasificacionTorneo[i][1]} puntos`,
                cuerpo_en:`Congratulations, you have won the tournament ${torneo} with ${this.aClasificacionTorneo[i][1]} points`
              }
              this.servidorUsuario(usuario,mensaje,res.id)
            }else{
              //If para averiguar quien ha hecho podio y actualizar esa estadística del usuario
              if (i > this.aClasificacionTorneo.length-4) {
                const usuario:Usuario = {
                  nombre:res.nombre,
                  email:res.email,
                  rol:res.rol,
                  puntos: res.puntos + this.aClasificacionTorneo[i][1],
                  podios: res.podios+1
                }
                this.actUsuario = usuario
              }else{
                const usuario:Usuario = {
                  nombre:res.nombre,
                  email:res.email,
                  rol:res.rol,
                  puntos: res.puntos + this.aClasificacionTorneo[i][1],
                }
                this.actUsuario = usuario
              }
              //If para cambiar el mensaje dependiendo si se ha ganado o perdido puntos
              if (this.aClasificacionTorneo[i][1] > 0) {
                const mensaje:Mensaje ={
                  id_participante: this.aClasificacionTorneo[i][0],
                  cuerpo: `Has obtenido ${this.aClasificacionTorneo[i][1]} puntos en el torneo ${torneo}. Has terminado en ${this.aClasificacionTorneo.length - i}º posición`,
                  cuerpo_en:`You have obtained ${this.aClasificacionTorneo[i][1]} points in the tournament ${torneo}. You have ended up in ${this.aClasificacionTorneo.length - i}º position`
                }
                this.tipoMensaje = mensaje
              }else if (this.aClasificacionTorneo[i][1] < 0) {
                const mensaje:Mensaje ={
                  id_participante: this.aClasificacionTorneo[i][0],
                  cuerpo: `Has perdido ${-(this.aClasificacionTorneo[i][1])} puntos en el torneo ${torneo}. Has terminado en ${this.aClasificacionTorneo.length - i}º posición`,
                  cuerpo_en: `You have lost ${-(this.aClasificacionTorneo[i][1])} points in the tournament ${torneo}. You have ended up in ${this.aClasificacionTorneo.length - i}º position`
                }
                this.tipoMensaje = mensaje
              }else{
                const mensaje:Mensaje ={
                  id_participante: this.aClasificacionTorneo[i][0],
                  cuerpo: `No has perdido ni ganado puntos en el torneo ${torneo}. Has terminado en ${this.aClasificacionTorneo.length - i}º posición`,
                  cuerpo_en: `You have not lost or gained points in the tournament ${torneo}. You have ended up at ${this.aClasificacionTorneo.length - i}º position`
                }
                this.tipoMensaje = mensaje
              }
              this.servidorUsuario(this.actUsuario,this.tipoMensaje,res.id)
            }
          }else{
            Swal.fire({
              icon: "error",
              title: "Usuario no encontrado",
            });
          }
            })
      }
    }

    /**
     * Método empleado para evitar la repetición de código. En este se efectua la actualización del usuario y la creación de un nuevo mensaje.
     * @param usuario Objeto usuario
     * @param mensaje Objeto mensaje
     * @param id Clave primeria de usuario
     */

    servidorUsuario(usuario:Usuario,mensaje:Mensaje,id:number){
      this.serv_usuarios.updateUsuario(usuario,id).subscribe(
        res=>{
          if (res) {
            console.log('actualizado');
          }
        }
      )

      this.serv_mensaje.addMensaje(mensaje).subscribe(
        res=>{
          if (!res) {
            Swal.fire({
              title: "Ha habido algún error al crear el mensaje",
              icon: "error"
            });
          }
        }
      )
    }

    /**
     * Método empleado para marcar como anotadas las carreras completadas del torneo
     * @param carreras Objetos carreras (Las 3 carreras pertenecientes al torneo)
     */

    marcarCarreras(carreras:getCarrera[]){
      for (let i = 0; i < carreras.length; i++) {

        const carrera:Carrera = {
          id_torneo: carreras[i].id_torneo,
          id_circuito: carreras[i].id_circuito,
          anotado: 1
        }
        this.serv_carrera.updateCarrera(carrera,carreras[i].id).subscribe(
          res=>{
            if (res) {
              let timerInterval:number
              if (this.numParticipantes === undefined || this.numParticipantes > 4) {
                          if (this.idioma == 'es') {
                            Swal.fire({
                              position: 'top-end',
                              title: `Torneo ${this.nombreTorneo}  anulado por no llegar a los participantes mínimos`,
                              imageUrl: '../../../assets/img/trofeo.png',
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
                  });
                          }else{
                            Swal.fire({
                              position: 'top-end',
                              title: `Tournament ${this.nombreTorneo}  canceled due to not reaching the minimum participants.`,
                              imageUrl: '../../../assets/img/trofeo.png',
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
                  });
                          }
              }else{
                if (this.idioma == 'es') {
                  Swal.fire({
                    position: 'top-end',
                    title: `Torneo ${this.nombreTorneo} concluido`,
                    imageUrl: '../../../assets/img/copa-trofeo.png',
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
        });
                }else{
                  Swal.fire({
                    position: 'top-end',
                    title: `Tournament ${this.nombreTorneo} concluded`,
                    imageUrl: '../../../assets/img/copa-trofeo.png',
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
        });
                }
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
    }

    /**
     * Método empleado para comprobar si hay torneos disponibles
     * y se ha iniciado sesión para acceder a la página de torneos.
     */

    apuntarseTorneo(){
      this.serv_torneo.getTorneosTerminados().subscribe(res=>{
        if (res && this.cookies.check('token')) {
          this.serv_torneo.getTorneosPorTerminar().subscribe(resTorneos=>{
            if (resTorneos.length > 0) {
              this.apuntarTorneo = true
            }else{
              this.apuntarTorneo = false
            }
          })
        }else{
          this.apuntarTorneo = false
        }
      })
    }

    /**
     * Método empleado para alertar al usuario si tiene algún mensaje pendiente
     */

    mensajesUsuario(){
      this.serv_mensaje.getMensajesUsuario(parseInt(this.cookies.get('token'))).subscribe(
        res=>{
          if (res && res.length > 0) {
            let timerInterval:number
            if(this.idioma == 'es'){
              Swal.fire({
                position: 'top-end',
                title: `Tiene ${res.length} mensaje/es pendientes`,
                imageUrl: '../../../assets/img/pendiente.png',
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
    });
      }else{
              Swal.fire({
                position: 'top-end',
                title: `Has ${res.length} message/es pending`,
                imageUrl: '../../../assets/img/pendiente.png',
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
    });
          }
          }
        }
      )
    }
  }
