import axios from "axios";

const api = {
    postLogin: async (loginData: {email: string, password: string}) => {
    const { data } = await axios.post('/api/auth/login', loginData);
    return data; 
    },
    getAuth: async () => {
        const { data } = await axios.get("/api/auth/me");
        return data;
    },
    logout: async () => {
        const { data } = await axios.post("/api/auth/logout");
        return data;
    },
    getCard: async () => {
        const { data } = await axios.get("/api/account/card/me");
        return data;
    },
    getMain: async () => {
        const { data } = await axios.get("/api/account/get_account_d");
        return data;
    },
    changePassword: async (payload: {email: string, oldPassword: string, newPassword: string}) => {
    const { data } = await axios.post('/api/account/change_password', payload);
    return data; 
    },
    getInvoices: async () => {
        const { data } = await axios.get("api/account/get_invoices");
        return data
    }
};

export default api;