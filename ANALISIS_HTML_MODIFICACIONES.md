# Análisis de Modificaciones HTML para Funciones Personalizadas

## Archivos Involucrados

### 1. `index.html` - Archivo Principal
**Ubicación**: Raíz del proyecto
**Función**: Contiene toda la estructura HTML de la aplicación

## Variables y Elementos HTML Utilizados

### A. Dropdown de Activación Original
```html
<div class="control ui-activation">
  <label for="activations">Activation</label>
  <div class="select">
    <select id="activations">
      <option value="relu">ReLU</option>
      <option value="tanh">Tanh</option>
      <option value="sigmoid">Sigmoid</option>
      <option value="linear">Linear</option>
      <option value="custom">Custom</option>  <!-- ← AGREGADO -->
    </select>
  </div>
</div>
```

**Variables clave**:
- `id="activations"` - Selector principal para JavaScript
- `value="custom"` - Valor que activa la interfaz personalizada

### B. Nueva Interfaz de Función Personalizada
```html
<div class="control ui-custom-activation" style="display: none;">
  <label for="custom-function">f(x) =</label>
  <input type="text" id="custom-function" placeholder="Math.sin(x)">
  
  <label for="custom-derivative">f'(x) =</label>
  <input type="text" id="custom-derivative" placeholder="Math.cos(x)">
  
  <div style="margin-top: 10px; font-size: 11px; color: #999;">
    <strong>Ejemplos:</strong><br>
    • Swish: x/(1+Math.exp(-x)) | Math.exp(-x)*(x+Math.exp(-x)+1)/Math.pow(1+Math.exp(-x),2)<br>
    • Seno: Math.sin(x) | Math.cos(x)<br>
    • Leaky ReLU: Math.max(0.1*x,x) | x>0?1:0.1
  </div>
</div>
```

**Variables clave**:
- `class="ui-custom-activation"` - Clase CSS para mostrar/ocultar
- `id="custom-function"` - Input para la función f(x)
- `id="custom-derivative"` - Input para la derivada f'(x)
- `style="display: none;"` - Inicialmente oculto

## Flujo de Integración HTML

### 1. Estructura Jerárquica
```
#top-controls (contenedor principal)
  └── .container (layout flexbox)
      └── .control.ui-activation (dropdown original)
      └── .control.ui-custom-activation (nueva interfaz)
```

### 2. Clases CSS Utilizadas
- `.control` - Estilo base para controles
- `.ui-activation` - Identificador para el dropdown
- `.ui-custom-activation` - Identificador para campos personalizados
- `.select` - Estilo para el dropdown

### 3. IDs JavaScript
- `#activations` - Dropdown principal
- `#custom-function` - Campo de función
- `#custom-derivative` - Campo de derivada

## Estilos CSS Aplicados

### A. Estilos Inline (en HTML)
```css
/* Para el contenedor */
style="display: none; margin-left: 30px; margin-top: 6px;"

/* Para labels */
style="color: #777; font-size: 13px; display: block; margin-bottom: 6px;"

/* Para inputs */
style="width: 100%; padding: 6px 0; border: none; border-bottom: 1px solid #ccc; font-size: 14px;"
```

### B. Estilos en `styles.css`
```css
#top-controls .control input[type="text"] {
  -webkit-appearance: none;
  border-bottom: solid 1px #ccc;
  /* ... más estilos ... */
}

#top-controls .control input[type="text"]:focus {
  border-bottom-color: #183D4E;
}
```

## Variables de Estado Relacionadas

### En JavaScript (playground.ts)
```javascript
// Variables que interactúan con el HTML
let customDiv = d3.select(".ui-custom-activation");     // Contenedor
let customFnInput = d3.select("#custom-function");     // Input función
let customDerInput = d3.select("#custom-derivative");  // Input derivada
```

### En State Management
```javascript
// En state.ts
state.activation = activations["custom"];  // Función seleccionada
```

## Eventos HTML → JavaScript

### 1. Cambio en Dropdown
```javascript
d3.select("#activations").on("change", function() {
  if (this.value === "custom") {
    customDiv.style("display", "block");  // Muestra interfaz
  } else {
    customDiv.style("display", "none");   // Oculta interfaz
  }
});
```

### 2. Input en Campos de Texto
```javascript
d3.select("#custom-function").on("input", updateCustomActivation);
d3.select("#custom-derivative").on("input", updateCustomActivation);
```

## Flujo Completo HTML → JavaScript

```
1. Usuario selecciona "Custom" en dropdown
   ↓
2. HTML: <select id="activations"> value="custom"
   ↓
3. JavaScript: detecta cambio → muestra .ui-custom-activation
   ↓
4. Usuario escribe en inputs
   ↓
5. HTML: <input id="custom-function"> y <input id="custom-derivative">
   ↓
6. JavaScript: lee valores → crea función → actualiza red
```

## Responsividad y Layout

### Flexbox Container
```html
<div class="container l--page">  <!-- Layout principal -->
  <div class="timeline-controls">  <!-- Controles de tiempo -->
  <div class="control">           <!-- Cada control individual -->
```

### Adaptación Mobile
- Los controles se apilan verticalmente en pantallas pequeñas
- Los inputs mantienen su ancho completo (width: 100%)
- Los estilos se adaptan automáticamente

## Accesibilidad

### Labels Asociados
```html
<label for="custom-function">f(x) =</label>
<input type="text" id="custom-function">
```

### Placeholders Informativos
```html
placeholder="Math.sin(x)"
placeholder="Math.cos(x)"
```

### Ejemplos Visuales
- Incluye ejemplos comunes directamente en el HTML
- Ayuda contextual visible sin necesidad de documentación externa