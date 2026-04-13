"use strict";
! function (e, n) {
	var t, o, i;
	if ("localhost" !== location.hostname && "127.0.0.1" !== location.hostname && "" !== location.host) {
		if (!n.createElementNS || !n.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) return;
		var r, s = "localStorage" in e && null !== e.localStorage,
			a = function () {
				n.body.insertAdjacentHTML("afterbegin", r)
			};
		["./img/symbol_sprite.html"].forEach(function (e) {
			try {
				var t = new XMLHttpRequest;
				t.open("GET", e, !0), t.onload = function () {
					200 <= t.status && t.status < 400 && (r = t.responseText, n.body ? a() : n.addEventListener("DOMContentLoaded", a), s && (localStorage.setItem("inlineSVGdata", r), localStorage.setItem("inlineSVGrev", 10)))
				}, t.send()
			} catch (e) {}
		})
	} else t = "./img/symbol_sprite.html", o = n.querySelector("body"), (i = new XMLHttpRequest).onload = function () {
		4 == this.readyState && 200 == this.status && o.insertAdjacentHTML("afterbegin", i.responseText)
	}, i.open("GET", t, !0), i.send(null)
}(window, document), document.addEventListener("submit", function (e) {
	e.preventDefault();
	var t, n = e.target,
		o = document.querySelector("html").getAttribute("lang"),
		i = n.querySelector("button[type='submit']"),
		r = n.querySelector("input[type='tel']");
	if (regex = /^\+38\(0(67|68|96|97|98|50|66|95|99|63|73|93|91|92|89|97)\)(.*)?$/i, regex.test(r))
		if (r.addEventListener("input", function () {
			r.classList.remove("validation-error")
		}), /^\+38\(0[0-9]{2}\)\s[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/i.test(r.value)) {
			i.disabled = !0;
			i.innerHTML;
			"ru-RU" == o ? i.innerHTML = "Отправка" : "uk" == o && (i.innerHTML = "Відправка"), fetch("registration.php", {
				method: "POST",
				body: new FormData(n)
			}).then(function () {
				var t = document.createElement("div");
				t.classList.add("form-ty"), "ru-RU" == o ? (t.innerHTML = "Спасибо за заявку!", i.innerHTML = "Отправлено!") : "uk" == o && (t.innerHTML = "Дякуємо за заявку!", i.innerHTML = "Відправлено!"), n.appendChild(t), setTimeout(function () {
					var e = n.closest(".modal");
					e && ($("#" + e.id).hide(), $(e).hide(), $("body").css({
						overflowY: "",
						padding: 0
					})), t.remove(), n.reset(), i.disabled = !1
				}, 4e3)
			})
		} else r.classList.add("validation-error");
	else "ru-RU" == o ? t = '<div style="color: red;" id="span-error">Некорректно введен, Ваш номер</div>' : "uk" == o ? t = '<div style="color: red;" id="span-error">Некоректно введений, Ваш номер</div>' : "ua" == o && (t = '<div style="color: red;" id="span-error">Некоректно введений, Ваш номер</div>'), r.insertAdjacentHTML("afterend", t), setTimeout(function () {
		console.log("span", t), document.querySelector("#span-error").remove()
	}, 5e3)
}), $(document).ready(function () {
	$(".single-item").slick({})
}), document.addEventListener("DOMContentLoaded", function () {
	(e = document.location.href).split("?")[1], e.split("?")[0], document.referrer;
	e.split("invite_id=")[1], $(".input-tel").keypress(function (e) {
		if (8 != e.which && 0 != e.which && 46 != e.which && (e.which < 48 || 57 < e.which)) return !1
	}), $.getJSON("https://ipapi.co/json/", function (t) {
		document.querySelectorAll(".geoloc").forEach(function (e) {
			e.value = t.city
		})
	});
	var e;
	(e = document.location.href).split("?")[1], e.split("?")[0], document.referrer;
	e.split("invite_id=")[1];
	var t = ["+", "3", "8", "(", /[0]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/],
		n = document.querySelectorAll('input[type="tel"]');
	if (n)
		for (var o = 0; o < n.length; o++) {
			vanillaTextMask.maskInput({
				inputElement: n[o],
				mask: t,
				guide: !0,
				showMask: !0,
				keepCharPositions: !0
			});
			n[o].addEventListener("click", function () {
				"+38(___) ___-__-__" == this.value && this.setSelectionRange(4, 4)
			})
		}
	var i = document.querySelector(".navbar-toggler"),
		r = document.querySelector(".collapse-overlay");
	i.addEventListener("click", function () {
		r.classList.toggle("show")
	})
});