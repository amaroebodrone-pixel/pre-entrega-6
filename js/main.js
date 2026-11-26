// =====================================================
// Simulador de Ahorro Personal
// Pre-Entrega 6: Funciones de Orden Superior
// (continúa lo hecho en las pre-entregas 2, 3, 4 y 5)
//
// Métodos de orden superior usados con el array de objetos:
//   BÚSQUEDA:        find, findIndex, filter, some
//   TRANSFORMACIÓN:  map, sort, reduce
//   RECORRIDO:       forEach
// =====================================================


// ---------- CONSTANTES GLOBALES ----------
const MESES_POR_ANIO = 12;
const OPCION_SALIR = "0";


// =====================================================
// CLASE: MetaDeAhorro
// Es la "fábrica" de metas. Cada meta sabe cuánto necesita,
// cuánto lleva ahorrado y puede calcular su propio progreso.
// =====================================================
class MetaDeAhorro {
    // El constructor recibe 4 parámetros y los guarda en el objeto con "this"
    constructor(id, nombre, montoObjetivo, montoAhorrado) {
        this.id = id;                       // número que identifica a la meta
        this.nombre = nombre;               // ej: "Notebook"
        this.montoObjetivo = montoObjetivo; // cuánto dinero necesita
        this.montoAhorrado = montoAhorrado; // cuánto lleva juntado hasta ahora
    }

    // MÉTODO: suma dinero a la meta (MODIFICA el estado del objeto)
    aportar(monto) {
        this.montoAhorrado = this.montoAhorrado + monto;
        return this.montoAhorrado;
    }

    // MÉTODO: informa cuánto falta para cumplir la meta (nunca menos de 0)
    calcularFaltante() {
        const faltante = this.montoObjetivo - this.montoAhorrado;
        return faltante > 0 ? faltante : 0;
    }

    // MÉTODO: informa el porcentaje de avance (máximo 100%)
    calcularPorcentaje() {
        const porcentaje = Math.round((this.montoAhorrado * 100) / this.montoObjetivo);
        return porcentaje > 100 ? 100 : porcentaje;
    }

    // MÉTODO: informa si la meta ya se cumplió (true / false)
    estaCumplida() {
        return this.montoAhorrado >= this.montoObjetivo;
    }

    // MÉTODO: calcula cuántos meses faltan según el ahorro mensual del usuario
    calcularMesesRestantes(ahorroMensual) {
        return Math.ceil(this.calcularFaltante() / ahorroMensual);
    }

    // MÉTODO: arma un texto corto con el estado de la meta
    describir() {
        const estado = this.estaCumplida() ? " ✅ ¡Cumplida!" : "";
        return this.nombre + ": " + formatearPesos(this.montoAhorrado) + " de " +
            formatearPesos(this.montoObjetivo) + " (" + this.calcularPorcentaje() + "%)" + estado;
    }
}


// =====================================================
// INSTANCIAS: creamos objetos reales con "new"
// y los guardamos en constantes
// =====================================================
const fondoDeEmergencia = new MetaDeAhorro(1, "Fondo de emergencia", 300000, 120000);
const cursoDeIngles = new MetaDeAhorro(2, "Curso de inglés", 90000, 30000);
const notebook = new MetaDeAhorro(3, "Notebook", 800000, 0);
const vacaciones = new MetaDeAhorro(4, "Vacaciones", 500000, 50000);
const bicicleta = new MetaDeAhorro(5, "Bicicleta", 250000, 250000);

// ARRAY DE OBJETOS: la lista de metas, ordenada por prioridad
// (la primera, índice 0, es la más importante)
const metasDeAhorro = [fondoDeEmergencia, cursoDeIngles, notebook, vacaciones, bicicleta];

// Contador para darle un id nuevo a cada meta que se agregue
let proximoId = metasDeAhorro.length + 1;


// =====================================================
// FUNCIONES DE ENTRADA DE DATOS
// =====================================================

