import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function BuddyCard({ p }) {
  const topics = Array.isArray(p.topics) ? p.topics : p.topics ? [p.topics] : [];
  let contactList = [];
  if (Array.isArray(p.contacts)) {
    contactList = p.contacts
      .map((c) => (typeof c === "string" ? { type: "Other", value: c } : c))
      .filter((c) => c && c.value);
  } else if (typeof p.contacts === "string" && p.contacts.trim()) {
    contactList = [{ type: "Other", value: p.contacts }];
  } else if (p.contacts && typeof p.contacts === "object") {
    contactList = Object.entries(p.contacts).map(([k, v]) => ({ type: k, value: String(v) }));
  }
  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
      <h3 className="text-base font-semibold">{p.username || "Anonymous"}</h3>
      {p.name && <div className="text-xs text-muted-foreground mb-2">{p.name}</div>}
      {p.bio && <p className="text-sm mt-2">{p.bio}</p>}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {topics.map((t, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {contactList.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
          {contactList.map((c, i) => (
            <div key={i}>📬 {c.type}: {c.value}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuddiesGrid({ refreshKey }) {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");
      if (!active) return;
      if (error) {
        setError(error.message);
        setBuddies([]);
      } else {
        setBuddies(data || []);
        setError("");
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const allTopics = useMemo(() => {
    const set = new Set();
    buddies.forEach((b) => {
      const t = Array.isArray(b.topics) ? b.topics : b.topics ? [b.topics] : [];
      t.forEach((x) => x && set.add(x));
    });
    return Array.from(set).sort();
  }, [buddies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return buddies.filter((b) => {
      const matchesTopic = !activeTopic ||
        (Array.isArray(b.topics) ? b.topics : b.topics ? [b.topics] : []).includes(activeTopic);
      const matchesQuery = !q ||
        [b.username, b.name, b.bio].some((f) => (f || "").toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });
  }, [buddies, query, activeTopic]);

  if (loading) return <p className="text-muted-foreground text-sm">Loading study buddies…</p>;
  if (error) return <p className="text-sm text-red-500">Could not load profiles: {error}</p>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, username, or bio…"
          className="pl-9"
        />
      </div>

      {allTopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTopic("")}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTopic === ""
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            All
          </button>
          {allTopics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(activeTopic === t ? "" : t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeTopic === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {buddies.length === 0
            ? "No study buddies yet. Be the first!"
            : "No buddies match your filter."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((b) => (
            <BuddyCard key={b.id} p={b} />
          ))}
        </div>
      )}
    </div>
  );
}