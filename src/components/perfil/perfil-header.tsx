import { ArrowLeft } from "lucide-react"

export const PerfilHeader = () => {
    return(
        // 1. Usa 'relative' para que el 'after' se posicione respecto a esta sección.
        // 2. Agrega las clases de 'after:' para darle la apariencia de una barra.
        <section className="flex gap-5 p-4 items-center relative 
                           after:content-[''] after:absolute after:bottom-0 
                           after:left-0 after:h-[1px] after:w-full 
                           after:bg-black">
            
            <button className="bg-white hover:bg-gray-200 hover:cursor-pointer 
                               rounded-2xl w-10 h-10 flex justify-center items-center transition-all">  
                {/* Nota: En Tailwind, el tamaño y color del icono se controlan con clases de texto, no con atributos 'text-2xl font-bold' */}
                <ArrowLeft className="text-emerald-400 text-2xl font-bold"></ArrowLeft>
            </button>
            
            <h1 className="font-mono font-bold text-2xl">Mi cuenta</h1>
        </section>
    )
}