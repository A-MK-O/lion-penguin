
const world = document.querySelector("#world");

const pets = {
  lion: document.querySelector("#lion"),
  penguin: document.querySelector("#penguin")
};

const petImages = {
  lion: document.querySelector("#lion-image"),
  penguin: document.querySelector("#penguin-image")
};

const loveLetterButton =
  document.querySelector("#love-letter");

const loveLetterButtonImage =
  document.querySelector("#love-letter-button-image");

const statusText =
  document.querySelector("#status");

let selectedPet = "lion";

const roamTimers = {};
const animationTimers = {};
const busyPets = new Set();

const API_URL =
  "https://lion-penguin-api.alicja-kowalska1996.workers.dev";


// ==================================================
// PET DRAWINGS
// ==================================================

const petFrames = {

  lion: {

    idle: [
      "images/lion-idle-1.png",
      "images/lion-idle-2.png"
    ],

    treat: [
      "images/lion-treat-1.png",
      "images/lion-treat-2.png"
    ],

    workout: [
      "images/lion-workout-1.png",
      "images/lion-workout-2.png"
    ],

    email: [
      "images/lion-email-1.png",
      "images/lion-email-2.png"
    ],

    pet: [
      "images/lion-glasc-1.png",
      "images/lion-glasc-2.png"
    ],

    love: [
      "images/lion-love-1.png",
      "images/lion-love-2.png"
    ]
  },


  penguin: {

    idle: [
      "images/penguin-idle-1.png",
      "images/penguin-idle-2.png"
    ],

    treat: [
      "images/penguin-treat-1.png",
      "images/penguin-treat-2.png"
    ],

    workout: [
      "images/penguin-workout-1.png",
      "images/penguin-workout-2.png"
    ],

    email: [
      "images/penguin-email-1.png",
      "images/penguin-email-2.png"
    ],

    pet: [
      "images/penguin-glasc-1.png",
      "images/penguin-glasc-2.png"
    ],

    love: [
      "images/penguin-love-1.png",
      "images/penguin-love-2.png"
    ]
  }
};


// ==================================================
// TWO-FRAME PET ANIMATION
// ==================================================

function startPetAnimation(
  petName,
  animationName,
  speed = 350
) {

  stopPetAnimation(petName);

  const frames =
    petFrames[petName][animationName];

  let currentFrame = 0;

  petImages[petName].src =
    frames[currentFrame];

  animationTimers[petName] =
    setInterval(() => {

      currentFrame =
        (currentFrame + 1) % frames.length;

      petImages[petName].src =
        frames[currentFrame];

    }, speed);
}


function stopPetAnimation(petName) {

  if (animationTimers[petName]) {

    clearInterval(
      animationTimers[petName]
    );

    delete animationTimers[petName];
  }
}


// ==================================================
// RANDOM MOVEMENT
// ==================================================

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

  roamTimers[petName] =
    setTimeout(
      () => movePetRandomly(petName),
      travelTime
        + 1000
        + Math.random() * 2000
    );
}


// ==================================================
// INITIAL POSITION
// ==================================================

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


// ==================================================
// SELECT PET
// ==================================================

function selectPet(petName) {

  selectedPet = petName;

  Object.values(pets).forEach(pet => {
    pet.classList.remove("selected");
  });

  pets[petName].classList.add("selected");


  // If Lion Boy is selected,
  // the letter goes TO Penguin.

  if (petName === "lion") {

    loveLetterButtonImage.src =
      "images/button-letter-P.png";

    loveLetterButtonImage.alt =
      "Send Penguin a love letter";

  } else {

    // Penguin selected:
    // letter goes TO Lion Boy.

    loveLetterButtonImage.src =
      "images/button-letter-L.png";

    loveLetterButtonImage.alt =
      "Send Lion Boy a love letter";
  }
}


// ==================================================
// ACTIONS
// ==================================================

const actionDurations = {
  treat: 2200,
  workout: 2600,
  email: 2800,
  pet: 2200
};


function performAction(
  petName,
  action
) {

  if (busyPets.has(petName)) {
    return false;
  }

  busyPets.add(petName);

  clearTimeout(
    roamTimers[petName]
  );

  startPetAnimation(
    petName,
    action,
    300
  );

  setTimeout(() => {

    startPetAnimation(
      petName,
      "idle",
      350
    );

    busyPets.delete(petName);

    movePetRandomly(petName);

  }, actionDurations[action]);

  return true;
}


// ==================================================
// CLOUDFLARE API
// ==================================================

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


// ==================================================
// ACTIVITY BUTTONS
// ==================================================

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

        const started =
          performAction(
            pet,
            action
          );

        if (!started) {
          return;
        }

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


