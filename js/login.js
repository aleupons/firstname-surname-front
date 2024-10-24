import { urlAPI, getUser } from "/js/data.js";
import { errorPeticio } from "/js/alerts.js";

const sendFormLogIn = async (element) => {
  const loginData = { username: element.find("#username").val(), password: element.find("#password").val() };
  const resp = await fetch(`${urlAPI}users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  const userInfo = await resp.json();
  if (!userInfo.error) {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.setItem("token", userInfo.token);
    const respUser = await getUser(userInfo.userId, userInfo.token);
    if (!respUser.error) {
      localStorage.setItem("admin", respUser.isAdmin);
      if (respUser.isAdmin) {
        window.location.href = "/admin";
        return true;
      } else {
        window.location.href = "/";
        return true;
      }
    } else {
      errorPeticio("#loginForm", respUser.message);
      return false;
    }
  } else {
    errorPeticio("#loginForm", userInfo.message);
    return false;
  }
};

$("#loginForm").on("submit", async function (e) {
  e.preventDefault();
  await sendFormLogIn($(this));
});
