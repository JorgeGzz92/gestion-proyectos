import { useState, useEffect, useRef } from 'react';
import socket from '../services/socket';

function Chat({ proyectoId, nombreUsuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const finRef = useRef(null);

   useEffect(() => {
    socket.emit('unirse-proyecto', proyectoId); // pedimos el historial al entrar

    socket.on('historial-chat', (historial) => {
      setMensajes(historial);
    });

    socket.on('chat-message', (data) => {
      if (data.proyectoId === proyectoId) {
        setMensajes((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('chat-message');
      socket.off('historial-chat');
    };
  }, [proyectoId]);

  useEffect(() => {
    // Scroll automatico al ultimo mensaje
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  function enviarMensaje(e) {
    e.preventDefault();
    if (!texto.trim()) return;

    const nuevoMensaje = {
      proyectoId,
      autor: nombreUsuario || 'Anónimo',
      texto,
      hora: new Date().toLocaleTimeString(),
    };

    socket.emit('chat-message', nuevoMensaje);
    setTexto('');
  }

  return (
    <div className="card">
      <h3>Chat del proyecto</h3>

      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
        {mensajes.length === 0 && <p style={{ opacity: 0.6, fontSize: '13px' }}>No hay mensajes todavía.</p>}
        {mensajes.map((m, i) => (
          <p key={i} style={{ fontSize: '14px', marginBottom: '4px' }}>
            <strong>{m.autor}</strong> <span style={{ opacity: 0.6, fontSize: '11px' }}>{m.hora}</span>: {m.texto}
          </p>
        ))}
        <div ref={finRef} />
      </div>

      <form onSubmit={enviarMensaje} style={{ flexDirection: 'row', display: 'flex', gap: '8px', margin: 0, padding: 0, background: 'transparent' }}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;