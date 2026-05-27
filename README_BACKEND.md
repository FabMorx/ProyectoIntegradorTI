
# Sistema Inteligente de Monitoreo TI – Backend

## 🏥 Descripción

Este módulo corresponde al **Backend** del Sistema Inteligente de Monitoreo TI diseñado para el **Hospital Universitario San Rafael de Tunja**.

La arquitectura está basada en **microservicios desarrollados en Python**, permitiendo gestionar de forma desacoplada la autenticación, dispositivos, métricas, alertas, ubicaciones y usuarios.

Además, se implementa un **Gateway** encargado del acceso centralizado y comunicación entre servicios.

---

# 🛠️ Tecnologías Utilizadas

- Python 3.12 o superior
- Flask
- API Gateway
- Variables de entorno (.env)
- Arquitectura basada en microservicios

---

# 🚀 Instalación e Inicialización

## Paso 1. Ubicación del Proyecto

Ubicarse en la raíz del backend:

```bash
cd hospital-ti-monitoring-main
```

---

## Paso 2. Crear Entorno Virtual (Opcional pero recomendado)

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / Mac:

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Paso 3. Instalar Dependencias

Instalar librerías necesarias:

```bash
pip install -r requirements.txt
```

Verificar instalación:

```bash
pip list
```

---

## Paso 4. Configurar Variables de Entorno

Cada microservicio contiene un archivo:

```plaintext
.env
```

Estos archivos deben configurarse manualmente y **no deben subirse al repositorio**.

Ejemplo:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

## Paso 5. Ejecutar Servicios

Ejemplo Gateway:

```bash
cd backend/gateway
python app.py
```

Ejemplo Auth Service:

```bash
cd backend/auth_service
python app.py
```

Cada microservicio puede iniciarse individualmente.

---

# 📂 Estructura del Proyecto

```plaintext
hospital-ti-monitoring-main
├─ backend
│
├─ gateway/             # Punto central de acceso
├─ auth_service/        # Autenticación
├─ users_service/       # Gestión de usuarios
├─ devices_service/     # Gestión de dispositivos
├─ alerts_service/      # Gestión de alertas
├─ metrics_service/     # Gestión de métricas
├─ locations_service/   # Gestión de ubicaciones
│
├─ requirements.txt     # Dependencias Python
└─ README.md
```

---

# 🔐 Observaciones

### Seguridad

Los archivos `.env` contienen configuración sensible y no deben compartirse.

### Dependencias

Si existen errores:

```bash
pip install -r requirements.txt
```

### Caché Python

Eliminar archivos temporales:

```bash
__pycache__/
```

---

# 📌 Arquitectura

