const emailRegEp = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

const validateRegister = (email, password, confirmPassword) => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email is required';
  }

  if (!email.match(emailRegEp)) {
    errors.email = 'Email should be a valid email address';
  }

  if (password.trim() === '') {
    errors.password = 'Password is required';
  }

  if (password.length < 8) {
    errors.password = 'Password should be at least 8 characters long';
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = 'Password confirmation should match the password';
  }

  return errors;
};

module.exports = { validateRegister };
