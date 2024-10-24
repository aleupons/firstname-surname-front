// export const urlAPI = "http://localhost:5000/";
export const urlAPI = "https://firstname-surname-back.onrender.com";

//Llistes
export const loadInformacions = async () => {
  try {
    const resp = await fetch(`${urlAPI}informacions/list`);
    if (!resp.ok) {
      return false;
    }
    return await resp.json();
  } catch (error) {
    return false;
  }
};

export const loadDibuixos = async () => {
  try {
    const resp = await fetch(`${urlAPI}dibuixos/list`);
    if (!resp.ok) {
      return false;
    }
    return await resp.json();
  } catch (error) {
    return false;
  }
};

export const loadPintures = async () => {
  try {
    const resp = await fetch(`${urlAPI}pintures/list`);
    if (!resp.ok) {
      return false;
    }
    return await resp.json();
  } catch (error) {
    return false;
  }
};

export const loadPoemes = async () => {
  try {
    const resp = await fetch(`${urlAPI}poemes/list`);
    if (!resp.ok) {
      return false;
    }
    return await resp.json();
  } catch (error) {
    return false;
  }
};
//

//Create
export const newElement = async (ambImatge, data, token, ruta) => {
  try {
    const resp = await fetch(`${urlAPI}${ruta}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        ...(!ambImatge && {"Content-Type": "application/json"})
      },
      body: ambImatge ? data : JSON.stringify(data),
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};
//

//Read
export const getElement = async (id, token, ruta) => {
  try {
    const resp = await fetch(`${urlAPI}${ruta}/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};

export const getMyUser = async (token) => {
  try {
    const resp = await fetch(`${urlAPI}users/my-user`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};

export const getUser = async (id, token) => {
  try {
    const resp = await fetch(`${urlAPI}users/user/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};
//

//Update
export const modifyElement = async (ambImatge, data, id, token, ruta) => {
  try {
    const resp = await fetch(`${urlAPI}${ruta}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        ...(!ambImatge && {"Content-Type": "application/json"})
      },
      body: ambImatge ? data : JSON.stringify(data),
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};

export const modifyUser = async (userData, token) => {
  try {
    const resp = await fetch(urlAPI + "users/user", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};
//

//Delete
export const deleteElement = async (id, token, ruta) => {
  try {
    const resp = await fetch(`${urlAPI}${ruta}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return await resp.json();
  } catch (error) {
    return error.message;
  }
};
//
