const quotes = [
  "Every step forward is a step closer to your dreams.",
  "Believe in yourself, even when no one else does.",
  "Success begins with the courage to take the first step.",
  "Small progress each day leads to remarkable results.",
  "Your future is created by what you do today.",
  "Stay focused, stay strong, and never stop growing.",
  "Dream big, work hard, and stay humble.",
  "Challenges are opportunities in disguise.",
  "The only limits are the ones you choose to believe.",
  "Be patient; every great achievement takes time.",
  "Every setback is a setup for a stronger comeback.",
  "Consistency beats perfection every single time.",
  "Don't wait for the perfect moment—create it.",
  "Your determination is more powerful than your doubts.",
  "The best investment you can make is in yourself.",
  "Success belongs to those who never stop trying.",
  "Be fearless in the pursuit of your goals.",
  "Growth begins at the edge of your comfort zone.",
  "Keep moving forward, no matter how slow the progress.",
  "Today's effort is tomorrow's achievement.",
];

const el = document.getElementById("quote");
let i = 0;

function showQuote() {
  el.classList.remove("is-visible");
  // fade out, swap text, fade back in
  setTimeout(() => {
    el.textContent = quotes[i];
    el.classList.add("is-visible");
    i = (i + 1) % quotes.length;
  }, 400);
}

showQuote();
setInterval(showQuote, 60 * 1000); // change every 1 minute
