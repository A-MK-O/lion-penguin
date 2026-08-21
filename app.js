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

const actionDurations = {
  treat: 1400,
  workout: 1800,
  email: 2000,
  pet: 1400
};

function performAction(petName, action) {

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

const statusText =
  document.querySelector("#status");


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

              type:
                "activity",

              pet:
                pet,

              action:
                action

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


const API_URL =
  "https://lion-penguin-api.alicja-kowalska1996.workers.dev";


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

          type:
            "loveLetter",

          from:
            from,

          to:
            to

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
