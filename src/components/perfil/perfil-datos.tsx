import { ButtonPerfil } from "./perfil-button"

interface ClienteDatos {
    nombre:string,
    apellido:string,
    correo:string,
    metodosDePago?:MetodosDePago
}
interface MetodosDePago{
    nombreTitular:string,
    apellidoTitular:string,
    numero:string,
    cvc:string,
    mesVencimiento:string,
    añoVencimiento:string
}
export const PerfilDatos = ({nombre,apellido,correo,metodosDePago}:ClienteDatos)=>{
    return(
        <aside className="flex-col w-[40%] h-1/2 bg-zinc-100 rounded-2xl shadow-md justify-center items-center gap-16 p-4">
            <div className="flex justify-evenly h-24">

                <div>
                    <span className="font-bold">Nombre: </span>
                    <span>{nombre}</span>
                </div>
                <div>
                    <span className="font-bold">Apellido: </span>
                    <span>{apellido}</span>
                </div>
            </div>
            <div className="flex justify-center h-24">
                <span className="font-bold">Correo: </span>
                <span>{correo}</span>
            </div>
            <div className="flex justify-center">
                <ButtonPerfil text="VER METODOS DE PAGO"></ButtonPerfil>
            </div>
        </aside>
    )
}