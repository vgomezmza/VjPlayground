# Guía de Funciones de Activación Personalizadas

## Cómo usar funciones personalizadas

1. **Selecciona "Custom" en el dropdown de Activation**
2. **Escribe tu función en el campo f(x)**
3. **Escribe la derivada en el campo f'(x)**
4. **La red se actualizará automáticamente**

## Sintaxis de JavaScript para funciones

### Operadores básicos:
- `+` suma
- `-` resta  
- `*` multiplicación
- `/` división
- `Math.pow(x, 2)` potencia (x²)

### Funciones matemáticas disponibles:
- `Math.sin(x)` - seno
- `Math.cos(x)` - coseno
- `Math.exp(x)` - exponencial (e^x)
- `Math.log(x)` - logaritmo natural
- `Math.abs(x)` - valor absoluto
- `Math.max(a, b)` - máximo entre a y b
- `Math.min(a, b)` - mínimo entre a y b
- `Math.sqrt(x)` - raíz cuadrada

### Operadores condicionales:
- `x > 0 ? 1 : 0` - si x > 0 entonces 1, sino 0
- `x >= 0 ? x : 0` - ReLU básico

## Ejemplos de funciones populares

### 1. ReLU (Rectified Linear Unit)
```
f(x) = Math.max(0, x)
f'(x) = x > 0 ? 1 : 0
```

### 2. Leaky ReLU
```
f(x) = Math.max(0.1 * x, x)
f'(x) = x > 0 ? 1 : 0.1
```

### 3. Swish (función moderna)
```
f(x) = x / (1 + Math.exp(-x))
f'(x) = Math.exp(-x) * (x + Math.exp(-x) + 1) / Math.pow(1 + Math.exp(-x), 2)
```

### 4. ELU (Exponential Linear Unit)
```
f(x) = x >= 0 ? x : Math.exp(x) - 1
f'(x) = x >= 0 ? 1 : Math.exp(x)
```

### 5. Función Seno (experimental)
```
f(x) = Math.sin(x)
f'(x) = Math.cos(x)
```

### 6. Función Cuadrática
```
f(x) = x * x
f'(x) = 2 * x
```

### 7. Sigmoid modificado
```
f(x) = 1 / (1 + Math.exp(-2 * x))
f'(x) = 2 * Math.exp(-2 * x) / Math.pow(1 + Math.exp(-2 * x), 2)
```

### 8. Softplus
```
f(x) = Math.log(1 + Math.exp(x))
f'(x) = 1 / (1 + Math.exp(-x))
```

### 9. GELU (Gaussian Error Linear Unit)
```
f(x) = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))))
f'(x) = 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3)))) + 0.5 * x * (1 - Math.pow(Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))), 2)) * Math.sqrt(2 / Math.PI) * (1 + 0.134145 * Math.pow(x, 2))
```

### 10. Mish
```
f(x) = x * Math.tanh(Math.log(1 + Math.exp(x)))
f'(x) = Math.tanh(Math.log(1 + Math.exp(x))) + x * (1 - Math.pow(Math.tanh(Math.log(1 + Math.exp(x))), 2)) / (1 + Math.exp(-x))
```

### 11. PReLU (Parametric ReLU)
```
f(x) = x > 0 ? x : 0.2 * x
f'(x) = x > 0 ? 1 : 0.2
```

### 12. SELU (Scaled ELU)
```
f(x) = x >= 0 ? 1.0507 * x : 1.0507 * 1.67326 * (Math.exp(x) - 1)
f'(x) = x >= 0 ? 1.0507 : 1.0507 * 1.67326 * Math.exp(x)
```

### 13. Hard Sigmoid
```
f(x) = Math.max(0, Math.min(1, 0.2 * x + 0.5))
f'(x) = (x >= -2.5 && x <= 2.5) ? 0.2 : 0
```

### 14. Bent Identity
```
f(x) = (Math.sqrt(x * x + 1) - 1) / 2 + x
f'(x) = x / (2 * Math.sqrt(x * x + 1)) + 1
```

## Consejos importantes

