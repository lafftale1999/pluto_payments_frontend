import axios from "axios";

const api = {
    postLogin: async (loginData: {email: string, password: string}) => {
    const { data } = await axios.post('/api/auth/login', loginData);
    return data; 
    },
    getAuth: async () => {
        const { data } = await axios.get("/api/auth/me");
        return data;
    }
    
};

export default api;