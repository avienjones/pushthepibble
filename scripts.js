const pibbleEl = document.getElementById("pibble");
const pushCountEl = document.getElementById("pushcount");

var pibblespeed = 0;
var pushcount = 0;
var muted = false;

function playsound(soundpath) {
  if (muted) {
    return;
  }
  const sound = new Audio(soundpath);
  sound.play();
}

function pibbleclick() {
  if (pibblespeed <= 0.33) {
    pibblespeed = 1.5;
  } else {
    if (!(pibblespeed >= 3.5)) {
      pibblespeed += 0.15 * (3.5 - pibblespeed);
    }
  }

  pibbleEl.style.cursor = "initial";
  pibbleEl.onclick = null;

  pushcount++;

  const push = Math.floor(Math.random() * (3 - 1) + 1);
  playsound("sfx/push" + push.toString() + ".wav");

  const swing = Math.floor(Math.random() * (9 - 1) + 1);
  playsound("sfx/swing" + swing.toString() + ".wav");

  if (pibbleEl.paused) {
    pibbleEl.currentTime = 0;
    pibbleEl.play();
  }

  pushCountEl.style.opacity = "1";
  pushCountEl.textContent = "You have pushed pibble " + pushcount.toString() + " times";
}

// Pibble slowdown
setInterval(function() {
  var calcspeed = pibblespeed - (0.1 * (2 + pibblespeed));

  if (calcspeed > 0.33) {
    pibblespeed = calcspeed;
  } else {
    pibblespeed = 0.33;
  }
}, 1000);

// Pibble animation
setInterval(() => {
  pibbleEl.playbackRate = pibblespeed;
}, 10);

// After each loop
pibbleEl.addEventListener('ended', function() {
  pibbleEl.style.cursor = "pointer";
  pibbleEl.onclick = pibbleclick;

  if (pibblespeed > 0.33) {
    pibbleEl.currentTime = 0;
    pibbleEl.play();
  }

  if (!pibbleEl.paused) {
    if (pibblespeed < 0.5) {
      setTimeout(()=>{ // To sync up sound
        const swing = Math.floor(Math.random() * (9 - 1) + 1);
        playsound("sfx/swing" + swing.toString() + ".wav");
      }, 500);
    } else {
      const swing = Math.floor(Math.random() * (9 - 1) + 1);
      playsound("sfx/swing" + swing.toString() + ".wav");
    }
  }
});

// Random Barks
setInterval(()=>{
  const rng = Math.floor(Math.random() * (11));
  if (rng == 10) {
    const bark = Math.floor(Math.random() * (4 - 1) + 1);
    playsound("sfx/bark" + bark.toString() + ".wav");
  }
}, 8000);

// Background Music 
document.onclick = () => {
  if (muted) {
    return;
  }

  const sound = new Audio("sfx/nature-loop.wav");
  sound.volume = 0;
  sound.loop = true;
  sound.play();

  var fadein = setInterval(()=>{
    if(sound.volume + 0.05 <= 1) {
      sound.volume = sound.volume + 0.05;
    }

    if (sound.volume >= 1) {
      sound.volume = 1;
      clearInterval(fadein);
    }
  }, 100);

  document.onclick = null; // Only play once
};

if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome/")) {
  document.getElementById("error").style.display = "initial";
  muted = true;
}