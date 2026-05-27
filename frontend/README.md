# Sistema Inteligente de Monitoreo TI – Frontend

##  Descripción

Este módulo corresponde al **Frontend** del Sistema Inteligente de Monitoreo TI diseñado para el **Hospital Universitario San Rafael de Tunja**.

La plataforma proporciona una interfaz gráfica moderna y centralizada para supervisar la infraestructura tecnológica, gestionar alertas y visualizar métricas en tiempo real.

Realizado por : Paula Sofia Barreto Moncada, Sebastian Felipe Vargas Quintero, Samuel Oswaldo Avellaneda Guevara, Fabian Isaac Moreno Lopez

---

##  Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (Versión 18 o superior recomendada)
- **Gestor de paquetes:** npm o pnpm
- **Editor de código:** Visual Studio Code (Recomendado)

Verificar instalaciones:

```bash
node -v
npm -v
```

---

#  Instalación e Inicialización

## Paso 1. Ubicación del Proyecto

Abrir la carpeta del proyecto en el editor o ubicarse desde la terminal:

```bash
cd ProyectoIntegrador/frontend
```

---

## Paso 2. Instalar Dependencias

Al descargar o clonar el proyecto, la carpeta `node_modules` no está incluida.

Antes de inicializar el sistema se deben instalar todas las librerías necesarias.

### Opción A — Con npm

```bash
npm install
```

### Opción B — Con pnpm

```bash
pnpm install
```

> **Nota:** Este proceso generará automáticamente la carpeta:

```plaintext
node_modules/
```

La carpeta `node_modules` contiene todas las dependencias necesarias para el funcionamiento del sistema.

---

## Paso 3. Configuración de Variables de Entorno (.env) ⚠️

Por razones de seguridad, el archivo `.env` no debe subirse al repositorio (debe estar agregado al `.gitignore`).

Crear un archivo llamado:

```plaintext
frontend/.env
```

Definir las variables necesarias para la conexión con el backend.

Ejemplo:

```env
VITE_API_URL=http://localhost:5000
```

---

## Paso 4. Inicializar el Proyecto

Una vez instaladas las dependencias, ejecutar:

### Con npm

```bash
npm run dev
```

### Con pnpm

```bash
pnpm run dev
```

El sistema estará disponible normalmente en:

```plaintext
http://localhost:5173/
```

---

#  Estructura del Proyecto

```plaintext
ProyectoIntegrador
├─ frontend
│
├─ node_modules/      # Dependencias instaladas automáticamente
├─ public/            # Archivos estáticos, iconos y favicon
│
├─ src/
│
│  ├─ animations/     # Lógica de animaciones
│  ├─ assets/         # Recursos gráficos (icons e images)
│  ├─ components/     # Componentes reutilizables
│  ├─ context/        # Gestión del estado global
│  ├─ layouts/        # Estructura general del sistema
│  ├─ pages/          # Vistas principales
│  ├─ routes/         # Configuración de rutas
│  ├─ styles/         # Estilos CSS organizados por módulos
│  ├─ App.jsx         # Componente principal
│  └─ main.jsx        # Punto de entrada
│
├─ .env               # Variables de entorno
├─ package.json       # Dependencias y scripts
├─ vite.config.js     # Configuración de Vite
└─ README.md
```

---

#  Pantallazos del Sistema

En esta sección se visualiza el diseño del sistema.

#  Pantallazos del Sistema

En esta sección se visualiza el diseño del sistema.

## Home

![Home](docs/image-1.png)

---

##  Inicio de Sesión

![Inicio de Sesión](docs/image-2.png)

---

##  Dashboard Principal

![Dashboard](docs/image-3.png)

![Dashboard](docs/image-4.png)

---

##  Gestión de Dispositivos

![Gestión de Dispositivos](docs/image-5.png)

![Gestión de Dispositivos](docs/image-6.png)

![Gestión de Dispositivos](docs/image-7.png)

![Gestión de Dispositivos](docs/image-8.png)

![Gestión de Dispositivos](docs/image-9.png)

![Gestión de Dispositivos](docs/image-10.png)

---

##  Alertas

![Alertas](docs/image-11.png)

![Alertas](docs/image-12.png)

![Alertas](docs/image-13.png)

![Alertas](docs/image-14.png)

---

##  Métricas

![Métricas](docs/image-15.png)

![Métricas](docs/image-16.png)

![Métricas](docs/image-17.png)

![Métricas](docs/image-18.png)

![Métricas](docs/image-19.png)

![Métricas](docs/image-20.png)

![Métricas](docs/image-21.png)

---

##  Usuarios

![Usuarios](docs/image-22.png)

![Usuarios](docs/image-23.png)

---

##  Locaciones

![Locaciones](docs/image-24.png)

![Locaciones](docs/image-25.png)

---

#  Observaciones

### Seguridad

El archivo `.env` es de uso interno.  
Si trabajas en equipo, solicita los valores de las variables al administrador del sistema.

### Mantenimiento

Si el proyecto presenta errores relacionados con librerías o dependencias:

```bash
rm -rf node_modules
npm install
```

### Estilos

Se utiliza **CSS puro** organizado por módulos dentro de:

```plaintext
src/styles
```

Esto permite mantener una estructura visual más limpia y reducir conflictos entre estilos.


