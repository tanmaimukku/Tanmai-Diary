// src/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvvswliklpeezhwfhohu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dnN3bGlrbHBlZXpod2Zob2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MDI4MjUsImV4cCI6MjA2MDE3ODgyNX0.B3LefhgFmLDL8rMTGigyPrBQyHcHEae_bafypdbzpC4";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
