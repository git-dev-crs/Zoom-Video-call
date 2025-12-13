// export const BASE_URL = "http://localhost:5000"; 
// export const SOCKET_URL = "http://localhost:5000"; 
let IS_PROD = true;
const server = IS_PROD ?
    "https://apnacollegebackend.onrender.com" :

    "http://localhost:8000"


export default server;