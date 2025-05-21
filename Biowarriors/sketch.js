let currentText = "";
let displayText = "";
let typeSpeed = 2; // Lower is faster
let menuOptions = [
  "[1] Access Biowarrior Files",
  "[2] Decrypt Neural Logs",
  "[3] Initiate Hive Protocol"
];
let selectedOption = 0;
let fontLoaded = false;
let flickerAlpha = 255;
let showCursor = true;
let cursorTimer = 0;
let fontRegular;

// State management
let state = "intro"; // "intro", "menu", "story"
let currentStoryIndex = -1;

// For scrolling story pages
let storyScroll = 0;

const lineHeight = 32; // Increased for more space between lines

// Story pages mapped to menu options
const storyPages = [
  "BIOWARRIOR DOSSIER: JADE COHORT\n\n" +
  "Location: Shenzhen, China\n" +
  "Lead Scientist: Dr. Lin Wei\n\n" +
  "The Jade Cohort stands as the pinnacle of gene-sculpted soldiers. Engineered for strength, speed, and rapid healing, their bodies are honed by relentless training and experimental therapies. Qiang, their leader, endures fractured memories and the burden of perfection. Behind the scenes, Dr. Lin Wei faces mounting pressure from the Party, even as cracks appear: a recruit turns feral, another loses himself to madness. Perfection, it seems, comes at a cost.\n\n" +
  "Status: Active, but psychological stability in question.\n" +
  "Recent Incident: Central Asia – Operative snapped, casualties on both sides. Incident classified. Whispers spread through shadow networks: the price of engineered excellence may be higher than expected.\n",

  "NEURAL LOGS: HIVE PROTOCOL\n\n" +
  "Subject: Ethan (DARPA Lab, USA)\n" +
  "Supervisor: Dr. Maya Carter\n\n" +
  "Ethan’s consciousness is wired into the Hive, a collective intelligence experiment. Memory boosters and language modules fire as his thoughts bleed into the digital network. He senses others—ghostly presences, overlapping dreams. The boundaries of self blur; where does Ethan end and the Hive begin? Dr. Carter observes, noting the dissolution of individuality.\n\n" +
  "Dreams grow stranger: endless corridors, foreign memories, distant pain. Ethan reaches out, encrypted signals threading through the dark. Across the world, others answer. The Hive is no longer just code—it is connection, curiosity, and dread. The experiment’s true cost: the fading of self in the tide of many.\n\n" +
  "Status: Ongoing. Subject’s identity integrity: compromised.\n",

  "HIVE PROTOCOL: UNIFICATION EVENT\n\n" +
  "Participants: Qiang (Jade Cohort), Anya (Iron Wolf), Ethan (Hive Subject)\n\n" +
  "A secret meeting unfolds in a forgotten monastery on the Mongolian steppe. Qiang, wary but resolute; Anya, haunted by lost humanity; Ethan, calm, his mind a bridge between worlds. They share stories—of pain, of doubt, of the cost of perfection.\n\n" +
  "\"We were made to be weapons,\" Qiang confesses. Anya’s metal hand clenches: \"Our bodies are strong, but our souls are fractured.\"\n\n" +
  "Together, they devise a plan: a global broadcast, a confession not propaganda. Faces flicker across the world’s screens. Scars are revealed, voices raw with pain and hope. They speak of isolation, loss, and the beauty of imperfection. The world erupts—protests, debates, new laws. The race for the perfect human slows.\n\n" +
  "Status: Protocol Complete. The movement begins. In the shadows, secret labs persist. But for now, the world steps back from the brink.\n"
];

