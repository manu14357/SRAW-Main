import { BASE_URL } from "../config";

const signup = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const login = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + params.id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getRandomUsers = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/random?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + user._id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
  
};

// api/notifications.js
export const getNotifications = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await fetch(`/api/notifications/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data = await response.json();
  return data;
};



export { signup, login, getUser, getRandomUsers, updateUser };
