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

function placePet(petName, xPercent, yPercent) {

  const pet = pets[petName];

  const x =
    (world.clientWidth - pet.offsetWidth)
    * xPercent;

  const y =
    (world.clientHeight - pet.offsetHeight)
    * yPercent;


  pet.style.transition = "none";

  pet.style.transform =
    `translate(${x}px, ${y}px)`;


  // force browser to apply the position
  pet.offsetHeight;


  pet.style.transition =
    "transform 3s linear";
}


placePet("lion", 0.2, 0.55);
placePet("penguin", 0.7, 0.4);


setTimeout(() => {
  movePetRandomly("lion");
  movePetRandomly("penguin");
}, 500);

const selectedName =
  document.querySelector("#selected-name");

const loveLetterButton =
  document.querySelector("#love-letter");

function selectPet(petName) {

  selectedPet = petName;


  Object.values(pets).forEach(pet => {
    pet.classList.remove("selected");
  });


  pets[petName].classList.add("selected");


  const displayName =
    petName === "lion"
      ? "Lion"
      : "Penguin";


  const otherName =
    petName === "lion"
      ? "Penguin"
      : "Lion";


  selectedName.textContent =
    displayName;


  loveLetterButton.textContent =
    `💌 ${displayName} → ${otherName}`;
}

pets.lion.addEventListener(
  "click",
  () => selectPet("lion")
);

pets.penguin.addEventListener(
  "click",
  () => selectPet("penguin")
);
