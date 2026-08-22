console.log("APP STARTED");
document.body.dataset.appLoaded = "yes";

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


function selectPet(petName) {
  selectedPet = petName;

  Object.values(pets).forEach(pet => {
    pet.classList.remove("selected");
  });

  pets[petName].classList.add("selected");

  if (petName === "lion") {
    loveLetterButtonImage.src =
      "images/button-letter-P.png";

    loveLetterButtonImage.alt =
      "Send Penguin a love letter";
  } else {
    loveLetterButtonImage.src =
      "images/button-letter-L.png";

    loveLetterButtonImage.alt =
      "Send Lion Boy a love letter";
  }
}


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
        envelopeFrame === 1 ? 2 : 1;

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

  let targetX =
    targetRect.left
    - worldRect.left
    - visitorWidth
    + 15;

  let targetY =
    targetRect.top
    - worldRect.top;

  if (targetX < 0) {
    targetX =
      targetRect.right
      - worldRect.left
      - 15;
  }

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

  await wait(2100);

  showHeartBetweenPets();

  await wait(3000);

  busyPets.delete(visitorName);
  busyPets.delete(targetName);

  movePetRandomly(visitorName);
  movePetRandomly(targetName);

  return true;
}


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
    (lionCenterX + penguinCenterX)
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
        heartFrame === 1 ? 2 : 1;

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


function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


function schedulePetVisit() {
  const delay =
    10000 + Math.random() * 10000;

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


// --------------------------------------------------
// EVENT LISTENERS
// --------------------------------------------------

pets.lion.addEventListener(
  "click",
  () => selectPet("lion")
);

pets.penguin.addEventListener(
  "click",
  () => selectPet("penguin")
);


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

    startPetAnimation(
      from,
      "love",
      280
    );

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


// --------------------------------------------------
// START
// --------------------------------------------------

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

setTimeout(() => {
  movePetRandomly("lion");
  movePetRandomly("penguin");
}, 500);

schedulePetVisit();
const loveLetterButtonImage =
  document.querySelector(
    "#love-letter-button-image"
  );


const statusText =
  document.querySelector("#status");



let selectedPet =
  "lion";


const roamTimers = {};

const animationTimers = {};

const busyPets =
  new Set();



// ==================================================
// CLOUDFLARE API
// ==================================================

const API_URL =
  "https://lion-penguin-api.alicja-kowalska1996.workers.dev";



// ==================================================
// ALL YOUR PET DRAWINGS
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


  let currentFrame =
    0;


  petImages[petName].src =
    frames[currentFrame];


  animationTimers[petName] =
    setInterval(() => {

      currentFrame =
        (currentFrame + 1)
        % frames.length;


      petImages[petName].src =
        frames[currentFrame];

    }, speed);

}



function stopPetAnimation(
  petName
) {

  if (
    animationTimers[petName]
  ) {

    clearInterval(
      animationTimers[petName]
    );


    delete animationTimers[petName];

  }

}



// ==================================================
// INITIAL PET ANIMATIONS
// ==================================================

startPetAnimation(
  "lion",
  "idle"
);


startPetAnimation(
  "penguin",
  "idle"
);



// ==================================================
// RANDOM WANDERING
// ==================================================

function movePetRandomly(
  petName
) {

  if (
    busyPets.has(petName)
  ) {

    return;

  }


  const pet =
    pets[petName];


  const maxX =
    world.clientWidth
    - pet.offsetWidth;


  const maxY =
    world.clientHeight
    - pet.offsetHeight;


  const randomX =
    Math.random()
    * maxX;


  const randomY =
    Math.random()
    * maxY;


  const travelTime =
    2000
    + Math.random()
    * 2500;


  pet.style.transitionDuration =
    `${travelTime}ms`;


  pet.style.transform =
    `translate(
      ${randomX}px,
      ${randomY}px
    )`;


  roamTimers[petName] =
    setTimeout(
      () =>
        movePetRandomly(
          petName
        ),

      travelTime
      + 1000
      + Math.random()
      * 2000
    );

}



// ==================================================
// INITIAL POSITIONS
// ==================================================