### ✅ Buenas prácticas:
- Siempre proporciona tanto la función como su derivada
- Prueba con funciones simples primero
- Verifica que tu función no produzca valores infinitos o NaN
- Las derivadas deben ser matemáticamente correctas

### ❌ Errores comunes:
- Olvidar paréntesis: `Math.sin x` ❌ → `Math.sin(x)` ✅
- Derivadas incorrectas: pueden causar que la red no aprenda
- Funciones que explotan: `Math.exp(1000)` puede causar overflow
- Divisiones por cero: verificar denominadores

## Funciones experimentales interesantes

### Función Gaussiana
```
f(x) = Math.exp(-x * x)
f'(x) = -2 * x * Math.exp(-x * x)
```

### Función Tangente Hiperbólica Modificada
```
f(x) = Math.tanh(2 * x)
f'(x) = 2 * (1 - Math.pow(Math.tanh(2 * x), 2))
```

### Función Periódica
```
f(x) = Math.sin(x) + 0.1 * x
f'(x) = Math.cos(x) + 0.1
```

## Debugging Avanzado

Si tu función no funciona:

### Pasos básicos:
1. **Abre la consola del navegador** (F12)
2. **Busca mensajes de error** en rojo
3. **Verifica la sintaxis** de JavaScript
4. **Prueba funciones más simples** primero
5. **Asegúrate de que la derivada sea correcta**

### Errores específicos comunes:

#### Error: "NaN" en la red
- **Causa**: División por cero o raíz de número negativo
- **Solución**: Agregar verificaciones: `x !== 0 ? ... : 0`
- **Ejemplo**: `Math.sqrt(Math.abs(x))` en lugar de `Math.sqrt(x)`

#### Error: "Infinity" en los pesos
- **Causa**: Función crece demasiado rápido
- **Solución**: Limitar valores: `Math.min(Math.max(resultado, -10), 10)`

#### La red no aprende (loss no baja)
- **Causa**: Derivada incorrecta o siempre cero
- **Solución**: Verificar derivada manualmente con valores de prueba

#### Función muy lenta
- **Causa**: Cálculos complejos repetidos
- **Solución**: Simplificar o pre-calcular valores constantes

### Herramientas de testing:
```javascript
// Prueba tu función en la consola:
let testX = [-2, -1, 0, 1, 2];
testX.forEach(x => {
  let fx = /* tu función aquí */;
  let fpx = /* tu derivada aquí */;
  console.log(`f(${x}) = ${fx}, f'(${x}) = ${fpx}`);
});
```

### Validación de derivadas:
- **Método numérico**: `(f(x+h) - f(x-h)) / (2*h)` donde h=0.0001
- **Debe coincidir** aproximadamente con tu derivada analítica

## Ver Logs en la Consola del Navegador

### Cómo abrir la consola:
1. **Chrome/Edge**: F12 o Ctrl+Shift+I → pestaña "Console"
2. **Firefox**: F12 o Ctrl+Shift+K → pestaña "Consola"
3. **Safari**: Cmd+Option+I → pestaña "Console"

### Logs automáticos del playground:
El playground ya incluye logs detallados que puedes ver:

#### Logs de funciones personalizadas:
```
[PLAYGROUND] Custom function text: Math.max(0, x)
[PLAYGROUND] Custom derivative text: x > 0 ? 1 : 0
[PLAYGROUND] Creating custom activation function
[PLAYGROUND] Custom activation applied successfully
```

#### Logs de construcción de red:
```
Building network with shape: [2, 4, 4, 1]
Using activation: {output: ƒ, der: ƒ}
Network built successfully
```

#### Logs de entrenamiento:
```
Losses calculated - Train: 0.234 Test: 0.267
Drawing network with 4 layers
```

### Agregar tus propios logs:
Puedes agregar logs personalizados en tus funciones:

```javascript
// En el campo f(x):
console.log('Evaluando f(x) con x =', x);
let result = Math.max(0, x);
console.log('Resultado:', result);
return result;

