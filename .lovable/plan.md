

## Plan: Temporarily Disable Google Sign-In

A simple UI change to hide the Google login option while keeping the code for future re-enablement.

---

### Change Required

**File: `src/components/auth/LoginPage.tsx`**

Comment out or remove:
- The "Or continue with" divider (lines 56-59)
- The Google Sign In button (lines 61-80)

The `handleGoogleLogin` function can stay in the hook - we're just hiding the UI.

---

### Result

- Clean email/password login page
- Google code preserved for easy re-enablement later
- You can access the app and work on other features

