import { loadInformacions, loadCansons, loadDibuixos, loadPintures, loadPoemes } from "/js/data.js";
import { dataNotFound } from "/js/alerts.js";

/* Idiomes */
const changeLanguage = (informacions, lang, generarBotons) => {
  if (!lang) {
    lang = "ca";
  }
  $(".info .carregant").addClass("d-none");

  if (informacions && !informacions.filter((informacio) => informacio.lang == lang).length) {
    lang = informacions[0] ? informacions[0].lang : "";
  }
  if (!informacions || !lang) {
    dataNotFound("#welcome-text");
    $(".navOcult").each(function () {
      $(this).css("visibility", "initial");
    });
    return;
  }

  localStorage.setItem("webData", JSON.stringify(informacions));
  setTextos(informacions, lang, generarBotons);
};

const setTextos = (informacions, lang, generarBotons) => {
  const welcomeText = document.getElementById('welcome-text');
  const section1 = document.getElementById('title-section1');
  const section2 = document.getElementById('title-section2');
  const section3 = document.getElementById('title-section3');
  const firstNavLink = document.getElementById('first-nav-link');
  const secondNavLink = document.getElementById('second-nav-link');
  const thirdNavLink = document.getElementById('third-nav-link');
  const lastNavLink = document.getElementById('last-nav-link');

  $(".idiomes button:not(.langTemplate)").each(function () {
    $(this).remove();
  });

  if (generarBotons) {
    const template = $(".idiomes button.langTemplate");
    informacions.map((informacio) => {
      const nouIdioma = template.clone().removeClass("d-none");
      nouIdioma.addClass(informacio.lang);
      nouIdioma.data("language", informacio.lang);
      nouIdioma.attr("title", informacio.language);
      nouIdioma.attr("alt", informacio.language);
      nouIdioma.text(informacio.lang.toUpperCase());
      nouIdioma.on("click", async (e) => {
        changeLanguage(await loadInformacions(), $(e.currentTarget).data("language"), false);
      });
      $(".idiomes .btn-group").append(nouIdioma);
    });
  }

  const texts = informacions.filter((informacio) => informacio.lang == lang)[0];
  localStorage.setItem("language", lang);

  welcomeText.textContent = texts.welcome;
  section1.textContent = texts.section1.toUpperCase();
  section2.textContent = texts.section2.toUpperCase();
  section3.textContent = texts.section3.toUpperCase();
  firstNavLink.textContent = texts.section1.toUpperCase();
  secondNavLink.textContent = texts.section2.toUpperCase();
  thirdNavLink.textContent = texts.section3.toUpperCase();
  firstNavLink.setAttribute("title", texts.section1);
  secondNavLink.setAttribute("title", texts.section2);
  thirdNavLink.setAttribute("title", texts.section3);
  lastNavLink.setAttribute("title", texts.home);
  firstNavLink.setAttribute("alt", texts.section1);
  secondNavLink.setAttribute("alt", texts.section2);
  thirdNavLink.setAttribute("alt", texts.section3);
  lastNavLink.setAttribute("alt", texts.home);

  $(".idiomes .botoMenu").each(function () {
    $(this).removeClass("clicked");
  });
  $(`.idiomes .botoMenu.${lang}`).addClass("clicked");

  responsiveMenu();
};
/* */

/* Menu */
const getVisibleArea = (element) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  return visibleHeight * visibleWidth;
};

const responsiveMenu = () => {
  const menuLateral = $(".menuLateral");
  menuLateral.removeAttr("style");
  if (menuLateral.width() > menuLateral.parent().width() && window.matchMedia("(min-width: 768px)").matches) {
    menuLateral.css("max-width", menuLateral.parent().width());
  } else {
    menuLateral.css("min-width", menuLateral.parent().width());
  }

  const botoMenu = menuLateral.find("button.navbar-toggler");
  if ((botoMenu.hasClass("collapsed") && !window.matchMedia("(min-width: 576px)").matches)
    || (!botoMenu.hasClass("collapsed") && window.matchMedia("(min-width: 576px)").matches)) {
    botoMenu.click();
  }
};
/* */

