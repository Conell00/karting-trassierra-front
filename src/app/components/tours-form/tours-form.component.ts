import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TorneoService } from '../../servicios/torneo.service';
import Swal from 'sweetalert2';
import { CircuitoService } from '../../servicios/circuito.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { CarreraService } from '../../servicios/carrera.service';
import { Carrera } from '../../modelos/carrera';
import { Torneo } from '../../modelos/torneo';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tours-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tours-form.component.html',
  styleUrl: './tours-form.component.css'
})
export class ToursFormComponent implements OnInit {
  private serv_torneo = inject(TorneoService);
  private serv_circuito = inject(CircuitoService);
  private serv_usuario = inject(UsuarioService);
  private serv_carrera = inject(CarreraService);
  private _router=inject(Router);
  private _activedRouter=inject(ActivatedRoute);
  private cookies = inject(CookieService)
  frm!:FormGroup
  private idTorneo!:number;
  textoBoton!:string;
  aCircuitos:any[] = [];
  aCarreras:any[] = [];
  aAnotadores:any[] = [];
  torneo:any[] = [];
  aCarrerasTorneoId:any[] = [];
  idioma!:string
  constructor(private fb:FormBuilder){}
  ngOnInit(): void {
    this.idiomaEstablecido()
    this.frm= this.fb.group({
      nombre:['',[Validators.required]],
      fecha:['',[Validators.required,this.comprobarFecha.bind(this)]],
      hora:['',[Validators.required,this.comprobarHora.bind(this)]],
      imagen:['',[Validators.required, Validators.pattern(/\.(png|jpg)$/i)]],
      descripcion:['',[Validators.required]],
      descripcion_en:['',[Validators.required]],
      carrera1:['',[Validators.required]],
      carrera2:['',[Validators.required]],
      carrera3:['',[Validators.required]],
    })
    this._activedRouter.params.subscribe(
      params=>{
        this.idTorneo=params['id'];
        if (this.idTorneo) {
          this.cargarTorneo();
          this.cargarCarrerasTorneo();
          if (this.idioma == 'es') {
            this.textoBoton = 'Editar torneo'
          }else{
            this.textoBoton = 'Edit tournament'
          }
        }else{
          if (this.idioma == 'es') {
            this.textoBoton = 'Añadir torneo'
          }else{
            this.textoBoton = 'Add torneo'
          }
        }
      }
     )
     this.cargarCircuitos();
     this.verificarUsuario();
  }

  get nombre(){
    return this.frm.get('nombre') as FormControl
  }
  get fecha(){
    return this.frm.get('fecha') as FormControl
  }
  get hora(){
    return this.frm.get('hora') as FormControl
  }
  get imagen(){
    return this.frm.get('imagen') as FormControl
  }
  get descripcion(){
    return this.frm.get('descripcion') as FormControl
  }
  get carrera1(){
    return this.frm.get('carrera1') as FormControl
  }
  get carrera2(){
    return this.frm.get('carrera2') as FormControl
  }
  get carrera3(){
    return this.frm.get('carrera3') as FormControl
  }
  get descripcion_en(){
    return this.frm.get('descripcion_en') as FormControl
  }

  /**
   * @description Método empleado para comprobar que la hora es correcta
   * @param control
   * @returns true o false, dependiendo de si la hora está dentro del baremo establecido
   */

  comprobarHora(control:AbstractControl){
    if (this.frm) { //Verificar si frm está defenido antes de acceder a los controles.
      const hora = this.frm.get('hora')?.value;
     return hora > '12:00' && hora < '20:01'?null : {passwordIdem:true}
    }else{
      return null
    }
  }

  /**
   * @description Método empleado para comprobar que la fecha es correcta
   * @param control 
   * @returns true o false, dependiendo de si la fecha no es inferior al día de hoy
   */

  comprobarFecha(control:AbstractControl){
    if (this.frm) { //Verificar si frm está defenido antes de acceder a los controles.
      const hoy = new Date()
      const hoySoloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const fecha = new Date(this.frm.get('fecha')?.value)
     return fecha >= hoySoloFecha?null : {passwordIdem:true}
    }else{
      return null
    }
  }

  /**
 * @description Método empleado para saber si el usuario que ha entrado es administrador o no.
 * En caso de que sea administrador no se permitirá su acceso a esta página
 */

