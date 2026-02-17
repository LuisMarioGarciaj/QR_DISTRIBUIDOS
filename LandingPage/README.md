# Sistema de Patrullaje QR - Landing Page

Landing page moderna y responsiva para el Sistema Inteligente de Patrullaje con Control QR.

## 🚀 Características

- ✅ Hero Section con título impactante y CTAs
- ✅ Propuesta de valor con 3 pilares principales
- ✅ Flujo del sistema explicado paso a paso
- ✅ Beneficios clave del servicio
- ✅ Métricas en tiempo real (simuladas con mock API)
- ✅ Explicación técnica de entidades del sistema
- ✅ Proceso de adquisción en 5 pasos
- ✅ Footer con información de contacto
- ✅ Diseño completamente responsivo
- ✅ Animaciones suaves con Framer Motion
- ✅ Todo el contenido en español

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **Vite 7** - Build tool y dev server
- **Tailwind CSS 4** - Estilos y diseño responsivo
- **Framer Motion** - Animaciones fluidas
- **React Icons** - Iconografía
- **gh-pages** - Despliegue automático

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <your-repo-url>
cd LandingPage

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🌐 Despliegue en GitHub Pages

### Paso 1: Configurar el repositorio

1. Crea un repositorio en GitHub llamado `LandingPage`
2. Sube el proyecto:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<TU-USUARIO>/LandingPage.git
git push -u origin main
```

### Paso 2: Actualizar configuración

Edita `package.json` y reemplaza `<USERNAME>` con tu usuario de GitHub:

```json
"homepage": "https://<TU-USUARIO>.github.io/LandingPage"
```

### Paso 3: Desplegar

```bash
npm run deploy
```

Este comando:
- Construye el proyecto (`npm run build`)
- Despliega automáticamente a GitHub Pages (`gh-pages -d dist`)

### Paso 4: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: selecciona la rama `gh-pages`
4. Guarda los cambios

Tu sitio estará disponible en: `https://<TU-USUARIO>.github.io/LandingPage`

## 📁 Estructura del Proyecto

```
LandingPage/
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Sección hero principal
│   │   ├── ValueSection.jsx  # Propuesta de valor
│   │   ├── HowItWorks.jsx    # Flujo del sistema
│   │   ├── Benefits.jsx      # Beneficios del servicio
│   │   ├── Metrics.jsx       # Métricas dinámicas (mock API)
│   │   ├── Entities.jsx      # Entidades técnicas
│   │   ├── Acquisition.jsx   # Proceso de adquisición
│   │   └── Footer.jsx        # Pie de página
│   ├── App.jsx               # Componente principal
│   ├── index.css             # Estilos globales
│   └── main.jsx              # Punto de entrada
├── public/                   # Archivos estáticos
├── tailwind.config.js        # Configuración Tailwind
├── vite.config.js            # Configuración Vite
└── package.json              # Dependencias y scripts
```

## 🎨 Personalización

### Colores

Edita `tailwind.config.js` para cambiar la paleta de colores:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',    // Azul principal
      secondary: '#1e40af',  // Azul secundario
      accent: '#f59e0b',     // Color de acento
    },
  },
}
```

### Datos de Métricas

Para conectar con una API real, edita `src/components/Metrics.jsx`:

```javascript
// Reemplaza el mock con tu endpoint real
const response = await fetch('https://tu-api.com/api/dashboard/metrics');
const data = await response.json();
setMetrics(data);
```

## 📱 Responsividad

El diseño es completamente responsivo con breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta linter
- `npm run deploy` - Despliega a GitHub Pages

## 📄 Licencia

Este proyecto está diseñado para demostración del Sistema de Patrullaje QR.

---

**Desarrollado con ❤️ usando React + Vite + Tailwind CSS**
