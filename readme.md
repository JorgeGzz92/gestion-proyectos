# Sistema de Gestión de Proyectos

Aplicación web full stack para la gestión de proyectos, tareas y equipos de trabajo,
destinada a equipos de desarrollo de software. Incluye comunicación en tiempo real
para la sincronización de tareas entre usuarios conectados.

## Tecnologías utilizadas

- **Front-end:** React 18 + Vite, React Router DOM, Axios, Socket.io-client
- **Back-end:** Node.js + Express, Mongoose, Socket.io, dotenv, cors
- **Base de datos:** MongoDB (MongoDB Atlas)
- **Control de versiones:** Git + GitHub (feature branching: main / develop / feature/*)
- **Hosting:** Vercel (front-end) + Render (back-end) + MongoDB Atlas (base de datos)

## Estructura del proyecto

gestion-proyectos/
├── client/                  # Front-end (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables (Card, StatusBadge)
│   │   ├── pages/           # Vistas (Projects, ProjectDetail, Users)
│   │   ├── services/        # Conexión a la API (api.js) y sockets (socket.js)
│   │   ├── App.jsx          # Rutas de la aplicación
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Back-end (Node + Express)
│   ├── src/
│   │   ├── models/          # Esquemas de MongoDB (User, Project, Task)
│   │   ├── routes/          # Endpoints de la API
│   │   ├── controllers/     # Lógica de cada endpoint
│   │   ├── config/          # Conexión a la base de datos
│   │   ├── socket.js        # Configuración de Socket.io
│   │   └── index.js         # Punto de entrada del servidor
│   └── package.json
│
└── README.md