// En el campo f'(x):
console.log('Evaluando derivada con x =', x);
let derivative = x > 0 ? 1 : 0;
console.log('Derivada:', derivative);
return derivative;
```

### Logs útiles para debugging:

#### Verificar valores de entrada:
```javascript
// Función que registra todos los valores
f(x) = (() => {
  console.log(`Input: ${x}`);
  if (isNaN(x)) console.warn('Input is NaN!');
  if (!isFinite(x)) console.warn('Input is infinite!');
  let result = Math.tanh(x);
  console.log(`Output: ${result}`);
  return result;
})()
```

#### Detectar problemas numéricos:
```javascript
// Función con verificaciones de seguridad
f(x) = (() => {
  let result = Math.exp(x);
  if (result > 1e10) {
    console.warn('Function exploding:', result);
    return Math.min(result, 1e10);
  }
  return result;
})()
```

### Monitorear el entrenamiento:
Puedes ver el progreso en tiempo real:

```javascript
// En la consola, ejecuta:
setInterval(() => {
  console.log('Iteration:', document.querySelector('#iter-number').textContent);
  console.log('Train Loss:', document.querySelector('#loss-train').textContent);
  console.log('Test Loss:', document.querySelector('#loss-test').textContent);
}, 1000);
```

### Filtrar logs por tipo:
- **Solo errores**: Filtro "Errors" en la consola
- **Solo warnings**: Filtro "Warnings" 
- **Buscar texto**: Ctrl+F en la consola
- **Limpiar consola**: Ctrl+L o botón "Clear"

### Logs avanzados para desarrollo:

#### Inspeccionar la red neuronal:
```javascript
// En la consola del navegador:
console.log('Current network:', window.network);
console.log('Network weights:', window.getOutputWeights(window.network));
```

#### Ver el estado actual:
```javascript
// Inspeccionar configuración actual:
console.log('Current state:', window.state);
console.log('Training data size:', window.trainData.length);
console.log('Test data size:', window.testData.length);
```

### Consejos para logging efectivo:

#### ✅ Buenas prácticas:
- Usa `console.log()` para información general
- Usa `console.warn()` para advertencias
- Usa `console.error()` para errores críticos
- Usa `console.table()` para arrays de datos
- Agrupa logs relacionados con `console.group()`

#### ❌ Evita:
- Demasiados logs (ralentiza el entrenamiento)
- Logs en cada iteración (usa intervalos)
- Logs de objetos muy grandes
- Dejar logs en producción

## Funciones por Tipo de Problema

### Para Clasificación Binaria:
```
// Sigmoid clásico
f(x) = 1 / (1 + Math.exp(-x))
f'(x) = Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2)

// Tanh (centrado en cero)
f(x) = Math.tanh(x)
f'(x) = 1 - Math.pow(Math.tanh(x), 2)
```

### Para Redes Profundas:
```
// ReLU (evita vanishing gradient)
f(x) = Math.max(0, x)
f'(x) = x > 0 ? 1 : 0

// GELU (más suave que ReLU)
f(x) = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))))
```

### Para Problemas de Regresión:
```
// Lineal (capa de salida)
f(x) = x
f'(x) = 1

// Softplus (siempre positivo)
f(x) = Math.log(1 + Math.exp(x))
f'(x) = 1 / (1 + Math.exp(-x))
```

### Para Datos Ruidosos:
```
// Leaky ReLU (más robusto)
f(x) = Math.max(0.01 * x, x)
f'(x) = x > 0 ? 1 : 0.01

// ELU (suave en negativos)
f(x) = x >= 0 ? x : Math.exp(x) - 1
f'(x) = x >= 0 ? 1 : Math.exp(x)
```

### Para Experimentación:
```
// Función periódica (patrones cíclicos)
f(x) = Math.sin(x)
f'(x) = Math.cos(x)

// Función cuadrática (no monótona)
f(x) = x * x
f'(x) = 2 * x
```

## Casos de Uso Educativos

- **Comparar diferentes activaciones** en el mismo problema
- **Entender el efecto de la derivada** en el aprendizaje
- **Experimentar con funciones no estándar**
- **Visualizar cómo diferentes formas afectan las fronteras de decisión**
- **Observar el comportamiento** en redes profundas vs. superficiales
- **Analizar la velocidad de convergencia** con diferentes funciones
- **Usar logs para entender** el proceso de aprendizaje paso a paso
- **Debuggear funciones problemáticas** con logging detallado