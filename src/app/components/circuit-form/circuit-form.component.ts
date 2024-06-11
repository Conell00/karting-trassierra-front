import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CircuitoService } from '../../servicios/circuito.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../servicios/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { Circuito } from '../../modelos/circuito';

@Component({
  selector: 'app-circuit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './circuit-form.component.html',
  styleUrl: './circuit-form.component.css'
})
export class CircuitFormComponent implements OnInit {
  private serv_usuarios = inject(UsuarioService);
  private serv_circuito = inject(CircuitoService);
  private _router=inject(Router);
  private _activedRouter=inject(ActivatedRoute);
  private cookies = inject(CookieService)
  frm!:FormGroup
  private idCircuito!:number;
  textoBoton!:string;
  idioma!:string
  constructor(private fb:FormBuilder){}
  ngOnInit(): void {
    this.idiomaEstablecido()
    this.frm= this.fb.group({
      nombre:['',[Validators.required]],
      localizacion:['',[Validators.required]],
      distancia:['',[Validators.required]],
      imagen:['',[Validators.required, Validators.pattern(/\.(png|jpg)$/i)]],
      imagen_trazado:['',[Validators.required, Validators.pattern(/\.(png|jpg)$/i)]],
      descripcion:['',[Validators.required]],
      descripcion_en:['',[Validators.required]],
    })
    this._activedRouter.params.subscribe(
      params=>{
        this.idCircuito=params['id'];
        if (this.idCircuito) {
          this.cargarCircuito();
          if (this.idioma == 'es') {
            this.textoBoton = 'Editar circuito'
          }else{
            this.textoBoton = 'Edit circuit'
          }
        }else{
          if (this.idioma == 'es') {
            this.textoBoton = 'Añadir circuito'
          }else{
            this.textoBoton = 'Add circuit'
          }
        }
      }
     )
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
   * Getters
   */

  get nombre(){
    return this.frm.get('nombre') as FormControl
  }
  get localizacion(){
    return this.frm.get('localizacion') as FormControl
  }
  get distancia(){
    return this.frm.get('distancia') as FormControl
  }
  get imagen(){
    return this.frm.get('imagen') as FormControl
  }
  get imagen_trazado(){
    return this.frm.get('imagen_trazado') as FormControl
  }
  get descripcion(){
    return this.frm.get('descripcion') as FormControl
  }
  get descripcion_en(){
    return this.frm.get('descripcion_en') as FormControl
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
 * @description Método empleado para volver hacía atrás
 */

VolverCrud(){
  this._router.navigate(['/circuitsCrud']);

}

/**
 * @description Método empleado para cargar todos los datos del circuito a editar
 */

  cargarCircuito(){
    this.serv_circuito.getCircuito(this.idCircuito).subscribe(
      res=>{
        if (res) {
          //Cargar los datos al formulario
          this.frm.controls['nombre'].setValue(res.nombre);
          this.frm.controls['localizacion'].setValue(res.localizacion);
          this.frm.controls['distancia'].setValue(res.distancia);
          // this.frm.controls['imagen'].setValue(res.imagen);
          // this.frm.controls['imagen_trazado'].setValue(res.imagen_trazado);
          this.frm.controls['descripcion'].setValue(res.descripcion);
          this.frm.controls['descripcion_en'].setValue(res.descripcion_en);
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
   * @description Método empleado para cargar el formulario dependiendo de si es para editar o crear uno nuevo
   */

  comprobarDatos(){
    if (this.idCircuito) {
     this.editarCircuito();
    }else{
      this.crearCircuito();
    }
  }

  /**
   * @description Método empleado para crear nuevo circuito
   */

  crearCircuito(){
    let imagen = `${this.frm.value.imagen}`
    let imagen_trazado = `${this.frm.value.imagen_trazado}`
    imagen = imagen.slice(12)
    imagen_trazado = imagen_trazado.slice(12)
    const circuito:Circuito ={
      nombre: this.frm.value.nombre,
      distancia: this.frm.value.distancia,
      localizacion: this.frm.value.localizacion,
      descripcion: this.frm.value.descripcion,
      descripcion_en: this.frm.value.descripcion_en,
      imagen: imagen,
      imagen_trazado: imagen_trazado
    }
    this.serv_circuito.addCircuit(circuito).subscribe(
      res=>{
        if (res) {
          let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Circuito creado con exito",
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
        this._router.navigate(['/circuitsCrud']) //Cargar el componente crud
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "Circuit created successfully",
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
        this._router.navigate(['/circuitsCrud']) //Cargar el componente crud
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
   * @description Metodo empleado para editar circuito
   */

  editarCircuito(){
    let imagen = `${this.frm.value.imagen}`
    let imagen_trazado = `${this.frm.value.imagen_trazado}`
    imagen = imagen.slice(12)
    imagen_trazado = imagen_trazado.slice(12)
    const circuito:Circuito ={
      nombre: this.frm.value.nombre,
      distancia: this.frm.value.distancia,
      localizacion: this.frm.value.localizacion,
      descripcion: this.frm.value.descripcion,
      descripcion_en: this.frm.value.descripcion_en,
      imagen: imagen,
      imagen_trazado: imagen_trazado
    }
    this.serv_circuito.updateCircuito(circuito, this.idCircuito).subscribe(
      res=>{
        if (res) {
          let timerInterval:number
          if(this.idioma == 'es'){
            Swal.fire({
              position: 'top-end',
              title: "Circuito actualizado con exito",
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
        this._router.navigate(['/circuitsCrud']) //Cargar el componente crud
    }
  });
    }else{
            Swal.fire({
              position: 'top-end',
              title: "Circuit updated successfully",
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
        this._router.navigate(['/circuitsCrud']) //Cargar el componente crud
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