// FUNCIÓN DECLARADA: pide un texto que no puede quedar vacío.
function pedirTexto(mensaje) {
    let texto = prompt(mensaje);

    while (texto === null || texto.trim() === "") {
        alert("Este dato no puede quedar vacío. Intentá de nuevo.");
        texto = prompt(mensaje);
    }

    return texto;
}

// FUNCIÓN DECLARADA: pide un número mayor a 0.
function pedirNumeroPositivo(mensaje) {
    let numero;

    do {
        numero = parseFloat(prompt(mensaje));

        if (isNaN(numero)) {
            alert("Eso no es un número. Escribí solo números, sin $ ni puntos de miles.");
        } else if (numero <= 0) {
            alert("El número tiene que ser mayor a 0.");
        }
    } while (isNaN(numero) || numero <= 0);

    return numero;
}

// FUNCIÓN EXPRESADA: muestra el menú y devuelve la opción elegida.
const mostrarMenu = function (nombre, ahorroMensual) {
    return prompt(
        "MENÚ - ¿Qué querés hacer, " + nombre + "?\n" +
        "Ahorro actual: " + formatearPesos(ahorroMensual) + " por mes\n\n" +
        "--- AHORRO ---\n" +
        "1. Ver mi ahorro mes a mes durante un año\n" +
        "2. Calcular en cuántos meses llego a un monto\n" +
        "3. Cambiar mi ahorro mensual\n" +
        "--- MIS METAS ---\n" +
        "4. Ver mis metas y su progreso\n" +
        "5. Agregar una meta\n" +
        "6. Buscar una meta\n" +
        "7. Aportar dinero a una meta\n" +
        "8. Quitar una meta\n" +
        "--- ANALIZAR MIS METAS ---\n" +
        "9. Filtrar metas\n" +
        "10. Ordenar metas\n" +
        "11. Resumen general y plan de ahorro\n\n" +
        "0. Salir"
    );
};


// =====================================================
// FUNCIONES DE PROCESAMIENTO
// =====================================================

// FUNCIÓN FLECHA: agrega el signo $ a un monto.
const formatearPesos = (monto) => "$" + monto;

// FUNCIÓN FLECHA: calcula cuánto se junta en una cantidad de meses.
const calcularAhorroAcumulado = (ahorroMensual, meses) => ahorroMensual * meses;

// FUNCIÓN FLECHA: deja el texto con la primera letra en mayúscula y el resto en minúscula.
const normalizarTexto = (texto) => texto.trim().charAt(0).toUpperCase() + texto.trim().slice(1).toLowerCase();

// FUNCIÓN EXPRESADA: devuelve los meses necesarios para llegar a un monto.
const calcularMesesParaMonto = function (monto, ahorroMensual) {
    let meses = 0;

    while (calcularAhorroAcumulado(ahorroMensual, meses) < monto) {
        meses++;
    }

    return meses;
};

// FUNCIÓN DECLARADA: busca una meta por su nombre y devuelve su ÍNDICE en el array.
// findIndex (BÚSQUEDA): recorre el array y devuelve la posición del primer
// objeto que cumple la condición. Si no encuentra ninguno, devuelve -1.
function buscarIndicePorNombre(lista, nombreBuscado) {
    return lista.findIndex((meta) => meta.nombre.toLowerCase() === nombreBuscado.trim().toLowerCase());
}

// FUNCIÓN DECLARADA: pide un número de la lista (1, 2, 3...) y devuelve su ÍNDICE (0, 1, 2...).
// Si el número no existe en la lista, devuelve -1.
function pedirIndiceDeMeta(lista, mensaje) {
    const numero = parseInt(prompt(mensaje));

    if (isNaN(numero) || numero < 1 || numero > lista.length) {
        return -1;
    }

    return numero - 1; // los índices de un array empiezan en 0
}


// =====================================================
// FUNCIONES DE SALIDA (mostrar resultados)
// =====================================================

