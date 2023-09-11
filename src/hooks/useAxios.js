import axios from 'axios';

const useAxios = () => {
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL + '/api/v1';

  const instance = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getData = async (endpoint, params = {}) => {
    try {
      const response = await instance.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const postData = async (endpoint, data) => {
    try {
      const response = await instance.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getData,
    axiosInstance: instance,
    postData,
  };
};

export default useAxios;
