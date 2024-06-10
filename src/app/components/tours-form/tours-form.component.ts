import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      fecha:['',[Validators.required]],
      hora:['',[Validators.required]],
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

  cargarCircuitos(){
    this.serv_circuito.getCircuitos().subscribe(res=>{
       this.aCircuitos = res;
       console.log('Circuitos', this.aCircuitos);
    })
  }


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

  VolverCrud(){
    this._router.navigate(['/toursCrud']);
  }

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

  editarTorneo(){
    let imagen = `${this.frm.value.imagen}`
    console.log('fecha', this.frm.value.fecha);
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

  crearCarrerasTorneo(){
    this.serv_torneo.getTorneoNombre(this.frm.value.nombre).subscribe(
      res=>{
        if (res) {
         this.torneo.push(res)
         console.log('hola', this.torneo);
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
    /* Read more about handling dismissals below */
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
    /* Read more about handling dismissals below */
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
    /* Read more about handling dismissals below */
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
    /* Read more about handling dismissals below */
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
