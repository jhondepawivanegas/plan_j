import axios from "axios";

export const axioCliente = axios.create({
  baseURL: "http://localhost:3000/api",
});
