import { HOUSEHOLD_DATA } from '../data/sims-data.js';
import {
  createRandomNumber,
  generateBoxComponent,
  generateLoader,
  generateNoDataBoxComponent,
  removeLoader,
  returnRandomWord,
} from '../utils/utils.js';
import { generateGame } from './random-game.js';

const HOUSEHOLDS_NAMES = [
  'Race',
  'Gender',
  'Type',
  'Profession',
  'Aspirations',
];

// DOM elements
const houseHoldButton = document.getElementById('generate-household');
const houseHoldButtonText = document.getElementById('generate-household-text');
const generateAllButton = document.getElementById('generate-all');
const main = document.querySelector('[data-main]');

houseHoldButton.addEventListener('click', () => {
  generateFamily();
});
houseHoldButtonText.addEventListener('click', () => {
  generateFamily();
});

generateAllButton.addEventListener('click', () => {
  generateGame();
  generateFamily();
});

function generateFamily() {
  const householdPlaceholder = document.querySelectorAll('[data-household]');
  generateLoader(householdPlaceholder);
  setTimeout(() => {
    removeLoader();
    for (const householder of householdPlaceholder) {
      householder.remove();
    }
    generateHousehold();
  }, 500);
}

function generateGender() {
  const genderKeys = Object.keys(HOUSEHOLD_DATA.gender);
  const randomGender = returnRandomWord(genderKeys);
  return HOUSEHOLD_DATA.gender[randomGender];
}

/**
 * Generate sims race
 * 80% chance human, 20% chance other races (splitted 5% each)
 */
function generateRace(type) {
  if (!type.canHaveRace) return null;

  const humanChance = Math.random() < 0.8;

  if (humanChance) return HOUSEHOLD_DATA.race.human;

  const racesKeys = Object.keys(HOUSEHOLD_DATA.race);
  const raceKey = returnRandomWord(racesKeys);

  if (raceKey === 'human') return null;

  return HOUSEHOLD_DATA.race[raceKey];
}

function generateAspirations(type) {
  if (!type.canHaveAspirations) return { kids_aspirations: null };

  if (type.isTeenager || type.isAdult) {
    const adultKeys = Object.keys(HOUSEHOLD_DATA.adult_aspirations);
    const adultAspiration = returnRandomWord(adultKeys);
    return {
      adult_aspirations: HOUSEHOLD_DATA.adult_aspirations[adultAspiration],
    };
  }
  const kidKeys = Object.keys(HOUSEHOLD_DATA.kids_aspirations);
  const kidAspiration = returnRandomWord(kidKeys);
  return { kids_aspirations: HOUSEHOLD_DATA.kids_aspirations[kidAspiration] };
}

function generateProfessions(type) {
  if (type.isAdult) {
    const adultKeys = Object.keys(HOUSEHOLD_DATA.adult_professions);
    const randomAdultKey = returnRandomWord(adultKeys);
    return {
      adult_professions: HOUSEHOLD_DATA.adult_professions[randomAdultKey],
    };
  }
  const canHaveProfession = Math.random() < 0.3;
  if (type.isTeenager && canHaveProfession) {
    const teenKeys = Object.keys(HOUSEHOLD_DATA.teenager_professions);
    const randomTeenKey = returnRandomWord(teenKeys);
    return {
      teenager_professions: HOUSEHOLD_DATA.teenager_professions[randomTeenKey],
    };
  }

  return { teenager_professions: null };
}

function generateSims() {
  const sim = [];
  const numberOfSims = createRandomNumber(9, 1);
  const typesKeys = Object.keys(HOUSEHOLD_DATA.type);
  let mustHaveOneAdult = true;

  for (let i = typesKeys.length; numberOfSims <= i; --i) {
    let randomType = returnRandomWord(typesKeys);

    if (mustHaveOneAdult) {
      randomType = returnRandomWord(['young_adult', 'adult', 'elder']);
      mustHaveOneAdult = false;
    }

    const typeGenerated = HOUSEHOLD_DATA.type[randomType];
    sim.push({
      race: generateRace(typeGenerated),
      gender: generateGender(),
      type: {
        name: typeGenerated.name,
        icon: typeGenerated.icon,
        type_key: typeGenerated.type_key,
      },
      ...generateProfessions(typeGenerated),
      ...generateAspirations(typeGenerated),
    });
  }
  return sim;
}

function generateHousehold() {
  const houseHolds = generateSims();

  for (let i = 0; i < houseHolds.length; i++) {
    const section = generateSection(i + 1);
    const body = document.createElement('div');
    body.classList.add('section-boxed--child');
    const staticBody = generateStaticBody();
    const dynamicContent = document.createElement('div');
    dynamicContent.classList.add('section-boxed--flex', 'padding-bottom--xs');

    body.appendChild(staticBody);
    body.appendChild(dynamicContent);

    const household = houseHolds[i];
    for (const key of Object.keys(household)) {
      if (household[key]) {
        const dynamicBody = generateBoxComponent(
          household[key],
          rerollSingleHouseHold,
          false,
          key
        );
        dynamicContent.appendChild(dynamicBody.div);
      } else {
        const noDataBody = generateNoDataBoxComponent();
        dynamicContent.appendChild(noDataBody);
      }
    }
    section.appendChild(body);
    main.appendChild(section);
  }
}

function generateStaticBody() {
  const staticBody = document.createElement('div');
  staticBody.classList.add('section-boxed--flex', 'display', 'padding-top--xs');

  for (let i = 0; i < HOUSEHOLDS_NAMES.length; i++) {
    const staticBox = generateStaticBox(HOUSEHOLDS_NAMES[i]);
    staticBody.appendChild(staticBox);
  }

  return staticBody;
}

function generateStaticBox(householdName) {
  const staticBox = document.createElement('div');
  staticBox.classList.add('section-boxed--box');

  const img = document.createElement('img');
  img.src = './assets/sims-logo.png';
  img.classList.add('img-size');

  const p = document.createElement('p');
  p.classList.add('word-break-center');
  p.innerHTML = householdName;

  const ghostElement = document.createElement('span');
  ghostElement.classList.add('img-size');

  staticBox.appendChild(img);
  staticBox.appendChild(p);
  staticBox.appendChild(ghostElement);

  return staticBox;
}

function generateSection(houseHoldIndex) {
  const section = document.createElement('section');
  section.setAttribute('data-household', 'household');
  section.classList.add('section-boxed', 'margin-top-s', 'margin-bottom-s');

  const title = document.createElement('div');
  title.classList.add('section-boxed--title');

  const p = document.createElement('p');
  p.innerHTML = `Sim ${houseHoldIndex}`;

  title.appendChild(p);
  section.appendChild(title);

  return section;
}

function rerollSingleHouseHold(event) {
  const id = event.target.parentNode.id;
  const [img, p] = event.target.parentNode.children;

  for (const key of Object.keys(HOUSEHOLD_DATA)) {
    const dataset = event.target.parentNode.getAttribute(`data-${key}-${id}`);
    if (dataset) {
      const randomHousehold = returnRandomWord(
        Object.keys(HOUSEHOLD_DATA[dataset])
      );

      img.src = HOUSEHOLD_DATA[dataset][randomHousehold].icon;
      p.innerHTML = HOUSEHOLD_DATA[dataset][randomHousehold].name;
    }
  }
}

// generateDOMElements();
