import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wnytxrsysosztkhjkmdr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueXR4cnN5c29zenRraGprbWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2Mjg3NzgsImV4cCI6MjA4ODIwNDc3OH0.beDqFJs4Mys6qn98IFJR6kW9COhaMa6PVULsCh8-vyg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);