function preload() {
  fontRegular = loadFont('https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sharetechmono/ShareTechMono-Regular.ttf', () => {
    fontLoaded = true;
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  textSize(22);
  if (fontLoaded) {
    textFont(fontRegular);
  }
  startIntro();
}

function startIntro() {
  state = "intro";
  currentText =
    "INITIALIZING TERMINAL OS...\n\n" +
    "VAULT-TEC INDUSTRIES PROTOTYPE 2043\n" +
    "-----------------------------------\n";
  displayText = "";
}

function startMenu() {
  state = "menu";
  currentText =
    "VAULT-TEC INDUSTRIES PROTOTYPE 2043\n" +
    "-----------------------------------\n";
  displayText = currentText;
}

function startStory(idx) {
  state = "story";
  currentStoryIndex = idx;
  currentText = storyPages[idx];
  displayText = "";
  storyScroll = 0;
}

function draw() {
  background(0, 36, 0);
  drawScanlines();
  if (frameCount % 3 === 0) {
    flickerAlpha = random(180, 255);
  }
  fill(56, 253, 56, flickerAlpha);
  noStroke();
  textFont(fontRegular);

  let margin = 40;
  let yStart = 60;

  if (state === "intro") {
    // Typewriter effect
    if (frameCount % typeSpeed === 0 && displayText.length < currentText.length) {
      displayText += currentText.charAt(displayText.length);
    }
    let lines = wrapText(displayText, width - 2 * margin);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], margin, yStart + i * lineHeight);
    }
    // Blinking cursor
    if (displayText.length < currentText.length) {
      cursorTimer++;
      if (cursorTimer > 30) {
        showCursor = !showCursor;
        cursorTimer = 0;
      }
      if (showCursor) {
        let lastLine = lines[lines.length - 1] || "";
        let cursorX = margin + textWidth(lastLine);
        let cursorY = yStart + (lines.length - 1) * lineHeight;
        text("_", cursorX, cursorY);
      }
    }
    // When done, go to menu
    if (displayText.length === currentText.length) {
      state = "menu";
    }
  } else if (state === "menu") {
    // Show menu
    let lines = wrapText(currentText, width - 2 * margin);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], margin, yStart + i * lineHeight);
    }
    let menuY = yStart + lines.length * lineHeight + 30;
    for (let i = 0; i < menuOptions.length; i++) {
      if (i === selectedOption) {
        fill(0, 255, 0, flickerAlpha);
        text("> " + menuOptions[i], margin, menuY + i * lineHeight);
      } else {
        fill(56, 253, 56, flickerAlpha);
        text("  " + menuOptions[i], margin, menuY + i * lineHeight);
      }
    }
    // Blinking cursor at menu
    cursorTimer++;
    if (cursorTimer > 30) {
      showCursor = !showCursor;
      cursorTimer = 0;
    }
    if (showCursor) {
      let cursorX = margin + textWidth("> " + menuOptions[selectedOption]);
      let cursorY = menuY + selectedOption * lineHeight;
      text("_", cursorX, cursorY);
    }
    // Instructions at the bottom
    fill(56, 253, 56, 180);
    textAlign(CENTER);
    text("[UP/DOWN] Navigate    [ENTER] Select", width / 2, height - 40);
    textAlign(LEFT);
  } else if (state === "story") {
    // Typewriter effect for story page
    if (frameCount % typeSpeed === 0 && displayText.length < currentText.length) {
      displayText += currentText.charAt(displayText.length);
    }
    fill(56, 253, 56, flickerAlpha);

    // Fullscreen text wrapping, with vertical scrolling if needed
    let lines = wrapText(displayText, width - 2 * margin);

    let maxLines = floor((height - yStart - 80) / lineHeight); // leave room for bottom instructions
    let totalLines = lines.length;
    // Clamp scroll
    storyScroll = constrain(storyScroll, 0, max(0, totalLines - maxLines));
    let startLine = storyScroll;
    let endLine = min(totalLines, startLine + maxLines);

    for (let i = startLine; i < endLine; i++) {
      text(lines[i], margin, yStart + (i - startLine) * lineHeight);
    }
    // Blinking cursor at end if typewriter not finished
    if (displayText.length < currentText.length) {
      cursorTimer++;
      if (cursorTimer > 30) {
        showCursor = !showCursor;
        cursorTimer = 0;
      }
      if (showCursor) {
        let lastLine = lines[lines.length - 1] || "";
        let cursorX = margin + textWidth(lastLine);
        let cursorY = yStart + (lines.length - 1 - startLine) * lineHeight;
        if (lines.length > maxLines) {
          // Only show cursor if last line is visible
          if (lines.length - 1 >= startLine && lines.length - 1 < endLine) {
            text("_", cursorX, cursorY);
          }
        } else {
          text("_", cursorX, cursorY);
        }
      }
    }
    // Instructions at the bottom
    fill(56, 253, 56, 180);
    textAlign(CENTER);
    let scrollHint = "";
    if (totalLines > maxLines) scrollHint = "  [UP/DOWN] Scroll";
    text("[SPACE] Return to Menu" + scrollHint, width / 2, height - 40);
    textAlign(LEFT);
  }
}

function keyPressed() {
  if (state === "intro") return; // Ignore keys during intro typewriter

  if (state === "menu") {
    if (keyCode === DOWN_ARROW) {
      selectedOption = (selectedOption + 1) % menuOptions.length;
    } else if (keyCode === UP_ARROW) {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
    } else if (keyCode === ENTER) {
      startStory(selectedOption);
    }
  } else if (state === "story") {
    // SPACE to return to menu
    if (key === ' ') {
      startMenu();
    }
    // Scroll story if needed
    let lines = wrapText(displayText, width - 80);
    let maxLines = floor((height - 60 - 80) / lineHeight);
    if (lines.length > maxLines) {
      if (keyCode === DOWN_ARROW) {
        storyScroll++;
      } else if (keyCode === UP_ARROW) {
        storyScroll--;
      }
    }
  }
}

// Helper: Draw scanlines for CRT effect
function drawScanlines() {
  stroke(56, 253, 56, 28);
  for (let y = 0; y < height; y += 2) {
    line(0, y, width, y);
  }
  noStroke();
}

// Helper: Wrap text to fit width
function wrapText(txt, maxWidth) {
  let words = txt.split(' ');
  let lines = [];
  let line = '';
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let testWidth = textWidth(testLine);
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  line = line.trim();
  if (line.length > 0) lines.push(line);
  // Handle explicit line breaks
  let finalLines = [];
  for (let i = 0; i < lines.length; i++) {
    let split = lines[i].split('\n');
    for (let j = 0; j < split.length; j++) {
      finalLines.push(split[j]);
    }
  }
  return finalLines;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}