// FUNCIÓN DECLARADA: muestra el ahorro acumulado de cada mes del año.
function mostrarProyeccionAnual(ahorroMensual) {
    console.log("===== AHORRO MES A MES =====");

    for (let mes = 1; mes <= MESES_POR_ANIO; mes++) {
        const acumulado = calcularAhorroAcumulado(ahorroMensual, mes);

        if (mes === 6) {
            console.log("Mes " + mes + ": " + formatearPesos(acumulado) + "  <-- ¡Mitad de año!");
        } else if (mes === MESES_POR_ANIO) {
            console.log("Mes " + mes + ": " + formatearPesos(acumulado) + "  <-- ¡Total del año!");
        } else {
            console.log("Mes " + mes + ": " + formatearPesos(acumulado));
        }
    }

    const totalAnual = calcularAhorroAcumulado(ahorroMensual, MESES_POR_ANIO);
    alert("En un año vas a juntar " + formatearPesos(totalAnual) + ". Mirá el detalle mes a mes en la consola (F12).");
}

// FUNCIÓN DECLARADA: arma un mensaje según cuánto tiempo lleve llegar al monto.
function mostrarResultadoMonto(monto, meses) {
    const anios = Math.ceil(meses / MESES_POR_ANIO);
    let mensaje = "Llegás a " + formatearPesos(monto) + " en " + meses + " meses";

    if (meses <= MESES_POR_ANIO) {
        mensaje = mensaje + ". ¡En menos de un año! 🎉";
    } else if (meses <= MESES_POR_ANIO * 3) {
        mensaje = mensaje + " (unos " + anios + " años). ¡Se puede!";
    } else {
        mensaje = mensaje + " (unos " + anios + " años). Probá aumentar tu ahorro mensual.";
    }

    console.log(mensaje);
    alert(mensaje);
}

// FUNCIÓN DECLARADA: recorre el array de objetos con forEach y arma la lista numerada.
// Usa el método describir() de cada objeto.
// Return: el texto de la lista, para mostrarlo también en un alert o prompt.
function listarMetas(lista, titulo = "MIS METAS DE AHORRO") {
    let texto = "";

    console.log("===== " + titulo + " =====");

    // forEach: ejecuta la función una vez por cada objeto (y nos da su índice)
    lista.forEach((meta, indice) => {
        const linea = (indice + 1) + ". " + meta.describir();
        console.log(linea);
        texto = texto + linea + "\n";
    });

    console.log("Total: " + lista.length + " metas");
    return texto;
}

// FUNCIÓN DECLARADA: se despide del usuario.
function despedir(nombre) {
    console.log("El usuario " + nombre + " salió del simulador.");
    alert("¡Gracias por usar el simulador, " + nombre + "! Seguí ahorrando 💰");
}


// =====================================================
// FUNCIONES QUE TRABAJAN CON EL ARRAY DE OBJETOS
// =====================================================

// AGREGAR: crea un objeto nuevo con "new" y lo suma al array
// con unshift (al principio, si es prioritaria) o push (al final)
function agregarMeta(lista) {
    const nombreMeta = normalizarTexto(pedirTexto("¿Qué meta querés agregar? (ej: Auto, Mudanza)"));

    // evitamos metas repetidas
    if (buscarIndicePorNombre(lista, nombreMeta) !== -1) {
        alert("La meta \"" + nombreMeta + "\" ya está en tu lista.");
        return;
    }

    const montoObjetivo = pedirNumeroPositivo("¿Cuánto dinero necesitás para \"" + nombreMeta + "\"?");

    // Nueva instancia de la clase
    const nuevaMeta = new MetaDeAhorro(proximoId, nombreMeta, montoObjetivo, 0);
    proximoId++;

    const esPrioritaria = prompt("¿Es tu meta más importante? (si / no)");

    if (esPrioritaria !== null && esPrioritaria.trim().toLowerCase() === "si") {
        lista.unshift(nuevaMeta);
        alert("\"" + nuevaMeta.nombre + "\" quedó como tu meta número 1.");
    } else {
        lista.push(nuevaMeta);
        alert("\"" + nuevaMeta.nombre + "\" se agregó al final de tu lista.");
    }

    console.log("Meta creada:", nuevaMeta);
    listarMetas(lista);
}

