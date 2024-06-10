export interface Usuario {
    id?:number,
    nombre:string,
    email:string,
    contra?:string
    rol:string,
    torneos_ganados?:number
    puntos?:number
    podios?:number
    carreras_ganadas?:number
}

export interface getUsuario {
    id:number,
    nombre:string,
    email:string,
    contra:string
    rol:string,
    torneos_ganados:number
    puntos:number
    podios:number
    carreras_ganadas:number
}
