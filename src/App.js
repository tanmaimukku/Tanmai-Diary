import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getEntries() {
      setIsLoading(true);

      let query = supabase.from("entries").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }

      const { data, error } = await query
        .order("votes_interesting", { ascending: false })
        .limit(1000);

      if (!error) setEntries(data);
      else alert("There was a problem loading entries.");

      setIsLoading(false);
    }

    getEntries();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && (
        <NewEntryForm setEntries={setEntries} setShowForm={setShowForm} />
      )}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <p className="message">Loading...</p>
        ) : (
          <EntryList entries={entries} setEntries={setEntries} />
        )}
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Tanmai's Diary Logo" width={68} />
        <h1>Tanmai's Diary</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Close" : "New Entry"}
      </button>
    </header>
  );
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

function NewEntryForm({ setEntries, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (text && isValidUrl(source) && category && text.length <= 200) {
      setIsUploading(true);
      const { data, error } = await supabase
        .from("entries")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      if (!error) {
        setEntries((prev) => [data[0], ...prev]);
        setText("");
        setSource("");
        setCategory("");
        setShowForm(false);
      }
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write something memorable..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Link (optional)..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function EntryList({ entries, setEntries }) {
  if (entries.length === 0)
    return <p className="message">No entries yet! Write your first one ✍️</p>;

  return (
    <section>
      <ul className="facts-list">
        {entries.map((entry) => (
          <Entry key={entry.id} entry={entry} setEntries={setEntries} />
        ))}
      </ul>
      <p>There are {entries.length} entries in the diary. Add more!</p>
    </section>
  );
}

function Entry({ entry, setEntries }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const isDisputed =
    entry.votes_interesting + entry.votes_mindblowing < entry.votes_false;

  async function handleVote(column) {
    setIsUpdating(true);
    const { data, error } = await supabase
      .from("entries")
      .update({ [column]: entry[column] + 1 })
      .eq("id", entry.id)
      .select();
    setIsUpdating(false);

    if (!error) {
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? data[0] : e)));
    }
  }

  return (
    <li className="fact">
      <p>
        {isDisputed && <span className="disputed">[⛔️ DISPUTED]</span>}
        {entry.text}
        {entry.source && (
          <a
            className="source"
            href={entry.source}
            target="_blank"
            rel="noreferrer"
          >
            (Source)
          </a>
        )}
      </p>
      <span
        className="tag"
        style={{
          backgroundColor:
            CATEGORIES.find((c) => c.name === entry.category)?.color || "#aaa",
        }}
      >
        {entry.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votes_interesting")}
          disabled={isUpdating}
        >
          👍 {entry.votes_interesting}
        </button>
        <button
          onClick={() => handleVote("votes_mindblowing")}
          disabled={isUpdating}
        >
          🤯 {entry.votes_mindblowing}
        </button>
        <button onClick={() => handleVote("votes_false")} disabled={isUpdating}>
          ⛔️ {entry.votes_false}
        </button>
      </div>
    </li>
  );
}

export default App;