// BUSCAR: find (BÚSQUEDA) trae el OBJETO completo que coincide con el nombre.
// Si no hay ninguno, devuelve undefined.
function buscarMeta(lista, ahorroMensual) {
    const buscada = pedirTexto("¿Qué meta querés buscar?");
    const meta = lista.find((m) => m.nombre.toLowerCase() === buscada.trim().toLowerCase());
    let mensaje;

    if (meta === undefined) {
        mensaje = "❌ \"" + normalizarTexto(buscada) + "\" no está en tu lista de metas.";
    } else {
        console.log("Objeto encontrado con find:", meta);
        mensaje = "🔎 " + meta.describir() + "\nPosición en la lista: " + (buscarIndicePorNombre(lista, meta.nombre) + 1);

        if (meta.estaCumplida()) {
            mensaje = mensaje + "\n¡Ya juntaste todo lo que necesitabas!";
        } else {
            mensaje = mensaje + "\nTe faltan " + formatearPesos(meta.calcularFaltante()) +
                ". Ahorrando " + formatearPesos(ahorroMensual) + " por mes, la cumplís en " +
                meta.calcularMesesRestantes(ahorroMensual) + " meses.";
        }
    }

    console.log(mensaje);
    alert(mensaje);
}

// APORTAR: usa el método aportar() que MODIFICA el objeto elegido
function aportarAMeta(lista) {
    if (lista.length === 0) {
        alert("No tenés metas cargadas.");
        return;
    }

    const listaTexto = listarMetas(lista);
    const indice = pedirIndiceDeMeta(lista, "¿A qué meta querés aportar? Escribí su número:\n\n" + listaTexto);

    if (indice === -1) {
        alert("Ese número no está en la lista.");
        return;
    }

    const meta = lista[indice];

    if (meta.estaCumplida()) {
        alert("\"" + meta.nombre + "\" ya está cumplida. ¡Elegí otra meta!");
        return;
    }

    const monto = pedirNumeroPositivo("¿Cuánto querés aportar a \"" + meta.nombre + "\"?");
    meta.aportar(monto);

    let mensaje = "Aportaste " + formatearPesos(monto) + ".\n" + meta.describir();

    if (meta.estaCumplida()) {
        mensaje = mensaje + "\n🎉 ¡Felicitaciones, cumpliste tu meta!";
    }

    console.log(mensaje);
    alert(mensaje);
}

// QUITAR: shift (la primera), pop (la última) o splice (una elegida por número)
function quitarMeta(lista) {
    if (lista.length === 0) {
        alert("No tenés metas para quitar.");
        return;
    }

    const opcion = prompt(
        "¿Qué meta querés quitar?\n\n" +
        "1. La primera de la lista (" + lista[0].nombre + ")\n" +
        "2. La última de la lista (" + lista[lista.length - 1].nombre + ")\n" +
        "3. Elegir una por su número"
    );

    let eliminada;

    if (opcion === "1") {
        eliminada = lista.shift();
    } else if (opcion === "2") {
        eliminada = lista.pop();
    } else if (opcion === "3") {
        const indice = pedirIndiceDeMeta(lista, "Escribí el número de la meta:\n\n" + listarMetas(lista));
        if (indice === -1) {
            alert("Ese número no está en la lista.");
            return;
        }
        eliminada = lista.splice(indice, 1)[0];
    } else {
        alert("Opción inválida. No se quitó ninguna meta.");
        return;
    }

    alert("Se ha eliminado la meta: " + eliminada.nombre);
    console.log("Se ha eliminado la meta:", eliminada);
    listarMetas(lista);
}


// =====================================================
// FUNCIONES DE ORDEN SUPERIOR: ANALIZAR LAS METAS
// =====================================================

