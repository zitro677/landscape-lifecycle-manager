

# Fix Google OAuth Redirect URLs

## The Problem
The Lovable Cloud UI only lets you select from two specific redirect URLs:
- `https://oauth.lovable.app/callback`
- `https://landscape-lifecycle-manager.lovable.app/~oauth/callback`

You cannot use `https://eftohgkfjnmlxmkcbvxq.supabase.co/auth/v1/callback` because it's not an option in the UI. The code also needs to switch from direct Supabase auth to the Lovable managed auth client.

## What Needs to Change

### 1. Google Cloud Console — Update Authorized Redirect URIs
Replace the current redirect URI with these two:
- `https://oauth.lovable.app/callback`
- `https://landscape-lifecycle-manager.lovable.app/~oauth/callback`

Also add your custom domain as an **Authorized JavaScript Origin**:
- `https://landscape.arkanatech.net`

### 2. Lovable Cloud UI — Select the Redirect URLs
Check **both** redirect URL checkboxes shown in the dialog, then click Save.

### 3. Code Change — Switch to Lovable Managed Auth
Update `useLoginForm.tsx` to use `lovable.auth.signInWithOAuth` instead of `supabase.auth.signInWithOAuth`:

```typescript
import { lovable } from "@/integrations/lovable/index";

// Replace the current handleGoogleLogin with:
const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: "https://landscape.arkanatech.net",
    });

    if (error) throw error;
  } catch (error: any) {
    console.error("Google login error:", error);
    setErrorMessage(error.message || "Failed to login with Google");
    toast.error("Failed to login with Google");
    setIsLoading(false);
  }
};
```

This removes the manual URL validation and `skipBrowserRedirect` workaround, using Lovable's managed OAuth flow instead.

## Summary of Steps
1. Update Google Cloud Console redirect URIs to match the ones shown in Lovable Cloud
2. Select both checkboxes in Lovable Cloud and save
3. Update code to use `lovable.auth.signInWithOAuth`

