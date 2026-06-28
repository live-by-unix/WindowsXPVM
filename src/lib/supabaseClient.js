import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bhcqjgzhczggvojprzkq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY3FqZ3poY3pnZ3ZvanByemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTc3ODIsImV4cCI6MjA5ODA5Mzc4Mn0.HkWZB89L1wHHDX7OSoBdgOW-fjXwDjvngYWc-uyDDJI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);