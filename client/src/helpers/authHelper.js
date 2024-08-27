import { initiateSocketConnection } from "./socketHelper";

const isLoggedIn = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const loginUser = (data) => {
  localStorage.setItem('userId', data.userId); // Ensure this is correct
  localStorage.setItem('token', data.token); 
  localStorage.setItem("user", JSON.stringify(data));
  initiateSocketConnection();
};


const logoutUser = () => {
  localStorage.removeItem("user");
  initiateSocketConnection();
};

export { loginUser, isLoggedIn, logoutUser };
