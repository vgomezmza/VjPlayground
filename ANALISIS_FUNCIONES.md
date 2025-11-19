# Análisis Completo de Funciones - Deep Playground

## 1. ARCHIVO: `src/nn.ts` - Motor de Red Neuronal

### Clase `Node` (Neurona)
```typescript
export class Node {
  constructor(id: string, activation: ActivationFunction, initZero?: boolean)
  updateOutput(): number
}
```
- **Propósito**: Representa una neurona individual en la red
- **Propiedades**: id, inputLinks, bias, outputs, totalInput, output, outputDer, inputDer, accInputDer, numAccumulatedDers, activation
- **updateOutput()**: Calcula la salida de la neurona aplicando la función de activación a la suma ponderada de entradas

### Clase `Link` (Conexión)
```typescript
export class Link {
  constructor(source: Node, dest: Node, regularization: RegularizationFunction, initZero?: boolean)
}
```
- **Propósito**: Representa una conexión entre dos neuronas con su peso
- **Propiedades**: id, source, dest, weight, isDead, errorDer, accErrorDer, numAccumulatedDers, regularization

### Funciones de Activación
```typescript
export class Activations {
  public static TANH: ActivationFunction
  public static RELU: ActivationFunction  
  public static SIGMOID: ActivationFunction
  public static LINEAR: ActivationFunction
  public static CUSTOM: ActivationFunction
}
```
- **TANH**: Tangente hiperbólica, salida entre -1 y 1
- **RELU**: Rectified Linear Unit, max(0, x)
- **SIGMOID**: Función sigmoide, salida entre 0 y 1
- **LINEAR**: Función lineal, f(x) = x
- **CUSTOM**: Función personalizada (agregada en modificaciones)

### Funciones de Error
```typescript
export class Errors {
  public static SQUARE: ErrorFunction
}
```
- **SQUARE**: Error cuadrático medio para entrenamiento

### Funciones de Regularización
```typescript
export class RegularizationFunction {
  public static L1: RegularizationFunction
  public static L2: RegularizationFunction
}
```
- **L1**: Regularización L1 (suma de valores absolutos)
- **L2**: Regularización L2 (suma de cuadrados)

### Funciones Principales del Motor

#### `buildNetwork()`
```typescript
export function buildNetwork(
  networkShape: number[], 
  activation: ActivationFunction,
  outputActivation: ActivationFunction,
  regularization: RegularizationFunction,
  inputIds: string[], 
  initZero?: boolean
): Node[][]
```
- **Propósito**: Construye la arquitectura completa de la red neuronal
- **Parámetros**: forma de la red, funciones de activación, regularización, IDs de entrada
- **Retorna**: Array de capas, cada capa es un array de nodos

#### `forwardProp()`
```typescript
export function forwardProp(network: Node[][], inputs: number[]): number
```
- **Propósito**: Ejecuta propagación hacia adelante
- **Proceso**: Toma inputs → calcula salidas capa por capa → retorna salida final
- **Retorna**: Salida final de la red

#### `backProp()`
```typescript
export function backProp(network: Node[][], target: number, errorFunc: ErrorFunction): void
```
- **Propósito**: Ejecuta retropropagación para calcular gradientes
- **Proceso**: Calcula error en salida → propaga error hacia atrás → calcula derivadas

#### `updateWeights()`
```typescript
export function updateWeights(network: Node[][], learningRate: number, regularizationRate: number)
```
- **Propósito**: Actualiza pesos y sesgos usando gradientes calculados
- **Proceso**: Aplica descenso de gradiente con regularización

#### `createCustomActivation()` (Agregada)
```typescript
export function createCustomActivation(outputFn: string, derivativeFn: string): ActivationFunction
```
- **Propósito**: Crea funciones de activación personalizadas desde strings
- **Proceso**: Convierte strings a funciones JavaScript → valida → retorna ActivationFunction

---

## 2. ARCHIVO: `src/dataset.ts` - Generación de Datos

### Tipo `Example2D`
```typescript
export type Example2D = {
  x: number,
  y: number, 
  label: number
}
```
- **Propósito**: Representa un punto de datos 2D con etiqueta

### `shuffle()`
```typescript
export function shuffle(array: any[]): void
```
- **Propósito**: Mezcla aleatoriamente un array usando algoritmo Fisher-Yates
- **Uso**: Para aleatorizar datos de entrenamiento

### Generadores de Datos de Clasificación

#### `classifyCircleData()`
```typescript
export function classifyCircleData(numSamples: number, noise: number): Example2D[]
```
- **Propósito**: Genera datos en forma de círculo (dentro = +1, fuera = -1)
- **Uso**: Problema de clasificación simple linealmente separable

#### `classifyXORData()`
```typescript
export function classifyXORData(numSamples: number, noise: number): Example2D[]
```
- **Propósito**: Genera datos XOR (cuadrantes alternos)
- **Uso**: Problema clásico no linealmente separable

