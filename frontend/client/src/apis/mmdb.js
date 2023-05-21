import axios from "axios";

export default axios.create({
  // baseURL: "https://mmdb.online/api/v2",
  baseURL: "http://127.0.0.1:9393/api/v2",
});
