import axios from "axios";

const api = {
    postLogin: async (loginData: {email: string, password: string}) => {
    const { data } = await axios.post('/api-login', loginData);
    return data; 
    },
    
};

export default api;