#### `classifyTwoGaussData()`
```typescript
export function classifyTwoGaussData(numSamples: number, noise: number): Example2D[]
```
- **Propósito**: Dos distribuciones gaussianas separadas
- **Uso**: Clasificación con distribuciones naturales

#### `classifySpiralData()`
```typescript
export function classifySpiralData(numSamples: number, noise: number): Example2D[]
```
- **Propósito**: Datos en forma de espiral entrelazada
- **Uso**: Problema complejo que requiere redes profundas

### Generadores de Datos de Regresión

#### `regressPlane()`
```typescript
export function regressPlane(numSamples: number, noise: number): Example2D[]
```
- **Propósito**: Función lineal simple (plano)
- **Uso**: Regresión lineal básica

#### `regressGaussian()`
```typescript
export function regressGaussian(numSamples: number, noise: number): Example2D[]
```
- **Propósito**: Múltiples picos gaussianos
- **Uso**: Regresión no lineal compleja

---

## 3. ARCHIVO: `src/state.ts` - Gestión de Estado

### Enums y Mapas
```typescript
export enum Type { STRING, NUMBER, ARRAY_NUMBER, ARRAY_STRING, BOOLEAN, OBJECT }
export enum Problem { CLASSIFICATION, REGRESSION }
```

### Mapas de Configuración
```typescript
export let activations: {[key: string]: nn.ActivationFunction}
export let regularizations: {[key: string]: nn.RegularizationFunction}  
export let datasets: {[key: string]: dataset.DataGenerator}
export let regDatasets: {[key: string]: dataset.DataGenerator}
export let problems = { "classification": Problem.CLASSIFICATION, "regression": Problem.REGRESSION }
```

### Clase `State`
```typescript
export class State {
  static deserializeState(): State
  serialize(): void
  getHiddenProps(): string[]
  setHideProperty(name: string, hidden: boolean): void
}
```

#### `deserializeState()`
- **Propósito**: Lee configuración desde URL hash
- **Proceso**: Parsea parámetros → valida tipos → crea objeto State

#### `serialize()`
- **Propósito**: Guarda configuración actual en URL hash
- **Proceso**: Convierte propiedades → genera string → actualiza URL

---

## 4. ARCHIVO: `src/heatmap.ts` - Visualización

### Clase `HeatMap`
```typescript
export class HeatMap {
  constructor(width: number, numSamples: number, xDomain: [number, number], yDomain: [number, number], container, userSettings?: HeatMapSettings)
  updateTestPoints(points: Example2D[]): void
  updatePoints(points: Example2D[]): void  
  updateBackground(data: number[][], discretize: boolean): void
}
```

#### `constructor()`
- **Propósito**: Inicializa mapa de calor con Canvas y SVG
- **Proceso**: Crea escalas → configura Canvas → añade SVG overlay

#### `updateBackground()`
- **Propósito**: Actualiza el fondo del mapa de calor
- **Proceso**: Toma matriz de datos → convierte a colores → renderiza en Canvas

#### `updatePoints()` / `updateTestPoints()`
- **Propósito**: Actualiza puntos de datos visibles
- **Proceso**: Filtra puntos en rango → actualiza círculos SVG

### `reduceMatrix()`
```typescript
export function reduceMatrix(matrix: number[][], factor: number): number[][]
```
- **Propósito**: Reduce resolución de matriz para performance
- **Uso**: Optimizar renderizado de mapas de calor pequeños

---

## 5. ARCHIVO: `src/linechart.ts` - Gráficos de Líneas

### Clase `AppendingLineChart`
```typescript
export class AppendingLineChart {
  constructor(container, colorScale: string[])
  addDataPoint(dataPoint: number[]): void
  reset(): void
}
```

#### `addDataPoint()`
- **Propósito**: Añade punto al gráfico de pérdida
- **Uso**: Visualizar progreso del entrenamiento en tiempo real

#### `reset()`
- **Propósito**: Limpia el gráfico para nuevo entrenamiento

---

## 6. ARCHIVO: `src/playground.ts` - Controlador Principal

### Variables Globales
```typescript
let state: State
let network: nn.Node[][]
let trainData: Example2D[]
let testData: Example2D[]  
let heatMap: HeatMap
let lineChart: AppendingLineChart
let player: Player
```

### Clase `Player`
```typescript
class Player {
  playOrPause(): void
  onPlayPause(callback: (isPlaying: boolean) => void): void
  play(): void
  pause(): void
}
```
- **Propósito**: Controla la animación del entrenamiento
- **Funciones**: play/pause, callbacks para UI

### Funciones de Interfaz

#### `makeGUI()`
```typescript
function makeGUI(): void
```
- **Propósito**: Inicializa todos los controles de la interfaz
- **Proceso**: Configura event listeners → conecta controles con funciones

