let BASE_URL = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "http://api.sraws.com:4000/";
}

export { BASE_URL };
