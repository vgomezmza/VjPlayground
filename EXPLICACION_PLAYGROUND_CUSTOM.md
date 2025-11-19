# Explicación: playground.ts - Manejo de Funciones Personalizadas

## Función Principal: Manejo del Dropdown de Activación

```typescript
let activationDropdown = d3.select("#activations").on("change", function() {
  console.log("Activation changed to:", this.value);
  let customDiv = d3.select(".ui-custom-activation");
  
  if (this.value === "custom") {
    console.log("Showing custom activation inputs");
    customDiv.style("display", "block");
  } else {
    console.log("Using built-in activation:", this.value);
    customDiv.style("display", "none");
    state.activation = activations[this.value];
    parametersChanged = true;
    reset();
  }
});
```

### ¿Qué hace esta función?

1. **Detecta cambios** en el dropdown `<select id="activations">`
2. **Obtiene el valor seleccionado** (`this.value`)
3. **Decide qué interfaz mostrar**:
   - Si es "custom" → muestra campos de entrada
   - Si es otra → usa función predefinida y oculta campos

### Variables involucradas:
- `customDiv` - Referencia al contenedor de campos personalizados
- `state.activation` - Función de activación actual del estado
- `activations[this.value]` - Mapeo de string a función
- `parametersChanged` - Flag para indicar que hay cambios
- `reset()` - Función que reconstruye la red

## Inicialización de Event Listeners

```typescript
// Check if custom inputs exist
let customFnInput = d3.select("#custom-function");
let customDerInput = d3.select("#custom-derivative");

console.log("Custom function input found:", !customFnInput.empty());
console.log("Custom derivative input found:", !customDerInput.empty());

customFnInput.on("input", updateCustomActivation);
customDerInput.on("input", updateCustomActivation);
```

### ¿Qué hace esta sección?

1. **Busca los elementos HTML** de entrada de texto
2. **Verifica que existan** (debugging)
3. **Asigna event listeners** para detectar cuando el usuario escribe

### Variables involucradas:
- `customFnInput` - Referencia al campo f(x)
- `customDerInput` - Referencia al campo f'(x)
- `updateCustomActivation` - Función callback que se ejecuta al escribir

## Función Core: updateCustomActivation()

```typescript
function updateCustomActivation() {
  let fnText = (d3.select("#custom-function").node() as HTMLInputElement).value;
  let derText = (d3.select("#custom-derivative").node() as HTMLInputElement).value;
  
  console.log("Custom function text:", fnText);
  console.log("Custom derivative text:", derText);
  
  if (fnText && derText) {
    try {
      console.log("Creating custom activation function");
      state.activation = nn.createCustomActivation(fnText, derText);
      activations["custom"] = state.activation;
      parametersChanged = true;
      reset();
      console.log("Custom activation applied successfully");
    } catch (e) {
      console.error("Invalid custom function:", e);
    }
  }
}
```

### Flujo paso a paso:

#### 1. **Obtener valores de entrada**
```typescript
let fnText = (d3.select("#custom-function").node() as HTMLInputElement).value;
let derText = (d3.select("#custom-derivative").node() as HTMLInputElement).value;
```
- Accede al DOM directamente
- Obtiene el texto que escribió el usuario
- Cast a `HTMLInputElement` para acceder a `.value`

#### 2. **Validación básica**
```typescript
if (fnText && derText) {
```
- Verifica que ambos campos tengan contenido
- Solo procede si hay función Y derivada

#### 3. **Creación de función personalizada**
```typescript
state.activation = nn.createCustomActivation(fnText, derText);
```
- Llama a la función en `nn.ts` que convierte strings a funciones
- Asigna el resultado al estado global

#### 4. **Actualización del mapa de activaciones**
```typescript
activations["custom"] = state.activation;
```
- Actualiza el mapa global para que "custom" apunte a la nueva función
- Esto permite que el sistema use la función personalizada

#### 5. **Reconstrucción de la red**
```typescript
parametersChanged = true;
reset();
```
- Marca que hubo cambios en parámetros
- Llama a `reset()` que reconstruye toda la red con la nueva función

## Integración con el Sistema Global

### Variables Globales Afectadas:

```typescript
// En playground.ts (nivel global)
let state: State;                    // Estado de la aplicación
let network: nn.Node[][];           // Red neuronal actual
let activations: {[key: string]: nn.ActivationFunction}; // Mapa de funciones
let parametersChanged: boolean;      // Flag de cambios
```

### Funciones Globales Llamadas:

1. **`nn.createCustomActivation()`** - Crea la función desde strings
2. **`reset()`** - Reconstruye la red neuronal
3. **`state.serialize()`** - Guarda estado en URL (dentro de reset)

## Flujo Completo de Integración

```
Usuario escribe función
        ↓
updateCustomActivation() detecta cambio
        ↓
nn.createCustomActivation() convierte string a función
        ↓
state.activation = nueva función
        ↓
activations["custom"] = nueva función
        ↓
reset() reconstruye red
        ↓
buildNetwork() usa state.activation
        ↓
Cada Node recibe la nueva función
        ↓
Forward/Backward pass usan nueva función
        ↓
Visualización muestra resultados
```

## Manejo de Errores

```typescript
try {
  // Creación de función
} catch (e) {
  console.error("Invalid custom function:", e);
}
```

### Tipos de errores capturados:
- **Sintaxis JavaScript inválida** en los strings
- **Funciones que retornan NaN** o valores inválidos
- **Errores de evaluación** en tiempo de ejecución

### Comportamiento en caso de error:
- La función anterior se mantiene
- Se muestra error en consola
- La red sigue funcionando con la función previa

## Variables de Estado Persistente

```typescript
// El estado se guarda automáticamente en la URL
state.serialize(); // Dentro de reset()

// Al recargar la página:
state = State.deserializeState(); // Restaura configuración
```

### Persistencia de funciones personalizadas:
- **Problema**: Las funciones JavaScript no se pueden serializar directamente
- **Solución actual**: Se pierde al recargar (limitación conocida)
- **Mejora futura**: Guardar los strings de función en la URL

## Debugging y Logs

Los logs agregados permiten rastrear:

1. **Cambios en dropdown**: "Activation changed to: custom"
2. **Existencia de elementos**: "Custom function input found: true"
3. **Valores ingresados**: "Custom function text: Math.sin(x)"
4. **Creación exitosa**: "Custom activation applied successfully"
5. **Errores**: "Invalid custom function: [error details]"

## Optimizaciones de Performance

### Debouncing implícito:
- Solo actualiza cuando ambos campos tienen contenido
- Evita reconstrucciones innecesarias de la red

### Validación temprana:
- `nn.createCustomActivation()` valida antes de aplicar
- Previene estados inconsistentes en la red