// FILTRAR: filter (BÚSQUEDA) devuelve un array NUEVO solo con los objetos
// que cumplen la condición. El array original no cambia.
function filtrarMetas(lista) {
    const opcion = prompt(
        "¿Qué metas querés ver?\n\n" +
        "1. Las que todavía no cumplí\n" +
        "2. Las que ya cumplí\n" +
        "3. Las que necesitan al menos cierto monto\n" +
        "4. Las que llevan al menos cierto % de avance"
    );

    let resultado;
    let titulo;

    if (opcion === "1") {
        resultado = lista.filter((meta) => !meta.estaCumplida());
        titulo = "METAS PENDIENTES";
    } else if (opcion === "2") {
        resultado = lista.filter((meta) => meta.estaCumplida());
        titulo = "METAS CUMPLIDAS";
    } else if (opcion === "3") {
        const montoMinimo = pedirNumeroPositivo("¿Desde qué monto? (ej: 200000)");
        resultado = lista.filter((meta) => meta.montoObjetivo >= montoMinimo);
        titulo = "METAS DE " + formatearPesos(montoMinimo) + " O MÁS";
    } else if (opcion === "4") {
        const porcentajeMinimo = pedirNumeroPositivo("¿Desde qué porcentaje de avance? (ej: 50)");
        resultado = lista.filter((meta) => meta.calcularPorcentaje() >= porcentajeMinimo);
        titulo = "METAS CON " + porcentajeMinimo + "% O MÁS DE AVANCE";
    } else {
        alert("Opción inválida.");
        return;
    }

    if (resultado.length === 0) {
        console.log(titulo + ": no hay metas que cumplan ese filtro.");
        alert("No hay metas que cumplan ese filtro.");
    } else {
        alert(titulo + ":\n\n" + listarMetas(resultado, titulo));
    }
}

// ORDENAR: sort (TRANSFORMACIÓN) reordena según la regla que le pasamos.
// Ordenamos una COPIA ([...lista]) para no perder el orden de prioridad original.
function ordenarMetas(lista) {
    const opcion = prompt(
        "¿Cómo querés ordenar tus metas?\n\n" +
        "1. De la más cara a la más barata\n" +
        "2. De la más barata a la más cara\n" +
        "3. De la más avanzada a la menos avanzada"
    );

    const copia = [...lista];
    let titulo;

    if (opcion === "1") {
        copia.sort((a, b) => b.montoObjetivo - a.montoObjetivo);
        titulo = "METAS DE MAYOR A MENOR MONTO";
    } else if (opcion === "2") {
        copia.sort((a, b) => a.montoObjetivo - b.montoObjetivo);
        titulo = "METAS DE MENOR A MAYOR MONTO";
    } else if (opcion === "3") {
        copia.sort((a, b) => b.calcularPorcentaje() - a.calcularPorcentaje());
        titulo = "METAS DE MAYOR A MENOR AVANCE";
    } else {
        alert("Opción inválida.");
        return;
    }

    alert(titulo + ":\n\n" + listarMetas(copia, titulo));
}

// RESUMEN: reduce, map y some trabajan juntos para darle información de valor al usuario.
function mostrarResumen(lista, ahorroMensual) {
    if (lista.length === 0) {
        alert("No tenés metas cargadas.");
        return;
    }

    // reduce (TRANSFORMACIÓN): acumula todos los objetos en un solo número
    const totalNecesario = lista.reduce((acumulado, meta) => acumulado + meta.montoObjetivo, 0);
    const totalAhorrado = lista.reduce((acumulado, meta) => acumulado + meta.montoAhorrado, 0);
    const totalFaltante = lista.reduce((acumulado, meta) => acumulado + meta.calcularFaltante(), 0);
    const avanceGeneral = Math.round((totalAhorrado * 100) / totalNecesario);

    // map (TRANSFORMACIÓN): convierte cada objeto en un texto con su plan de ahorro
    const planDeAhorro = lista
        .filter((meta) => !meta.estaCumplida())
        .map((meta) => "• " + meta.nombre + ": faltan " + formatearPesos(meta.calcularFaltante()) +
            " → " + meta.calcularMesesRestantes(ahorroMensual) + " meses");

    // some (BÚSQUEDA): ¿hay AL MENOS UNA meta cumplida?
    const hayCumplidas = lista.some((meta) => meta.estaCumplida());

    let mensaje =
        "📊 RESUMEN DE TUS METAS\n\n" +
        "Total necesario: " + formatearPesos(totalNecesario) + "\n" +
        "Total ahorrado: " + formatearPesos(totalAhorrado) + "\n" +
        "Te falta: " + formatearPesos(totalFaltante) + "\n" +
        "Avance general: " + avanceGeneral + "%\n\n";

    if (planDeAhorro.length > 0) {
        mensaje = mensaje + "Plan ahorrando " + formatearPesos(ahorroMensual) + " por mes (cada meta por separado):\n" +
            planDeAhorro.join("\n");
    } else {
        mensaje = mensaje + "🎉 ¡Cumpliste todas tus metas!";
    }

    if (hayCumplidas) {
        mensaje = mensaje + "\n\n✅ Ya tenés al menos una meta cumplida. ¡Bien ahí!";
    }

    console.log(mensaje);
    console.log("Array generado con map:", planDeAhorro);
    alert(mensaje);
}


