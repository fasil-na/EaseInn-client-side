export const isValidUsername = (username: string): boolean => {
    const re = /^[A-Za-z]+$/; 
    return re.test(username) && username.length >= 4;
};

  export const isValidEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  
  export const isValidPhone = (phone: string): boolean => {
    const re = /^[0-9\b]+$/; 
    return re.test(phone) && phone.length === 10; 
  };

  export const isValidPassword = (password: string): boolean => {
    return Boolean(password) && password.length >= 8;
  };
  
  export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };
  