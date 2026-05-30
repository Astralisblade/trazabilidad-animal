import React, { useState, useEffect } from 'react';

function Eventos({ animal }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    tipo_evento: '',
    descripcion: '',
    ubicacion: '',
    responsable: '',
    fecha_evento: new Date().toISOString().slice(0, 16),
  });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarEventos();
  }, [animal]);

  const cargarEventos = () => {
    setLoading(true);
    fetch(`/.netlify/functions/eventos?animal_id=${animal.id}`)
      .then(res => res.json())
      .then(data => {
        setEventos(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar eventos');
        setLoading(false);
      });
  };

  const handleRegistrar = () => {
    if (!nuevoEvento.tipo_evento || !nuevoEvento.fecha_evento) {
      setMensaje({ tipo: 'error', texto: 'Tipo de evento y fecha son obligatorios' });
      return;
    }

    fetch('/.netlify/functions/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...nuevoEvento, animal_id: animal.id }),
    })
      .then(res => res.json())
      .then(() => {
        setMensaje({ tipo: 'success', texto: '✅ Evento registrado correctamente' });
        setMostrarFormulario(false);
        setNuevoEvento({
          tipo_evento: '',
          descripcion: '',
          ubicacion: '',
          responsable: '',
          fecha_evento: new Date().toISOString().slice(0, 16),
        });
        cargarEventos();
      })
      .catch(() => {
        setMensaje({ tipo: 'error', texto: 'Error al registrar el evento' });
      });
  };

  if (loading) return <div className="loading">⏳ Cargando eventos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="card">
        <h2>📋 Trazabilidad — {animal.arete_id} ({animal.especie} / {animal.raza})</h2>

        {mensaje && (
          <div className={mensaje.tipo === 'error' ? 'error' : 'success'}>
            {mensaje.texto}
          </div>
        )}

        <button
          className="btn btn-success"
          style={{ marginBottom: '20px' }}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cancelar' : '➕ Registrar Nuevo Evento'}
        </button>

        {mostrarFormulario && (
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', color: '#1a5276' }}>Nuevo Evento</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Tipo de Evento *</label>
                <select
                  value={nuevoEvento.tipo_evento}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, tipo_evento: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  <option>Vacunación</option>
                  <option>Pesaje</option>
                  <option>Control sanitario</option>
                  <option>Cambio de propietario</option>
                  <option>Esquila</option>
                  <option>Parto</option>
                  <option>Tratamiento médico</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha del Evento *</label>
                <input
                  type="datetime-local"
                  value={nuevoEvento.fecha_evento}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, fecha_evento: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej: Riobamba"
                  value={nuevoEvento.ubicacion}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, ubicacion: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Responsable</label>
                <input
                  type="text"
                  placeholder="Ej: Dr. López"
                  value={nuevoEvento.responsable}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, responsable: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Vacuna contra fiebre aftosa, dosis 2ml"
                  value={nuevoEvento.descripcion}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                />
              </div>
            </div>
            <button className="btn btn-success" onClick={handleRegistrar}>
              💾 Guardar Evento
            </button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo de Evento</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#7f8c8d' }}>Sin eventos registrados</td></tr>
            ) : (
              eventos.map(evento => (
                <tr key={evento.id}>
                  <td>{new Date(evento.fecha_evento).toLocaleDateString('es-EC')}</td>
                  <td><span className="tag">{evento.tipo_evento}</span></td>
                  <td>{evento.descripcion || '—'}</td>
                  <td>{evento.ubicacion || '—'}</td>
                  <td>{evento.responsable || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Eventos;