// ==================================================
// DRAWN LOVE LETTER
// ==================================================

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


  const image =
    document.createElement("img");

  image.src =
    "images/envelope-1.png";

  image.alt = "";

  letter.appendChild(image);


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


  let envelopeFrame = 1;

  const envelopeAnimation =
    setInterval(() => {

      envelopeFrame =
        envelopeFrame === 1
          ? 2
          : 1;

      image.src =
        `images/envelope-${envelopeFrame}.png`;

    }, 200);


  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      letter.style.left =
        `${endX}px`;

      letter.style.top =
        `${endY}px`;

    });

  });


  setTimeout(() => {

    clearInterval(
      envelopeAnimation
    );

    letter.remove();

  }, 1600);
}


// ==================================================
// LOVE LETTER BUTTON
// ==================================================

loveLetterButton.addEventListener(
  "click",
  async () => {

    const from =
      selectedPet;

    const to =
      from === "lion"
        ? "penguin"
        : "lion";


    if (busyPets.has(from)) {
      return;
    }


    busyPets.add(from);

    clearTimeout(
      roamTimers[from]
    );


    // Show sender's love drawings.

    startPetAnimation(
      from,
      "love",
      280
    );


    // Send drawn envelope across screen.

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


    await wait(1800);


    startPetAnimation(
      from,
      "idle",
      350
    );

    busyPets.delete(from);

    movePetRandomly(from);
  }
);


// ==================================================
// PET VISITS PET
// ==================================================

async function petVisitsPet(
  visitorName,
  targetName
) {

  if (
    busyPets.has(visitorName) ||
    busyPets.has(targetName)
  ) {
    return false;
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


  // First try standing to the
  // LEFT of the other pet.

  let targetX =
    targetRect.left
    - worldRect.left
    - visitorWidth
    + 15;

  let targetY =
    targetRect.top
    - worldRect.top;


  // No room on the left?
  // Stand on the right instead.

  if (targetX < 0) {

    targetX =
      targetRect.right
      - worldRect.left
      - 15;
  }


  // Keep visitor inside frame.

  targetX =
    Math.max(
      0,
      Math.min(
        targetX,
        world.clientWidth
          - visitorWidth
      )
    );

  targetY =
    Math.max(
      0,
      Math.min(
        targetY,
        world.clientHeight
          - visitorHeight
      )
    );


  // Walk over.

  visitor.style.transitionDuration =
    "2s";

  visitor.style.transform =
    `translate(${targetX}px, ${targetY}px)`;


  await wait(2100);


  // Heart appears when they meet.

  showHeartBetweenPets();


  // Stay together for 3 seconds.

  await wait(3000);


  busyPets.delete(visitorName);
  busyPets.delete(targetName);


  // Go back to wandering.

  movePetRandomly(visitorName);
  movePetRandomly(targetName);

  return true;
}


// ==================================================
// DRAWN HEART
// ==================================================

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


  const image =
    document.createElement("img");

  image.src =
    "images/heart-1.png";

  image.alt = "";

  heart.appendChild(image);


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
    )
    / 2
    - worldRect.left;


  const middleY =
    Math.min(
      lionRect.top,
      penguinRect.top
    )
    - worldRect.top
    - 20;


  heart.style.left =
    `${middleX}px`;

  heart.style.top =
    `${middleY}px`;

  world.appendChild(heart);


  let heartFrame = 1;

  const heartAnimation =
    setInterval(() => {

      heartFrame =
        heartFrame === 1
          ? 2
          : 1;

      image.src =
        `images/heart-${heartFrame}.png`;

    }, 300);


  setTimeout(() => {

    clearInterval(
      heartAnimation
    );

    heart.remove();

  }, 2600);
}


// ==================================================
// WAIT HELPER
// ==================================================

function wait(ms) {

  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


// ==================================================
// RANDOM PET VISITS
// ==================================================

function schedulePetVisit() {

  // TESTING:
  // random visit every 10–20 seconds.

  const delay =
    10000
    + Math.random() * 10000;


  setTimeout(async () => {

    // Randomly choose who visits whom.

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


// ==================================================
// CLICK PET TO SELECT IT
// ==================================================

pets.lion.addEventListener(
  "click",
  () => selectPet("lion")
);

pets.penguin.addEventListener(
  "click",
  () => selectPet("penguin")
);


// ==================================================
// START EVERYTHING
// ==================================================

startPetAnimation(
  "lion",
  "idle"
);

startPetAnimation(
  "penguin",
  "idle"
);


placePet(
  "lion",
  0.20,
  0.55
);

placePet(
  "penguin",
  0.70,
  0.40
);


// Lion Boy starts selected.

selectPet("lion");


setTimeout(() => {

  movePetRandomly("lion");
  movePetRandomly("penguin");

}, 500);


// Start random visits.

schedulePetVisit();
