import axios from 'axios';


export const getApi = async (api, token) => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  

  console.log({api, config}, "check")
  return await axios.get(api)
      .catch(err => {
        // reject(err.response);
        handleAuthorization(err.response?.status);
      });
  
};

export const postApi = async (api, data, token) => {
  //  console.log(api, data, token);
  const config = {
    headers: {
      Authorization: 'Bearer ' + token  ,
    },
  };
  return new Promise((resolve, reject) => {
    axios
      .post(api, data, config)
      .then(resolve)
      .catch(err => {
        reject(err.response);
        handleAuthorization(err.response?.status);
      });
  });
};

export const uploadApi = async (api, data, token) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .post(api, data, config)
      .then(resolve)
      .catch(err => {
        reject(err.response);
        handleAuthorization(err.response?.status);
      });
  });
};

export const putApi = async (api, data, token) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .put(api, data, config)
      .then(resolve)
      .catch(err => {
        reject(err.response);
        handleAuthorization(err.response?.status);
      });
  });
};

const handleAuthorization = status => {
  if (status !== 401) return;
  // AsyncStorage.clear();
};
