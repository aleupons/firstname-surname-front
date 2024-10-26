export const pageNotFound = () => {
  $(".content-wrapper").html(`
    <div class="alert alert-danger d-flex align-items-center justify-content-center mt-4">
      <p class="text text-danger">Page not found</p>
    </div>
  `);
  $(".main-wrapper").css("height", `calc(100vh - ${$("footer").outerHeight()}px)`);
};

export const dataNotFound = (selectorElement, timer) => {
  const alerta = $(`
    <div class="alert alert-warning d-flex align-items-center justify-content-center mt-4">
      <p class="text text-warning">Data not found</p>
    </div>
  `);
  alerta.insertBefore($(selectorElement));
  if (timer) {
    window['timer_' + "dataAlert"] = setTimeout(() => alerta.remove(), 3500);
  }
};

export const errorPeticio = (selectorElement, missatge) => {
  let alerta = $("#errAlert");
  if (alerta.length) {
    clearTimeout(window['timer_' + "errAlert"]);
    alerta.find(".text").text(missatge);
  } else {
    alerta = $(`
      <div class="alert alert-danger d-flex align-items-center justify-content-center mt-4 peticio" id="errAlert">
        <p class="text text-danger">${missatge}</p>
      </div>
    `);
    $(selectorElement).append(alerta);
  }
  window['timer_' + "errAlert"] = setTimeout(() => alerta.remove(), 3500);
};

export const okPeticio = (selectorElement, missatge) => {
  let alerta = $("#okAlert");
  if (alerta.length) {
    clearTimeout(window['timer_' + "okAlert"]);
    alerta.find(".text").text(missatge);
  } else {
    alerta = $(`
      <div class="alert alert-success d-flex align-items-center justify-content-center mt-4 peticio" id="okAlert">
        <p class="text text-success">${missatge}</p>
      </div>
    `);
    $(selectorElement).append(alerta);
  }
  window['timer_' + "okAlert"] = setTimeout(() => alerta.remove(), 3500);
};
