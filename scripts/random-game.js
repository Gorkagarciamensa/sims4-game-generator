import { PACKS } from "../data/data.js";
import {
  createRandomNumber,
  generateBoxComponent,
  generateFullLoader,
  generateRandomIncome,
  onLoadingEnd,
} from "../utils/utils.js";

const generatePackBtn = document.getElementById("generate-pack");
const generatePackBtntext = document.getElementById("generate-pack-text");
const dataPack = document.querySelectorAll("[data-pack]");

generatePackBtntext.addEventListener("click", () => {
  generateGame();
});

generatePackBtn.addEventListener("click", () => {
  generateGame();
});

export function generateGame() {
  generateFullLoader(dataPack);
  onLoadingEnd(generateRandomPacks);
}

function rerollSinglePack(event) {
  const id = event.target.parentNode.id;
  const [img, p] = event.target.parentNode.children;
  const pack = PACKS[id];
  const randomNumber = createRandomNumber(pack.length);
  const name = pack[randomNumber].name;
  const icon = pack[randomNumber].icon;

  const samePack = img.src === icon || p.innerHTML === name;

  if (!samePack) {
    img.src = icon;
    p.innerHTML = id === "simoleon" ? generateRandomIncome() : name;
  }
}

function generateRandomPacks() {
  while (dataPack[0].firstChild) {
    dataPack[0].removeChild(dataPack[0].lastChild);
  }

  // Loop through all the expansions
  for (const pack of Object.values(PACKS)) {
    // generate a random number
    const randomPack = createRandomNumber(pack.length);
    const isSimoleon = pack[randomPack].type_key === "simoleon";
    const boxComponent = generateBoxComponent({
      pack: pack[randomPack],
      clickHandler: rerollSinglePack,
      isSimoleon,
      key: pack[randomPack].type_key,
    });

    dataPack[0].appendChild(boxComponent.div);
  }
}
