# Guía de Debugging - Deep Playground

## Cómo Ejecutar en Desarrollo

### 1. Compilar y Servir
```bash
cd "d:\Redes Neuronales\playground"
npm run build
npm run serve
```

### 2. Abrir en Navegador
- Ir a: `http://localhost:3000` (o el puerto que muestre)
- Abrir **DevTools** (F12)
- Ir a la pestaña **Console**

## Logs por Consola

### Logs de Estado (state.ts)
```
[STATE] Activations map initialized: ["relu", "tanh", "sigmoid", "linear", "custom"]
[STATE] Deserializing state from URL hash: #activation=relu&...
[STATE] Setting activation to: relu
```

### Logs de Red Neuronal (nn.ts)
```
[NN] Creating custom activation with auto-derivative: Math.sin(x)
[NN] Test output(1): 0.8414709848078965
[NN] Test derivative(1): 0.5403023058681398
[NN] Validating function syntax: Math.sin(x)
[NN] Function validation passed
```

### Logs de Interfaz (playground.ts)
```
[PLAYGROUND] Activation changed to: custom
[PLAYGROUND] Custom selected - opening modal
[PLAYGROUND] Modal elements found: {modal: true, closeButton: true, ...}
[PLAYGROUND] Function input changed: Math.sin(x)
[PLAYGROUND] Validating function: Math.sin(x)
[PLAYGROUND] Function validation passed
[PLAYGROUND] Applying custom function: Math.sin(x)
[PLAYGROUND] Custom activation applied successfully
```

## Testing Manual desde Consola

### 1. Probar Función Personalizada
```javascript
// En la consola del navegador:
testCustomFunction("Math.sin(x)")
testCustomFunction("x > 0 ? x : 0.1 * x")
testCustomFunction("1 / (1 + Math.exp(-x))")
```

### 2. Abrir Modal Programáticamente
```javascript
// En la consola del navegador:
testCustomModal()
```

### 3. Verificar Elementos DOM
```javascript
// Verificar que el modal existe
document.querySelector('#custom-activation-modal')

// Verificar input de función
document.querySelector('#custom-function-input')

// Verificar botón aplicar
document.querySelector('#apply-custom-function')
```

## Errores Comunes y Soluciones

### ❌ "Modal elements found: {modal: false, ...}"
**Problema**: Elementos del modal no se encuentran
**Solución**: 
1. Verificar que el HTML se compiló correctamente
2. Revisar que no hay errores de sintaxis en index.html

### ❌ "Function validation failed: SyntaxError"
**Problema**: Función JavaScript inválida
**Solución**:
1. Verificar sintaxis: paréntesis, operadores, etc.
2. Usar funciones válidas: `Math.sin(x)`, no `sin(x)`

### ❌ "Error creating custom activation: Function returns NaN"
**Problema**: La función retorna valores no numéricos
**Solución**:
1. Evitar divisiones por cero
2. Verificar que la función siempre retorna números

### ❌ "Dropdown not found" en testCustomModal()
**Problema**: El dropdown de activaciones no existe
**Solución**:
1. Verificar que la página cargó completamente
2. Revisar que el elemento tiene id="activations"

## Debugging Paso a Paso

### 1. Verificar Compilación
```bash
npm run build
# Debe completarse sin errores críticos
```

### 2. Verificar Elementos HTML
```javascript
// En consola del navegador
console.log("Dropdown:", document.getElementById('activations'));
console.log("Modal:", document.getElementById('custom-activation-modal'));
console.log("Input:", document.getElementById('custom-function-input'));
```

### 3. Probar Flujo Completo
1. Seleccionar "Custom" en dropdown
2. Verificar que modal se abre
3. Escribir función válida (ej: `Math.sin(x)`)
4. Verificar validación en tiempo real
5. Hacer clic en "Aplicar"
6. Verificar que red se reconstruye

### 4. Monitorear Logs
Buscar estos patrones en consola:
- `[PLAYGROUND] Activation changed to: custom` ✓
- `[PLAYGROUND] Custom selected - opening modal` ✓
- `[NN] Function validation passed` ✓
- `[PLAYGROUND] Custom activation applied successfully` ✓

## Funciones de Testing Disponibles

### En Consola del Navegador:
```javascript
// Probar función personalizada
testCustomFunction("Math.max(0, x)")

// Abrir modal de custom
testCustomModal()

// Verificar validación
nn.validateFunctionSyntax("Math.sin(x)")

// Crear función de activación
nn.createCustomActivationAuto("Math.sin(x)")
```

## Estructura de Logs por Módulo

```
Inicialización:
├── [STATE] Activations map initialized
├── [STATE] Deserializing state from URL hash
└── [PLAYGROUND] Modal elements found

Selección Custom:
├── [PLAYGROUND] Activation changed to: custom
├── [PLAYGROUND] Custom selected - opening modal
└── Modal se abre

Validación en Tiempo Real:
├── [PLAYGROUND] Function input changed: Math.sin(x)
├── [PLAYGROUND] Validating function: Math.sin(x)
├── [NN] Validating function syntax: Math.sin(x)
└── [NN] Function validation passed

Aplicación de Función:
├── [PLAYGROUND] Applying custom function: Math.sin(x)
├── [NN] Creating custom activation with auto-derivative
├── [NN] Test output(1): 0.841...
├── [NN] Test derivative(1): 0.540...
└── [PLAYGROUND] Custom activation applied successfully
```

## Troubleshooting Rápido

1. **No se abre el modal**: Verificar logs de `[PLAYGROUND] Modal elements found`
2. **Validación no funciona**: Buscar logs de `[NN] Validating function syntax`
3. **Función no se aplica**: Revisar logs de `[NN] Creating custom activation`
4. **Red no se actualiza**: Verificar `[PLAYGROUND] Custom activation applied successfully`

Todos los errores aparecerán en rojo en la consola con el prefijo correspondiente al módulo.