function placePet(
  petName,
  xPercent,
  yPercent
) {

  const pet =
    pets[petName];


  const x =
    (
      world.clientWidth
      - pet.offsetWidth
    )
    * xPercent;


  const y =
    (
      world.clientHeight
      - pet.offsetHeight
    )
    * yPercent;


  pet.style.transition =
    "none";


  pet.style.transform =
    `translate(
      ${x}px,
      ${y}px
    )`;


  /*
    Force browser to apply
    position immediately.
  */

  pet.offsetHeight;


  pet.style.transition =
    "transform 3s linear";

}



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



setTimeout(() => {

  movePetRandomly(
    "lion"
  );

  movePetRandomly(
    "penguin"
  );

}, 500);



// ==================================================
// SELECT PET
// ==================================================

function selectPet(
  petName
) {

  selectedPet =
    petName;


  Object
    .values(pets)
    .forEach(pet => {

      pet.classList.remove(
        "selected"
      );

    });


  pets[petName]
    .classList
    .add(
      "selected"
    );



  /*
    The button artwork depends
    on WHO WILL RECEIVE the letter.

    Lion selected:
    Lion → Penguin
    therefore button-letter-P.png

    Penguin selected:
    Penguin → Lion
    therefore button-letter-L.png
  */


  if (
    petName === "lion"
  ) {

    loveLetterButtonImage.src =
      "images/button-letter-P.png";


    loveLetterButtonImage.alt =
      "Send Penguin a love letter";

  }

  else {

    loveLetterButtonImage.src =
      "images/button-letter-L.png";


    loveLetterButtonImage.alt =
      "Send Lion Boy a love letter";

  }

}



pets.lion.addEventListener(
  "click",
  () =>
    selectPet("lion")
);


pets.penguin.addEventListener(
  "click",
  () =>
    selectPet("penguin")
);



// ==================================================
// ACTION LENGTHS
// ==================================================

const actionDurations = {

  treat:
    2200,

  workout:
    2600,

  email:
    2800,

  pet:
    2200

};



// ==================================================
// PERFORM AN ACTIVITY
// ==================================================

function performAction(
  petName,
  action
) {

  /*
    Ignore another action
    if this pet is already busy.
  */

  if (
    busyPets.has(petName)
  ) {

    return false;

  }


  busyPets.add(
    petName
  );


  clearTimeout(
    roamTimers[petName]
  );


  /*
    Switch from idle drawings
    to activity drawings.
  */

  startPetAnimation(
    petName,
    action,
    300
  );


  setTimeout(() => {

    /*
      Return to idle drawings.
    */

    startPetAnimation(
      petName,
      "idle",
      350
    );


    busyPets.delete(
      petName
    );


    movePetRandomly(
      petName
    );

  }, actionDurations[action]);


  return true;

}



// ==================================================
// SEND EVENT TO CLOUDFLARE
// ==================================================

async function sendEvent(
  data
) {

  const response =
    await fetch(
      API_URL,
      {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(
            data
          )

      }
    );


  if (
    !response.ok
  ) {

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
  .querySelectorAll(
    "[data-action]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {


        const action =
          button.dataset.action;


        const pet =
          selectedPet;


        /*
          Don't send anything
          if pet is already busy.
        */

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

              type:
                "activity",

              pet:
                pet,

              action:
                action

            });


          statusText.textContent =
            result.content;

        }

        catch (error) {

          console.error(
            error
          );


          statusText.textContent =
            "Something went wrong.";

        }

      }
    );

  });



