"use strict";

class Calculadora {
  constructor() {
    this.output = {
      valoresPantalla: document.querySelector(".valores__pantalla"),
      resultadoEnPantalla: document.querySelector(".resultado__pantalla"),
    };
    this.opciones = {
      btnHistorial: document.querySelector(".btn-historial"),
      btnAvanzado: document.querySelector(".btn-avanzado"),
    };
    this.btnNumericos = {
      btn0: document.querySelector(".btn-0"),
      btn1: document.querySelector(".btn-1"),
      btn2: document.querySelector(".btn-2"),
      btn3: document.querySelector(".btn-3"),
      btn4: document.querySelector(".btn-4"),
      btn5: document.querySelector(".btn-5"),
      btn6: document.querySelector(".btn-6"),
      btn7: document.querySelector(".btn-7"),
      btn8: document.querySelector(".btn-8"),
      btn9: document.querySelector(".btn-9"),
    };
    this.btnDeOperaciones = {
      btnSuma: document.querySelector(".btn-suma"),
      btnResta: document.querySelector(".btn-resta"),
      btnMultiplicacion: document.querySelector(".btn-multiplicacion"),
      btnDivision: document.querySelector(".btn-division"),
      btnPorcentaje: document.querySelector(".btn-porcentaje"),
    };
    this.btnEspeciales = {
      btnBorrar: document.querySelector(".btn-c"),
      btnParentesis: document.querySelector(".btn-parentesis"),
      btnSigno: document.querySelector(".btn-signo"),
      btnPunto: document.querySelector(".btn-punto"),
      btnIgual: document.querySelector(".btn-igual"),
    };
    this.interfaz = {
      containerHistorial: document.querySelector(".container__historial"),
      containerAvanzado: document.querySelector(".container__avanzado"),
      historialInput: document.querySelectorAll(
        ".container__historial__bloque__operacion__input"
      ),
      historialOutput: document.querySelectorAll(
        ".container__historial__bloque__operacion__output"
      ),
    };
  }

  /* {array}=> [...(...ultimaPosicion)...] || length - 1 */
  detrasDe(array) {
    if (array.includes("(") && array.includes(")")) {
      return array.indexOf(")") - 1;
    } else {
      return array.length - 1;
    }
  }

  getDate() {
    const monthsInWord = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec",
    };
    const date = new Date();

    const localeTimeString = date.toLocaleTimeString();
    const year = /^\d{2}(\d{2})$/.exec(date.getFullYear());
    const time = /^(\d{1,2}):(\d{2})/.exec(localeTimeString);
    const meridian = /.+? (\w)\.\sm\./.exec(localeTimeString);

