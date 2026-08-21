const world = document.querySelector("#world");

const pets = {
  lion: document.querySelector("#lion"),
  penguin: document.querySelector("#penguin")
};

let selectedPet = "lion";

const roamTimers = {};
const busyPets = new Set();

const API_URL =
  "https://lion-penguin-api.alicja-kowalska1996.workers.dev";



// --------------------------------------------------
// RANDOM WANDERING
// --------------------------------------------------

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



function placePet(
  petName,
  xPercent,
  yPercent
) {

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



// --------------------------------------------------
// SELECTING PETS
// --------------------------------------------------

const selectedName =
  document.querySelector("#selected-name");

const loveLetterButton =
  document.querySelector("#love-letter");

const statusText =
  document.querySelector("#status");



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



// --------------------------------------------------
// ACTIVITY ANIMATIONS
// --------------------------------------------------

const actionDurations = {
  treat: 1400,
  workout: 1800,
  email: 2000,
  pet: 1400
};



function performAction(
  petName,
  action
) {

  const pet = pets[petName];

  busyPets.add(petName);

  clearTimeout(
    roamTimers[petName]
  );

  pet.classList.add(
    `action-${action}`
  );

  setTimeout(() => {

    pet.classList.remove(
      `action-${action}`
    );

    busyPets.delete(petName);

    movePetRandomly(petName);

  }, actionDurations[action]);
}



// --------------------------------------------------
// API
// --------------------------------------------------

async function sendEvent(data) {

  const response =
    await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(data)
      }
    );

  if (!response.ok) {

    throw new Error(
      "Server request failed"
    );
  }

  return await response.json();
}



// --------------------------------------------------
// ACTIVITY BUTTONS
// --------------------------------------------------

document
  .querySelectorAll("[data-action]")
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        const action =
          button.dataset.action;

        const pet =
          selectedPet;

        performAction(
          pet,
          action
        );

        statusText.textContent =
          "Sending update...";

        try {

          const result =
            await sendEvent({
              type: "activity",
              pet: pet,
              action: action
            });

          statusText.textContent =
            result.content;

        } catch (error) {

          console.error(error);

          statusText.textContent =
            "Something went wrong.";
        }
      }
    );
  });



// --------------------------------------------------
// LOVE LETTER ANIMATION
// --------------------------------------------------

function animateLoveLetter(
  fromName,
  toName
) {

  const fromPet =
    pets[fromName];

  const toPet =
    pets[toName];

  const worldRect =
    world.getBoundingClientRect();

  const fromRect =
    fromPet.getBoundingClientRect();

  const toRect =
    toPet.getBoundingClientRect();

  const letter =
    document.createElement("div");

  letter.className =
    "flying-letter";

  letter.textContent =
    "💌";

  const startX =
    fromRect.left
    - worldRect.left
    + fromRect.width / 2;

  const startY =
    fromRect.top
    - worldRect.top
    + fromRect.height / 2;

  const endX =
    toRect.left
    - worldRect.left
    + toRect.width / 2;

  const endY =
    toRect.top
    - worldRect.top
    + toRect.height / 2;

  letter.style.left =
    `${startX}px`;

  letter.style.top =
    `${startY}px`;

  world.appendChild(letter);

  requestAnimationFrame(() => {

    letter.style.transform =
      `translate(
        ${endX - startX}px,
        ${endY - startY}px
      )`;
  });

  setTimeout(
    () => letter.remove(),
    1400
  );
}



// --------------------------------------------------
// LOVE LETTER BUTTON
// --------------------------------------------------

loveLetterButton.addEventListener(
  "click",
  async () => {

    const from =
      selectedPet;

    const to =
      from === "lion"
        ? "penguin"
        : "lion";

    animateLoveLetter(
      from,
      to
    );

    statusText.textContent =
      "Sending love letter...";

    try {

      const result =
        await sendEvent({
          type: "loveLetter",
          from: from,
          to: to
        });

      statusText.textContent =
        `💌 ${result.letter}`;

    } catch (error) {

      console.error(error);

      statusText.textContent =
        "The love letter got lost :(";
    }
  }
);



// --------------------------------------------------
// PET VISITS
// --------------------------------------------------

async function petVisitsPet(
  visitorName,
  targetName
) {

  if (
    busyPets.has(visitorName) ||
    busyPets.has(targetName)
  ) {
    return;
  }

  busyPets.add(visitorName);
  busyPets.add(targetName);

  clearTimeout(
    roamTimers[visitorName]
  );

  clearTimeout(
    roamTimers[targetName]
  );

  const visitor =
    pets[visitorName];

  const target =
    pets[targetName];

  const worldRect =
    world.getBoundingClientRect();

  const targetRect =
    target.getBoundingClientRect();

  const visitorWidth =
    visitor.offsetWidth;

  const visitorHeight =
    visitor.offsetHeight;



  // Try to stand on the left side
  // of the target.

  let targetX =
    targetRect.left
    - worldRect.left
    - visitorWidth
    + 25;

  let targetY =
    targetRect.top
    - worldRect.top;



  // If there isn't enough space
  // on the left, stand on the right.

  if (targetX < 0) {

    targetX =
      targetRect.right
      - worldRect.left
      - 25;
  }



  // Keep visitor inside the world.

  targetX =
    Math.max(
      0,
      Math.min(
        targetX,
        world.clientWidth - visitorWidth
      )
    );

  targetY =
    Math.max(
      0,
      Math.min(
        targetY,
        world.clientHeight - visitorHeight
      )
    );



  visitor.style.transitionDuration =
    "2s";

  visitor.style.transform =
    `translate(${targetX}px, ${targetY}px)`;



  // Give the visitor time to arrive.

  await wait(2100);



  showHeartBetweenPets();



  // Hang out together.

  await wait(3000);



  busyPets.delete(visitorName);
  busyPets.delete(targetName);



  movePetRandomly(visitorName);
  movePetRandomly(targetName);
}



// --------------------------------------------------
// HEART
// --------------------------------------------------

function showHeartBetweenPets() {

  const lionRect =
    pets.lion.getBoundingClientRect();

  const penguinRect =
    pets.penguin.getBoundingClientRect();

  const worldRect =
    world.getBoundingClientRect();

  const heart =
    document.createElement("div");

  heart.className =
    "meeting-heart";

  heart.textContent =
    "❤️";

  const lionCenterX =
    lionRect.left
    + lionRect.width / 2;

  const penguinCenterX =
    penguinRect.left
    + penguinRect.width / 2;

  const middleX =
    (
      lionCenterX
      + penguinCenterX
    ) / 2
    - worldRect.left;

  const middleY =
    Math.min(
      lionRect.top,
      penguinRect.top
    )
    - worldRect.top
    - 25;

  heart.style.left =
    `${middleX}px`;

  heart.style.top =
    `${middleY}px`;

  world.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2500);
}



// --------------------------------------------------
// SMALL WAIT HELPER
// --------------------------------------------------

function wait(ms) {

  return new Promise(
    resolve => {
      setTimeout(resolve, ms);
    }
  );
}



// --------------------------------------------------
// RANDOM VISIT SCHEDULER
// --------------------------------------------------

function schedulePetVisit() {

  // During testing:
  // wait randomly between 10 and 20 seconds.

  const delay =
    10000
    + Math.random() * 10000;

  setTimeout(async () => {

    const lionVisits =
      Math.random() < 0.5;

    if (lionVisits) {

      await petVisitsPet(
        "lion",
        "penguin"
      );

    } else {

      await petVisitsPet(
        "penguin",
        "lion"
      );
    }

    schedulePetVisit();

  }, delay);
}



schedulePetVisit();
