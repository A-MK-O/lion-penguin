const world = document.querySelector("#world");

const pets = {
  lion: document.querySelector("#lion"),
  penguin: document.querySelector("#penguin")
};

let selectedPet = "lion";

const roamTimers = {};
const busyPets = new Set();
