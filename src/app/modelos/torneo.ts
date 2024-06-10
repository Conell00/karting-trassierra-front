
export interface Torneo {
    id?:number,
    nombre:string,
    fecha:Date,
    hora:string,
    descripcion:string,
    descripcion_en:string
    imagen:string
}

export interface getTorneo {
    id:number,
    nombre:string,
    fecha:Date,
    hora:string,
    descripcion:string,
    descripcion_en:string
    imagen:string
}