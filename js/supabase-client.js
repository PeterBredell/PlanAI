// Supabase client configuration
// This file initializes and exports the Supabase client for use throughout the application

// Import the Supabase client
// Note: You'll need to add the Supabase JavaScript library to your project
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Supabase configuration
const SUPABASE_URL = 'https://revbzephgjzupznftiwf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldmJ6ZXBoZ2p6dXB6bmZ0aXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTk2NDIsImV4cCI6MjA2MTkzNTY0Mn0.PBsA5UjptrZwHDVMifi0z5EQ3Xwryld9bWrnSlzlFmQ';

// Initialize the Supabase client
let supabase;

// Function to initialize Supabase with provided credentials
export function initializeSupabase(url, key) {
    if (!url || !key) {
        console.error('Supabase URL and anon key are required');
        return null;
    }

    try {
        // The Supabase client is loaded from CDN and available as a global object
        if (typeof window !== 'undefined' && window.supabase) {
            supabase = window.supabase.createClient(url, key);
            console.log('Supabase client initialized');
            return supabase;
        } else {
            console.error('Supabase client library not found. Make sure it is loaded before this script.');
            return null;
        }
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        return null;
    }
}

// Initialize with default values if the Supabase client is available
try {
    if (typeof window !== 'undefined' && window.supabase) {
        initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (error) {
    console.error('Error during automatic Supabase initialization:', error);
}

// Export the Supabase client
export function getSupabaseClient() {
    if (!supabase) {
        console.warn('Supabase client not initialized. Call initializeSupabase first.');
    }
    return supabase;
}

// Helper function to check if Supabase is initialized
export function isSupabaseInitialized() {
    return !!supabase;
}
