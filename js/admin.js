import { errorPeticio, okPeticio, dataNotFound } from "/js/alerts.js";
import { loadInformacions, loadDibuixos, loadPintures, loadPoemes } from "/js/data.js";
import { getMyUser, modifyUser } from "/js/data.js";
import { newElement, getElement, modifyElement, deleteElement } from "/js/data.js";

const token = localStorage.getItem("token");
//Init
$(document).ready(async function() {
  await llistaInformacions();
});
//

//Llistes
const llistaInformacions = async () => {
  deseleccionarElements();
  const informacions = await loadInformacions();
  if (!informacions) {
    dataNotFound(".contingut");
    return;
  }
  if (!$(".informacions ul li:not(#templateInformacio)").length) {
    informacions.map((informacio) => {
      afegirInformacio(informacio);
    });
  }
  $(".adminList").removeClass("d-none");
  $(".llistaElements").each(function () {
    $(this).parent().addClass("d-none");
  });
  $(".informacions").removeClass("d-none");
  seleccionarElement();
  pagination("informacions");
};

const afegirInformacio = (informacio, replace) => {
  const template = $(".informacions .llistaElements #templateInformacio");
  const novaInformacio = template.clone().removeClass("d-none");
  novaInformacio.attr("id", informacio._id);
  novaInformacio.find(".nomElement").text(informacio.lang);
  const templateProp = novaInformacio.find(".templatePropietat");
  for (const propietat in informacio) {
      if (propietat != "_id" && propietat != "lang") {
        const novaPropietat = templateProp.clone();
        novaPropietat.find(".propietat").text(propietat);
        novaPropietat.find(".valor").text(informacio[propietat]);
        novaPropietat.removeClass("templatePropietat").addClass("propietatElement");
        novaPropietat.appendTo(templateProp.parent());
      }
  }
  templateProp.remove();
  if (!replace) {
    novaInformacio.appendTo(template.parent());
  }
  return novaInformacio;
};

const llistaDibuixosPinturesPoemes = async (tipus) => {
  deseleccionarElements();
  if (!$(`.${tipus} ul li:not([id^='template'])`).length) {
    let elements;
    let singular;
    switch (tipus) {
      case "dibuixos":
        elements = await loadDibuixos();
        if (!elements) {
          dataNotFound(".adminList");
          return;
        }
        singular = "Dibuix";
        break;
      case "pintures":
        elements = await loadPintures();
        if (!elements) {
          dataNotFound(".adminList");
          return;
        }
        singular = "Pintura";
        break;
      case "poemes":
        elements = await loadPoemes();
        if (!elements) {
          dataNotFound(".adminList");
          return;
        }
        singular = "Poema";
        break;
      default:
        return;
    }
    elements.map((element) => {
      afegirDibuixPinturaPoema(element, tipus, singular);
    });
  }
  $(".adminList").removeClass("d-none");
  $(".llistaElements").each(function () {
    $(this).parent().addClass("d-none");
  });
  $(`.${tipus}`).removeClass("d-none");
  seleccionarElement();
  pagination(tipus);
};

const afegirDibuixPinturaPoema = (element, tipus, singular, replace) => {
  const template = $(`.${tipus} .llistaElements #template${singular}`);
  const nouElement = template.clone().removeClass("d-none");
  nouElement.attr("id", element._id);
  nouElement.find(".nomElement").text(element.name);
  nouElement.find(".descripcioElement").text(element.description ?? element.text);
  const imatge = nouElement.find("img.imatgeElement");
  imatge.attr("src", element.photoUrl);
  imatge.attr("title", element.name);
  imatge.attr("alt", element.description ?? element.text);
  if (!replace) {
    nouElement.appendTo(template.parent());
  }
  return nouElement;
};

$(".adminOptions ul button").on("click", async function () {
  $(".editOptions").removeClass("d-none");
  $("section.usuari").addClass("d-none");

  $(".adminItem").addClass("d-none");
  $(".adminOptions ul button").each(function () {
    $(this).removeClass("clicked");
    $(this).removeAttr("aria-current");
  });
  $(this).addClass("clicked");
  $(this).attr("aria-current", "page");
  const id = $(this).attr("id");
  switch (id) {
    case "informacions":
      await llistaInformacions();
      break;
    case "dibuixos":
    case "pintures":
    case "poemes":
      await llistaDibuixosPinturesPoemes(id);
      break;
    default:
      return;
  }
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
});

