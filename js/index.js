import { loadInformacions, loadDibuixos, loadPintures, loadPoemes } from "/js/data.js";
import { dataNotFound } from "/js/alerts.js";

/* Idiomes */
const changeLanguage = async (lang, generarBotons) => {
  localStorage.setItem("language", lang);
  const informacions = await loadInformacions();

  const welcomeText = document.getElementById('welcome-text');
  const title = document.querySelector('#main h1');
  const title2 = document.getElementById('title-2');
  const title3 = document.getElementById('title-3');
  const title4 = document.getElementById('title-4');
  const firstNavLink = document.getElementById('first-nav-link');
  const secondNavLink = document.getElementById('second-nav-link');
  const thirdNavLink = document.getElementById('third-nav-link');
  const lastNavLink = document.getElementById('last-nav-link');

  if (!informacions || !informacions.filter((informacio) => informacio.lang == lang).length) {
    return;
  }

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
      nouIdioma.on("click", (e) => {
        changeLanguage($(e.currentTarget).data("language"), false);
      });
      $(".idiomes .btn-group").append(nouIdioma);
    });
  }

  const texts = informacions.filter((informacio) => informacio.lang == lang)[0];

  welcomeText.textContent = texts.welcome;
  title.innerHTML = texts.title.toUpperCase();
  title2.textContent = texts.title2.toUpperCase();
  title3.textContent = texts.title3.toUpperCase();
  title4.textContent = texts.title4.toUpperCase();
  firstNavLink.textContent = texts.title2.toUpperCase();
  secondNavLink.textContent = texts.title3.toUpperCase();
  thirdNavLink.textContent = texts.title4.toUpperCase();
  lastNavLink.innerHTML = texts.title.toUpperCase();
  firstNavLink.setAttribute("title", texts.title2);
  secondNavLink.setAttribute("title", texts.title3.replaceAll("<br>", " "));
  thirdNavLink.setAttribute("title", texts.title4);
  lastNavLink.setAttribute("title", texts.title5);
  firstNavLink.setAttribute("alt", texts.title2);
  secondNavLink.setAttribute("alt", texts.title3.replaceAll("<br>", " "));
  thirdNavLink.setAttribute("alt", texts.title4);
  lastNavLink.setAttribute("alt", texts.title5);

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
const setCustomCarousel = (carouselId, dades) => {
  if (!dades) {
    dataNotFound(`#${carouselId}`);
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
  if (!dades) {
    dataNotFound(`#${carouselId}`);
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

changeLanguage(localStorage.getItem("language") ?? navigator.language, true);
$(document).ready(async function() {
  /* Dades */
  setCustomCarousel("carouselDibuixos", await loadDibuixos());
  setCustomCarousel("carouselPintures", await loadPintures());
  setCarousel("carouselPoemes", await loadPoemes());
  /* */

  /* Links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  $(".social-links button").on("click", (e) => {
    const link = $(e.currentTarget).data("link");
    open(link, link.startsWith("mailto:") ? "_self" : "_blank");
  });
  /* */

  /* Menu */
  responsiveMenu();
  const sections = document.querySelectorAll("section");
  const navLi = document.querySelectorAll(".navbar-nav.nav li");

  const updateActiveSection = () => {
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
      li.classList.remove("active");
      if (li.classList.contains(activeSection)) {
        li.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveSection);
  window.addEventListener("resize", updateActiveSection);

  const menuLateral = $(".menuLateral");
  $('#menu').on('show.bs.collapse', () => {
    menuLateral.css("box-shadow", `2px 6px 8px 2px rgba(112, 108, 97, 0.5)`);
  });

  $('#menu').on('hide.bs.collapse', () => {
    menuLateral.css("box-shadow", "none");
  });
  /* */

  /* Carousel */
  responsiveCarousel("carouselDibuixos");
  responsiveCarousel("carouselPintures");
  autoCarousel("carouselDibuixos", 3000);
  autoCarousel("carouselPintures", 3500);
  obrirImatge();
  /* */
});
