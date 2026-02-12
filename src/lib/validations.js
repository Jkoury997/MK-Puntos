// Validation utilities for API routes

export const validators = {
  email: (email) => {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email es requerido' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { valid: false, error: 'Formato de email inválido' };
    }
    return { valid: true, value: email.trim().toLowerCase() };
  },

  password: (password, minLength = 6) => {
    if (!password || typeof password !== 'string') {
      return { valid: false, error: 'Contraseña es requerida' };
    }
    if (password.length < minLength) {
      return { valid: false, error: `La contraseña debe tener al menos ${minLength} caracteres` };
    }
    return { valid: true, value: password };
  },

  dni: (dni) => {
    if (!dni || typeof dni !== 'string') {
      return { valid: false, error: 'DNI es requerido' };
    }
    // DNI argentino: 7-8 dígitos
    const dniClean = dni.replace(/\D/g, '');
    if (dniClean.length < 7 || dniClean.length > 8) {
      return { valid: false, error: 'DNI debe tener entre 7 y 8 dígitos' };
    }
    return { valid: true, value: dniClean };
  },

  phone: (phone) => {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, error: 'Teléfono es requerido' };
    }
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 15) {
      return { valid: false, error: 'Número de teléfono inválido' };
    }
    return { valid: true, value: phoneClean };
  },

  otp: (otp) => {
    if (!otp || typeof otp !== 'string') {
      return { valid: false, error: 'Código OTP es requerido' };
    }
    const otpClean = otp.replace(/\D/g, '');
    if (otpClean.length !== 6) {
      return { valid: false, error: 'El código OTP debe tener 6 dígitos' };
    }
    return { valid: true, value: otpClean };
  },

  name: (name, fieldName = 'Nombre') => {
    if (!name || typeof name !== 'string') {
      return { valid: false, error: `${fieldName} es requerido` };
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return { valid: false, error: `${fieldName} debe tener al menos 2 caracteres` };
    }
    if (trimmed.length > 50) {
      return { valid: false, error: `${fieldName} no puede exceder 50 caracteres` };
    }
    return { valid: true, value: trimmed };
  },

  birthDate: (date) => {
    if (!date) {
      return { valid: false, error: 'Fecha de nacimiento es requerida' };
    }
    const birthDate = new Date(date);
    if (isNaN(birthDate.getTime())) {
      return { valid: false, error: 'Fecha de nacimiento inválida' };
    }
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      return { valid: false, error: 'Edad debe estar entre 13 y 120 años' };
    }
    return { valid: true, value: date };
  },

  sex: (sex) => {
    const validValues = ['M', 'F', 'O', 'masculino', 'femenino', 'otro'];
    if (!sex || !validValues.includes(sex.toLowerCase())) {
      return { valid: false, error: 'Sexo inválido' };
    }
    return { valid: true, value: sex };
  }
};

// Helper to validate multiple fields at once
export function validateFields(data, rules) {
  const errors = [];
  const validated = {};

  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    if (!result.valid) {
      errors.push({ field, error: result.error });
    } else {
      validated[field] = result.value;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: validated
  };
}
