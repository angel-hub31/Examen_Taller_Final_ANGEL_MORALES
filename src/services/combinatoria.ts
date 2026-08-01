
//Calcula el factorial de un número. (Sección 12)
export function factorial(number: number): number {
    if (number <= 1) {
        return 1;
    }
    return number * factorial(number - 1);
}
//Paso 4: Calcular C(n,r) - Número de combinaciones (Sección 26)
export function calculateCombinationCount(n: number, r: number): number {
    if (r < 0 || r > n) {
        return 0;
    }
    return factorial(n) / (factorial(r) * factorial(n - r));
}
// Paso 5: Generar las combinaciones mediante algoritmo (Sección 16)
export function generateCombinations<T>(elements: T[], size: number): T[][] {
    const results: T[][] = [];

    function combine(startIndex: number, currentCombination: T[]) {
        if (currentCombination.length === size) {
            results.push([...currentCombination]);
            return;
        }
        for (let index = startIndex; index < elements.length; index++) {
            currentCombination.push(elements[index]!);
            combine(index + 1, currentCombination);
            currentCombination.pop();
        }
    }

    combine(0, []);
    return results;
}