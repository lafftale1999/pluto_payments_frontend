import axios from "axios";

const api = {
    postLogin: async (loginData: {email: string, password: string}) => {
    const { data } = await axios.post('http://localhost:8080/api/auth/login', loginData);
    return data; 
    },
    
};

export default api;