// *** IMPORTANTE: Define la URL base de tu backend aquí ***
// Esta URL DEBE ser la URL de tu servicio de backend en Render.
// Si tu backend es un "Web Service" en Render, su URL será algo como:
// "https://nombre-de-tu-servicio-backend.onrender.com"
// Ve a tu panel de Render y copia la URL de tu servicio de backend.
const BASE_URL = "https://crear-solicitud-backend.onrender.com; // ¡CÁMBIAME!

const cupsDescriptions = {
  "87.38.01": "Radiografía de tórax posteroanterior y lateral",
  "87.03.01": "Radiografía de cráneo",
  "87.06.01": "Radiografía de columna cervical",
  "87.06.02": "Radiografía de columna dorsolumbar",
  "87.08.01": "Radiografía de pelvis",
  "87.10.01": "Radiografía de abdomen simple",
  "87.28.01": "Radiografía de extremidades superiores",
  "87.30.01": "Radiografía de extremidades inferiores",
  "87.44.02": "Ecografía abdominal total",
  "87.44.03": "Ecografía pélvica transabdominal",
  "87.44.04": "Ecografía obstétrica temprana",
  "87.44.05": "Ecografía renal y vías urinarias",
  "87.44.06": "Ecografía de partes blandas",
  "87.44.07": "Ecografía testicular",
  "87.44.08": "Ecografía tiroidea",
  "88.38.01": "TAC de tórax simple",
  "88.38.02": "TAC de cráneo",
  "88.38.03": "TAC de abdomen simple",
  "88.38.04": "TAC abdomen y pelvis con contraste",
  "88.38.06": "TAC de columna lumbar",
  "88.38.08": "TAC de senos paranasales",
  "88.01.03": "Resonancia magnética de cráneo simple",
  "88.01.04": "Resonancia magnética de columna lumbar",
  "88.01.05": "Resonancia magnética de rodilla",
  "88.01.06": "Resonancia magnética de abdomen superior"
};

// Autocompletar descripción del examen cuando se selecciona un código CUPS
document.getElementById("service_type").addEventListener("change", function () {
  const code = this.value;
  document.getElementById("description").value = cupsDescriptions[code] || "";
});

// Manejo del envío del formulario de Solicitud de Servicio Médico
document.getElementById("serviceRequestForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Evita que el formulario se recargue la página

  // Obtener los valores de los campos del formulario
  const document_type = document.getElementById("document_type").value;
  const patient_id = document.getElementById("patient_id").value.trim();
  const service_type = document.getElementById("service_type").value;
  const description = document.getElementById("description").value.trim();
  const requester = parseInt(document.getElementById("requester").value, 10);
  const priority = document.getElementById("priority").value;
  const resultDisplay = document.getElementById("result"); // Elemento para mostrar mensajes al usuario

  // Validaciones básicas del formulario
  if (!document_type || !patient_id || !service_type || !description || !requester || !priority) {
    resultDisplay.textContent = "Error: Por favor, complete todos los campos obligatorios.";
    resultDisplay.style.color = "red";
    return;
  }

  if (requester <= 0 || isNaN(requester)) {
    resultDisplay.textContent = "Error: El ID del profesional debe ser un número positivo.";
    resultDisplay.style.color = "red";
    return;
  }

  // Preparar los datos a enviar al backend
  const data = {
    document_type,
    patient_id,
    service_type,
    description,
    requester,
    priority,
  };

  // Mostrar mensaje de carga
  resultDisplay.textContent = "Enviando solicitud...";
  resultDisplay.style.color = "blue";

  try {
    // Realizar la solicitud POST a tu API de backend
    // La URL debe ser: BASE_URL + la ruta específica de tu API para solicitudes de servicio (ej. '/service_requests')
    const response = await fetch(`${BASE_URL}/service_requests`, {
      method: "POST", // Método HTTP para crear un recurso
      headers: {
        "Content-Type": "application/json", // Indica que estamos enviando JSON
        // Si tu API requiere autenticación (ej. un Bearer Token), agrégalo aquí:
        // "Authorization": "Bearer TU_TOKEN_DE_AUTENTICACION"
      },
      body: JSON.stringify(data), // Convierte el objeto JavaScript a una cadena JSON
    });

    // Manejo de respuestas del servidor
    if (!response.ok) { // Si la respuesta no es 2xx (ej. 404, 500, 400)
      let errorMessage = "Error desconocido al enviar la solicitud.";
      try {
        const errorData = await response.json(); // Intenta leer un mensaje de error JSON del servidor
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (jsonError) {
        // Si la respuesta no es JSON o hay un error al parsear, usa el estado HTTP
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage); // Lanza un error para ser capturado por el bloque catch
    }

    // Si la respuesta es exitosa (código 2xx)
    const result = await response.json(); // Parsea la respuesta JSON del servidor
    resultDisplay.textContent = "Solicitud enviada con éxito. ID de respuesta: " + (result.id || "N/A");
    resultDisplay.style.color = "green";
    this.reset(); // Limpia todos los campos del formulario
  } catch (error) {
    // Manejo de errores de red o errores lanzados desde el bloque try
    resultDisplay.textContent = `Error: ${error.message}. Por favor, verifica la URL de tu backend y los logs del servidor.`;
    resultDisplay.style.color = "red";
    console.error("Error al enviar la solicitud:", error); // Imprime el error completo en la consola del navegador
  }
});