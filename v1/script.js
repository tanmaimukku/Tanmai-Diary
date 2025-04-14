const CATEGORIES = [
  { name: "personal", color: "#3b82f6" },
  { name: "travel", color: "#16a34a" },
  { name: "projects", color: "#ef4444" },
  { name: "goals", color: "#eab308" },
  { name: "learning", color: "#db2777" },
  { name: "fun", color: "#14b8a6" },
  { name: "thoughts", color: "#f97316" },
  { name: "memories", color: "#8b5cf6" },
];

// DOM elements
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

// Supabase credentials
const PROJECT_ID = "tvvswliklpeezhwfhohu";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dnN3bGlrbHBlZXpod2Zob2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MDI4MjUsImV4cCI6MjA2MDE3ODgyNX0.B3LefhgFmLDL8rMTGigyPrBQyHcHEae_bafypdbzpC4";

// Empty list before rendering
factsList.innerHTML = "";

loadEntries();

async function loadEntries() {
  const res = await fetch(`https://${PROJECT_ID}.supabase.co/rest/v1/entries`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const data = await res.json();
  createFactsList(data);
}

function createFactsList(dataArray) {
  const htmlArr = dataArray.map(
    (entry) => `<li class="fact">
        <p>
          ${entry.text}
          ${
            entry.source
              ? `<a class="source" href="${entry.source}" target="_blank">(Source)</a>`
              : ""
          }
        </p>
        <span class="tag" style="background-color: ${
          CATEGORIES.find((cat) => cat.name === entry.category)?.color || "#aaa"
        }">${entry.category}</span>
        <div class="vote-buttons">
          <button>👍 ${entry.votes_interesting}</button>
          <button>🤯 ${entry.votes_mindblowing}</button>
          <button>⛔️ ${entry.votes_false}</button>
        </div>
      </li>`
  );
  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

// Toggle form visibility
btn.addEventListener("click", function () {
  form.classList.toggle("hidden");
  btn.textContent = form.classList.contains("hidden") ? "New Entry" : "Close";
});
