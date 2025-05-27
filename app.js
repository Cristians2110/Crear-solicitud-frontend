document.getElementById('patientForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const name = document.getElementById('name').value.trim();
  const familyName = document.getElementById('familyName').value.trim();
  const gender = document.getElementById('gender').value;
  const birthDate = document.getElementById('birthDate').value;
  const identifierSystem = document.getElementById('identifierSystem').value.trim();
  const identifierValue = document.getElementById('identifierValue').value.trim();
  const cellPhone = document.getElementById('cellPhone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const postalCode = document.getElementById('postalCode').value.trim();

  // Validaciones básicas (puedes ampliar según tus necesidades)
  if (!name || !familyName || !gender || !birthDate || !identifierSystem || !identifierValue) {
    alert('Por favor, completa los campos obligatorios.');
    return;
  }

  // Crear el objeto Patient en formato FHIR
  const patient = {
    resourceType: "Patient",
    name: [{
      use: "official",
      given: [name],
      family: familyName
    }],
    gender: gender,
    birthDate: birthDate,
    identifier: [{
      system: identifierSystem,
      value: identifierValue
    }],
    telecom: []
  };

  // Agregar datos telecom si existen
  if (cellPhone) {
    patient.telecom.push({
      system: "phone",
      value: cellPhone,
      use: "home"
    });
  }
  if (email) {
    patient.telecom.push({
      system: "email",
      value: email,
      use: "home"
    });
  }

  // Agregar dirección si hay datos
  if (address || city || postalCode) {
    patient.address = [{
      use: "home",
      line: address ? [address] : [],
      city: city || undefined,
      postalCode: postalCode || undefined,
      country: "Colombia"
    }];
  }

  // Enviar datos usando Fetch API
  fetch('https://hl7-fhir-ehr.onrender.com/patient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patient)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message || 'Error al crear paciente');
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Paciente creado exitosamente!');
    this.reset(); // Limpiar formulario después de éxito
  })
  .catch(error => {
    console.error('Error:', error);
    alert(`Hubo un error al crear el paciente: ${error.message}`);
  });
});