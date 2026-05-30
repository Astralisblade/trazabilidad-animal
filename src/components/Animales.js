import React, { useState, useEffect } from 'react';

function Animales({ onVerEventos }) {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/.netlify/functions/animales')
      .then(res => res.json())
      .then(data => {
        setAnimales(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los animales');
        setLoading(false);
      });
  }, []);

  const getBadgeClass = (especie) => {
    const e = especie?.toLowerCase();
    if (e === 'bovino') return 'badge badge-bovino';
    if (e === 'ovino') return 'badge badge-ovino';
    if (e === 'porcino') return 'badge badge-porcino';
    return 'badge badge-bovino';
  };

  if (loading) return <div className="loading">⏳ Cargando animales desde Supabase...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <h2>🐾 Registro de Animales ({animales.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Arete ID</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Fecha Nacimiento</th>
            <th>Sexo</th>
            <th>Propietario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {animales.map(animal => (
            <tr key={animal.id}>
              <td><strong>{animal.arete_id}</strong></td>
              <td><span className={getBadgeClass(animal.especie)}>{animal.especie}</span></td>
              <td>{animal.raza}</td>
              <td>{animal.fecha_nacimiento}</td>
              <td>{animal.sexo ? '♂ Macho' : '♀ Hembra'}</td>
              <td>{animal.propietarios?.nombre || '—'}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => onVerEventos(animal)}
                >
                  📋 Ver Trazabilidad
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Animales;