"use strict";

/*
  TRADER DIAGNOSIS
  Static randomized personality assessment
  No database, wallet, framework, or build process required.
*/

/* =========================================================
   DOM REFERENCES
========================================================= */

const landingScreen = document.getElementById("landingScreen");
const quizScreen = document.getElementById("quizScreen");
const analysisScreen = document.getElementById("analysisScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const shareButton = document.getElementById("shareButton");

const headerStatus = document.getElementById("headerStatus");
const questionCounter = document.getElementById("questionCounter");
const bullComment = document.getElementById("bullComment");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.querySelector(".progress-track");

const questionStage = document.querySelector(".question-stage");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const answerGrid = document.getElementById("answerGrid");

const analysisMeterFill = document.getElementById("analysisMeterFill");
const analysisMessage = document.getElementById("analysisMessage");

const diagnosisBackdrop = document.getElementById("diagnosisBackdrop");
const classificationStamp = document.getElementById("classificationStamp");
const resultCaseNumber = document.getElementById("resultCaseNumber");
const resultRiskLevel = document.getElementById("resultRiskLevel");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const resultHabitat = document.getElementById("resultHabitat");
const resultAbility = document.getElementById("resultAbility");
const resultWeakness = document.getElementById("resultWeakness");
const resultPhrase = document.getElementById("resultPhrase");
const shareFeedback = document.getElementById("shareFeedback");

const flashOverlay = document.getElementById("flashOverlay");

/* =========================================================
   CONFIGURATION
========================================================= */

const QUESTIONS_PER_ROUND = 5;
const ANSWER_LOCK_DELAY = 520;
const ANALYSIS_DURATION = 3200;

const personalityKeys = [
  "topBlaster",
  "diamondHands",
  "paperHands",
  "exitLiquidity",
  "whaleWatcher",
  "narrativeChaser",
  "sniper",
  "bundler",
  "dipCollector"
];

/*
  Each answer contains a score object.

  Example:
  score: {
    topBlaster: 3,
    narrativeChaser: 1
  }

  Scores can affect more than one personality.
*/

/* =========================================================
   PERSONALITY RESULTS
========================================================= */

const personalities = {
  topBlaster: {
    title: "Top Blaster",
    icon: "▲",
    severity: "ADVANCED",
    artwork: "assets/result-top-blaster.png",
    bodyClass: "result-top-blaster",
    summary:
      "You possess an unhealthy attraction to momentum. Unfortunately, momentum has also noticed you.",
    habitat:
      "The final green candle before a sudden period of reflection.",
    ability:
      "Interpreting violent upward movement as a personal invitation.",
    weakness:
      "Prices that have not already increased enough to feel trustworthy.",
    phrase:
      "\"There is still room.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as a Top Blaster.",
    accent: "#b7ff2a"
  },

  diamondHands: {
    title: "Diamond Hands",
    icon: "◆",
    severity: "UNTREATABLE",
    artwork: "assets/result-diamond-hands.png",
    bodyClass: "result-diamond-hands",
    summary:
      "You remain calm through fear, confusion, project abandonment, and several preventable financial events.",
    habitat:
      "An inactive group chat where the final message says, \"big news soon.\"",
    ability:
      "Turning temporary losses into permanent personality traits.",
    weakness:
      "The sell button and all forms of emotional closure.",
    phrase:
      "\"I was never planning to sell anyway.\"",
    shareLine:
      "The Black Bull Institute diagnosed me with Diamond Hands.",
    accent: "#8cc8ff"
  },

  paperHands: {
    title: "Paper Hands",
    icon: "▱",
    severity: "RECOVERABLE",
    artwork: "assets/result-paper-hands.png",
    bodyClass: "result-paper-hands",
    summary:
      "You survive by leaving early, sleeping peacefully, and watching everything you sold rise immediately afterward.",
    habitat:
      "The sidelines, holding a small profit and a very large opinion.",
    ability:
      "Protecting gains too small to explain at dinner.",
    weakness:
      "Any candle that briefly changes color.",
    phrase:
      "\"Profit is profit.\"",
    shareLine:
      "The Black Bull Institute diagnosed me with Paper Hands.",
    accent: "#d9d5ca"
  },

  exitLiquidity: {
    title: "Exit Liquidity",
    icon: "▼",
    severity: "TERMINAL",
    artwork: "assets/result-exit-liquidity.png",
    bodyClass: "result-exit-liquidity",
    summary:
      "Your arrival gives the market the exact thing it was waiting for: someone new to sell to.",
    habitat:
      "Directly beneath a post announcing that it is still early.",
    ability:
      "Locating the exact top through personal participation.",
    weakness:
      "Buying before asking why everyone else is suddenly celebrating.",
    phrase:
      "\"I finally got in.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as Exit Liquidity.",
    accent: "#ff5b45"
  },

  whaleWatcher: {
    title: "Whale Watcher",
    icon: "◉",
    severity: "DEPENDENT",
    artwork: "assets/result-whale-watcher.png",
    bodyClass: "result-whale-watcher",
    summary:
      "You prefer important decisions to be made by strangers with larger balances and completely different motives.",
    habitat:
      "Six wallet trackers, four dashboards, and one unread warning.",
    ability:
      "Following smart money moments after it becomes smart enough to leave.",
    weakness:
      "Assuming large wallets care whether you survive.",
    phrase:
      "\"The wallets know something.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as a Whale Watcher.",
    accent: "#66d9ff"
  },

    narrativeChaser: {
    title: "Narrative Chaser",
    icon: "✦",
    severity: "VISIONARY",
    artwork: "assets/result-narrative-chaser.png",
    bodyClass: "result-narrative-chaser",
    summary:
      "You do not purchase assets. You purchase stories, mascots, destiny, cultural moments, and occasionally a roadmap.",
    habitat:
      "A live audio room where someone has just said, \"this is bigger than a token.\"",
    ability:
      "Finding deep meaning in a cartoon animal with no declared revenue.",
    weakness:
      "A compelling story told with confidence.",
    phrase:
      "\"You do not understand the vision.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as a Narrative Chaser.",
    accent: "#d27cff"
  },

  sniper: {
    title: "The Sniper",
    icon: "⌖",
    severity: "OVER-CALIBRATED",
    artwork: "assets/result-sniper.png",
    bodyClass: "result-sniper",
    summary:
      "You can identify the perfect entry with extraordinary precision, usually several minutes after it has already happened.",
    habitat:
      "A five-second chart covered in lines nobody else is qualified to interpret.",
    ability:
      "Waiting patiently for confirmation of something that is already obvious.",
    weakness:
      "Pressing the button before every possible variable has been reviewed.",
    phrase:
      "\"I will catch the next one.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as The Sniper.",
    accent: "#f4c84a"
  },

  bundler: {
    title: "The Bundler",
    icon: "▦",
    severity: "COORDINATED",
    artwork: "assets/result-bundler.png",
    bodyClass: "result-bundler",
    summary:
      "You believe opportunities are best experienced together, preferably in one suspiciously organized package.",
    habitat:
      "Near several wallets that all discovered the same opportunity at exactly the same time.",
    ability:
      "Making coordinated behavior appear completely spontaneous.",
    weakness:
      "Public transaction history and anyone capable of following arrows.",
    phrase:
      "\"Completely organic.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as The Bundler.",
    accent: "#ff9e45"
  },

  dipCollector: {
    title: "Dip Collector",
    icon: "↓",
    severity: "ACCUMULATING",
    artwork: "assets/result-dip-collector.png",
    bodyClass: "result-dip-collector",
    summary:
      "You interpret every decline as a limited-time discount, including declines that are clearly trying to communicate something.",
    habitat:
      "A burning marketplace with a shopping cart and no remaining cash.",
    ability:
      "Buying fear while everyone else is searching for the exit.",
    weakness:
      "Assuming every falling object must eventually bounce.",
    phrase:
      "\"Now it is cheap.\"",
    shareLine:
      "The Black Bull Institute diagnosed me as a Dip Collector.",
    accent: "#55e68a"
  }
};

/* =========================================================
   QUESTION BANK
========================================================= */

const questionBank = [
  {
    category: "DECISION PATTERN",
    text: "You find a button labeled DO NOT PRESS. What happens next?",
    answers: [
      {
        label: "I press it immediately.",
        score: { topBlaster: 2, exitLiquidity: 1 }
      },
      {
        label: "I ask who made the button.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "I leave the room.",
        score: { paperHands: 3 }
      },
      {
        label: "I keep it in case it becomes important later.",
        score: { diamondHands: 3, narrativeChaser: 1 }
      }
    ]
  },

  {
    category: "ANIMAL SELECTION",
    text: "Pick an animal with no additional context.",
    answers: [
      {
        label: "Bull",
        emoji: "🐂",
        score: { topBlaster: 2 }
      },
      {
        label: "Turtle",
        emoji: "🐢",
        score: { diamondHands: 3 }
      },
      {
        label: "Rabbit",
        emoji: "🐇",
        score: { paperHands: 2, topBlaster: 1 }
      },
      {
        label: "Raccoon",
        emoji: "🦝",
        score: { narrativeChaser: 3, exitLiquidity: 1 }
      }
    ]
  },

  {
    category: "RISK RESPONSE",
    text: "Someone offers you five dollars or one mysterious envelope.",
    answers: [
      {
        label: "Take the five dollars.",
        score: { paperHands: 2 }
      },
      {
        label: "Take the envelope.",
        score: { topBlaster: 2, narrativeChaser: 1 }
      },
      {
        label: "Ask what everyone else picked.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Keep the envelope sealed forever.",
        score: { diamondHands: 3 }
      }
    ]
  },

  {
    category: "SOCIAL BEHAVIOR",
    text: "A crowd suddenly starts running. You...",
    answers: [
      {
        label: "Run with them immediately.",
        score: { topBlaster: 2, whaleWatcher: 1 }
      },
      {
        label: "Ask what happened first.",
        score: { paperHands: 2, whaleWatcher: 1 }
      },
      {
        label: "Run in the opposite direction.",
        score: { exitLiquidity: 2, narrativeChaser: 1 }
      },
      {
        label: "Stand still and pretend this was your plan.",
        score: { diamondHands: 3 }
      }
    ]
  },

  {
    category: "OBJECT PREFERENCE",
    text: "Choose one object to bring into a dark basement.",
    answers: [
      {
        label: "Flashlight",
        emoji: "🔦",
        score: { paperHands: 3 }
      },
      {
        label: "Baseball bat",
        emoji: "⚾",
        score: { topBlaster: 2 }
      },
      {
        label: "Old map",
        emoji: "🗺️",
        score: { narrativeChaser: 3 }
      },
      {
        label: "Someone braver than me",
        emoji: "🧍",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "FEAR ANALYSIS",
    text: "What scares you more?",
    answers: [
      {
        label: "Missing out.",
        score: { topBlaster: 2 }
      },
      {
        label: "Losing what I already have.",
        score: { paperHands: 3 }
      },
      {
        label: "Being wrong in public.",
        score: { whaleWatcher: 2, narrativeChaser: 1 }
      },
      {
        label: "Admitting something is over.",
        score: { diamondHands: 3 }
      }
    ]
  },

  {
    category: "MONEY RESPONSE",
    text: "You unexpectedly find twenty dollars.",
    answers: [
      {
        label: "Save it.",
        score: { paperHands: 3 }
      },
      {
        label: "Try to turn it into forty.",
        score: { topBlaster: 3 }
      },
      {
        label: "Ask where everyone else is spending theirs.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Keep it forever because it feels lucky.",
        score: { diamondHands: 2, narrativeChaser: 2 }
      }
    ]
  },

  {
    category: "CHAIR SELECTION",
    text: "Pick the chair that best represents your decision making.",
    answers: [
      {
        label: "Gaming chair",
        emoji: "💺",
        score: { topBlaster: 2, whaleWatcher: 1 }
      },
      {
        label: "Rocking chair",
        emoji: "🪑",
        score: { diamondHands: 3 }
      },
      {
        label: "Folding chair near the exit",
        emoji: "🪑",
        score: { paperHands: 3 }
      },
      {
        label: "Throne I found online",
        emoji: "👑",
        score: { narrativeChaser: 3, exitLiquidity: 1 }
      }
    ]
  },

  {
    category: "TRUST EVALUATION",
    text: "A stranger says, \"Trust me.\" Your immediate reaction?",
    answers: [
      {
        label: "I trust them.",
        score: { exitLiquidity: 3 }
      },
      {
        label: "I need more information.",
        score: { paperHands: 2, whaleWatcher: 1 }
      },
      {
        label: "Who else trusts them?",
        score: { whaleWatcher: 3 }
      },
      {
        label: "They seem like part of the story.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "WEATHER PREFERENCE",
    text: "Which weather feels most trustworthy?",
    answers: [
      {
        label: "Clear skies",
        emoji: "☀️",
        score: { paperHands: 3 }
      },
      {
        label: "Thunderstorm",
        emoji: "⛈️",
        score: { topBlaster: 3 }
      },
      {
        label: "Fog",
        emoji: "🌫️",
        score: { narrativeChaser: 3 }
      },
      {
        label: "Whatever the forecast says",
        emoji: "📱",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "PERSONAL PHILOSOPHY",
    text: "Choose the sentence that feels most reasonable.",
    answers: [
      {
        label: "Better safe than sorry.",
        score: { paperHands: 3 }
      },
      {
        label: "You only live once.",
        score: { topBlaster: 2 }
      },
      {
        label: "Good things take time.",
        score: { diamondHands: 3 }
      },
      {
        label: "Everything happens for a reason.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "DIRECTIONAL INSTINCT",
    text: "You reach a fork in the road with no signs.",
    answers: [
      {
        label: "Go left immediately.",
        score: { topBlaster: 1 }
      },
      {
        label: "Wait for someone else.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Turn around.",
        score: { paperHands: 3 }
      },
      {
        label: "Sit there until the correct path reveals itself.",
        score: { diamondHands: 2, narrativeChaser: 2 }
      }
    ]
  },

  {
    category: "SUPERNATURAL JUDGMENT",
    text: "A fortune teller says your luck is about to change.",
    answers: [
      {
        label: "I knew it.",
        score: { narrativeChaser: 3, topBlaster: 1 }
      },
      {
        label: "How soon?",
        score: { topBlaster: 3 }
      },
      {
        label: "That sounds suspicious.",
        score: { paperHands: 3 }
      },
      {
        label: "Did they tell anyone else?",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "FOOD SELECTION",
    text: "Pick a snack for a long and uncertain journey.",
    answers: [
      {
        label: "Protein bar",
        emoji: "🥜",
        score: { paperHands: 3 }
      },
      {
        label: "Energy drink",
        emoji: "⚡",
        score: { topBlaster: 2 }
      },
      {
        label: "A mysterious mushroom",
        emoji: "🍄",
        score: { narrativeChaser: 3, exitLiquidity: 1 }
      },
      {
        label: "Whatever the group packed",
        emoji: "🎒",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "EMERGENCY RESPONSE",
    text: "The lights suddenly go out.",
    answers: [
      {
        label: "Remain calm.",
        score: { diamondHands: 3 }
      },
      {
        label: "Leave immediately.",
        score: { paperHands: 3 }
      },
      {
        label: "Yell first, investigate second.",
        score: { topBlaster: 3 }
      },
      {
        label: "Wait to see what everyone else does.",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "PHONE BEHAVIOR",
    text: "Your phone battery reaches three percent.",
    answers: [
      {
        label: "Turn it off and save it.",
        score: { paperHands: 3 }
      },
      {
        label: "Keep using it at full brightness.",
        score: { topBlaster: 1, exitLiquidity: 1 }
      },
      {
        label: "Ask who has a charger.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Trust that it will survive.",
        score: { diamondHands: 2, narrativeChaser: 2 }
      }
    ]
  },

  {
    category: "DOOR SELECTION",
    text: "Which door are you opening?",
    answers: [
      {
        label: "The heavy metal door",
        score: { diamondHands: 3 }
      },
      {
        label: "The bright red door",
        score: { topBlaster: 1 }
      },
      {
        label: "The door closest to the exit",
        score: { paperHands: 3 }
      },
      {
        label: "The door everyone is whispering about",
        score: { narrativeChaser: 2, whaleWatcher: 2 }
      }
    ]
  },

  {
    category: "GIFT RESPONSE",
    text: "Someone gives you a strange gift with no receipt.",
    answers: [
      {
        label: "Open it now.",
        score: { topBlaster: 2 }
      },
      {
        label: "Keep it unopened.",
        score: { diamondHands: 3 }
      },
      {
        label: "Try to return it anyway.",
        score: { paperHands: 3 }
      },
      {
        label: "Search who else received one.",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "NOISE INTERPRETATION",
    text: "You hear a loud crash from another room.",
    answers: [
      {
        label: "Run toward it.",
        score: { topBlaster: 2 }
      },
      {
        label: "Leave the building.",
        score: { paperHands: 3 }
      },
      {
        label: "Ask the group chat.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Assume this is the beginning of something important.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "TIME PREFERENCE",
    text: "Which time of day feels most powerful?",
    answers: [
      {
        label: "Sunrise",
        emoji: "🌅",
        score: { topBlaster: 2, narrativeChaser: 1 }
      },
      {
        label: "Noon",
        emoji: "☀️",
        score: { paperHands: 3 }
      },
      {
        label: "Midnight",
        emoji: "🌑",
        score: { narrativeChaser: 3 }
      },
      {
        label: "Whenever everyone else is awake",
        emoji: "👁️",
        score: { whaleWatcher: 3 }
      }
    ]
  },

  {
    category: "SHOPPING INSTINCT",
    text: "You see a long line outside a store.",
    answers: [
      {
        label: "Join immediately.",
        score: { whaleWatcher: 2, topBlaster: 2 }
      },
      {
        label: "Ask what they are selling.",
        score: { paperHands: 2, whaleWatcher: 1 }
      },
      {
        label: "Assume it is already too late.",
        score: { exitLiquidity: 3 }
      },
      {
        label: "The line itself makes it interesting.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "MEMORY TEST",
    text: "How long do you keep things you might need someday?",
    answers: [
      {
        label: "A few days.",
        score: { paperHands: 3 }
      },
      {
        label: "Until I forget why I kept them.",
        score: { diamondHands: 3 }
      },
      {
        label: "Until someone tells me they are valuable.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Forever. Objects have stories.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "LUCK RESPONSE",
    text: "You win twice in a row. What does this mean?",
    answers: [
      {
        label: "I should stop while ahead.",
        score: { paperHands: 3 }
      },
      {
        label: "I cannot lose.",
        score: { topBlaster: 2, exitLiquidity: 1 }
      },
      {
        label: "I need to know who else is winning.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "The universe has selected me.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "ESCAPE PLANNING",
    text: "You enter a room. What do you notice first?",
    answers: [
      {
        label: "The exits.",
        score: { paperHands: 3 }
      },
      {
        label: "The most important-looking person.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "The biggest object.",
        score: { topBlaster: 3 }
      },
      {
        label: "The atmosphere.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "MOVIE LOGIC",
    text: "A movie character says, \"I have a bad feeling about this.\"",
    answers: [
      {
        label: "Believe them.",
        score: { paperHands: 3 }
      },
      {
        label: "Continue anyway.",
        score: { topBlaster: 3 }
      },
      {
        label: "Check the reviews.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "This is clearly part of the prophecy.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "PATIENCE MEASUREMENT",
    text: "A package is delayed with no delivery date.",
    answers: [
      {
        label: "Request a refund.",
        score: { paperHands: 3 }
      },
      {
        label: "Order another one.",
        score: { topBlaster: 3 }
      },
      {
        label: "Check what other buyers are saying.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Wait. It will arrive when it is meant to.",
        score: { diamondHands: 2, narrativeChaser: 2 }
      }
    ]
  },

  {
    category: "PERSONAL BRANDING",
    text: "Choose a title for yourself.",
    answers: [
      {
        label: "The Early One",
        score: { topBlaster: 3 }
      },
      {
        label: "The Patient One",
        score: { diamondHands: 3 }
      },
      {
        label: "The Sensible One",
        score: { paperHands: 3 }
      },
      {
        label: "The Chosen One",
        score: { narrativeChaser: 3, exitLiquidity: 1 }
      }
    ]
  },

  {
    category: "SIGN INTERPRETATION",
    text: "You see the same number three times in one day.",
    answers: [
      {
        label: "Coincidence.",
        score: { paperHands: 3 }
      },
      {
        label: "A signal.",
        score: { narrativeChaser: 3 }
      },
      {
        label: "Ask what other people think.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Act before the fourth one appears.",
        score: { topBlaster: 3 }
      }
    ]
  },

  {
    category: "MAP READING",
    text: "The map says the bridge may be unsafe.",
    answers: [
      {
        label: "Find another route.",
        score: { paperHands: 3 }
      },
      {
        label: "Cross faster.",
        score: { topBlaster: 3 }
      },
      {
        label: "Wait for someone else to cross first.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "The bridge is testing my conviction.",
        score: { diamondHands: 2, narrativeChaser: 2 }
      }
    ]
  },

  {
    category: "DREAM ANALYSIS",
    text: "You have a vivid dream about finding treasure.",
    answers: [
      {
        label: "Forget it by breakfast.",
        score: { paperHands: 3 }
      },
      {
        label: "Start searching immediately.",
        score: { topBlaster: 3 }
      },
      {
        label: "Look up what the dream means.",
        score: { whaleWatcher: 2, narrativeChaser: 1 }
      },
      {
        label: "Accept that destiny has spoken.",
        score: { narrativeChaser: 3 }
      }
    ]
  },

  {
    category: "SELF-ASSESSMENT",
    text: "How would your friends describe your judgment?",
    answers: [
      {
        label: "Careful.",
        score: { paperHands: 3 }
      },
      {
        label: "Bold.",
        score: { topBlaster: 3 }
      },
      {
        label: "Influenced.",
        score: { whaleWatcher: 3 }
      },
      {
        label: "Difficult to explain.",
        score: { narrativeChaser: 2, exitLiquidity: 2 }
      }
    ]
  }
];

/* =========================================================
   EXPANDED RESULT SCORING
========================================================= */

/*
  This applies targeted scoring adjustments without requiring
  the original question objects to be rewritten individually.

  Format:
  "CATEGORY::ANSWER LABEL": { resultKey: points }
*/

const expandedScoreOverrides = {
  /* THE SNIPER */

  "DECISION PATTERN::I ask who made the button.": {
    sniper: 3,
    whaleWatcher: 1
  },

  "SOCIAL BEHAVIOR::Ask what happened first.": {
    sniper: 3,
    paperHands: 1
  },

  "OBJECT PREFERENCE::Flashlight": {
    sniper: 3,
    paperHands: 1
  },

  "TRUST EVALUATION::I need more information.": {
    sniper: 3,
    paperHands: 1
  },

  "DIRECTIONAL INSTINCT::Wait for someone else.": {
    sniper: 2,
    whaleWatcher: 1
  },

  "MOVIE LOGIC::Check the reviews.": {
    sniper: 3,
    whaleWatcher: 1
  },

  "PATIENCE MEASUREMENT::Check what other buyers are saying.": {
    sniper: 3,
    whaleWatcher: 1
  },

  "MAP READING::Wait for someone else to cross first.": {
    sniper: 3,
    whaleWatcher: 1
  },

  "DREAM ANALYSIS::Look up what the dream means.": {
    sniper: 2,
    narrativeChaser: 1
  },

  "SELF-ASSESSMENT::Careful.": {
    sniper: 2,
    paperHands: 1
  },

  /* THE BUNDLER */

  "RISK RESPONSE::Ask what everyone else picked.": {
    bundler: 3,
    whaleWatcher: 1
  },

  "SOCIAL BEHAVIOR::Run with them immediately.": {
    bundler: 3,
    topBlaster: 1
  },

  "FOOD SELECTION::Whatever the group packed": {
    bundler: 3,
    whaleWatcher: 1
  },

  "EMERGENCY RESPONSE::Wait to see what everyone else does.": {
    bundler: 3,
    whaleWatcher: 1
  },

  "PHONE BEHAVIOR::Ask who has a charger.": {
    bundler: 3,
    whaleWatcher: 1
  },

  "DOOR SELECTION::The door everyone is whispering about": {
    bundler: 3,
    narrativeChaser: 1
  },

  "GIFT RESPONSE::Search who else received one.": {
    bundler: 3,
    whaleWatcher: 1
  },

  "NOISE INTERPRETATION::Ask the group chat.": {
    bundler: 3,
    whaleWatcher: 1
  },

  "TIME PREFERENCE::Whenever everyone else is awake": {
    bundler: 3,
    whaleWatcher: 1
  },

  "SHOPPING INSTINCT::Join immediately.": {
    bundler: 3,
    topBlaster: 1
  },

  "MEMORY TEST::Until someone tells me they are valuable.": {
    bundler: 3,
    whaleWatcher: 1
  },

  "SELF-ASSESSMENT::Influenced.": {
    bundler: 3,
    whaleWatcher: 1
  },

  /* DIP COLLECTOR */

  "RISK RESPONSE::Take the five dollars.": {
    dipCollector: 2,
    paperHands: 1
  },

  "FEAR ANALYSIS::Losing what I already have.": {
    dipCollector: 2,
    paperHands: 1
  },

  "MONEY RESPONSE::Save it.": {
    dipCollector: 3,
    paperHands: 1
  },

  "PERSONAL PHILOSOPHY::Better safe than sorry.": {
    dipCollector: 2,
    paperHands: 1
  },

  "EMERGENCY RESPONSE::Remain calm.": {
    dipCollector: 2,
    diamondHands: 1
  },

  "PHONE BEHAVIOR::Turn it off and save it.": {
    dipCollector: 3,
    paperHands: 1
  },

  "GIFT RESPONSE::Keep it unopened.": {
    dipCollector: 2,
    diamondHands: 1
  },

  "SHOPPING INSTINCT::Assume it is already too late.": {
    dipCollector: 3,
    exitLiquidity: 1
  },

  "LUCK RESPONSE::I should stop while ahead.": {
    dipCollector: 2,
    paperHands: 1
  },

  "MOVIE LOGIC::Believe them.": {
    dipCollector: 2,
    paperHands: 1
  },

  "PERSONAL BRANDING::The Sensible One": {
    dipCollector: 3,
    paperHands: 1
  },

  "SIGN INTERPRETATION::Coincidence.": {
    dipCollector: 3,
    paperHands: 1
  },

  "MAP READING::Find another route.": {
    dipCollector: 3,
    paperHands: 1
  }
};

function applyExpandedScoreOverrides() {
  questionBank.forEach((question) => {
    question.answers.forEach((answer) => {
      const overrideKey =
        `${question.category}::${answer.label}`;

      const replacementScore =
        expandedScoreOverrides[overrideKey];

      if (replacementScore) {
        answer.score = { ...replacementScore };
      }
    });
  });
}

applyExpandedScoreOverrides();

/* =========================================================
   BULL COMMENTARY
========================================================= */

const bullComments = [
  "THE BULL IS OBSERVING.",
  "INTERESTING. DEEPLY CONCERNING.",
  "YOUR FILE HAS BEEN UPDATED.",
  "THE BULL HAS NOTED THAT.",
  "NO RESPONSIBLE ADULT CHOSE THAT.",
  "THIS EXPLAINS SEVERAL THINGS.",
  "YOUR INSTINCTS REMAIN ACTIVE.",
  "THE ASSESSMENT IS BECOMING PERSONAL.",
  "THE BULL REQUESTS NO FURTHER CONTEXT.",
  "THAT ANSWER WILL REMAIN ON RECORD.",
  "CONFIDENCE DETECTED. BASIS UNKNOWN.",
  "A PATTERN IS BEGINNING TO FORM."
];

const analysisMessages = [
  "Measuring impulse control...",
  "Reviewing suspicious confidence...",
  "Comparing you with known bag holders...",
  "Checking for herd response...",
  "Evaluating attachment to bad decisions...",
  "Consulting the bull...",
  "Preparing final diagnosis..."
];

/* =========================================================
   STATE
========================================================= */

let selectedQuestions = [];
let currentQuestionIndex = 0;
let scores = createEmptyScores();
let answerLocked = false;
let currentResultKey = "";
let currentCaseNumber = "";

/* =========================================================
   HELPERS
========================================================= */

function createEmptyScores() {
  return personalityKeys.reduce((accumulator, key) => {
    accumulator[key] = 0;
    return accumulator;
  }, {});
}

function shuffleArray(array) {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [
      copy[randomIndex],
      copy[index]
    ];
  }

  return copy;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatQuestionNumber(number) {
  return String(number).padStart(2, "0");
}

function generateCaseNumber() {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(10 + Math.random() * 90);
  return `${timestampPart}${randomPart}`;
}

function setScreen(activeScreen) {
  const screens = [
    landingScreen,
    quizScreen,
    analysisScreen,
    resultScreen
  ];

  screens.forEach((screen) => {
    const isActive = screen === activeScreen;

    screen.hidden = !isActive;
    screen.classList.toggle("screen-active", isActive);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function setHeaderStatus(text) {
  if (headerStatus) {
    headerStatus.textContent = text;
  }
}

function triggerFlash() {
  flashOverlay.classList.remove("flash");
  void flashOverlay.offsetWidth;
  flashOverlay.classList.add("flash");
}

function triggerGlitch() {
  document.body.classList.remove("glitch-active");
  void document.body.offsetWidth;
  document.body.classList.add("glitch-active");

  window.setTimeout(() => {
    document.body.classList.remove("glitch-active");
  }, 280);
}

function addScores(scoreObject) {
  Object.entries(scoreObject).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(scores, key)) {
      scores[key] += value;
    }
  });
}

function updateAccentColor(color) {
  document.documentElement.style.setProperty("--signal", color);
}

function resetAccentColor() {
  document.documentElement.style.setProperty("--signal", "#b7ff2a");
}

function clearDiagnosisClasses() {
  Object.values(personalities).forEach((personality) => {
    document.body.classList.remove(personality.bodyClass);
  });
}

function setDiagnosisArtwork(personality) {
  clearDiagnosisClasses();

  document.body.classList.add(personality.bodyClass);

  diagnosisBackdrop.style.backgroundImage =
    `url("${personality.artwork}")`;
}

function triggerClassificationStamp() {
  classificationStamp.classList.remove("is-active");
  void classificationStamp.offsetWidth;
  classificationStamp.classList.add("is-active");

  window.setTimeout(() => {
    classificationStamp.classList.remove("is-active");
  }, 1000);
}

function triggerResultHaptic() {
  if (
    "vibrate" in navigator &&
    typeof navigator.vibrate === "function"
  ) {
    navigator.vibrate([40, 35, 90]);
  }
}
/* =========================================================
   QUIZ START
========================================================= */

function startAssessment() {
  selectedQuestions = shuffleArray(questionBank).slice(
    0,
    QUESTIONS_PER_ROUND
  );

  currentQuestionIndex = 0;
  scores = createEmptyScores();
  answerLocked = false;
  currentResultKey = "";
  currentCaseNumber = "";
  shareFeedback.textContent = "";

  resetAccentColor();
  setHeaderStatus("ASSESSMENT ACTIVE");
  setScreen(quizScreen);

  document.body.classList.add("quiz-active");

  renderQuestion();
}

/* =========================================================
   QUESTION RENDERING
========================================================= */

function renderQuestion() {
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const displayedQuestionNumber = currentQuestionIndex + 1;
  const progressPercentage =
    (displayedQuestionNumber / QUESTIONS_PER_ROUND) * 100;

  answerLocked = false;

  questionCounter.textContent =
    `QUESTION ${formatQuestionNumber(displayedQuestionNumber)} / ` +
    `${formatQuestionNumber(QUESTIONS_PER_ROUND)}`;

  questionCategory.textContent = currentQuestion.category;
  questionText.textContent = currentQuestion.text;

  bullComment.textContent =
    currentQuestionIndex === 0
      ? "THE BULL IS OBSERVING."
      : getRandomItem(bullComments);

  progressBar.style.width = `${progressPercentage}%`;
  progressTrack.setAttribute(
    "aria-valuenow",
    String(displayedQuestionNumber)
  );

  answerGrid.innerHTML = "";

  currentQuestion.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    const answerNumber = String(answerIndex + 1).padStart(2, "0");

    button.type = "button";
    button.className = "answer-option";
    button.setAttribute(
      "aria-label",
      `${answerIndex + 1}. ${answer.label}`
    );

    const indexSpan = document.createElement("span");
    indexSpan.className = "answer-index";
    indexSpan.textContent = answerNumber;

    const labelSpan = document.createElement("span");
    labelSpan.className = "answer-label";
    labelSpan.textContent = answer.label;

    const markerSpan = document.createElement("span");
    markerSpan.className = "answer-marker";
    markerSpan.setAttribute("aria-hidden", "true");
    markerSpan.textContent = "↗";

    button.appendChild(indexSpan);

    if (answer.emoji) {
      const emojiSpan = document.createElement("span");
      emojiSpan.className = "answer-emoji";
      emojiSpan.setAttribute("aria-hidden", "true");
      emojiSpan.textContent = answer.emoji;
      button.appendChild(emojiSpan);
    }

    button.appendChild(labelSpan);
    button.appendChild(markerSpan);

    button.addEventListener("click", () => {
      handleAnswerSelection(answer, button);
    });

    answerGrid.appendChild(button);
  });

  questionStage.classList.remove("question-exit", "question-enter");
  void questionStage.offsetWidth;
  questionStage.classList.add("question-enter");
}

/* =========================================================
   ANSWER HANDLING
========================================================= */

function handleAnswerSelection(answer, selectedButton) {
  if (answerLocked) {
    return;
  }

  answerLocked = true;

  const allButtons = answerGrid.querySelectorAll(".answer-option");

  allButtons.forEach((button) => {
    button.disabled = true;
  });

  selectedButton.classList.add("is-selected");

  addScores(answer.score);
  triggerFlash();

  window.setTimeout(() => {
    questionStage.classList.remove("question-enter");
    questionStage.classList.add("question-exit");
  }, 250);

  window.setTimeout(() => {
    currentQuestionIndex += 1;

    if (currentQuestionIndex < QUESTIONS_PER_ROUND) {
      renderQuestion();
      return;
    }

    beginAnalysis();
  }, ANSWER_LOCK_DELAY);
}

/* =========================================================
   RESULT CALCULATION
========================================================= */

function calculateResult() {
  const highestScore = Math.max(...Object.values(scores));

  let leadingResults = personalityKeys.filter(
    (key) => scores[key] === highestScore
  );

  /*
    Tie handling:

    1. Prefer any result with the strongest recent score.
    2. If still tied, randomize between tied results.
    3. This makes replaying more varied without making
       the entire quiz completely random.
  */

  if (leadingResults.length > 1) {
    const finalQuestion = selectedQuestions[selectedQuestions.length - 1];

    const finalQuestionWeights = leadingResults.map((key) => {
      let finalWeight = 0;

      finalQuestion.answers.forEach((answer) => {
        finalWeight += answer.score[key] || 0;
      });

      return {
        key,
        finalWeight
      };
    });

    const strongestFinalWeight = Math.max(
      ...finalQuestionWeights.map((item) => item.finalWeight)
    );

    const finalLeaders = finalQuestionWeights
      .filter((item) => item.finalWeight === strongestFinalWeight)
      .map((item) => item.key);

    leadingResults =
      finalLeaders.length > 0 ? finalLeaders : leadingResults;
  }

  return getRandomItem(leadingResults);
}

/* =========================================================
   ANALYSIS SEQUENCE
========================================================= */

function beginAnalysis() {
  document.body.classList.remove("quiz-active");

  setHeaderStatus("PROCESSING RESULTS");
  setScreen(analysisScreen);

  analysisMeterFill.classList.remove("is-running");
  void analysisMeterFill.offsetWidth;
  analysisMeterFill.classList.add("is-running");

  let messageIndex = 0;
  analysisMessage.textContent = analysisMessages[messageIndex];

  const messageTimer = window.setInterval(() => {
    messageIndex += 1;

    if (messageIndex >= analysisMessages.length) {
      window.clearInterval(messageTimer);
      return;
    }

    analysisMessage.textContent = analysisMessages[messageIndex];
  }, 430);

  window.setTimeout(() => {
    window.clearInterval(messageTimer);
    currentResultKey = calculateResult();
    showResult(currentResultKey);
  }, ANALYSIS_DURATION);
}

/* =========================================================
   RESULT RENDERING
========================================================= */

function showResult(resultKey) {
  const result = personalities[resultKey];

  if (!result) {
    console.error(`Unknown diagnosis result: ${resultKey}`);
    return;
  }

  currentCaseNumber = generateCaseNumber();

  resultCaseNumber.textContent = currentCaseNumber;
  resultRiskLevel.textContent = result.severity;
  resultIcon.textContent = result.icon;
  resultTitle.textContent = result.title;
  resultSummary.textContent = result.summary;
  resultHabitat.textContent = result.habitat;
  resultAbility.textContent = result.ability;
  resultWeakness.textContent = result.weakness;
  resultPhrase.textContent = result.phrase;

  updateAccentColor(result.accent);
  setDiagnosisArtwork(result);

  setHeaderStatus("CLASSIFICATION COMPLETE");
  setScreen(resultScreen);

  triggerGlitch();
  triggerFlash();
  triggerResultHaptic();

  window.setTimeout(() => {
    triggerClassificationStamp();
  }, 320);

  const diagnosisContent = resultScreen.querySelector(
    ".diagnosis-content"
  );

  if (
    diagnosisContent &&
    typeof diagnosisContent.animate === "function"
  ) {
    diagnosisContent.animate(
      [
        {
          opacity: 0,
          transform: "translateY(34px)",
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          transform: "translateY(0)",
          filter: "blur(0)"
        }
      ],
      {
        duration: 850,
        delay: 140,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      }
    );
  }

  const diagnosisReport = resultScreen.querySelector(
    ".diagnosis-report"
  );

  if (
    diagnosisReport &&
    typeof diagnosisReport.animate === "function"
  ) {
    diagnosisReport.animate(
      [
        {
          opacity: 0,
          transform: "translateX(28px)"
        },
        {
          opacity: 1,
          transform: "translateX(0)"
        }
      ],
      {
        duration: 700,
        delay: 420,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      }
    );
  }
}
/* =========================================================
   SHARING
========================================================= */

function buildShareText() {
  const result = personalities[currentResultKey];

  return [
    result.shareLine,
    "",
    result.summary,
    "",
    "Five questionable questions.",
    "One permanent diagnosis.",
    "",
    "Find your trader personality at BullType."
  ].join("\n");
}

async function shareResult() {
  if (!currentResultKey) {
    return;
  }

  const shareData = {
  title: "BullType",
  text: buildShareText(),
  url: "https://bulltype.net/"
};

  shareFeedback.textContent = "";

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareFeedback.textContent = "DIAGNOSIS RELEASED TO THE PUBLIC.";
      return;
    }

    await navigator.clipboard.writeText(
      `${shareData.text}\n${shareData.url}`
    );

    shareFeedback.textContent =
      "RESULT COPIED. YOUR CONDITION IS NOW SHAREABLE.";
  } catch (error) {
    if (error && error.name === "AbortError") {
      shareFeedback.textContent = "SHARING CANCELLED. THE FILE REMAINS OPEN.";
      return;
    }

    fallbackCopy(
      `${shareData.text}\n${shareData.url}`
    );
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    shareFeedback.textContent =
      "RESULT COPIED. YOUR CONDITION IS NOW SHAREABLE.";
  } catch (error) {
    shareFeedback.textContent =
      "COPY FAILED. SCREENSHOT THE EVIDENCE.";
  } finally {
    textarea.remove();
  }
}

/* =========================================================
   RESTART
========================================================= */

function restartAssessment() {
  resetAccentColor();
  clearDiagnosisClasses();

  diagnosisBackdrop.style.backgroundImage = "";
  classificationStamp.classList.remove("is-active");

  selectedQuestions = [];
  currentQuestionIndex = 0;
  scores = createEmptyScores();
  answerLocked = false;
  currentResultKey = "";
  currentCaseNumber = "";

  analysisMeterFill.classList.remove("is-running");
  shareFeedback.textContent = "";

  setHeaderStatus("ASSESSMENT READY");
  setScreen(landingScreen);

  document.body.classList.remove("quiz-active");

  triggerGlitch();
}

/* =========================================================
   OPTIONAL KEYBOARD SUPPORT
========================================================= */

function handleKeyboardSelection(event) {
  if (quizScreen.hidden || answerLocked) {
    return;
  }

  const validKeys = ["1", "2", "3", "4"];

  if (!validKeys.includes(event.key)) {
    return;
  }

  const buttonIndex = Number(event.key) - 1;
  const buttons = answerGrid.querySelectorAll(".answer-option");
  const button = buttons[buttonIndex];

  if (button && !button.disabled) {
    button.click();
  }
}

/* =========================================================
   EVENT LISTENERS
========================================================= */

startButton.addEventListener("click", startAssessment);
restartButton.addEventListener("click", restartAssessment);
shareButton.addEventListener("click", shareResult);
document.addEventListener("keydown", handleKeyboardSelection);

/* =========================================================
   INITIALIZATION
========================================================= */

function initializeApp() {
  resetAccentColor();
  clearDiagnosisClasses();

  diagnosisBackdrop.style.backgroundImage = "";

  landingScreen.hidden = false;
  quizScreen.hidden = true;
  analysisScreen.hidden = true;
  resultScreen.hidden = true;

  setHeaderStatus("ASSESSMENT READY");

  /*
    Preload all visual assets when available.
    Missing images will not prevent the assessment from running.
  */

    [
    "assets/trader-diagnosis-bg.png",
    "assets/black-bull.png",
    "assets/result-texture.png",
    "assets/result-top-blaster.png",
    "assets/result-diamond-hands.png",
    "assets/result-paper-hands.png",
    "assets/result-exit-liquidity.png",
    "assets/result-whale-watcher.png",
    "assets/result-narrative-chaser.png",
    "assets/result-sniper.png",
    "assets/result-bundler.png",
    "assets/result-dip-collector.png"
  ].forEach((source) => {
    const image = new Image();
    image.src = source;
  });
}
initializeApp();