// =====================================================
// VERIFICACIÓN DE LA CLASE (en consola)
// Probamos los métodos de las instancias y mostramos
// cómo quedaron sus propiedades.
// =====================================================
console.log("===== PRUEBA DE LA CLASE MetaDeAhorro =====");
console.log("Curso de inglés ANTES:", cursoDeIngles.montoAhorrado);
cursoDeIngles.aportar(15000);
console.log("Curso de inglés DESPUÉS de aportar $15000:", cursoDeIngles.montoAhorrado);
console.log("Le falta:", formatearPesos(cursoDeIngles.calcularFaltante()));
console.log("Progreso:", cursoDeIngles.calcularPorcentaje() + "%");
console.log("¿Bicicleta cumplida?", bicicleta.estaCumplida());
console.log("¿Notebook cumplida?", notebook.estaCumplida());
console.log(fondoDeEmergencia);


// =====================================================
// PROGRAMA PRINCIPAL: acá se INVOCAN las funciones
// =====================================================

const nombre = pedirTexto("¡Bienvenido al Simulador de Ahorro! ¿Cuál es tu nombre?");
let ahorroMensual = pedirNumeroPositivo(nombre + ", ¿cuánto podés ahorrar por mes? (ej: 15000)");

console.log("Usuario: " + nombre);
console.log("Ahorro mensual: " + formatearPesos(ahorroMensual));
listarMetas(metasDeAhorro);

let opcion = "";

while (opcion !== OPCION_SALIR) {
    opcion = mostrarMenu(nombre, ahorroMensual);

    switch (opcion) {
        case "1":
            mostrarProyeccionAnual(ahorroMensual);
            break;

        case "2": {
            const monto = pedirNumeroPositivo("¿Cuánto dinero querés juntar?");
            const meses = calcularMesesParaMonto(monto, ahorroMensual);
            mostrarResultadoMonto(monto, meses);
            break;
        }

        case "3": {
            const nuevoAhorro = pedirNumeroPositivo("¿Cuál es tu nuevo ahorro mensual?");
            console.log("Ahorro mensual actualizado: de " + formatearPesos(ahorroMensual) + " a " + formatearPesos(nuevoAhorro));
            ahorroMensual = nuevoAhorro;
            alert("¡Listo! Tu nuevo ahorro mensual es " + formatearPesos(ahorroMensual) + ".");
            break;
        }

        case "4":
            alert("Tus metas, de la más importante a la menos importante:\n\n" + listarMetas(metasDeAhorro));
            break;

        case "5":
            agregarMeta(metasDeAhorro);
            break;

        case "6":
            buscarMeta(metasDeAhorro, ahorroMensual);
            break;

        case "7":
            aportarAMeta(metasDeAhorro);
            break;

        case "8":
            quitarMeta(metasDeAhorro);
            break;

        case "9":
            filtrarMetas(metasDeAhorro);
            break;

        case "10":
            ordenarMetas(metasDeAhorro);
            break;

        case "11":
            mostrarResumen(metasDeAhorro, ahorroMensual);
            break;

        case OPCION_SALIR:
            despedir(nombre);
            break;

        default:
            if (opcion === null) {
                opcion = OPCION_SALIR;
                despedir(nombre);
            } else {
                alert("Opción inválida. Elegí un número del 0 al 11.");
            }
    }
}
