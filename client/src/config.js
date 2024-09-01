let BASE_URL = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "https://api.sraws.com:4000/";
} else {
  BASE_URL = "https://api.sraws.com/";
}

export { BASE_URL };
