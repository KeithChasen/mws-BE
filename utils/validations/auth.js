const emailRegEp = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

const validateRegister = (email, password, confirmPassword) => {
  const errors = validateLogin(email, password);

  if (password.length < 8) {
    errors.password = 'Password should be at least 8 characters long';
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = 'Password confirmation should match the password';
  }

  return errors;
};

const validateLogin = (email, password) => {
  const errors = validateEmail(email);

  if (password.trim() === '') {
    errors.password = 'Password is required';
  }

  return errors;
};

const validateEmail = email => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email is required';
  }

  if (!email.match(emailRegEp)) {
    errors.email = 'Email should be a valid email address';
  }

  return errors;
};

module.exports = { validateRegister, validateLogin,validateEmail };