/* Carousel */
const responsiveCarousel = (carouselId) => {
  const multipleCardCarousel = document.querySelector(`#${carouselId}`);
  $(`#${carouselId} .carousel-control-next`).off("click");
  $(`#${carouselId} .carousel-control-prev`).off("click");

  if (window.matchMedia("(min-width: 768px)").matches) {
    const carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false,
      wrap: false,
    });
    if (!$(`#${carouselId} .carousel-inner`).length) {
      return;
    }
    const carouselWidth = $(`#${carouselId} .carousel-inner`)[0].scrollWidth;
    const cardWidth = $(`#${carouselId} .carousel-item`).width();
    const numItems = $(`#${carouselId} .carousel-item`).length;
    let scrollPosition = 0;

    $(multipleCardCarousel).removeClass("slide");
    $(`#${carouselId} .carousel-indicators`).addClass("d-none");

    $(`#${carouselId} .carousel-control-next`).on("click", function () {
      if (scrollPosition < (carouselWidth - cardWidth * 4)) {
        scrollPosition += cardWidth;
        $(`#${carouselId} .carousel-inner`).animate({ scrollLeft: scrollPosition }, 600);
      } else {
        scrollPosition = 0;
        $(`#${carouselId} .carousel-inner`).animate({ scrollLeft: scrollPosition }, 600);
      }
    });
    $(`#${carouselId} .carousel-control-prev`).on("click", function () {
      if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
        $(`#${carouselId} .carousel-inner`).animate({ scrollLeft: scrollPosition }, 600);
      } else {
        scrollPosition = cardWidth * (numItems - 3); //3 items visibles
        $(`#${carouselId} .carousel-inner`).animate({ scrollLeft: scrollPosition }, 600);
      }
    });
  } else {
    $(multipleCardCarousel).addClass("slide");
    $(`#${carouselId} .carousel-indicators`).removeClass("d-none");
  }
};

const autoCarousel = (carouselId, time) => {
  window['timer_' + carouselId] = setInterval(() => $(`#${carouselId} .carousel-control-next`).click(), time);
  $(`#${carouselId} .carousel-control-next`).on("click", function () {
    clearInterval(window['timer_' + carouselId]);
    window['timer_' + carouselId] = setInterval(() => $(`#${carouselId} .carousel-control-next`).click(), time);
  });
  $(`#${carouselId} .carousel-control-prev`).on("click", function () {
    clearInterval(window['timer_' + carouselId]);
    window['timer_' + carouselId] = setInterval(() => $(`#${carouselId} .carousel-control-next`).click(), time);
  });
};

const obrirImatge = () => {
  $(".carousel-inner .carousel-item").on("click", (e) => {
    const img = $(e.currentTarget).find("img");
    const caption = img.next(".carousel-caption");
    Swal.fire({
      title: `${caption.length ? caption.find(".titolImatge").text() : img.attr("title")}`,
      html: `<img src="${img.attr("src")}"></img>${caption.length ? "<p class='poema'>" + caption.find("p").text() + "</p>" : ""}`,
      confirmButtonText: `<i class="fa-solid fa-times"></i>`,
      confirmButtonColor: `${getComputedStyle(document.documentElement).getPropertyValue('--color-alternatiu')}`,
      customClass: 'swal'
    });
  });
};
/* */

/* Responsive */
window.addEventListener("resize", () => {
  responsiveMenu();
  responsiveCarousel("carouselDibuixos");
  responsiveCarousel("carouselPintures");
});
/* */

/* Dades */
const setCansons = (containerSelector, dades) => {
  $(`#${containerSelector}`).removeClass("carregantDades");
  $(`#${containerSelector}`).parent().prev(".carregant").addClass("d-none");
  if (!dades) {
    dataNotFound(`#${containerSelector}`);
    $(`#${containerSelector}`).addClass("d-none");
    return;
  }
  const template = $(`#${containerSelector}`);
  dades.map((dada, i) => {
    const nouElement = template.clone();
    nouElement.html(dada.iframe);
    nouElement.find("iframe").removeAttr("style");
    if (dada.spotify) {
      nouElement.find("iframe").addClass("player");
    }
    nouElement.appendTo(template.parent());
  });
  template.remove();
};

const setCustomCarousel = (carouselId, dades) => {
  $(`#${carouselId}`).removeClass("carregantDades");
  $(`#${carouselId}`).prevAll(".carregant:first").addClass("d-none");
  if (!dades) {
    dataNotFound(`#${carouselId}`);
    $(`#${carouselId}`).addClass("d-none");
    return;
  }
  const template = $(`#${carouselId} .carousel-inner .carousel-item`);
  const templateIndicator = $(`#${carouselId} .carousel-indicators button`);
  dades.map((dada, i) => {
    const nouElement = template.clone();
    const img = nouElement.find("img");
    img.attr("src", dada.photoUrl);
    img.attr("title", dada.name);
    img.attr("alt", dada.description);

    const nouIndicator = templateIndicator.clone();
    nouIndicator.attr("data-bs-slide-to", i);
    nouIndicator.attr("aria-label", dada.name);
    if (i != 0) {
      nouElement.removeClass("active");
      nouIndicator.removeClass("active");
      nouIndicator.removeAttr("aria-current");
    }

    nouElement.appendTo(template.parent());
    nouIndicator.appendTo(templateIndicator.parent());
  });
  template.remove();
  templateIndicator.remove();
};

