//ENTREGA N°

let empleados = [];
let cantidad = prompt("¿Cuántos empleados desea registrar?");
cantidad = parseInt(cantidad);

while (isNaN(cantidad) || cantidad <= 0) {
  alert("Por favor, ingrese un número válido mayor a 0.");
  cantidad = parseInt(prompt("¿Cuántos empleados desea registrar?"));
}

for (let i = 0; i < cantidad; i++) {
  alert("Registro del empleado N° " + (i + 1));

  let nombre = prompt("Ingrese el nombre del empleado:");
  while (nombre.trim() === "" || /\d/.test(nombre)) {
    alert("Error: El nombre no puede estar vacío ni contener números.");
    nombre = prompt("Ingrese el nombre del empleado:");
  }

  let apellido = prompt("Ingrese el apellido del empleado:");
  while (apellido.trim() === "" || /\d/.test(apellido)) {
    alert("Error: El apellido no puede estar vacío ni contener números.");
    apellido = prompt("Ingrese el apellido del empleado:");
  }

  let direccion = prompt("Ingrese la dirección del empleado:");
  while (direccion.trim() === "" || /^\d+$/.test(direccion)) {
    alert("Error: La dirección no puede estar vacía ni ser solo números.");
    direccion = prompt("Ingrese la dirección del empleado:");
  }

  let puesto = prompt("Ingrese el puesto del empleado:");
  while (puesto.trim() === "" || /\d/.test(puesto)) {
    alert("Error: El puesto no puede estar vacío ni contener números.");
    puesto = prompt("Ingrese el puesto del empleado:");
  }

  empleados.push({
    nombre: nombre,
    apellido: apellido,
    direccion: direccion,
    puesto: puesto
  });
}

console.log("Empleados registrados:");
console.log(empleados);
alert("Registro completado. Verifica la consola para ver los datos.");
