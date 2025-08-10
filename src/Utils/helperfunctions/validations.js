export const ValueEmpty = value => {
    if (value?.trim()) {
      return false;
    }
    return true;
  };
  
  export const ValidateMobile = email => {
    const reg = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  
    if (ValueEmpty(email)) {
      return 'Please fill your email';
    } else if (!reg.test(email)) {
      return 'Invalid email';
    }else if(!email ){
      return 'Please enter email';
    }else
    return 'success';
  };
  
  export const ValidateMail = email => {
    // if (ValueEmpty(email)) {
    //   return 'Please provide valid email';
    // }
    const emailPattern = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if (!re.test(email)) {
      return 'Please provide valid email';
    }
    return 'success';
  };
  
  export const ValidatePassword = password => {
    var reg = '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/sd';
  
    if (ValueEmpty(password)) {
      return 'Please provide a password to keep your account secure';
    } else if (password.length < 8 || password.length > 16) {
      return 'Password should be 8-16 characters long';
    } else if (!reg.test(password)) {
      return 'Password should be alphanumeric & it contain atleast one special character';
    }
  
    return 'success';
  };
  
  export const ifEmail = str => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    return re.test(str);
  };
  
 
  