    return {
      year: year[1],
      month: monthsInWord[date.getMonth()],
      day: date.getDay() + 1,
      hour: time[1],
      minutes: time[2],
      meridian: `${meridian[1]}m`,
    };
  }

  saveOperation(input, result) {
    const { containerHistorial } = this.interfaz;
    const { year, month, day, hour, minutes, meridian } = this.getDate();

    /* https://lenguajejs.com/javascript/dom/insertar-elementos-dom/#:~:text=Uno%20de%20los%20m%C3%A9todos%20m%C3%A1s,sobre%20el%20que%20se%20realiza. */

    const createHtml = (type, idClass = "", text = "") => {
      const element = document.createElement(type);
      element.classList.add(idClass);
      element.textContent = text;
      return element;
    };

    /* if (containerHistorial.children.length === 20) {
      containerHistorial.lastElementChild
    } */

    let fragment = document.createDocumentFragment();
    let bloque = createHtml("div", "container__historial__bloque");

    let bloqueTiempo = createHtml(
      "div",
      "container__historial__bloque__tiempo"
    );
    bloque.appendChild(bloqueTiempo);

    bloqueTiempo.appendChild(
      createHtml(
        "p",
        "container__historial__bloque__tiempo__fecha",
        `${day} ${month} ${year}`
      )
    );

    bloqueTiempo.appendChild(
      createHtml(
        "p",
        "container__historial__bloque__tiempo__hora",
        `${hour}:${minutes}${meridian}`
      )
    );

    let bloqueOperacion = createHtml(
      "div",
      "container__historial__bloque__operacion"
    );

    bloque.appendChild(bloqueOperacion);

    bloqueOperacion.appendChild(
      createHtml("p", "container__historial__bloque__operacion__input", input)
    );

    bloqueOperacion.appendChild(
      createHtml("p", "container__historial__bloque__operacion__igualdad", "=")
    );

    bloqueOperacion.appendChild(
      createHtml("p", "container__historial__bloque__operacion__output", result)
    );

    fragment.appendChild(bloque);
    containerHistorial.prepend(fragment);
    console.log(bloque);
  }

  /* {}=> 2+2 = 4 */
  calcular() {
    const { valoresPantalla, resultadoEnPantalla } = this.output;
    let valoresSeparados = valoresPantalla.textContent.split(/([\\+()/x%])/);

    const numbersPosition = (array, signo) => {
      return [
        array.indexOf(signo) - 1,
        array[array.indexOf(signo) - 1],
        array[array.indexOf(signo) + 1],
      ];
    };

    const porcentaje = (array) => {
      let newArray = array;
      while (newArray.includes("%")) {
        let [posicionNum1, num1, num2] = numbersPosition(newArray, "%");
        newArray.splice(posicionNum1, 2, num1 / 100);
      }
      return newArray;
    };
    const divivir = (array) => {
      let newArray = array;
      while (newArray.includes("/")) {
        let [posicionNum1, num1, num2] = numbersPosition(newArray, "/");
        newArray.splice(posicionNum1, 3, num1 / num2);
      }
      return newArray;
    };
    const multiplicar = (array) => {
      let newArray = array;
      while (newArray.includes("x")) {
        let [posicionNum1, num1, num2] = numbersPosition(newArray, "x");
        newArray.splice(posicionNum1, 3, num1 * num2);
      }
      return newArray;
    };
    const restar = (array) => {
      let newArray = array;
      while (newArray.includes("-")) {
        let [posicionNum1, num1, num2] = numbersPosition(newArray, "-");
        newArray.splice(posicionNum1, 3, num1 - num2);
      }
      return newArray;
    };
    const sumar = (array) => {
      let newArray = array;
      while (newArray.includes("+")) {
        let [posicionNum1, num1, num2] = numbersPosition(newArray, "+");
        newArray.splice(posicionNum1, 3, num1 + num2);
      }
      return newArray;
    };

    const doOperation = (array) => {
      let newArray = array;
      let resultado;

      resultado = porcentaje(newArray);
      resultado = divivir(newArray);
      resultado = multiplicar(newArray);
      resultado = restar(newArray);
      resultado = sumar(newArray);
      return resultado[0];
    };

    //console.log(doOperation([1,'+', 4, '+', 10, '+', 20, '+', 100, '-', 20]))

    const cleanArray = (array) => {
      let newArray = array;
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] == "" || newArray[i] == undefined)
          newArray.splice(i, 1);
      }
      return newArray;
    };

    const negativeSeparator = (array) => {
      let newArray = array;
      for (let i = 0; i < newArray.length; i++) {
        if (/(\-\d+)/.test(newArray[i]) || /(\d+\-)/.test(newArray[i])) {
          let separatedNegative = newArray[i].split(
            /(\-\d+\.\d+)|(\-\d+)|([\-])/
          );
          newArray.splice(i, 1);
          for (let j = separatedNegative.length - 1; j >= 0; j--) {
            if (separatedNegative[j] != "" && separatedNegative[j] != undefined)
              newArray.splice(i, 0, separatedNegative[j]);
          }
        }
      }
      return cleanArray(newArray);
    };

    const addSimbols = (array) => {
      let newArray = negativeSeparator(array);
      for (let i = 0; i < newArray.length; i++) {
        let back = i - 1;
        if (
          /^(\-\d+)/.test(newArray[i]) &&
          (/(\d+)$/.test(newArray[back]) || /^%$/.test(newArray[back]))
        ) {
          newArray.splice(i, 0, "+");
        }
        if (
          /[\\(]/.test(newArray[i]) &&
          (/(\d+)$/.test(newArray[back]) || /^%$/.test(newArray[back]))
        ) {
          newArray.splice(i, 0, "x");
        }
      }
      return newArray;
    };

    const toNumberConverter = (array) => {
      let newArray = addSimbols(array);
      for (let i = 0; i < newArray.length; i++) {
        if (/(\d+\.\d+)|(\d+)/.test(newArray[i])) {
          newArray.splice(i, 1, parseFloat(newArray[i]));
        }
      }
      return cleanArray(newArray);
    };

    const expresionReductor = (array) => {
      let newArray = toNumberConverter(array);

      while (newArray.includes("(") && newArray.includes(")")) {
        let fragment = newArray.slice(
          newArray.lastIndexOf("(") + 1,
          newArray.indexOf(")")
        );
        newArray.splice(
          newArray.lastIndexOf("("),
          fragment.length + 2,
          doOperation(fragment)
        );
      }
      console.log(newArray);
      let result = doOperation(newArray);
      console.log(result);

      return result;
    };

    return expresionReductor(valoresSeparados);
  }

  actualizacionesGenerales() {
    const { valoresPantalla, resultadoEnPantalla } = this.output;

    const colorSimbols = (simbolos) => {
      let contenidoDePantalla = valoresPantalla.textContent.split("");

      for (let elemento in contenidoDePantalla) {
        for (let i = 0; i < simbolos.length; i++) {
          if (contenidoDePantalla[elemento] == simbolos[i]) {
            contenidoDePantalla.splice(
              elemento,
              1,
              `<span style='color: #1bf';>${contenidoDePantalla[elemento]}</span>`
            );
          }
        }
      }
      valoresPantalla.innerHTML = contenidoDePantalla.join("");
    };

    const showResult = () => {
      let result = this.calcular();
      if (!isNaN(result)) resultadoEnPantalla.textContent = result;
      //if (result = undefined || result == '') resultadoEnPantalla.textContent = '0';
    };

    colorSimbols(["x", "/", "-", "+", "%", "(", ")", "."]);
    showResult();
  }

  colorcarElementos(elemento) {
    const { valoresPantalla, resultadoEnPantalla } = this.output;
    if (
      valoresPantalla.textContent.includes("(") &&
      valoresPantalla.textContent.includes(")")
    ) {
      let arrayDeValores = valoresPantalla.textContent.split("");
      arrayDeValores.splice(arrayDeValores.indexOf(")"), 0, elemento);
      valoresPantalla.textContent = arrayDeValores.join("");
    } else {
      valoresPantalla.textContent += elemento;
    }
    this.actualizacionesGenerales();
  }

  btnOpcionesFuncional() {
    const { btnHistorial, btnAvanzado } = this.opciones;
      

  }

  /* ([...btnNum])=> btnNum.addEventListener => (pantalla: ...789)  */
  btnNumericosFuncional() {
    const { valoresPantalla, resultadoEnPantalla } = this.output;
    const { btn0, btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9 } =
      this.btnNumericos;
    let botones = [btn0, btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9];

    for (let i = 0; i < botones.length; i++) {
      botones[i].addEventListener("click", () => {
        if (valoresPantalla.textContent == "Error")
          valoresPantalla.textContent = "";
        let arrayDeValores = valoresPantalla.textContent.split("");
        if (arrayDeValores[this.detrasDe(arrayDeValores)] == "%") {
          this.colorcarElementos(`x${i}`);
        } else {
          this.colorcarElementos(i);
        }
      });
    }
    this.actualizacionesGenerales();
  }

  /* ([...abc], signo) => signo != [...abc][...a] ? pantalla += signo  */
  comprobacionDeSignos(otrosSignos = [], elementosProhibidos = [], signo) {
    const { valoresPantalla, resultadoEnPantalla } = this.output;

    let arrayValoresPantalla = valoresPantalla.textContent.split("");
    let contiene = false;

    const comprobarIgualdad = (arreglo) => {
      for (let elemento of arreglo) {
        if (
          arrayValoresPantalla[this.detrasDe(arrayValoresPantalla)] == elemento
        )
          return true;
      }
      return false;
    };
    const comprobarProhibicion = (arreglo) => {
      for (let elemento of arreglo) {
        if (
          arrayValoresPantalla[this.detrasDe(arrayValoresPantalla)] == elemento
        )
          return true;
      }
      return false;
    };

    if (comprobarIgualdad(otrosSignos)) {
      contiene = true;
      arrayValoresPantalla.splice(
        this.detrasDe(arrayValoresPantalla),
        1,
        signo
      );
      valoresPantalla.textContent = arrayValoresPantalla.join("");
      this.actualizacionesGenerales();
    }
    if (
      !contiene &&
      arrayValoresPantalla[this.detrasDe(arrayValoresPantalla)] != undefined &&
      !comprobarProhibicion(elementosProhibidos)
    ) {
      this.colorcarElementos(signo);
      return true;
    }
  }

  /* ([...btnSigno])=> btn.addEventListener => (pantalla: ...+-) */
  btnDeOperacionesFuncional() {
    const { btnSuma, btnResta, btnMultiplicacion, btnDivision, btnPorcentaje } =
      this.btnDeOperaciones;

    btnSuma.addEventListener("click", (e) => {
      this.comprobacionDeSignos(["x", "/", "-", "+"], [".", "(", ")"], "+");
    });
    btnResta.addEventListener("click", () => {
      this.comprobacionDeSignos(["x", "/", "-", "+"], [".", "(", ")"], "-");
    });
    btnMultiplicacion.addEventListener("click", () => {
      this.comprobacionDeSignos(["x", "/", "-", "+"], [".", "(", ")"], "x");
    });
    btnDivision.addEventListener("click", () => {
      this.comprobacionDeSignos(["x", "/", "-", "+"], [".", "(", ")"], "/");
    });
    btnPorcentaje.addEventListener("click", () => {
      this.comprobacionDeSignos(
        ["x", "/", "%", "+", "-"],
        [".", "(", ")"],
        "%"
      );
    });
  }

  btnEspecialesFuncional() {
    const { valoresPantalla, resultadoEnPantalla } = this.output;
    const { btnBorrar, btnParentesis, btnSigno, btnPunto, btnIgual } =
      this.btnEspeciales;

    btnBorrar.addEventListener("click", () => {
      let arrayDeValores = valoresPantalla.textContent.split("");
      arrayDeValores.pop();
      valoresPantalla.textContent = arrayDeValores.join("");
      this.actualizacionesGenerales();
    });

    const borrarTodo = () => {
      let intervaloContador;
      let contador = 0;

      const actualizarContador = () => {
        contador++;
        console.log(contador);
        if (contador >= 1) {
          valoresPantalla.textContent = "";
          clearInterval(intervaloContador);
          contador = 0;
          return 0;
        }
      };

      /* Este es para cuando se deje el mouse presionado. El onmouseup es para cuando se deje de presionar */
      btnBorrar.onmousedown = () => {
        intervaloContador = setInterval(actualizarContador, 600);
      };
      btnBorrar.onmouseup = () => {
        clearInterval(intervaloContador);
      };
      this.actualizacionesGenerales();
    };
    borrarTodo();

    const conteoParentesis = () => {
      let arrayDeValores = valoresPantalla.textContent.split("");
      let parentesisAbiertos = 0,
        parentesisCerrados = 0;

      for (let elemento of arrayDeValores) {
        if (elemento == "(") parentesisAbiertos++;
        if (elemento == ")") parentesisCerrados++;
      }
      return {
        abiertos: parentesisAbiertos,
        cerrados: parentesisCerrados,
      };
    };

    btnParentesis.addEventListener("click", () => {
      if (valoresPantalla.textContent.includes("(")) {
        let parentesis = conteoParentesis();
        if (parentesis.abiertos == parentesis.cerrados) {
          this.colorcarElementos("()");
        } else {
          while (parentesis.abiertos > parentesis.cerrados) {
            this.colorcarElementos(")");
            parentesis.cerrados++;
          }
        }
        return;
      }
      this.colorcarElementos("()");
    });

    btnSigno.addEventListener("click", () => {
      let arrayDeValores = valoresPantalla.textContent.split("");
      if (
        arrayDeValores[this.detrasDe(arrayDeValores)] == undefined ||
        arrayDeValores[this.detrasDe(arrayDeValores)] == "(" ||
        arrayDeValores[this.detrasDe(arrayDeValores)] == "x" ||
        arrayDeValores[this.detrasDe(arrayDeValores)] == "/"
      ) {
        this.colorcarElementos("-");
      } else if (arrayDeValores[this.detrasDe(arrayDeValores)] == "-") {
        arrayDeValores.splice(this.detrasDe(arrayDeValores), 1, "");
        valoresPantalla.textContent = arrayDeValores.join("");
      }
    });

    btnPunto.addEventListener("click", () => {
      let arrayDeValores = valoresPantalla.textContent.split(/([\+\-\x\/()])/);
      if (
        /^\d+$/.test(arrayDeValores[this.detrasDe(arrayDeValores)]) &&
        !arrayDeValores[this.detrasDe(arrayDeValores)].includes(".")
      ) {
        this.colorcarElementos(".");
      }
    });

    btnIgual.addEventListener("click", () => {
      if (
        valoresPantalla.textContent.includes("(") &&
        conteoParentesis().abiertos > conteoParentesis().cerrados
      ) {
        btnParentesis.click();
      }
      let result = this.calcular();
      if (!isNaN(result)) {
        this.saveOperation(valoresPantalla.textContent, result);
        valoresPantalla.textContent = result;
      } else valoresPantalla.textContent = "Error";
    });

    this.actualizacionesGenerales();
  }

  btnInterfazFuncional() {
    const { valoresPantalla } = this.output;
    const { containerHistorial, historialInput, historialOutput } = this.interfaz;

    containerHistorial.addEventListener('click', (e) => {
      if (
        e.target.classList.contains(
          "container__historial__bloque__operacion__input"
        ) ||
        e.target.classList.contains(
          "container__historial__bloque__operacion__output"
        )
      ) {
        valoresPantalla.textContent = e.target.textContent;
      }
    })
  }
}

let Calculadora1 = new Calculadora();

(() => {
  console.log(Math);
})();

(() => {
  Calculadora1.btnNumericosFuncional();
  Calculadora1.btnDeOperacionesFuncional();
  Calculadora1.btnEspecialesFuncional();
  Calculadora1.actualizacionesGenerales();
  Calculadora1.btnInterfazFuncional();
})();
