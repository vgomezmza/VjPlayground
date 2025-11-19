// Script de testing para desarrollo
console.log("=== DEEP PLAYGROUND DEV TEST ===");

// Test de funciones de activación
function testActivationFunctions() {
    console.log("\n--- Testing Activation Functions ---");
    
    const testFunctions = [
        "x",
        "x * x", 
        "Math.sin(x)",
        "Math.max(0, x)",
        "x > 0 ? x : 0.1 * x",
        "1 / (1 + Math.exp(-x))",
        "Math.log(1 + Math.exp(x))"
    ];
    
    testFunctions.forEach(fn => {
        try {
            console.log(`Testing: ${fn}`);
            const testFn = new Function('x', `return ${fn}`);
            
            // Test con varios valores
            const testValues = [-2, -1, 0, 1, 2];
            testValues.forEach(val => {
                const result = testFn(val);
                console.log(`  f(${val}) = ${result}`);
            });
            
            console.log(`✓ ${fn} - OK`);
        } catch (e) {
            console.error(`✗ ${fn} - ERROR:`, e.message);
        }
    });
}

// Test de elementos DOM
function testDOMElements() {
    console.log("\n--- Testing DOM Elements ---");
    
    const elements = [
        '#activations',
        '#custom-activation-modal',
        '#custom-function-input',
        '#apply-custom-function',
        '#validation-indicator',
        '.example-item'
    ];
    
    elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`✓ ${selector} - Found`);
        } else {
            console.error(`✗ ${selector} - NOT FOUND`);
        }
    });
}

// Test de validación de funciones
function testFunctionValidation() {
    console.log("\n--- Testing Function Validation ---");
    
    const validFunctions = [
        "x",
        "Math.sin(x)",
        "x > 0 ? x : 0"
    ];
    
    const invalidFunctions = [
        "x +",
        "Math.sin(",
        "undefined_function(x)"
    ];
    
    console.log("Valid functions:");
    validFunctions.forEach(fn => {
        try {
            const testFn = new Function('x', `return ${fn}`);
            testFn(1); // Test execution
            console.log(`✓ ${fn}`);
        } catch (e) {
            console.error(`✗ ${fn} - ${e.message}`);
        }
    });
    
    console.log("Invalid functions:");
    invalidFunctions.forEach(fn => {
        try {
            const testFn = new Function('x', `return ${fn}`);
            testFn(1);
            console.error(`✗ ${fn} - Should have failed but didn't`);
        } catch (e) {
            console.log(`✓ ${fn} - Correctly failed: ${e.message}`);
        }
    });
}

// Ejecutar tests cuando la página cargue
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}

function runTests() {
    console.log("DOM loaded, running tests...");
    
    setTimeout(() => {
        testActivationFunctions();
        testDOMElements();
        testFunctionValidation();
        
        console.log("\n=== Tests completed ===");
        console.log("Check console for any errors marked with ✗");
    }, 1000);
}

// Función para testing manual desde consola
window.testCustomFunction = function(fnString) {
    console.log(`\n--- Manual Test: ${fnString} ---`);
    try {
        const fn = new Function('x', `return ${fnString}`);
        const testValues = [-2, -1, 0, 1, 2];
        
        testValues.forEach(x => {
            const result = fn(x);
            console.log(`f(${x}) = ${result}`);
        });
        
        console.log("✓ Function test completed");
        return true;
    } catch (e) {
        console.error("✗ Function test failed:", e.message);
        return false;
    }
};

// Función para simular selección de custom
window.testCustomModal = function() {
    console.log("\n--- Testing Custom Modal ---");
    
    const dropdown = document.getElementById('activations');
    if (dropdown) {
        dropdown.value = 'custom';
        dropdown.dispatchEvent(new Event('change'));
        console.log("✓ Custom option selected");
    } else {
        console.error("✗ Dropdown not found");
    }
};

console.log("Dev test script loaded. Use testCustomFunction('Math.sin(x)') or testCustomModal() for manual testing.");