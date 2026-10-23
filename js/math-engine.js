/**
 * Generador y Evaluador de Jerarquía de Operaciones Matemáticas (PAPOMUDAS / PEMDAS)
 */

class MathEngine {
  constructor() {
    this.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Genera un nuevo ejercicio según el nivel seleccionado
   * @param {'easy'|'medium'|'hard'} level 
   * @returns {Object} { displayExpr, answer, stepsEs, stepsEn, rawExpr }
   */
  generate(level = 'easy') {
    let exercise = null;
    let attempts = 0;
    while (!exercise && attempts < 100) {
      attempts++;
      try {
        if (level === 'easy') {
          exercise = this.generateEasy();
        } else if (level === 'medium') {
          exercise = this.generateMedium();
        } else {
          exercise = this.generateHard();
        }
      } catch (e) {
        exercise = null;
      }
    }

    // Fallback seguro en caso extremo
    if (!exercise) {
      return {
        displayExpr: "4 + 3 × 5",
        answer: 19,
        stepsEs: [
          "Identificar operaciones: suma (+) y multiplicación (×).",
          "Por jerarquía PAPOMUDAS, se multiplica antes de sumar: 3 × 5 = 15",
          "Reemplazar en la expresión: 4 + 15",
          "Sumar: 4 + 15 = 19"
        ],
        stepsEn: [
          "Identify operations: addition (+) and multiplication (×).",
          "By PEMDAS hierarchy, multiply before adding: 3 × 5 = 15",
          "Substitute into expression: 4 + 15",
          "Add: 4 + 15 = 19"
        ]
      };
    }

    return exercise;
  }

  /**
   * Fácil: 3 números, 2 operaciones sin paréntesis
   * Pone a prueba la precedencia (× / ÷ antes de + / -)
   */
  generateEasy() {
    const patterns = [
      // 1: a + b * c
      () => {
        const a = this.randomInt(2, 25);
        const b = this.randomInt(2, 9);
        const c = this.randomInt(2, 9);
        const prod = b * c;
        const ans = a + prod;
        return {
          displayExpr: `${a} + ${b} × ${c}`,
          answer: ans,
          stepsEs: [
            `Identificar la jerarquía: la multiplicación (×) se resuelve ANTES que la suma (+).`,
            `Calcular primero la multiplicación: ${b} × ${c} = ${prod}`,
            `Reemplazar en la expresión: ${a} + ${prod}`,
            `Resolver la suma final: ${a} + ${prod} = ${ans}`
          ],
          stepsEn: [
            `Identify precedence: multiplication (×) comes BEFORE addition (+).`,
            `Calculate the multiplication first: ${b} × ${c} = ${prod}`,
            `Substitute back: ${a} + ${prod}`,
            `Solve the final addition: ${a} + ${prod} = ${ans}`
          ]
        };
      },
      // 2: a * b + c
      () => {
        const a = this.randomInt(2, 9);
        const b = this.randomInt(2, 9);
        const c = this.randomInt(2, 30);
        const prod = a * b;
        const ans = prod + c;
        return {
          displayExpr: `${a} × ${b} + ${c}`,
          answer: ans,
          stepsEs: [
            `Identificar la jerarquía: la multiplicación (×) se realiza antes que la adición (+).`,
            `Calcular la multiplicación: ${a} × ${b} = ${prod}`,
            `Reemplazar en la expresión: ${prod} + ${c}`,
            `Resolver la suma final: ${prod} + ${c} = ${ans}`
          ],
          stepsEn: [
            `Identify precedence: multiplication (×) is performed before addition (+).`,
            `Calculate the multiplication: ${a} × ${b} = ${prod}`,
            `Substitute back: ${prod} + ${c}`,
            `Solve the final addition: ${prod} + ${c} = ${ans}`
          ]
        };
      },
      // 3: a - b * c (con a > b*c)
      () => {
        const b = this.randomInt(2, 8);
        const c = this.randomInt(2, 7);
        const prod = b * c;
        const a = prod + this.randomInt(2, 20);
        const ans = a - prod;
        return {
          displayExpr: `${a} - ${b} × ${c}`,
          answer: ans,
          stepsEs: [
            `Identificar la jerarquía: la multiplicación (×) tiene mayor prioridad que la resta (−).`,
            `Calcular la multiplicación: ${b} × ${c} = ${prod}`,
            `Reemplazar en la expresión: ${a} - ${prod}`,
            `Resolver la resta final: ${a} - ${prod} = ${ans}`
          ],
          stepsEn: [
            `Identify precedence: multiplication (×) has higher priority than subtraction (−).`,
            `Calculate the multiplication: ${b} × ${c} = ${prod}`,
            `Substitute back: ${a} - ${prod}`,
            `Solve the final subtraction: ${a} - ${prod} = ${ans}`
          ]
        };
      },
      // 4: a + b / c (con b divisible por c)
      () => {
        const c = this.randomInt(2, 8);
        const quotient = this.randomInt(2, 9);
        const b = c * quotient;
        const a = this.randomInt(3, 25);
        const ans = a + quotient;
        return {
          displayExpr: `${a} + ${b} ÷ ${c}`,
          answer: ans,
          stepsEs: [
            `Identificar la jerarquía: la división (÷) se resuelve antes que la suma (+).`,
            `Calcular la división: ${b} ÷ ${c} = ${quotient}`,
            `Reemplazar en la expresión: ${a} + ${quotient}`,
            `Resolver la suma final: ${a} + ${quotient} = ${ans}`
          ],
          stepsEn: [
            `Identify precedence: division (÷) is solved before addition (+).`,
            `Calculate the division: ${b} ÷ ${c} = ${quotient}`,
            `Substitute back: ${a} + ${quotient}`,
            `Solve the final addition: ${a} + ${quotient} = ${ans}`
          ]
        };
      },
      // 5: a - b / c
      () => {
        const c = this.randomInt(2, 8);
        const quotient = this.randomInt(2, 8);
        const b = c * quotient;
        const a = quotient + this.randomInt(4, 25);
        const ans = a - quotient;
        return {
          displayExpr: `${a} - ${b} ÷ ${c}`,
          answer: ans,
          stepsEs: [
            `Identificar la jerarquía: la división (÷) tiene prioridad sobre la resta (−).`,
            `Calcular la división: ${b} ÷ ${c} = ${quotient}`,
            `Reemplazar en la expresión: ${a} - ${quotient}`,
            `Resolver la resta final: ${a} - ${quotient} = ${ans}`
          ],
          stepsEn: [
            `Identify precedence: division (÷) has priority over subtraction (−).`,
            `Calculate the division: ${b} ÷ ${c} = ${quotient}`,
            `Substitute back: ${a} - ${quotient}`,
            `Solve the final subtraction: ${a} - ${quotient} = ${ans}`
          ]
        };
      },
      // 6: a * b - c
      () => {
        const a = this.randomInt(3, 9);
        const b = this.randomInt(2, 8);
        const prod = a * b;
        const c = this.randomInt(2, prod - 2);
        const ans = prod - c;
        return {
          displayExpr: `${a} × ${b} - ${c}`,
          answer: ans,
          stepsEs: [
            `Identificar la jerarquía: resolver la multiplicación (×) antes que la resta (−).`,
            `Calcular la multiplicación: ${a} × ${b} = ${prod}`,
            `Reemplazar en la expresión: ${prod} - ${c}`,
            `Resolver la resta final: ${prod} - ${c} = ${ans}`
          ],
          stepsEn: [
            `Identify precedence: solve multiplication (×) before subtraction (−).`,
            `Calculate the multiplication: ${a} × ${b} = ${prod}`,
            `Substitute back: ${prod} - ${c}`,
            `Solve the final subtraction: ${prod} - ${c} = ${ans}`
          ]
        };
      }
    ];

    const pick = patterns[Math.floor(Math.random() * patterns.length)];
    return pick();
  }

  /**
   * Medio: Operaciones con paréntesis simples
   * Los paréntesis alteran o delimitan el orden natural
   */
  generateMedium() {
    const patterns = [
      // 1: (a + b) * c
      () => {
        const a = this.randomInt(2, 9);
        const b = this.randomInt(2, 9);
        const c = this.randomInt(2, 8);
        const inside = a + b;
        const ans = inside * c;
        return {
          displayExpr: `(${a} + ${b}) × ${c}`,
          answer: ans,
          stepsEs: [
            `Por regla PAPOMUDAS, los PARÉNTESIS se resuelven primero: (${a} + ${b})`,
            `Resolver la operación interna: ${a} + ${b} = ${inside}`,
            `Reemplazar el paréntesis en la expresión: ${inside} × ${c}`,
            `Resolver la multiplicación final: ${inside} × ${c} = ${ans}`
          ],
          stepsEn: [
            `By PEMDAS rule, PARENTHESES must be evaluated first: (${a} + ${b})`,
            `Evaluate inside the parentheses: ${a} + ${b} = ${inside}`,
            `Substitute back into the expression: ${inside} × ${c}`,
            `Solve the final multiplication: ${inside} × ${c} = ${ans}`
          ]
        };
      },
      // 2: c * (a - b)
      () => {
        const b = this.randomInt(2, 7);
        const inside = this.randomInt(2, 8);
        const a = b + inside;
        const c = this.randomInt(3, 9);
        const ans = c * inside;
        return {
          displayExpr: `${c} × (${a} - ${b})`,
          answer: ans,
          stepsEs: [
            `Por jerarquía, resolver primero lo que está dentro del PARÉNTESIS: (${a} - ${b})`,
            `Calcular la resta interna: ${a} - ${b} = ${inside}`,
            `Reemplazar en la expresión: ${c} × ${inside}`,
            `Resolver la multiplicación: ${c} × ${inside} = ${ans}`
          ],
          stepsEn: [
            `By hierarchy, resolve what is inside the PARENTHESES first: (${a} - ${b})`,
            `Calculate inside subtraction: ${a} - ${b} = ${inside}`,
            `Substitute back: ${c} × ${inside}`,
            `Solve the multiplication: ${c} × ${inside} = ${ans}`
          ]
        };
      },
      // 3: (a + b) / c (con suma divisible por c)
      () => {
        const c = this.randomInt(2, 6);
        const quotient = this.randomInt(3, 9);
        const total = c * quotient;
        const a = this.randomInt(2, total - 2);
        const b = total - a;
        const ans = quotient;
        return {
          displayExpr: `(${a} + ${b}) ÷ ${c}`,
          answer: ans,
          stepsEs: [
            `Primero resolvemos el PARÉNTESIS: (${a} + ${b})`,
            `Calcular la suma interna: ${a} + ${b} = ${total}`,
            `Reemplazar en la expresión: ${total} ÷ ${c}`,
            `Resolver la división final: ${total} ÷ ${c} = ${ans}`
          ],
          stepsEn: [
            `First, evaluate the PARENTHESES: (${a} + ${b})`,
            `Calculate inside addition: ${a} + ${b} = ${total}`,
            `Substitute back: ${total} ÷ ${c}`,
            `Solve the final division: ${total} ÷ ${c} = ${ans}`
          ]
        };
      },
      // 4: a + (b - c) * d
      () => {
        const c = this.randomInt(2, 6);
        const diff = this.randomInt(2, 7);
        const b = c + diff;
        const d = this.randomInt(2, 6);
        const a = this.randomInt(4, 25);
        const prod = diff * d;
        const ans = a + prod;
        return {
          displayExpr: `${a} + (${b} - ${c}) × ${d}`,
          answer: ans,
          stepsEs: [
            `1. Paréntesis primero: calcular (${b} - ${c}) = ${diff}`,
            `2. Expresión reducida: ${a} + ${diff} × ${d}`,
            `3. Multiplicación antes que la suma: ${diff} × ${d} = ${prod}`,
            `4. Sumar resultado: ${a} + ${prod} = ${ans}`
          ],
          stepsEn: [
            `1. Parentheses first: calculate (${b} - ${c}) = ${diff}`,
            `2. Reduced expression: ${a} + ${diff} × ${d}`,
            `3. Multiplication before addition: ${diff} × ${d} = ${prod}`,
            `4. Add results: ${a} + ${prod} = ${ans}`
          ]
        };
      },
      // 5: a - (b + c) / d
      () => {
        const d = this.randomInt(2, 5);
        const quotient = this.randomInt(2, 6);
        const sum = d * quotient;
        const b = this.randomInt(1, sum - 1);
        const c = sum - b;
        const a = quotient + this.randomInt(5, 30);
        const ans = a - quotient;
        return {
          displayExpr: `${a} - (${b} + ${c}) ÷ ${d}`,
          answer: ans,
          stepsEs: [
            `1. Resolver el paréntesis: (${b} + ${c}) = ${sum}`,
            `2. Expresión restante: ${a} - ${sum} ÷ ${d}`,
            `3. Realizar la división antes de la resta: ${sum} ÷ ${d} = ${quotient}`,
            `4. Resta final: ${a} - ${quotient} = ${ans}`
          ],
          stepsEn: [
            `1. Evaluate parentheses first: (${b} + ${c}) = ${sum}`,
            `2. Remaining expression: ${a} - ${sum} ÷ ${d}`,
            `3. Perform division before subtraction: ${sum} ÷ ${d} = ${quotient}`,
            `4. Final subtraction: ${a} - ${quotient} = ${ans}`
          ]
        };
      }
    ];

    const pick = patterns[Math.floor(Math.random() * patterns.length)];
    return pick();
  }

  /**
   * Avanzado: Operaciones combinadas completas con paréntesis, multiplicación, división, suma y resta
   */
  generateHard() {
    const patterns = [
      // 1: (a + b * c) / d + e
      () => {
        const b = this.randomInt(2, 5);
        const c = this.randomInt(2, 6);
        const prod = b * c;
        const d = this.randomInt(2, 6);
        const quotient = this.randomInt(2, 8);
        const targetInside = d * quotient;
        if (targetInside <= prod) return null; // para asegurar a > 0
        const a = targetInside - prod;
        const e = this.randomInt(3, 20);
        const ans = quotient + e;

        return {
          displayExpr: `(${a} + ${b} × ${c}) ÷ ${d} + ${e}`,
          answer: ans,
          stepsEs: [
            `1. Dentro del PARÉNTESIS, la multiplicación (×) va primero: ${b} × ${c} = ${prod}`,
            `2. Terminar el paréntesis sumando: ${a} + ${prod} = ${targetInside}`,
            `3. Expresión reducida: ${targetInside} ÷ ${d} + ${e}`,
            `4. La división (÷) tiene prioridad sobre la suma (+): ${targetInside} ÷ ${d} = ${quotient}`,
            `5. Suma final: ${quotient} + ${e} = ${ans}`
          ],
          stepsEn: [
            `1. Inside PARENTHESES, multiplication (×) goes first: ${b} × ${c} = ${prod}`,
            `2. Finish the parentheses addition: ${a} + ${prod} = ${targetInside}`,
            `3. Reduced expression: ${targetInside} ÷ ${d} + ${e}`,
            `4. Division (÷) takes priority over addition (+): ${targetInside} ÷ ${d} = ${quotient}`,
            `5. Final addition: ${quotient} + ${e} = ${ans}`
          ]
        };
      },
      // 2: a * (b - c) - d / e
      () => {
        const a = this.randomInt(3, 8);
        const diff = this.randomInt(3, 7);
        const c = this.randomInt(2, 8);
        const b = c + diff;
        const e = this.randomInt(2, 5);
        const quotient = this.randomInt(2, 6);
        const d = e * quotient;
        const term1 = a * diff;
        if (term1 <= quotient) return null;
        const ans = term1 - quotient;

        return {
          displayExpr: `${a} × (${b} - ${c}) - ${d} ÷ ${e}`,
          answer: ans,
          stepsEs: [
            `1. Resolver primero el paréntesis: (${b} - ${c}) = ${diff}`,
            `2. Expresión: ${a} × ${diff} - ${d} ÷ ${e}`,
            `3. Resolver multiplicaciones y divisiones de izquierda a derecha:`,
            `   • Multiplicación: ${a} × ${diff} = ${term1}`,
            `   • División: ${d} ÷ ${e} = ${quotient}`,
            `4. Expresión reducida: ${term1} - ${quotient}`,
            `5. Resta final: ${term1} - ${quotient} = ${ans}`
          ],
          stepsEn: [
            `1. Resolve parentheses first: (${b} - ${c}) = ${diff}`,
            `2. Expression: ${a} × ${diff} - ${d} ÷ ${e}`,
            `3. Perform multiplication and division from left to right:`,
            `   • Multiplication: ${a} × ${diff} = ${term1}`,
            `   • Division: ${d} ÷ ${e} = ${quotient}`,
            `4. Reduced expression: ${term1} - ${quotient}`,
            `5. Final subtraction: ${term1} - ${quotient} = ${ans}`
          ]
        };
      },
      // 3: (a * b - c) / d + (e - f)
      () => {
        const a = this.randomInt(3, 7);
        const b = this.randomInt(3, 6);
        const prod = a * b;
        const d = this.randomInt(2, 6);
        const quotient = this.randomInt(2, 6);
        const targetInside1 = d * quotient;
        if (prod <= targetInside1) return null;
        const c = prod - targetInside1;
        const f = this.randomInt(2, 8);
        const diff2 = this.randomInt(2, 9);
        const e = f + diff2;
        const ans = quotient + diff2;

        return {
          displayExpr: `(${a} × ${b} - ${c}) ÷ ${d} + (${e} - ${f})`,
          answer: ans,
          stepsEs: [
            `1. Resolver el primer paréntesis: multiplicación ${a} × ${b} = ${prod}, luego ${prod} - ${c} = ${targetInside1}`,
            `2. Resolver el segundo paréntesis: ${e} - ${f} = ${diff2}`,
            `3. Expresión con paréntesis resueltos: ${targetInside1} ÷ ${d} + ${diff2}`,
            `4. Resolver la división antes de la suma: ${targetInside1} ÷ ${d} = ${quotient}`,
            `5. Suma final: ${quotient} + ${diff2} = ${ans}`
          ],
          stepsEn: [
            `1. Solve first parentheses: multiply ${a} × ${b} = ${prod}, then ${prod} - ${c} = ${targetInside1}`,
            `2. Solve second parentheses: ${e} - ${f} = ${diff2}`,
            `3. Expression after parentheses: ${targetInside1} ÷ ${d} + ${diff2}`,
            `4. Resolve division before addition: ${targetInside1} ÷ ${d} = ${quotient}`,
            `5. Final addition: ${quotient} + ${diff2} = ${ans}`
          ]
        };
      },
      // 4: a + (b * c - d) / e
      () => {
        const a = this.randomInt(5, 25);
        const b = this.randomInt(3, 7);
        const c = this.randomInt(2, 6);
        const prod = b * c;
        const e = this.randomInt(2, 6);
        const quotient = this.randomInt(2, 7);
        const targetInside = e * quotient;
        if (prod <= targetInside) return null;
        const d = prod - targetInside;
        const ans = a + quotient;

        return {
          displayExpr: `${a} + (${b} × ${c} - ${d}) ÷ ${e}`,
          answer: ans,
          stepsEs: [
            `1. Dentro del paréntesis: primero multiplicar ${b} × ${c} = ${prod}`,
            `2. Terminar el paréntesis restando: ${prod} - ${d} = ${targetInside}`,
            `3. Expresión reducida: ${a} + ${targetInside} ÷ ${e}`,
            `4. Resolver la división antes de la suma: ${targetInside} ÷ ${e} = ${quotient}`,
            `5. Suma final: ${a} + ${quotient} = ${ans}`
          ],
          stepsEn: [
            `1. Inside parentheses: first multiply ${b} × ${c} = ${prod}`,
            `2. Finish the parentheses subtraction: ${prod} - ${d} = ${targetInside}`,
            `3. Reduced expression: ${a} + ${targetInside} ÷ ${e}`,
            `4. Resolve division before addition: ${targetInside} ÷ ${e} = ${quotient}`,
            `5. Final addition: ${a} + ${quotient} = ${ans}`
          ]
        };
      }
    ];

    const pick = patterns[Math.floor(Math.random() * patterns.length)];
    return pick ? pick() : null;
  }
}

window.mathEngine = new MathEngine();
