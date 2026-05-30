import React, { useState } from 'react';
import Animales from './components/Animales';
import Eventos from './components/Eventos';
import RegistrarAnimal from './components/RegistrarAnimal';
import './App.css';

function App() {
  const [vista, setVista] = useState('animales');
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1>🐄 Sistema de Trazabilidad Animal</h1>
        <p>ESPOCH — Computación en la Nube | Netlify + Supabase</p>
      </header>

      <nav className="nav">
        <button
          className={vista === 'animales' ? 'active' : ''}
          onClick={() => setVista('animales')}
        >
          🐾 Animales
        </button>
        <button
          className={vista === 'registrar' ? 'active' : ''}
          onClick={() => setVista('registrar')}
        >
          ➕ Registrar Animal
        </button>
        {animalSeleccionado && (
          <button
            className={vista === 'eventos' ? 'active' : ''}
            onClick={() => setVista('eventos')}
          >
            📋 Eventos de {animalSeleccionado.arete_id}
          </button>
        )}
      </nav>

      <main className="main">
        {vista === 'animales' && (
          <Animales
            onVerEventos={(animal) => {
              setAnimalSeleccionado(animal);
              setVista('eventos');
            }}
          />
        )}
        {vista === 'registrar' && (
          <RegistrarAnimal onRegistrado={() => setVista('animales')} />
        )}
        {vista === 'eventos' && animalSeleccionado && (
          <Eventos animal={animalSeleccionado} />
        )}
      </main>
    </div>
  );
}

export default App;