// ==================================================
// DRAWN ENVELOPE ANIMATION
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



  /*
    Envelope container
  */

  const letter =
    document.createElement(
      "div"
    );


  letter.className =
    "flying-letter";



  /*
    Envelope image
  */

  const image =
    document.createElement(
      "img"
    );


  image.src =
    "images/envelope-1.png";


  image.alt =
    "";


  letter.appendChild(
    image
  );



  /*
    Start at sender.
  */

  const startX =
    fromRect.left
    - worldRect.left
    + fromRect.width / 2;


  const startY =
    fromRect.top
    - worldRect.top
    + fromRect.height / 2;



  /*
    Finish at recipient.
  */

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


  world.appendChild(
    letter
  );



  /*
    Alternate your two
    envelope drawings.
  */

  let envelopeFrame =
    1;


  const envelopeAnimation =
    setInterval(() => {

      envelopeFrame =
        envelopeFrame === 1
          ? 2
          : 1;


      image.src =
        `images/envelope-${envelopeFrame}.png`;

    }, 200);



  /*
    Let browser create the
    letter first, then move it.
  */

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      letter.style.left =
        `${endX}px`;


      letter.style.top =
        `${endY}px`;

    });

  });



  /*
    Remove envelope after it
    reaches the other pet.
  */

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


    /*
      Don't interrupt a pet
      already doing something.
    */

    if (
      busyPets.has(from)
    ) {

      return;

    }


    busyPets.add(
      from
    );


    clearTimeout(
      roamTimers[from]
    );


    /*
      Use YOUR love/sending
      animation for sender.
    */

    startPetAnimation(
      from,
      "love",
      280
    );


    /*
      Fly YOUR envelope.
    */

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

    }

    catch (error) {

      console.error(
        error
      );


      statusText.textContent =
        "The love letter got lost :(";

    }



    /*
      Let sending animation
      run briefly.
    */

    await wait(
      1800
    );


    startPetAnimation(
      from,
      "idle",
      350
    );


    busyPets.delete(
      from
    );


    movePetRandomly(
      from
    );

  }
);



// ==================================================
// AUTONOMOUS PET VISITS
// ==================================================

async function petVisitsPet(
  visitorName,
  targetName
) {

  /*
    If either is currently
    eating, writing, sending,
    etc., skip this visit.
  */

  if (
    busyPets.has(visitorName)
    ||
    busyPets.has(targetName)
  ) {

    return false;

  }


  busyPets.add(
    visitorName
  );


  busyPets.add(
    targetName
  );


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



  /*
    First try to stand
    to the LEFT of target.
  */

  let targetX =
    targetRect.left
    - worldRect.left
    - visitorWidth
    + 15;


  let targetY =
    targetRect.top
    - worldRect.top;



  /*
    Not enough space on left?
    Stand to the RIGHT.
  */

  if (
    targetX < 0
  ) {

    targetX =
      targetRect.right
      - worldRect.left
      - 15;

  }



  /*
    Keep visitor inside world.
  */

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



  /*
    Walk over.
  */

  visitor.style
    .transitionDuration =
      "2s";


  visitor.style.transform =
    `translate(
      ${targetX}px,
      ${targetY}px
    )`;



  await wait(
    2100
  );



  /*
    YOUR animated heart.
  */

  showHeartBetweenPets();



  /*
    Stay together.
  */

  await wait(
    3000
  );



  busyPets.delete(
    visitorName
  );


  busyPets.delete(
    targetName
  );



  movePetRandomly(
    visitorName
  );


  movePetRandomly(
    targetName
  );


  return true;

}



// ==================================================
// YOUR TWO-FRAME HEART
// ==================================================

function showHeartBetweenPets() {

  const lionRect =
    pets.lion
      .getBoundingClientRect();


  const penguinRect =
    pets.penguin
      .getBoundingClientRect();


  const worldRect =
    world
      .getBoundingClientRect();



  const heart =
    document.createElement(
      "div"
    );


  heart.className =
    "meeting-heart";



  const image =
    document.createElement(
      "img"
    );


  image.src =
    "images/heart-1.png";


  image.alt =
    "";


  heart.appendChild(
    image
  );



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


  world.appendChild(
    heart
  );



  /*
    Animate:
    heart-1 → heart-2 → heart-1...
  */

  let heartFrame =
    1;


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

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}



// ==================================================
// RANDOM PET VISITS
// ==================================================

function schedulePetVisit() {

  /*
    TESTING:
    every 10–20 seconds.

    We can make this much
    less frequent later.
  */

  const delay =
    10000
    + Math.random()
    * 10000;


  setTimeout(
    async () => {


      const lionVisits =
        Math.random()
        < 0.5;



      if (
        lionVisits
      ) {

        await petVisitsPet(
          "lion",
          "penguin"
        );

      }

      else {

        await petVisitsPet(
          "penguin",
          "lion"
        );

      }



      schedulePetVisit();

    },

    delay
  );

}



schedulePetVisit();    Math.random() * maxX;

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
