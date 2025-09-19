/* Proyecto Final - Simulador Gestión de Empleados y Nómina
   Cumple: datos remotos (data.json), DOM generado desde JS, funciones reutilizables,
   localStorage, y reemplazo de alert/prompt por SweetAlert2.
*/

const STORAGE_KEY = "proyecto_empleados_v1";
let puestos = [];            // datos remotos de puestos
let empleados = [];          // array de objetos empleado

// ------------ CLASE / CONSTRUCTOR ------------
class Empleado {
  constructor({ nombre, apellido, direccion, puestoId, puestoNombre, horas = 40, sueldoExtra = 0 }) {
    this.id = generarId();
    this.nombre = nombre;
    this.apellido = apellido;
    this.direccion = direccion;
    this.puestoId = puestoId || "";
    this.puestoNombre = puestoNombre || "";
    this.horas = Number(horas) || 0;
    this.sueldoExtra = Number(sueldoExtra) || 0;
  }

  // método: calcula salario bruto según horas y sueldo por hora del puesto
  calcularNomina(sueldoHora) {
    const salarioBase = sueldoHora * this.horas;
    const bonos = this.sueldoExtra;
    const bruto = salarioBase + bonos;
    const descuentos = bruto * 0.17; // ejemplo: 17% de descuentos
    const neto = bruto - descuentos;
    return {
      salarioBase,
      bonos,
      bruto,
      descuentos,
      neto
    };
  }
}

// ------------ UTILIDADES / FUNCIONES REUTILIZABLES ------------
function generarId() {
  return 'emp_' + Math.random().toString(36).slice(2, 9);
}

function esTextoValido(texto) {
  return typeof texto === "string" && texto.trim() !== "" && !/\d/.test(texto);
}

function mostrarToast(icon = "success", title = "Operación exitosa") {
  Swal.fire({ toast: true, position: "top-end", icon, title, showConfirmButton: false, timer: 2000 });
}

async function cargarDatosRemotos() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    puestos = data.puestos || [];
    // carga de empleados de ejemplo (solo si no hay en localStorage)
    const ejemplo = data.empleadosEjemplo || [];
    if (!localStorage.getItem(STORAGE_KEY) && ejemplo.length) {
      const inicial = ejemplo.map(e => new Empleado({
        nombre: e.nombre, apellido: e.apellido, direccion: e.direccion,
        puestoId: buscarPuestoIdPorNombre(e.puesto),
        puestoNombre: capitalizarPuesto(e.puesto),
        horas: e.horas,
        sueldoExtra: e.sueldoExtra
      }));
      empleados = inicial;
      guardarLocalStorage();
    }
  } catch (err) {
    // si falla fetch, inicializamos con puestos por defecto
    puestos = [
      { id: "dev_jr", nombre: "Desarrollador Jr", sueldoHora: 800 },
      { id: "dev_sr", nombre: "Desarrollador Sr", sueldoHora: 1600 }
    ];
  }
}

function guardarLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(empleados));
}

function cargarLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    empleados = parsed.map(e => {
      // reconstruimos instancias
      const emp = new Empleado({
        nombre: e.nombre,
        apellido: e.apellido,
        direccion: e.direccion,
        puestoId: e.puestoId,
        puestoNombre: e.puestoNombre,
        horas: e.horas,
        sueldoExtra: e.sueldoExtra
      });
      emp.id = e.id || emp.id;
      return emp;
    });
  } else {
    empleados = [];
  }
}

function buscarPuestoPorId(id) {
  return puestos.find(p => p.id === id) || null;
}

function buscarPuestoIdPorNombre(nombre) {
  const key = (nombre || "").toLowerCase();
  const p = puestos.find(x => x.nombre.toLowerCase().includes(key));
  return p ? p.id : (puestos[0] ? puestos[0].id : "");
}

function capitalizarPuesto(str) {
  if (!str) return "";
  return str.split(" ").map(w => w[0].toUpperCase()+w.slice(1)).join(" ");
}