  verificarUsuario(){
    this.serv_usuario.getUsuarioId(parseInt(this.cookies.get('token'))).subscribe(
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
 * @description Método empleado para cargar los datos del torneo a editar
 */

  cargarTorneo(){
    this.serv_torneo.getTorneo(this.idTorneo).subscribe(
      res=>{
        if (res) {
          //Cargar los datos al formulario
          this.frm.controls['nombre'].setValue(res.nombre);
          this.frm.controls['fecha'].setValue(res.fecha.toString().slice(0,10));
          this.frm.controls['hora'].setValue(`${parseInt(res.hora.slice(0,2))+2}:${res.hora.slice(3,5)}:00`);
          this.frm.controls['descripcion'].setValue(res.descripcion);
          this.frm.controls['descripcion_en'].setValue(res.descripcion_en);
        }else{
          Swal.fire({
            title: "Torneo no existente",
            icon: "error"
          });
          this._router.navigate(['/toursCrud']) //Cargar el componente crud
        }
      }
    )
  }

  /**
   * @description Método empleado para cargar las carreras del torneo a editar
   */

  cargarCarrerasTorneo(){
    this.serv_carrera.getCarrerasTorneo(this.idTorneo).subscribe(
      res=>{
        if (res) {
          for (let i = 0; i < 3; i++) {
            this.aCarrerasTorneoId.push(res[i].id)
          }
          //Cargar los datos al formulario
          this.frm.controls['carrera1'].setValue(res[0].id_circuito);
          this.frm.controls['carrera2'].setValue(res[1].id_circuito);
          this.frm.controls['carrera3'].setValue(res[2].id_circuito);
        }else{
          Swal.fire({
            title: "Torneo no existente",
            icon: "error"
          });
          this._router.navigate(['/toursCrud']) //Cargar el componente crud
        }
      }
    )
  }

  /**
   * @description Método empelado para cargar todos los circuitos. Para poder seleccionarlos en los select
   */

  cargarCircuitos(){
    this.serv_circuito.getCircuitos().subscribe(res=>{
       this.aCircuitos = res;
    })
  }

  /**
   * @description Método empleado para saber si los datos del formulario son para editar o crear.
   */


  comprobarDatos(){
    this.aCarreras.push(this.frm.value.carrera1)
    this.aCarreras.push(this.frm.value.carrera2)
    this.aCarreras.push(this.frm.value.carrera3)
    delete this.frm.value.carrera1
    delete this.frm.value.carrera2
    delete this.frm.value.carrera3
    if (this.idTorneo) {
     this.editarTorneo();
    }else{
      this.crearTorneo();
    }
  }

  /**
   * @description Método empleado para volver hacía atrás
   */

  VolverCrud(){
    this._router.navigate(['/toursCrud']);
  }

  /**
   * @description Método empleado para crear el torneo
   */

  crearTorneo(){
    let imagen = `${this.frm.value.imagen}`
    imagen = imagen.slice(12)
    const torneo:Torneo ={
      nombre: this.frm.value.nombre,
      fecha: this.frm.value.fecha,
      hora:  `${parseInt(this.frm.value.hora.slice(0,2))-2}:${this.frm.value.hora.slice(3,5)}:00`,
      descripcion: this.frm.value.descripcion,
      descripcion_en: this.frm.value.descripcion_en,
      imagen: imagen,
    }
    this.serv_torneo.addTorneo(torneo).subscribe(
      res=>{
        if (res) {
          this.crearCarrerasTorneo()
          this.frm.reset(); //Limpiar formulario
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
   * @description Método empleado para editar el torneo
   */

  editarTorneo(){
    let imagen = `${this.frm.value.imagen}`
    imagen = imagen.slice(12)
    const torneo:Torneo ={
      nombre: this.frm.value.nombre,
      fecha: this.frm.value.fecha,
      hora: `${parseInt(this.frm.value.hora.slice(0,2))-2}:${this.frm.value.hora.slice(3,5)}:00`,
      descripcion: this.frm.value.descripcion,
      descripcion_en: this.frm.value.descripcion_en,
      imagen: imagen,
    }
    this.serv_torneo.updateTorneo(torneo,this.idTorneo).subscribe(
      res=>{
        if (res) {
          this.editarCarrerasTorneo()
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
   * @description Método empleado para crear las carreras del torneo a crear
   */

  crearCarrerasTorneo(){
    this.serv_torneo.getTorneoNombre(this.frm.value.nombre).subscribe(
      res=>{
        if (res) {
         this.torneo.push(res)
          for (let i = 0; i < this.aCarreras.length; i++) {
            const carrera:Carrera = {
              id_torneo: this.torneo[0].id,
              id_circuito: this.aCarreras[i],
            }
            this.serv_carrera.addCarrera(carrera).subscribe(
              res=>{
                if (!res) {
                  Swal.fire({
                    title: "Ha habido algún error al añadir la carrera",
                    icon: "error"
                  });
                }
              }
            )
          }
          let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Torneo creado con exito",
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
        this._router.navigate(['/toursCrud']) //Cargar el componente crud
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "Tournament created successfully",
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
        this._router.navigate(['/toursCrud']) //Cargar el componente crud
    }
  });
          }
        }
      }
    )
  }

   /**
   * @description Método empleado para editar las carreras del torneo a editar
   */

  editarCarrerasTorneo(){
    for (let i = 0; i < this.aCarrerasTorneoId.length; i++) {
      const carrera:Carrera = {
        id_torneo: this.idTorneo,
        id_circuito: this.aCarreras[i],
      }
      this.serv_carrera.updateCarrera(carrera,this.aCarrerasTorneoId[i]).subscribe(
        res=>{
          if (res) {
            let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Torneo actualizado con exito",
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
        this._router.navigate(['/toursCrud']) //Cargar el componente crud
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "Tournament update successfully",
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
        this._router.navigate(['/toursCrud']) //Cargar el componente crud
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
  }

}
