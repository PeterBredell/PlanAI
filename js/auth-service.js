// Authentication service for PlanAI
// This file provides authentication functionality using Supabase

import { getSupabaseClient } from './supabase-client.js';

class AuthService {
    constructor() {
        this.supabase = getSupabaseClient();
        this.currentUser = null;
        this.authStateListeners = [];
        
        // Initialize auth state
        this.initAuthState();
    }
    
    // Initialize authentication state
    async initAuthState() {
        try {
            // Get the current session
            const { data: { session } } = await this.supabase.auth.getSession();
            
            if (session) {
                this.currentUser = session.user;
                this.notifyAuthStateChange();
            }
            
            // Set up auth state change listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event);
                
                if (event === 'SIGNED_IN' && session) {
                    this.currentUser = session.user;
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                }
                
                this.notifyAuthStateChange();
            });
        } catch (error) {
            console.error('Error initializing auth state:', error);
        }
    }
    
    // Sign up a new user
    async signUp(email, password, metadata = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error signing up:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Sign in a user
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error signing in:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Sign out the current user
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Error signing out:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Reset password
    async resetPassword(email) {
        try {
            const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password'
            });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error resetting password:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Update user profile
    async updateProfile(userData) {
        try {
            const { data, error } = await this.supabase.auth.updateUser({
                data: userData
            });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get the current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Check if a user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }
    
    // Add auth state change listener
    addAuthStateListener(listener) {
        if (typeof listener === 'function') {
            this.authStateListeners.push(listener);
        }
    }
    
    // Remove auth state change listener
    removeAuthStateListener(listener) {
        this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    }
    
    // Notify all listeners of auth state change
    notifyAuthStateChange() {
        this.authStateListeners.forEach(listener => {
            try {
                listener(this.currentUser);
            } catch (error) {
                console.error('Error in auth state listener:', error);
            }
        });
    }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
