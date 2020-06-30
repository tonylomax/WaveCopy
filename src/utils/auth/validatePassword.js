export default validatePassword = (password) => {
  const REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return REGEXP.test(password);
};