// ------------ RENDER / DOM ------------
const form = document.getElementById("form-empleado");
const listaContainer = document.getElementById("lista-empleados");
const selectPuesto = document.getElementById("puesto");
const filtroPuesto = document.getElementById("filtroPuesto");
const buscarInput = document.getElementById("buscar");
const resultadoNomina = document.getElementById("resultado-nomina");

function poblarSelects() {
  // carga opciones de puestos
  selectPuesto.innerHTML = `<option value="">-- Selecciona un puesto --</option>`;
  filtroPuesto.innerHTML = `<option value="">Filtrar por puesto</option>`;
  puestos.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.nombre} ( $${p.sueldoHora}/h )`;
    selectPuesto.appendChild(opt);

    const opt2 = opt.cloneNode(true);
    filtroPuesto.appendChild(opt2);
  });
}

function limpiarFormulario() {
  form.reset();
  document.getElementById("horas").value = 40;
  document.getElementById("sueldoExtra").value = 0;
}

function renderLista(filtroText = "", filtroPuestoId = "") {
  listaContainer.innerHTML = "";
  const texto = filtroText.trim().toLowerCase();
  const items = empleados.filter(e => {
    const matchText = `${e.nombre} ${e.apellido} ${e.puestoNombre}`.toLowerCase().includes(texto);
    const matchPuesto = filtroPuestoId ? (e.puestoId === filtroPuestoId) : true;
    return matchText && matchPuesto;
  });

  if (items.length === 0) {
    listaContainer.innerHTML = `<li>No hay empleados registrados.</li>`;
    return;
  }

  items.forEach(emp => {
    const li = document.createElement("li");
    li.dataset.id = emp.id;

    const info = document.createElement("div");
    info.innerHTML = `<strong>${emp.nombre} ${emp.apellido}</strong>
                      <div class="meta">${emp.puestoNombre} • ${emp.direccion}</div>`;

    const acciones = document.createElement("div");
    acciones.className = "botones";

    const btnCalc = document.createElement("button");
    btnCalc.innerHTML = `<i class="fas fa-calculator"></i> Calcular Nómina`;
    btnCalc.addEventListener("click", () => mostrarNomina(emp.id));

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = `<i class="fas fa-edit"></i> Editar`;
    btnEditar.addEventListener("click", () => cargarParaEditar(emp.id));

    const btnBorrar = document.createElement("button");
    btnBorrar.style.background = "#c0392b";
    btnBorrar.innerHTML = `<i class="fas fa-trash"></i> Eliminar`;
    btnBorrar.addEventListener("click", () => confirmarEliminar(emp.id));

    acciones.appendChild(btnCalc);
    acciones.appendChild(btnEditar);
    acciones.appendChild(btnBorrar);

    li.appendChild(info);
    li.appendChild(acciones);
    listaContainer.appendChild(li);
  });
}

// ------------ ACCIONES / EVENTOS ------------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const nombre = formData.get("nombre").trim();
  const apellido = formData.get("apellido").trim();
  const direccion = formData.get("direccion").trim();
  const puestoId = formData.get("puesto").trim();
  const horas = formData.get("horas").trim();
  const sueldoExtra = formData.get("sueldoExtra").trim();

  if (!esTextoValido(nombre) || !esTextoValido(apellido) || direccion === "" || !puestoId || Number(horas) < 0) {
    Swal.fire({ icon: "error", title: "Error", text: "Por favor complete correctamente todos los campos." });
    return;
  }

  const puestoObj = buscarPuestoPorId(puestoId);
  const nuevo = new Empleado({
    nombre, apellido, direccion,
    puestoId: puestoObj ? puestoObj.id : puestoId,
    puestoNombre: puestoObj ? puestoObj.nombre : puestoId,
    horas: Number(horas),
    sueldoExtra: Number(sueldoExtra)
  });

  empleados.push(nuevo);
  guardarLocalStorage();
  renderLista();
  limpiarFormulario();
  mostrarToast("success", "Empleado agregado");
});

// botón limpiar
document.getElementById("btn-limpiar").addEventListener("click", () => {
  limpiarFormulario();
  mostrarToast("info", "Formulario limpiado");
});

// cargar ejemplo
document.getElementById("btn-cargar-ejemplo").addEventListener("click", async () => {
  Swal.fire({
    title: '¿Deseas cargar empleados de ejemplo?',
    showDenyButton: true,
    confirmButtonText: 'Sí',
    denyButtonText: `No`
  }).then((result) => {
    if (result.isConfirmed) {
      // cargar desde data.json (si existen empleadosEjemplo)
      fetch("data.json").then(r=>r.json()).then(data=>{
        const ej = data.empleadosEjemplo || [];
        ej.forEach(e => {
          const pId = buscarPuestoIdPorNombre(e.puesto);
          const emp = new Empleado({
            nombre: e.nombre, apellido: e.apellido, direccion: e.direccion,
            puestoId: pId, puestoNombre: capitalizarPuesto(e.puesto),
            horas: e.horas, sueldoExtra: e.sueldoExtra
          });
          empleados.push(emp);
        });
        guardarLocalStorage();
        renderLista();
        mostrarToast("success","Ejemplos cargados");
      }).catch(()=> {
        Swal.fire({icon:"error", title:"Error", text:"No se pudieron cargar los ejemplos."});
      });
    }
  });
});

// búsqueda y filtrado
buscarInput.addEventListener("input", () => renderLista(buscarInput.value, filtroPuesto.value));
filtroPuesto.addEventListener("change", () => renderLista(buscarInput.value, filtroPuesto.value));
document.getElementById("btn-reset").addEventListener("click", () => {
  buscarInput.value = "";
  filtroPuesto.value = "";
  renderLista();
  mostrarToast("info","Filtro reiniciado");
});

// cargar empleado para editar
function cargarParaEditar(id) {
  const emp = empleados.find(e => e.id === id);
  if (!emp) return;
  document.getElementById("nombre").value = emp.nombre;
  document.getElementById("apellido").value = emp.apellido;
  document.getElementById("direccion").value = emp.direccion;
  document.getElementById("puesto").value = emp.puestoId;
  document.getElementById("horas").value = emp.horas;
  document.getElementById("sueldoExtra").value = emp.sueldoExtra;

  // eliminar el empleado original (se reemplazará al guardar)
  empleados = empleados.filter(e => e.id !== id);
  guardarLocalStorage();
  renderLista();
  mostrarToast("info","Editando empleado (al guardar se reemplazará)");
}

// confirmar y eliminar
function confirmarEliminar(id) {
  const emp = empleados.find(e => e.id === id);
  if (!emp) return;
  Swal.fire({
    title: `Eliminar a ${emp.nombre} ${emp.apellido}?`,
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      empleados = empleados.filter(e => e.id !== id);
      guardarLocalStorage();
      renderLista();
      mostrarToast("success","Empleado eliminado");
    }
  });
}

// mostrar nómina
function mostrarNomina(id) {
  const emp = empleados.find(e => e.id === id);
  if (!emp) return;
  const puesto = buscarPuestoPorId(emp.puestoId);
  const sueldoHora = puesto ? Number(puesto.sueldoHora) : 0;
  const nomina = emp.calcularNomina(sueldoHora);

  resultadoNomina.innerHTML = `
    <h3>Nómina de ${emp.nombre} ${emp.apellido}</h3>
    <p><strong>Puesto:</strong> ${emp.puestoNombre} (${sueldoHora}/h)</p>
    <p><strong>Horas trabajadas:</strong> ${emp.horas}</p>
    <p><strong>Salario base:</strong> $${nomina.salarioBase.toFixed(2)}</p>
    <p><strong>Bonos / extras:</strong> $${nomina.bonos.toFixed(2)}</p>
    <p><strong>Bruto:</strong> $${nomina.bruto.toFixed(2)}</p>
    <p><strong>Descuentos (17% ejemplo):</strong> $${nomina.descuentos.toFixed(2)}</p>
    <p style="font-weight:700"><strong>Neto a cobrar:</strong> $${nomina.neto.toFixed(2)}</p>
  `;
}

// ------------ INICIALIZACION ------------
async function init() {
  await cargarDatosRemotos();
  cargarLocalStorage();
  poblarSelects();
  renderLista();
}
init();
