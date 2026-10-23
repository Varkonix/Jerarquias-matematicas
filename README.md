# Jerarquía de Operaciones Aritméticas (PAPOMUDAS / PEMDAS)

Aplicación web interactiva desarrollada en **HTML5, Tailwind CSS y JavaScript Vanilla**, diseñada y optimizada para teléfonos móviles (iOS Safari, Android Chrome), tabletas y computadores.

---

## 🚀 Características Principales

### 1. 📐 Diseño Responsivo y Adaptativo
- **Multiplataforma:** Optimizado para smartphones, iPads/tabletas y pantallas de escritorio.
- **Modern UI & Dark Theme:** Estética moderna en tonos pizarra (`slate-950`), degradados índigo/cian, tarjetas translúcidas y tipografía matemática de alta legibilidad (`Outfit` y `JetBrains Mono`).
- **Respuesta Háptica y Micro-animaciones:** Efectos de pulsación, sacudida visual al errar y confeti al acertar. Respeta `prefers-reduced-motion`.

### 2. 🌐 Sistema de Idiomas (i18n) en Tiempo Real
- Opciones: **Español (Base)** y **English (US)** en el modal de Ajustes.
- **Actualización instantánea:** Cambia títulos, botones, explicaciones, menús, placeholders y contadores sin recargar la página.
- **Transición suave:** Animación de fade de 250 ms con deslizamiento sutil y efecto pulso en el botón activado.
- **Persistencia:** Almacenamiento en `localStorage` (por defecto `'es'`).
- **Formateo numérico:** `Intl.NumberFormat(lang)` y sincronización dinámica de `<html lang="...">`.

### 3. ✏️ Pizarra Táctil (Borrador de Trabajo en Canvas)
- **Banner en cabecera:** Muestra la expresión matemática activa para no perder el contexto del ejercicio.
- **Herramientas de dibujo:**
  - ✏️ **Lápiz:** Trazo a mano alzada con soporte para dedos, lápices táctiles o ratón (PointerEvents de alta precisión).
  - 🧽 **Goma:** Borrado manual sobre el lienzo.
  - ⌨️ **Texto / Símbolos:** Toca cualquier parte del lienzo para abrir un asistente flotante con botones rápidos (`+`, `-`, `×`, `÷`, `=`) e insertar texto nítido.
- **Controles de personalización:**
  - Selector de colores: Azul (`#2563eb`), Rojo (`#dc2626`), Negro/Pizarra (`#0f172a`), Verde (`#16a34a`).
  - Slider de grosor: De 2px a 30px con indicador visual en tiempo real.
  - Deshacer (Undo ↩️) y Rehacer (Redo ↪️).
  - 🧹 **Limpiar Todo:** Borra el lienzo por completo.
- **Persistencia:** Conserva los cálculos mientras se trabaje en el mismo ejercicio.
- **Comprobación directa:** Incluye campo de respuesta y botón **"Comprobar"** en el pie de la pizarra para responder sin salir de ella.

### 4. 🎯 Niveles de Dificultad y Explicación Paso a Paso
- **Fácil:** Operaciones de 3 números sin paréntesis (evalúa precedencia de multiplicación y división frente a suma y resta).
- **Medio:** Operaciones con paréntesis simples que alteran la prioridad natural.
- **Avanzado:** Operaciones combinadas completas con paréntesis, multiplicación, división, adición y sustracción.
- **Generador Inteligente:** Siempre produce divisiones enteras exactas y resultados enteros positivos.
- **💡 Ver Paso a Paso:** Modal explicativo que desglosa la resolución paso a paso aplicando la regla PAPOMUDAS / PEMDAS en el idioma activo.

### 5. ⌨️ Modos de Entrada
- **Teclado Táctil:** Teclado numérico virtual flotante en pantalla con dígitos (0-9), signo negativo (-), borrar carácter (⌫), limpiar (C) y enviar (OK).
- **Teclado Móvil:** Entrada con el teclado numérico nativo del sistema operativo del dispositivo.

### 6. 📊 Estadísticas Persistentes (`localStorage`)
- **Aciertos Totales**, **Racha Actual (🔥)**, **Mejor Racha** y **Errores Totales**.
- **Al fallar:** Suma +1 a errores, resetea la racha y mantiene el mismo ejercicio intacto (conservando los trazos de la pizarra).
- **Al acertar:** Suma acierto y racha, lanza confeti, emite sonido triunfal y vacía la pizarra automáticamente para el nuevo ejercicio.
- **Gestión de datos:** Opción para reiniciar estadísticas desde Ajustes.

### 7. 📲 PWA y Funcionamiento 100% Offline
- `manifest.json` configurado para instalación como aplicación web independiente.
- `sw.js` (Service Worker) que pre-cachea todos los recursos, permitiendo su uso completo sin conexión a Internet.
- Audio sintetizado en tiempo real con Web Audio API (sin archivos `.mp3` externos que puedan fallar sin red).

---

## 📁 Estructura del Proyecto

```
matematicas juego/
├── index.html          # Interfaz principal, modales y maquetación responsiva
├── manifest.json       # Manifiesto PWA para instalación en dispositivos
├── sw.js               # Service Worker para funcionamiento offline
├── server.js           # Servidor local Node.js de desarrollo
├── css/
│   └── styles.css      # Estilos personalizados, animaciones y soporte touch
├── js/
│   ├── app.js          # Controlador principal del juego y eventos
│   ├── i18n.js         # Diccionarios bilingües y motor de traducción
│   ├── math-engine.js  # Generador de ejercicios y solucionador paso a paso
│   ├── whiteboard.js   # Motor del canvas, herramientas y persistencia
│   ├── audio.js        # Sintetizador de audio con Web Audio API
│   └── confetti.js     # Motor de partículas de confeti autónomo
└── icons/
    └── favicon.svg     # Icono vectorial escalable y favicon de la app
```

---

## 🏃‍♂️ Cómo Ejecutar la Aplicación

1. **Abrir directamente:**
   Puedes abrir el archivo [index.html](file:///d:/Nexusbyte/matematicas%20juego/index.html) en cualquier navegador web moderno (Chrome, Safari, Edge, Firefox).

2. **Ejecutar con el servidor local:**
   ```bash
   node server.js
   ```
   Y acceder en tu navegador a:
   [http://localhost:3000](http://localhost:3000)
