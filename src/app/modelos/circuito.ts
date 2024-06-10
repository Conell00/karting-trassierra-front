import { Time } from "@angular/common"

export interface Circuito {
    id?:number,
    distancia: number,
    nombre:string,
    localizacion: string,
    imagen:string,
    imagen_trazado:string
    descripcion:string,
    descripcion_en:string
}