El sistema está construido bajo una arquitectura basada en microservicios donde cada servicio administra una responsabilidad específica y se comunica mediante el Gateway.
```
hospital-ti-monitoring-main
├─ backend
│  ├─ alerts_service
│  │  ├─ .env
│  │  ├─ app.py
│  │  ├─ config.py
│  │  ├─ controllers
│  │  │  ├─ alertsController.py
│  │  │  └─ __pycache__
│  │  │     └─ alertsController.cpython-312.pyc
│  │  ├─ extensions.py
│  │  ├─ middlewares
│  │  │  ├─ auth_middleware.py
│  │  │  └─ __pycache__
│  │  │     └─ auth_middleware.cpython-312.pyc
│  │  ├─ models
│  │  │  ├─ alertsModel.py
│  │  │  ├─ enums.py
│  │  │  └─ __pycache__
│  │  │     ├─ alertsModel.cpython-312.pyc
│  │  │     └─ enums.cpython-312.pyc
│  │  ├─ routes
│  │  │  ├─ alertsRoutes.py
│  │  │  └─ __pycache__
│  │  │     └─ alertsRoutes.cpython-312.pyc
│  │  └─ __pycache__
│  │     ├─ config.cpython-312.pyc
│  │     └─ extensions.cpython-312.pyc
│  ├─ auth_service
│  │  ├─ .env
│  │  ├─ app.py
│  │  ├─ config.py
│  │  ├─ controllers
│  │  │  ├─ auth_controller.py
│  │  │  └─ __pycache__
│  │  │     └─ auth_controller.cpython-312.pyc
│  │  ├─ extensions.py
│  │  ├─ models
│  │  │  ├─ userModel.py
│  │  │  └─ __pycache__
│  │  │     └─ userModel.cpython-312.pyc
│  │  ├─ routes
│  │  │  ├─ auth_routes.py
│  │  │  └─ __pycache__
│  │  │     └─ auth_routes.cpython-312.pyc
│  │  ├─ utils
│  │  │  ├─ jwt_handler.py
│  │  │  └─ __pycache__
│  │  │     └─ jwt_handler.cpython-312.pyc
│  │  └─ __pycache__
│  │     ├─ config.cpython-312.pyc
│  │     └─ extensions.cpython-312.pyc
│  ├─ devices_service
│  │  ├─ .env
│  │  ├─ app.py
│  │  ├─ config.py
│  │  ├─ controllers
│  │  │  ├─ devicesController.py
│  │  │  └─ __pycache__
│  │  │     └─ devicesController.cpython-312.pyc
│  │  ├─ extensions.py
│  │  ├─ middlewares
│  │  │  ├─ auth_middleware.py
│  │  │  └─ __pycache__
│  │  │     └─ auth_middleware.cpython-312.pyc
│  │  ├─ models
│  │  │  ├─ devicesModel.py
│  │  │  ├─ enums.py
│  │  │  └─ __pycache__
│  │  │     ├─ devicesModel.cpython-312.pyc
│  │  │     └─ enums.cpython-312.pyc
│  │  ├─ routes
│  │  │  ├─ devicesRoutes.py
│  │  │  └─ __pycache__
│  │  │     └─ devicesRoutes.cpython-312.pyc
│  │  └─ __pycache__
│  │     ├─ config.cpython-312.pyc
│  │     └─ extensions.cpython-312.pyc
│  ├─ gateway
│  │  ├─ .env
│  │  ├─ app.py
│  │  ├─ config.py
│  │  └─ __pycache__
│  │     └─ config.cpython-312.pyc
│  ├─ locations_service
│  │  ├─ .env
│  │  ├─ app.py
│  │  ├─ config.py
│  │  ├─ controllers
│  │  │  ├─ locationsController.py
│  │  │  └─ __pycache__
│  │  │     └─ locationsController.cpython-312.pyc
│  │  ├─ extensions.py
│  │  ├─ middlewares
│  │  │  ├─ auth_middleware.py
│  │  │  └─ __pycache__
│  │  │     └─ auth_middleware.cpython-312.pyc
│  │  ├─ models
│  │  │  ├─ locationsModel.py
│  │  │  └─ __pycache__
│  │  │     └─ locationsModel.cpython-312.pyc
│  │  ├─ routes
│  │  │  ├─ locationsRoutes.py
│  │  │  └─ __pycache__
│  │  │     └─ locationsRoutes.cpython-312.pyc
│  │  └─ __pycache__
│  │     ├─ config.cpython-312.pyc
│  │     └─ extensions.cpython-312.pyc
│  ├─ metrics_service
│  │  ├─ .env
│  │  ├─ app.py
│  │  ├─ config.py
│  │  ├─ controllers
│  │  │  ├─ metricsController.py
│  │  │  └─ __pycache__
│  │  │     └─ metricsController.cpython-312.pyc
│  │  ├─ extensions.py
│  │  ├─ middlewares
│  │  │  ├─ auth_middleware.py
│  │  │  └─ __pycache__
│  │  │     └─ auth_middleware.cpython-312.pyc
│  │  ├─ models
│  │  │  ├─ metricsModel.py
│  │  │  └─ __pycache__
│  │  │     └─ metricsModel.cpython-312.pyc
│  │  ├─ routes
│  │  │  ├─ metricRoutes.py
│  │  │  └─ __pycache__
│  │  │     └─ metricRoutes.cpython-312.pyc
│  │  └─ __pycache__
│  │     ├─ config.cpython-312.pyc
│  │     └─ extensions.cpython-312.pyc
│  └─ users_service
│     ├─ .env
│     ├─ app.py
│     ├─ config.py
│     ├─ controllers
│     │  ├─ usersController.py
│     │  └─ __pycache__
│     │     └─ usersController.cpython-312.pyc
│     ├─ extensions.py
│     ├─ middlewares
│     │  ├─ auth_middleware.py
│     │  └─ __pycache__
│     │     └─ auth_middleware.cpython-312.pyc
│     ├─ models
│     │  ├─ usersModel.py
│     │  └─ __pycache__
│     │     └─ usersModel.cpython-312.pyc
│     ├─ routes
│     │  ├─ usersRoutes.py
│     │  └─ __pycache__
│     │     └─ usersRoutes.cpython-312.pyc
│     └─ __pycache__
│        ├─ config.cpython-312.pyc
│        └─ extensions.cpython-312.pyc
├─ LICENSE
└─ requirements.txt

```