const setCarousel = (carouselId, dades) => {
  $(`#${carouselId}`).removeClass("carregantDades");
  $(`#${carouselId}`).prevAll(".carregant:first").addClass("d-none");
  if (!dades) {
    dataNotFound(`#${carouselId}`);
    $(`#${carouselId}`).addClass("d-none");
    return;
  }
  const template = $(`#${carouselId} .carousel-inner .carousel-item`);
  const templateIndicator = $(`#${carouselId} .carousel-indicators button`);
  dades.map((dada, i) => {
    const nouElement = template.clone();
    const img = nouElement.find("img");
    const caption = nouElement.find(".carousel-caption");
    img.attr("src", dada.photoUrl);
    img.attr("title", dada.name);
    img.attr("alt", dada.text);
    caption.find(".titolImatge").text(dada.name);
    caption.find(".textImatge").text(dada.text);

    const nouIndicator = templateIndicator.clone();
    nouIndicator.attr("data-bs-slide-to", i);
    nouIndicator.attr("aria-label", dada.name);
    if (i != 0) {
      nouIndicator.removeClass("active");
      nouIndicator.removeAttr("aria-current");
      nouElement.removeClass("active");
    }

    nouElement.appendTo(template.parent());
    nouIndicator.appendTo(templateIndicator.parent());
  });
  template.remove();
  templateIndicator.remove();
};
/* */

/* Menu */
$(".nav-link").each(function () {
  $(this).on("touch", (e) => {e.preventDefault(); console.log("aaa");});
  $(this).prev(".nav-item").on("touch", (e) => {e.preventDefault(); console.log("bbb");});
});

responsiveMenu();

const updateActiveSection = () => {
  const sections = document.querySelectorAll("section");
  const navLi = document.querySelectorAll(".navbar-nav.nav li");
  let maxVisibleArea = 0;
  let activeSection = null;

  sections.forEach((section) => {
    const visibleArea = getVisibleArea(section);

    if (visibleArea > maxVisibleArea) {
      maxVisibleArea = visibleArea;
      activeSection = section.getAttribute("id");
    }
  });

  navLi.forEach((li) => {
    $(li).find("a").removeClass("active");
    if (li.classList.contains(activeSection)) {
      $(li).find("a").addClass("active");
    }
  });
};

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

window.addEventListener("scroll", debounce(updateActiveSection, 50));
window.addEventListener("resize", debounce(updateActiveSection, 50));

const menuLateral = $(".menuLateral");
$('#menu').on('show.bs.collapse', () => {
  menuLateral.css("box-shadow", `2px 6px 8px 2px rgba(112, 108, 97, 0.5)`);
});

$('#menu').on('hide.bs.collapse', () => {
  menuLateral.css("box-shadow", "none");
});
/* */

/* Links */
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

$(".social-links button").on("click", (e) => {
  const link = $(e.currentTarget).data("link");
  open(link, link.startsWith("mailto:") ? "_self" : "_blank");
});
/* */

$(document).ready(async function() {
  updateActiveSection();

  /* Idiomes */
  const webData = JSON.parse(localStorage.getItem("webData"));
  const idioma = localStorage.getItem("language") ?? navigator.language;
  let recarregarDades = false;
  if (webData) {
    changeLanguage(webData, idioma, true);
    recarregarDades = true;
  } else {
    changeLanguage(await loadInformacions(), idioma, true);
  }
  /* */

  /* Dades */
  setCansons("songs .music-player", await loadCansons());
  setCustomCarousel("carouselDibuixos", await loadDibuixos());
  setCustomCarousel("carouselPintures", await loadPintures());
  setCarousel("carouselPoemes", await loadPoemes());
  /* */

  /* Carousel */
  responsiveCarousel("carouselDibuixos");
  responsiveCarousel("carouselPintures");
  autoCarousel("carouselDibuixos", 3000);
  autoCarousel("carouselPintures", 3500);
  obrirImatge();
  /* */

  if (recarregarDades) {
    changeLanguage(await loadInformacions(), idioma);
  }
});
