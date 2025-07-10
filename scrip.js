
// Entrega N°1

alert("Realizamos el registro de los 3 nuevos empleados");

let empleadosnuevos = [
  { nombre: "", apellido: "", direccion: "", puesto: "" },
  { nombre: "", apellido: "", direccion: "", puesto: "" },
  { nombre: "", apellido: "", direccion: "", puesto: "" }
];

function registrarEmpleados() {
  for (let i = 0; i < empleadosnuevos.length; i++) {
    alert("Ingrese los datos del empleado N°" + (i + 1));

    empleadosnuevos[i].nombre = prompt("Ingrese el nombre del empleado N°" + (i + 1)).trim();
    while (empleadosnuevos[i].nombre === "") {
      alert("Error, debe ingresar el nombre del empleado. Inténtelo nuevamente.");
      empleadosnuevos[i].nombre = prompt("Ingrese el nombre del empleado N°" + (i + 1)).trim();
    }

    empleadosnuevos[i].apellido = prompt("Ingrese el apellido del empleado N°" + (i + 1)).trim();
    while (empleadosnuevos[i].apellido === "") {
      alert("Error, debe ingresar el apellido del empleado. Inténtelo nuevamente.");
      empleadosnuevos[i].apellido = prompt("Ingrese el apellido del empleado N°" + (i + 1)).trim();
    }

    empleadosnuevos[i].direccion = prompt("Ingrese la dirección del empleado N°" + (i + 1)).trim();
    while (empleadosnuevos[i].direccion === "") {
      alert("Error, debe ingresar la dirección del empleado. Inténtelo nuevamente.");
      empleadosnuevos[i].direccion = prompt("Ingrese la dirección del empleado N°" + (i + 1)).trim();
    }

    empleadosnuevos[i].puesto = prompt("Ingrese el puesto del empleado N°" + (i + 1)).trim();
    while (empleadosnuevos[i].puesto === "") {
      alert("Error, debe ingresar el puesto del empleado. Inténtelo nuevamente.");
      empleadosnuevos[i].puesto = prompt("Ingrese el puesto del empleado N°" + (i + 1)).trim();
    }

    alert("Ingresaste correctamente los datos del empleado N°" + (i + 1) + ". Datos guardados en el sistema.");
  }
}

registrarEmpleados();

for (let i = 0; i < empleadosnuevos.length; i++) {
  alert(
    "Empleado N°" + (i + 1) +
    "\nNombre: " + empleadosnuevos[i].nombre +
    "\nApellido: " + empleadosnuevos[i].apellido +
    "\nDirección: " + empleadosnuevos[i].direccion +
    "\nPuesto: " + empleadosnuevos[i].puesto
  );
}