const seleccionarElement = () => {
  $(".llistaElements .element").off("click");
  $(".llistaElements .element").on("click", function () {
    const element = $(this);
    $(".llistaElements .element").each(function () {
      if (!element.is($(this))) {
        $(this).removeClass("seleccionat");
      }
    });
    element.toggleClass("seleccionat");

    if ($(".llistaElements .element.seleccionat").length) {
      $(".editOptions button:not(#add)").removeAttr("disabled");
    } else {
      $(".editOptions button:not(#add)").attr("disabled", true);
      unFillForm();
      tipusVisible().target.addClass("d-none");
      return;
    }

    if ($("button#modify").hasClass("lastClicked")) {
      const target = tipusVisible().target;
      const ruta = tipusVisible().ruta;
      fillForm(target, ruta);
    }
  });
};

const deseleccionarElements = () => {
  $(".llistaElements .element").each(function () {
    $(this).removeClass("seleccionat");
  });
  $(".editOptions button").each(function () {
    $(this).removeClass("lastClicked");
  });
  $(".editOptions button:not(#add)").attr("disabled", true);
};

const tipusVisible = () => {
  let target, ruta;
  if ($(".llistaElements:visible").parent().hasClass("informacions")) {
    target = $("#infoForm");
    ruta = "informacions/informacio";
  } else if ($(".llistaElements:visible").parent().hasClass("dibuixos")) {
    target = $("#dibuixForm");
    ruta = "dibuixos/dibuix";
  } else if ($(".llistaElements:visible").parent().hasClass("pintures")) {
    target = $("#pinturaForm");
    ruta = "pintures/pintura";
  } else if ($(".llistaElements:visible").parent().hasClass("poemes")) {
    target = $("#poemaForm");
    ruta = "poemes/poema";
  }
  return {target: target, ruta: ruta};
};
//

//CRUD
$(".editOptions button").on("click", function () {
  $(".editOptions button").each(function () {
    $(this).removeClass("lastClicked");
  });
  $(this).addClass("lastClicked");

  const target = tipusVisible().target;
  const ruta = tipusVisible().ruta;

  target.removeClass("modificant");
  target.off("submit");
  unFillForm();

  const titol = target.find(".titolForm");
  if ($(this).attr("id") == "add") {
    titol.text(titol.text().replace("Modificar", "Afegir"));
    target.on("submit", async function (e) {
      e.preventDefault();
      if (!document.querySelector(`#${$(this).attr("id")}`).checkValidity()) {
        return;
      }
      document.querySelector(`#${$(this).attr("id")}`).classList.add('was-validated');

      await crudElement("add", target, ruta);
    });
  } else if ($(this).attr("id") == "modify") {
    titol.text(titol.text().replace("Afegir", "Modificar"));
    target.addClass("modificant");
    fillForm(target, ruta);
    target.on("submit", async function (e) {
      e.preventDefault();
      if (!document.querySelector(`#${$(this).attr("id")}`).checkValidity()) {
        return;
      }
      document.querySelector(`#${$(this).attr("id")}`).classList.add('was-validated');

      await crudElement("modify", target, ruta);
    });
  } else if ($(this).attr("id") == "delete") {
    Swal.fire({
      title: "Segur que vols eliminar aquest element?",
      confirmButtonText: `<i class="fa-solid fa-check"></i>`,
      confirmButtonColor: `${getComputedStyle(document.documentElement).getPropertyValue('--color-alternatiu')}`,
      showCancelButton: true,
      cancelButtonText: `<i class="fa-solid fa-times"></i>`,
      cancelButtonColor: `${getComputedStyle(document.documentElement).getPropertyValue('--color-alternatiu')}`,
      icon: "warning"
    }).then(async (confirmed) => {
      if (confirmed.isConfirmed) {
        await crudElement("delete", target, ruta);
      }
    });
  }

  target.removeClass("was-validated");
  if ($(this).attr("id") != "delete") {
    $(".adminItem").removeClass("d-none");
    $(".adminForm").each(function () {
      $(this).addClass("d-none");
    });
    target.removeClass("d-none");

    const capsalera = $(".adminOptions");
    $('html, body').animate({
      scrollTop: target.offset().top - capsalera.height() + 'px'
    }, 300);
  }
});

const unFillForm = () => {
  $(".adminItem form").each(function () {
    $(this).find("input, textarea").each(function () {
      $(this).val("");
      if ($(this).is("[id^=foto]")) {
        $(this).attr("required", true);
      }
    });
  });
};

