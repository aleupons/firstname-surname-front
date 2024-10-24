export const pageNotFound = () => {
  $(".content-wrapper").html(`
    <div class="alert alert-danger d-flex align-items-center justify-content-center mt-4">
      <p class="text text-danger">Page not found</p>
    </div>
  `);
  $(".main-wrapper").css("height", `calc(100vh - ${$("footer").outerHeight()}px)`);
};

export const dataNotFound = (selectorElement, info) => {
  $(selectorElement).html(`
    <div class="alert alert-warning d-flex align-items-center justify-content-center mt-4">
      <p class="text text-warning">Data not found</p>
    </div>
  `);
  if (info) {
    $(".main-wrapper").css("height", `calc(100vh - ${$("footer").outerHeight()}px)`);
  }
};

export const errorPeticio = (selectorElement, missatge) => {
  const alerta = $(`
    <div class="alert alert-danger d-flex align-items-center justify-content-center mt-4">
      <p class="text text-danger">${missatge}</p>
    </div>
  `);
  $(selectorElement).append(alerta);
  setTimeout(() => alerta.remove(), 3500);
};

export const okPeticio = (selectorElement, missatge) => {
  const alerta = $(`
    <div class="alert alert-success d-flex align-items-center justify-content-center mt-4">
      <p class="text text-success">${missatge}</p>
    </div>
  `);
  $(selectorElement).append(alerta);
  setTimeout(() => alerta.remove(), 3500);
};
