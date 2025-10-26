import { useState } from "react"
import { Perfil } from "./components/perfil/perfil"
import { BrowserRouter, Route, Routes } from "react-router";
import { DetalleCompra } from "./components/perfil/detalle-compra";
import LoginModal from "./components/login-modal";

export default function App() {

  const clienteId = 7; 
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal de la cuenta */}
        <Route path="/login" element={<LoginModal ></LoginModal>}></Route>
        <Route path="/mi-cuenta" element={<Perfil id={clienteId} />} />
        
        {/* 👈 RUTA NUEVA: Mapea el ID de la compra a DetalleCompra */}
        <Route path="/detalle-compra/:id" element={<DetalleCompra />} /> 
        
        {/* Otras rutas... */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