const fillForm = async (target, ruta) => {
  const id = $(".element.seleccionat").attr("id");
  const data = await getElement(id, token, ruta);
  if (data.error) {
    errorPeticio(".adminList", data.message);
    return;
  }

  switch (target.attr("id")) {
    case "infoForm":
      target.find("#nomIdioma").val(data.lang);
      target.find("#idioma").val(data.lang);
      target.find("#benvinguda").val(data.welcome);
      target.find("#titol").val(data.title);
      target.find("#titol2").val(data.title2);
      target.find("#titol3").val(data.title3);
      target.find("#titol4").val(data.title4);
      target.find("#titol5").val(data.title5);
      break;
    case "dibuixForm":
      target.find("#fotoDibuix").removeAttr("required");
      target.find("#nomDibuix").val(data.name);
      target.find("#descDibuix").val(data.description);
      break;
    case "pinturaForm":
      target.find("#fotoPintura").removeAttr("required");
      target.find("#nomPintura").val(data.name);
      target.find("#descPintura").val(data.description);
      break;
    case "poemaForm":
      target.find("#fotoPoema").removeAttr("required");
      target.find("#nomPoema").val(data.name);
      target.find("#textPoema").val(data.text);
      break;
    default:
      return;
  }
};

const crudElement = async (accio, target, ruta) => {
  const id = $(".element.seleccionat").attr("id");
  let formData;
  let text;
  let gen;
  let tipus;

  switch (target.attr("id")) {
    case "infoForm":
      formData = {
        language: target.find("#nomIdioma").val(),
        lang: target.find("#idioma").val(),
        welcome: target.find("#benvinguda").val(),
        title: target.find("#titol").val(),
        title2: target.find("#titol2").val(),
        title3: target.find("#titol3").val(),
        title4: target.find("#titol4").val(),
        title5: target.find("#titol5").val(),
      };
      text = "Informació";
      gen = "F";
      tipus = "informacions";
      break;
    case "dibuixForm":
      const dadesD = {
        photoUrl: target.find("#fotoDibuix").get(0).files[0],
        name: target.find("#nomDibuix").val(),
        description: target.find("#descDibuix").val(),
      };
      formData  = new FormData();
      for(const name in dadesD) {
        formData.append(name, dadesD[name]);
      }
      text = "Dibuix";
      gen = "M";
      tipus = "dibuixos";
      break;
    case "pinturaForm":
      const dadesPi = {
        photoUrl: target.find("#fotoPintura").get(0).files[0],
        name: target.find("#nomPintura").val(),
        description: target.find("#descPintura").val(),
      };
      formData  = new FormData();
      for(const name in dadesPi) {
        formData.append(name, dadesPi[name]);
      }
      text = "Pintura";
      gen = "F";
      tipus = "pintures";
      break;
    case "poemaForm":
      const dadesPo = {
        photoUrl: target.find("#fotoPoema").get(0).files[0],
        name: target.find("#nomPoema").val(),
        text: target.find("#textPoema").val(),
      };
      formData  = new FormData();
      for(const name in dadesPo) {
        formData.append(name, dadesPo[name]);
      }
      text = "Poema";
      gen = "M";
      tipus = "poemes";
      break;
    default:
      return;
  }

  switch (accio) {
    case "add":
      const respAdd = await newElement(tipus != "informacions", formData, token, `${ruta.substring(0, ruta.indexOf("/") + 1)}new-${ruta.substr(ruta.indexOf("/") + 1)}`);
      if (respAdd.error) {
        errorPeticio(".adminList", respAdd.message);
      } else {
        okPeticio(".adminList", `${text} ${gen == "M" ? "afegit" : "afegida"}`);
        const elementAfegit = tipus == "informacions" ? afegirInformacio(respAdd) : afegirDibuixPinturaPoema(respAdd, tipus, text);
        seleccionarElement();
        pagination(tipus);
      }
      break;
    case "modify":
      let foto;
      if (formData instanceof FormData) {
        foto = formData.get("photoUrl") != "undefined";
        if (!foto) {
          const jsonObj = {};
          formData.delete("photoUrl");
          formData.forEach((value, key) => jsonObj[key] = value);
          formData = jsonObj;
        }
      } else {
        foto = true;
      }
      const respMod = await modifyElement(tipus != "informacions" && foto, formData, id, token, !foto ? `${ruta}-no-image` : ruta);
      if (respMod.error) {
        errorPeticio(".adminList", respMod.message);
      } else {
        okPeticio(".adminList", `${text} ${gen == "M" ? "modificat" : "modificada"}`);
        const elementModificat = tipus == "informacions" ? afegirInformacio(respMod, true) : afegirDibuixPinturaPoema(respMod, tipus, text, true);
        const elementAntic = $(`li.element[id="${id}"]`);
        elementAntic.replaceWith(elementModificat.attr("id", elementAntic.attr("id")));
        seleccionarElement();
        pagination(tipus);
        elementModificat.click();
      }
      break;
    case "delete":
      const respDel = await deleteElement(id, token, ruta);
      if (respDel.error) {
        errorPeticio(".adminList", respDel.message);
      } else {
        okPeticio(".adminList", `${text} ${gen == "M" ? "esborrat" : "esborrada"}`);
        $(`#${id}`).remove();
      }
      break;
    default:
      return;
  }
};
//

