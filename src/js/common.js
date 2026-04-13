(function (window, document) {
  "use strict";

  const retrieveURL = function (filename) {
    let scripts = document.getElementsByTagName("script");
    if (scripts && scripts.length > 0) {
      for (let i in scripts) {
        if (
          scripts[i].src &&
          scripts[i].src.match(new RegExp(filename + "\\.js$"))
        ) {
          return scripts[i].src.replace(
            new RegExp("(.*)" + filename + "\\.js$"),
            "$1",
          );
        }
      }
    }
  };

  function load(url, element) {
    let req = new XMLHttpRequest();

    req.onload = function () {
      if (this.readyState == 4 && this.status == 200) {
        element.insertAdjacentHTML("afterbegin", req.responseText);
      }
    };

    req.open("GET", url, true);
    req.send(null);
  }

  if (
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1" &&
    location.host !== ""
  ) {
    var files = ["./img/symbol_sprite.html"],
      revision = 10;

    if (
      !document.createElementNS ||
      !document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGRect
    )
      return true;

    var isLocalStorage =
        "localStorage" in window && window["localStorage"] !== null,
      request,
      data,
      insertIT = function () {
        document.body.insertAdjacentHTML("afterbegin", data);
      },
      insert = function () {
        if (document.body) insertIT();
        else document.addEventListener("DOMContentLoaded", insertIT);
      };
    files.forEach((file) => {
      try {
        let request = new XMLHttpRequest();
        request.open("GET", file, true);
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            data = request.responseText;
            insert();
            if (isLocalStorage) {
              localStorage.setItem("inlineSVGdata", data);
              localStorage.setItem("inlineSVGrev", revision);
            }
          }
        };
        request.send();
      } catch (e) {}
    });
  } else {
    load("./img/symbol_sprite.html", document.querySelector("body"));
  }
})(window, document);

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Input mask
   * https://github.com/text-mask/text-mask/tree/master/vanilla
   */
  var phoneMask = [
    "+",
    "3",
    "8",
    "(",
    /[0]/,
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
  var myInputs = document.querySelectorAll('input[type="tel"]');
  if (myInputs) {
    for (var phones = 0; phones < myInputs.length; phones++) {
      var maskedInputController = vanillaTextMask.maskInput({
        inputElement: myInputs[phones],
        mask: phoneMask,
        // placeholderChar: '___(___) ___-__-__',
        guide: true,
        showMask: true,
        keepCharPositions: true,
      });
      myInputs[phones].addEventListener("click", function () {
        if (this.value == "+38(___) ___-__-__") {
          this.setSelectionRange(4, 4);
        }
      });
    }
  }
  let navbar = document.querySelector(".navbar-toggler");
  let overlay = document.querySelector(".collapse-overlay");
  navbar.addEventListener("click", function () {
    overlay.classList.toggle("show");
  });

  var swiper = new Swiper(".swiper-container", {
    effect: "fade",
    loop: true,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false,
    },
    mousewheel: false, // якщо хочеш зміну при скролі
    pagination: false,
    navigation: false,
  });
  // Слайдер мініатюр
  var thumbsSwiper = new Swiper(".thumbs-swiper", {
    direction: "vertical",
    spaceBetween: 10,
    slidesPerView: 5,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      0: {
        enabled: false, // 🔥 вимикаємо на моб
      },
      769: {
        enabled: true,
      },
    },
  });

  var mainSwiper = new Swiper(".main-swiper", {
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 7000,
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });




});

//send form
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const html = document.querySelector("html").getAttribute("lang");
  const result = form.querySelector("button[type='submit']");
  const tel = form.querySelector("input[type='tel']");
  const name = form.querySelector('input[name="name"]');

  // Додаємо поле city, якщо його ще немає
  let cityInput = form.querySelector("input[name='city']");
  if (!cityInput) {
    cityInput = document.createElement("input");
    cityInput.type = "hidden";
    cityInput.name = "city";
    form.appendChild(cityInput);
  }

  // Отримуємо місто через API
  $.getJSON("https://ipapi.co/json/", function (t) {
    cityInput.value = t.city || "Невідоме місто";
  });

  tel.addEventListener("input", () => {
    tel.classList.remove("validation-error");
  });

  if (/^\+38\(0[0-9]{2}\)\s[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/i.test(tel.value)) {
    result.disabled = true;
    const btnText = result.innerHTML;
    if (html == "ru-RU") {
      result.innerHTML = "Отправка";
    } else if (html == "uk") {
      result.innerHTML = "Відправка";
    }

    // Додаємо затримку перед відправкою, щоб city встигло оновитися
    setTimeout(() => {
      fetch("registration.php", {
        method: "POST",
        body: new FormData(form),
      }).then(() => {
        const tyblock = document.createElement("div");
        tyblock.classList.add("form-ty");

        if (html == "ru-RU") {
          tyblock.innerHTML = "Спасибо за заявку!";
          result.innerHTML = "Отправлено!";
          result.disabled = true;
        } else if (html == "uk") {
          tyblock.innerHTML = "Дякуємо за заявку!";
          result.innerHTML = "Відправлено!";
          result.disabled = true;
        }

        form.appendChild(tyblock);
        setTimeout(function () {
          const modal = form.closest(".modal");
          if (modal) {
            $(`#${modal.id}`).hide();
            $(modal).hide();
            $("body").css({ overflowY: "", padding: 0 });

            tyblock.remove();
            form.reset();
            result.disabled = true;
          } else {
            tyblock.remove();
            form.reset();
            result.disabled = true;
          }
        }, 4000);
      });
    }, 500); // Даємо 500 мс, щоб `city` встигло оновитися
  } else {
    tel.classList.add("validation-error");
  }
});

$(document).ready(function () {
  $(".single-item").slick({});
});
