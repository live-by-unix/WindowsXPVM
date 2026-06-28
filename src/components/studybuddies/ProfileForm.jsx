import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function parseTopics(raw) {
  return (raw || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

const CONTACT_TYPES = [
  "Email", "Discord", "GitHub", "LinkedIn", "Twitter/X",
  "Instagram", "Phone", "Website", "Other",
];

function normalizeContacts(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((c) =>
        typeof c === "string" ? { type: "Other", value: c } : { type: c.type || "Other", value: c.value || "" }
      )
      .filter((c) => c.value);
  }
  if (typeof raw === "string") {
    const v = raw.trim();
    if (!v) return [];
    try {
      const parsed = JSON.parse(v);
      return normalizeContacts(parsed);
    } catch {
      return [{ type: "Other", value: v }];
    }
  }
  if (typeof raw === "object") {
    return Object.entries(raw).map(([k, v]) => ({ type: k, value: String(v) }));
  }
  return [];
}

export default function ProfileForm({ onSaved }) {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [topics, setTopics] = useState("");
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (data) {
        setUsername(data.username || "");
        setName(data.name || "");
        setBio(data.bio || "");
        setTopics(Array.isArray(data.topics) ? data.topics.join(", ") : data.topics || "");
        setContacts(normalizeContacts(data.contacts));
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus({ type: "", msg: "Saving…" });
    const payload = {
      id: user.id,
      username: username.trim(),
      name: name.trim(),
      bio: bio.trim(),
      topics: parseTopics(topics),
      contacts: contacts.filter((c) => c.value.trim()).map((c) => ({ type: c.type, value: c.value.trim() })),
      study_style: null,
    };
    const { error } = await supabase.from("profiles").upsert(payload);
    setSaving(false);
    if (error) {
      setStatus({ type: "err", msg: "Error: " + error.message });
      return;
    }
    setStatus({ type: "ok", msg: "Profile saved!" });
    onSaved && onSaved();
  };

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading your profile…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. ada_lovelace"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ada Lovelace"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short intro about you and how you like to study"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topics">Topics (comma-separated)</Label>
        <Input
          id="topics"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          placeholder="math, physics, history"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact methods</Label>
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={c.type}
                onChange={(e) => {
                  const next = [...contacts];
                  next[i] = { ...next[i], type: e.target.value };
                  setContacts(next);
                }}
                className="rounded-md border border-input bg-transparent px-2 py-2 text-sm"
              >
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Input
                value={c.value}
                onChange={(e) => {
                  const next = [...contacts];
                  next[i] = { ...next[i], value: e.target.value };
                  setContacts(next);
                }}
                placeholder="your link or handle"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setContacts(contacts.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setContacts([...contacts, { type: "Email", value: "" }])}
        >
          + Add contact
        </Button>
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save Profile"}
      </Button>
      {status.msg && (
        <p className={status.type === "ok" ? "text-sm text-green-600" : "text-sm text-red-500"}>
          {status.msg}
        </p>
      )}
    </form>
  );
}