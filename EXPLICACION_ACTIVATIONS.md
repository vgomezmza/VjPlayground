# Clase Activations - Análisis Completo

## 1. Definición de la Interfaz Base

```typescript
// En nn.ts
export interface ActivationFunction {
  output: (input: number) => number;  // La función f(x)
  der: (input: number) => number;     // La derivada f'(x)
}
```

**Propósito**: Define el contrato que debe cumplir cualquier función de activación.

## 2. La Clase Activations

```typescript
export class Activations {
  public static TANH: ActivationFunction = {
    output: x => (Math as any).tanh(x),
    der: x => {
      let output = Activations.TANH.output(x);
      return 1 - output * output;  // Derivada: 1 - tanh²(x)
    }
  };
  
  public static RELU: ActivationFunction = {
    output: x => Math.max(0, x),
    der: x => x <= 0 ? 0 : 1      // Derivada: 0 si x≤0, 1 si x>0
  };
  
  public static SIGMOID: ActivationFunction = {
    output: x => 1 / (1 + Math.exp(-x)),
    der: x => {
      let output = Activations.SIGMOID.output(x);
      return output * (1 - output);  // Derivada: σ(x)(1-σ(x))
    }
  };
  
  public static LINEAR: ActivationFunction = {
    output: x => x,
    der: x => 1                    // Derivada constante: 1
  };
  
  public static CUSTOM: ActivationFunction = {
    output: x => x,               // Placeholder inicial
    der: x => 1
  };
}
```

## 3. Función de Cada Activación

### TANH (Tangente Hiperbólica)
- **Rango**: (-1, 1)
- **Uso**: Centrada en cero, buena para capas ocultas
- **Ventaja**: Gradientes más fuertes que sigmoid
- **Matemática**: tanh(x) = (e^x - e^-x) / (e^x + e^-x)

### RELU (Rectified Linear Unit)
- **Rango**: [0, ∞)
- **Uso**: Más popular en redes profundas modernas
- **Ventaja**: No sufre vanishing gradient, computacionalmente eficiente
- **Problema**: "Dying ReLU" cuando x < 0

### SIGMOID
- **Rango**: (0, 1)
- **Uso**: Tradicionalmente en capas de salida para probabilidades
- **Problema**: Vanishing gradient en valores extremos
- **Matemática**: σ(x) = 1 / (1 + e^-x)

### LINEAR
- **Rango**: (-∞, ∞)
- **Uso**: Capas de salida para regresión
- **Característica**: No introduce no-linealidad

## 4. Integración en el Sistema

### A. En la Clase Node (Neurona)

```typescript
export class Node {
  activation: ActivationFunction;  // Cada neurona tiene su función
  
  updateOutput(): number {
    // 1. Calcula entrada total (suma ponderada + sesgo)
    this.totalInput = this.bias;
    for (let j = 0; j < this.inputLinks.length; j++) {
      let link = this.inputLinks[j];
      this.totalInput += link.weight * link.source.output;
    }
    
    // 2. Aplica función de activación
    this.output = this.activation.output(this.totalInput);
    return this.output;
  }
}
```

### B. En Backpropagation

```typescript
export function backProp(network: Node[][], target: number, errorFunc: ErrorFunction): void {
  // Para cada nodo en cada capa
  for (let i = 0; i < currentLayer.length; i++) {
    let node = currentLayer[i];
    
    // Usa la DERIVADA de la función de activación
    node.inputDer = node.outputDer * node.activation.der(node.totalInput);
    //                                    ↑
    //                            Aquí se usa la derivada
  }
}
```

### C. En la Construcción de Red

```typescript
export function buildNetwork(
  networkShape: number[], 
  activation: ActivationFunction,      // Para capas ocultas
  outputActivation: ActivationFunction, // Para capa de salida
  // ...
): Node[][] {
  
  for (let layerIdx = 0; layerIdx < numLayers; layerIdx++) {
    let isOutputLayer = layerIdx === numLayers - 1;
    
    // Asigna función de activación según la capa
    let node = new Node(nodeId,
      isOutputLayer ? outputActivation : activation,  // ← Aquí se asigna
      initZero
    );
  }
}
```

## 5. Flujo de Integración Completa

```
1. Usuario selecciona activación → state.activation
                ↓
2. reset() → buildNetwork(state.activation, ...)
                ↓
3. Cada Node recibe su ActivationFunction
                ↓
4. Forward Propagation:
   node.updateOutput() → activation.output(totalInput)
                ↓
5. Backward Propagation:
   backProp() → activation.der(totalInput)
                ↓
6. Visualización: Los resultados se muestran en heatmaps
```

## 6. Mapeo en State Management

```typescript
// En state.ts
export let activations: {[key: string]: nn.ActivationFunction} = {
  "relu": nn.Activations.RELU,
  "tanh": nn.Activations.TANH,
  "sigmoid": nn.Activations.SIGMOID,
  "linear": nn.Activations.LINEAR,
  "custom": nn.Activations.CUSTOM
};
```

## 7. Conexión con la Interfaz

```typescript
// En playground.ts
let activationDropdown = d3.select("#activations").on("change", function() {
  if (this.value === "custom") {
    // Muestra campos para función personalizada
  } else {
    // Usa función predefinida
    state.activation = activations[this.value];  // ← Mapeo directo
    reset(); // Reconstruye la red con nueva activación
  }
});
```

## 8. Impacto en el Aprendizaje

### Durante Forward Pass:
```
Input → Σ(wi*xi + b) → Activation.output() → Output de neurona
```

### Durante Backward Pass:
```
Error → Activation.der() → Gradiente local → Actualización de pesos
```

## 9. Por qué son Críticas las Derivadas

```typescript
// En backpropagation
node.inputDer = node.outputDer * node.activation.der(node.totalInput);
//                                      ↑
//                              Si der() es incorrecta:
//                              - Gradientes erróneos
//                              - Red no aprende
//                              - Convergencia imposible
```

## 10. Funciones Personalizadas (Agregadas)

```typescript
export function createCustomActivation(outputFn: string, derivativeFn: string): ActivationFunction {
  // Convierte strings JavaScript a funciones reales
  const output = new Function('x', `return ${outputFn}`) as (input: number) => number;
  const der = new Function('x', `return ${derivativeFn}`) as (input: number) => number;
  
  // Valida que funcionen correctamente
  const testVal = output(1);
  const testDer = der(1);
  
  return { output, der };
}
```

## Resumen de Integración

La clase `Activations` es el **corazón matemático** de la red neuronal:

1. **Define el comportamiento no-lineal** de cada neurona
2. **Se integra en cada Node** como propiedad
3. **Se usa en forward pass** para calcular salidas
4. **Se usa en backward pass** para calcular gradientes
5. **Determina la capacidad de aprendizaje** de la red
6. **Es configurable por el usuario** via interfaz
7. **Permite experimentación** con funciones personalizadas

Sin las funciones de activación, la red sería puramente lineal y no podría aprender patrones complejos. Son la clave que permite a las redes neuronales aproximar cualquier función no-lineal.