#### `drawNetwork()`
```typescript
function drawNetwork(network: nn.Node[][]): void
```
- **Propósito**: Dibuja la visualización de la red neuronal
- **Proceso**: Calcula posiciones → dibuja nodos → dibuja conexiones → añade controles

#### `drawNode()`
```typescript
function drawNode(cx: number, cy: number, nodeId: string, isInput: boolean, container, node?: nn.Node): void
```
- **Propósito**: Dibuja una neurona individual
- **Proceso**: Crea rectángulo SVG → añade etiquetas → crea canvas para heatmap

#### `drawLink()`
```typescript
function drawLink(input: nn.Link, node2coord: {[id: string]: {cx: number, cy: number}}, network: nn.Node[][], container, isFirst: boolean, index: number, length: number)
```
- **Propósito**: Dibuja conexión entre neuronas
- **Proceso**: Calcula path → aplica estilos según peso

### Funciones de Actualización

#### `updateUI()`
```typescript
function updateUI(firstStep = false): void
```
- **Propósito**: Actualiza toda la interfaz visual
- **Proceso**: Actualiza pesos → sesgos → fronteras → métricas

#### `updateWeightsUI()`
```typescript
function updateWeightsUI(network: nn.Node[][], container): void
```
- **Propósito**: Actualiza visualización de pesos de conexiones
- **Proceso**: Itera conexiones → actualiza grosor y color de líneas

#### `updateBiasesUI()`
```typescript
function updateBiasesUI(network: nn.Node[][]): void
```
- **Propósito**: Actualiza visualización de sesgos
- **Proceso**: Itera nodos → actualiza color de rectángulos de sesgo

#### `updateDecisionBoundary()`
```typescript
function updateDecisionBoundary(network: nn.Node[][], firstTime: boolean): void
```
- **Propósito**: Calcula fronteras de decisión
- **Proceso**: Muestrea grilla → evalúa red → almacena resultados

### Funciones de Entrenamiento

#### `oneStep()`
```typescript
function oneStep(): void
```
- **Propósito**: Ejecuta una iteración de entrenamiento
- **Proceso**: Forward prop → back prop → actualiza pesos → calcula pérdida

#### `reset()`
```typescript
function reset(onStartup=false): void
```
- **Propósito**: Reinicia la red y entrenamiento
- **Proceso**: Crea nueva red → inicializa datos → redibuja interfaz

### Funciones de Datos

#### `generateData()`
```typescript
function generateData(firstTime = false): void
```
- **Propósito**: Genera nuevo conjunto de datos
- **Proceso**: Selecciona generador → crea datos → divide train/test

#### `constructInput()`
```typescript
function constructInput(x: number, y: number): number[]
```
- **Propósito**: Construye vector de características de entrada
- **Proceso**: Evalúa features seleccionadas → retorna array

#### `getLoss()`
```typescript
function getLoss(network: nn.Node[][], dataPoints: Example2D[]): number
```
- **Propósito**: Calcula pérdida promedio en conjunto de datos
- **Proceso**: Evalúa red en cada punto → calcula error → promedia

### Funciones de Utilidad

#### `getOutputWeights()`
```typescript
export function getOutputWeights(network: nn.Node[][]): number[]
```
- **Propósito**: Extrae todos los pesos de la red
- **Uso**: Para análisis o exportación

#### `userHasInteracted()` / `simulationStarted()`
```typescript
function userHasInteracted(): void
function simulationStarted(): void
```
- **Propósito**: Tracking de analytics con Google Analytics

---

## 7. Funciones Agregadas (Modificaciones)

### En `nn.ts`:
#### `createCustomActivation()`
- **Propósito**: Crear funciones de activación desde strings de JavaScript
- **Validación**: Prueba funciones con valores de muestra
- **Error handling**: Retorna LINEAR si hay errores

### En `playground.ts`:
#### `updateCustomActivation()`
- **Propósito**: Maneja entrada de usuario para funciones personalizadas
- **Proceso**: Lee inputs → valida → crea función → actualiza red

---

## Flujo de Ejecución Principal

1. **Inicialización**: `makeGUI()` → `generateData(true)` → `reset(true)`
2. **Configuración**: Usuario cambia parámetros → `reset()`
3. **Entrenamiento**: `oneStep()` loop → `updateUI()`
4. **Visualización**: `drawNetwork()` → `updateDecisionBoundary()` → `heatMap.updateBackground()`

## Arquitectura de Datos

```
State ←→ URL Hash (persistencia)
  ↓
Network (nn.buildNetwork)
  ↓  
Training Loop (oneStep)
  ↓
UI Updates (updateUI)
  ↓
Visual Rendering (Canvas + SVG)
```

Cada función tiene un propósito específico en esta arquitectura modular que separa claramente la lógica de red neuronal, gestión de datos, estado de la aplicación y visualización.