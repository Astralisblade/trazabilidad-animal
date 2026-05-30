import React, { useState } from 'react';

function RegistrarAnimal({ onRegistrado }) {
  const [form, setForm] = useState({
    arete_id: '',
    especie: '',
    raza: '',
    fecha_nacimiento: '',
    sexo: true,
    propietario_id: '',
  });
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'sexo' ? value === 'true' : value });
  };

  const handleSubmit = () => {
    if (!form.arete_id || !form.especie) {
      setMensaje({ tipo: 'error', texto: 'Arete ID y especie son obligatorios' });
      return;
    }

    setLoading(true);
    fetch('/.netlify/functions/animales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        propietario_id: form.propietario_id ? parseInt(form.propietario_id) : null,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.error) {
          setMensaje({ tipo: 'error', texto: 'Error: ' + data.error });
        } else {
          setMensaje({ tipo: 'success', texto: '✅ Animal registrado correctamente' });
          setTimeout(() => onRegistrado(), 1500);
        }
        setLoading(false);
      })
      .catch(() => {
        setMensaje({ tipo: 'error', texto: 'Error al conectar con el servidor' });
        setLoading(false);
      });
  };

  return (
    <div className="card">
      <h2>➕ Registrar Nuevo Animal</h2>

      {mensaje && (
        <div className={mensaje.tipo === 'error' ? 'error' : 'success'}>
          {mensaje.texto}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>Arete ID *</label>
          <input
            type="text"
            name="arete_id"
            placeholder="Ej: EC-009-2024"
            value={form.arete_id}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Especie *</label>
          <select name="especie" value={form.especie} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            <option>Bovino</option>
            <option>Ovino</option>
            <option>Porcino</option>
            <option>Caprino</option>
            <option>Equino</option>
          </select>
        </div>

        <div className="form-group">
          <label>Raza</label>
          <input
            type="text"
            name="raza"
            placeholder="Ej: Holstein"
            value={form.raza}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sexo</label>
          <select name="sexo" value={form.sexo} onChange={handleChange}>
            <option value="true">♂ Macho</option>
            <option value="false">♀ Hembra</option>
          </select>
        </div>

        <div className="form-group">
          <label>ID Propietario</label>
          <input
            type="number"
            name="propietario_id"
            placeholder="Ej: 1"
            value={form.propietario_id}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        className="btn btn-success"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '⏳ Guardando...' : '💾 Registrar Animal'}
      </button>
    </div>
  );
}

export default RegistrarAnimal;