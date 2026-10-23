import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
  timeout: 10000, // 10 segundos
  headers: {
    Accept: "application/json",
  },
});

export function getErrorMessage(error) {
    if(!axios.isAxiosError(error)) {
        return "Ocorreu um erro inesperado.";
    }

    const status = error.response?.status;
    const data = error.response?.data;

    if (!status || [502, 503, 504].includes(status)) {
        return "O servidor está indisponível. Tente novamente mais tarde.";
    }
    if (status === 422 && data?.errors) {
        return Object.values(data.errors).flat()[0];
    }
    return data?.message || "Ocorreu um erro inesperado.";

}
export default api;