const world = document.querySelector("#world");

const pets = {
  lion: document.querySelector("#lion"),
  penguin: document.querySelector("#penguin")
};

let selectedPet = "lion";

const roamTimers = {};
const busyPets = new Set();

function movePetRandomly(petName) {

  if (busyPets.has(petName)) {
    return;
  }

  const pet = pets[petName];

  const maxX =
    world.clientWidth - pet.offsetWidth;

  const maxY =
    world.clientHeight - pet.offsetHeight;


  const randomX =
    Math.random() * maxX;

  const randomY =
    Math.random() * maxY;


  const travelTime =
    2000 + Math.random() * 2500;


  pet.style.transitionDuration =
    `${travelTime}ms`;

  pet.style.transform =
    `translate(${randomX}px, ${randomY}px)`;


  roamTimers[petName] = setTimeout(
    () => movePetRandomly(petName),
    travelTime + 1000 + Math.random() * 2000
  );
}
