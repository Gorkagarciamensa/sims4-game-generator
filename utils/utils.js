const LOADER_LENGTH = 4;

export function createRandomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function returnRandomWord(keys, min = 0) {
  const randomNumber = createRandomNumber(keys.length, min);
  return keys[randomNumber];
}

export function generateRandomIncome() {
  let random_income;

  // if range 20.000 - 70.000 number < 0.5
  const lowRange = Math.random() <= 0.6;
  // else if range 70.001 - 150.000 number > 0.51 - 0.8
  const midRange = !lowRange && Math.random() <= 0.85;
  // else range 150.001 - 320.000 number > 0.71 - 0.99

  if (lowRange) {
    random_income = createRandomNumber(70000, 20000);
  } else if (midRange) {
    random_income = createRandomNumber(150000, 70001);
  } else {
    random_income = createRandomNumber(320000, 150001);
  }

  return random_income;
}

export function generateBoxComponent({ pack, clickHandler, isSimoleon, key }) {
  const div = document.createElement("div");
  div.id = pack.type_key;
  if (key) {
    div.setAttribute(`data-${key}-${pack.type_key}`, `${key}`);
  }

  const image = document.createElement("img");
  const p = document.createElement("p");
  const rerollImg = document.createElement("img");

  div.classList.add("section-boxed--box");
  image.classList.add("img-size");
  p.classList.add("word-break-center");
  rerollImg.classList.add("img-size", "cursor-pointer");
  rerollImg.src = "./assets/icons/reroll.png";
  rerollImg.setAttribute("data-reroll", "reroll");
  rerollImg.addEventListener("click", clickHandler);

  image.src = pack.icon;
  p.innerHTML = isSimoleon ? generateRandomIncome() : pack.name;

  div.appendChild(image);
  div.appendChild(p);
  div.appendChild(rerollImg);

  return { div, image, p, rerollImg };
}

export function generateNoDataBoxComponent() {
  const noDataBody = document.createElement("div");
  noDataBody.classList.add("section-boxed--box", "justify-center");
  const p = document.createElement("p");
  p.innerHTML = "Doesn't have";
  p.classList.add("no-data-text");
  noDataBody.appendChild(p);
  return noDataBody;
}

export function generateFullLoader(allSelectors) {
  generateLoader({ selectors: allSelectors, className: "lds-ellipsis" });
}

export function generateSingleLoader(allSelectors) {
  generateLoader({ selectors: allSelectors, className: "lds-ellipsis-small" });
}

export function onLoadingEnd(callback) {
  setTimeout(() => {
    removeLoader();
    callback();
  }, 500);
}

function generateLoader({ selectors, className }) {
  for (const parent of selectors) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }

    const div = document.createElement("div");
    div.classList.add(className);
    div.setAttribute("data-loader", "loader");

    for (let i = 0; i < LOADER_LENGTH; i++) {
      const childDiv = document.createElement("div");
      div.appendChild(childDiv);
    }

    parent.appendChild(div);
  }
}

function removeLoader() {
  const loader = document.querySelector("[data-loader]");
  loader.classList.remove("lds-ellipsis");
}
