const visitedCounties = [
  "Devon",
  "Somerset",
  "Surrey",
  "Middlesex",
  "Hampshire",
  "Shropshire",
  "Midlothian",
  "East Lothian",
  "Morayshire",
  "Inverness-shire",
  "Aberdeenshire",
  "Angus",
  "Lancashire",
  "Dorset",
  "Bedfordshire",
  "Berkshire",
  "Essex",
  "Kent",
  "Cambridgeshire",
  "Sussex",
  "West Lothian",
  "Perthshire",
  "Durham",
  "Suffolk",
  "Fife",
  "Yorkshire",
  "Derbyshire",
  "Oxfordshire",
  "Northumberland",
  "Lincolnshire",
  "Wiltshire",
  "Argyllshire",
  "Lanarkshire",
  "Ayrshire",
  "Dumfriesshire",
  "Westmorland",
  "Sutherland",
  "Cromartyshire",
  "Ross-shire",
  "Peeblesshire",
  "Banffshire",
  "Buteshire",
  "Peterborough",
  "Buckinghamshire",
  "Northamptonshire",
  "Cumberland",
  "Leicestershire",
  "Renfrewshire",
  "Herefordshire",
  "Gloucestershire",
  "Roxburghshire",
  "Brecknockshire",
  "Hertfordshire",
  "Glamorgan",
  "Monmouthshire",
  "Nairnshire",
  "Berwickshire",
  "Selkirkshire",
  "Cornwall",
  "Rutland",
  "Cheshire",
  "Staffordshire",
  "Worcestershire",
  "Warwickshire",
  "Norfolk",
  "Nottinghamshire",
];
const animationInterval = 50; // used by animateLoad()
const totalCounties = document.querySelectorAll(".county").length;

let percentComplete = 0; // gets iterated by animateLoad()

function attachMouseEvents() {
  const elTextLabel = document.querySelector(".mouse-label");
  const mapCounties = document.querySelectorAll(".county");
  const svg = document.querySelector(".map-container svg");
  const countiesArray = Array.from(mapCounties);

  // Single tab stop on the SVG; paths get aria-labels for screen readers
  svg.setAttribute("tabindex", "0");
  svg.setAttribute("role", "application");
  svg.setAttribute("aria-label", "Map of British counties. Use arrow keys to explore.");
  mapCounties.forEach((el) => {
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", el.dataset.name);
  });

  // Keyboard navigation — arrow keys cycle through counties
  let keyboardIndex = -1;
  let keyboardFocusedEl = null;

  function setKeyboardFocus(el) {
    if (keyboardFocusedEl) keyboardFocusedEl.classList.remove("county--keyboard-focus");
    keyboardFocusedEl = el;
    if (el) el.classList.add("county--keyboard-focus");
  }

  function showTooltipForEl(el) {
    elTextLabel.innerText = el.dataset.name;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - elTextLabel.offsetWidth / 2;
    elTextLabel.style.left = Math.max(8, x) + "px";
    elTextLabel.style.top = Math.max(8, rect.top - 40) + "px";
    elTextLabel.classList.add("shown");
  }

  svg.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") {
      ev.preventDefault();
      keyboardIndex = (keyboardIndex + 1) % countiesArray.length;
      setKeyboardFocus(countiesArray[keyboardIndex]);
      showTooltipForEl(countiesArray[keyboardIndex]);
    } else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
      ev.preventDefault();
      keyboardIndex = (keyboardIndex - 1 + countiesArray.length) % countiesArray.length;
      setKeyboardFocus(countiesArray[keyboardIndex]);
      showTooltipForEl(countiesArray[keyboardIndex]);
    } else if (ev.key === "Escape") {
      keyboardIndex = -1;
      setKeyboardFocus(null);
      elTextLabel.classList.remove("shown");
    }
  });

  svg.addEventListener("blur", () => {
    keyboardIndex = -1;
    setKeyboardFocus(null);
    elTextLabel.classList.remove("shown");
  });

  // Mouse: tooltip follows cursor (unchanged)
  document.addEventListener("mousemove", (ev) => {
    elTextLabel.style.left = ev.clientX + "px";
    elTextLabel.style.top = ev.clientY - 40 + "px";
  });

  mapCounties.forEach((el) => {
    el.addEventListener("mouseover", (ev) => {
      elTextLabel.classList.add("shown");
      elTextLabel.innerText = ev.target.dataset.name;
    });

    el.addEventListener("mouseleave", () => {
      elTextLabel.classList.remove("shown");
    });

    el.addEventListener("click", (ev) => {
      navigator.clipboard.writeText(ev.target.dataset.name);
    });
  });
}

function updateCompletion() {
  const elPercentComplete = document.querySelector(".js-percent-complete");
  elPercentComplete.innerHTML = percentComplete;
}

function animateLoad() {
  visitedCounties.forEach((county, idx) => {
    setTimeout(function () {
      const el = document.querySelector("[data-name='" + county + "']");
      if (el) el.classList.add("county--visited");

      percentComplete = Math.floor((100 * (idx + 1)) / totalCounties);
      updateCompletion();
    }, idx * animationInterval);
  });

  setTimeout(() => {
    attachMouseEvents();
  }, visitedCounties.length * animationInterval);
}

document.addEventListener("DOMContentLoaded", animateLoad);