//Forms validation
(() => {
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false)
  });
})();
//

//Usuari
$("#user").on("click", async () => {
  $("section.usuari").removeClass("d-none");
  $(".editOptions").addClass("d-none");
  $("section.adminList").addClass("d-none");
  $("section.adminItem").addClass("d-none");

  const resp = await getMyUser(token);
  if (resp.error) {
    errorPeticio("#userForm", resp.message);
  } else {
    $("#userForm").find("#username").val(resp.username);
    $("#userForm").find("#password").val("");
  }
});

$("#userForm").on("submit", async function (e) {
  e.preventDefault();
  if (!document.querySelector("#userForm").checkValidity()) {
    return;
  }
  document.querySelector("#userForm").classList.add('was-validated');

  const userData = { username: $(this).find("#username").val(), password: $(this).find("#password").val() };
  const resp = await modifyUser(userData, token);
  if (resp.error) {
    errorPeticio("#userForm", resp.message);
  } else {
    okPeticio("#userForm", "Dades modificades");
  }
});
//

//Paginació
const pagination = (tipus) => {
  const content = document.querySelector(`.${tipus}`);
  const itemsPerPage = 10;
  let currentPage = 0;
  const items = Array.from(content.getElementsByTagName('li')).slice(0);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const showPage = (page) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    items.forEach((item, index) => {
      item.classList.toggle('hidden', index < startIndex || index >= endIndex);
    });
    updateActiveButtonStates();
    deseleccionarElements();
  }

  const createPageButtons = () => {
    const paginationDiv = $(content).find(".pagination");

    for (let i = 0; i < totalPages; i++) {
      const pageButton = $(`<button class="btn botoPag"></button>`).text(`${i + 1}`);
      pageButton.on("click", () => {
        currentPage = i;
        showPage(currentPage);
        updateActiveButtonStates();
      });
      paginationDiv.append(pageButton);
    }

    paginationDiv.prepend(`<button class="btn botoPag anterior" ${totalPages > 1 ? "" : "disabled"}>Anterior</button>`);
    paginationDiv.append(`<button class="btn botoPag seguent" ${totalPages > 1 ? "" : "disabled"}>Següent</button>`);

    $(`.${tipus} .pagination button.anterior`).on("click", () => {
      if (currentPage == 0) {
        return;
      }
      currentPage--;
      showPage(currentPage);
    });

    $(`.${tipus} .pagination button.seguent`).on("click", () => {
      if (currentPage + 1 > totalPages - 1) {
        return;
      }
      currentPage++;
      showPage(currentPage);
    });
  };

  const updateActiveButtonStates = () => {
    const pageButtons = $(`.${tipus} .pagination button:not(.anterior):not(.seguent)`);
    pageButtons.each((index, button) => {
      if (index === currentPage) {
        $(button).addClass("clicked");
      } else {
        $(button).removeClass("clicked");
      }
    });

    $(`.${tipus} .pagination button.anterior`).removeAttr("disabled");
    $(`.${tipus} .pagination button.seguent`).removeAttr("disabled");
    if (currentPage == 0) {
      $(`.${tipus} .pagination button.anterior`).attr("disabled", true);
    }
    if (currentPage == totalPages - 1) {
      $(`.${tipus} .pagination button.seguent`).attr("disabled", true);
    }
  };

  if (!$(`.${tipus} .pagination button`).length) {
    createPageButtons();
  }
  showPage(currentPage);
};
//
