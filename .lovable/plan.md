

# Fix Google OAuth ERR_BLOCKED_BY_RESPONSE

## Problem
The `lovable.auth.signInWithOAuth` managed flow uses an auth-bridge that intercepts the OAuth redirect. When accessed from a custom domain or certain preview URLs, Google blocks the response because the redirect goes through an intermediate domain, triggering `ERR_BLOCKED_BY_RESPONSE`.

## Solution
Bypass the auth-bridge by using `supabase.auth.signInWithOAuth` directly with `skipBrowserRedirect: true`, then manually redirect to the Google OAuth URL. This avoids the intermediate hop that Google blocks.

## What Changes

### 1. Update `src/components/auth/hooks/useLoginForm.tsx`

Replace the `handleGoogleLogin` function to:
- Call `supabase.auth.signInWithOAuth` with `provider: "google"`, `redirectTo: window.location.origin`, and `skipBrowserRedirect: true`
- Validate the returned URL hostname is `accounts.google.com` (security against open redirects)
- Redirect with `window.location.href = data.url`

```typescript
const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const oauthUrl = new URL(data.url);
      const allowedHosts = ["accounts.google.com"];
      if (!allowedHosts.some(host => oauthUrl.hostname === host)) {
        throw new Error("Invalid OAuth redirect URL");
      }
      window.location.href = data.url;
    }
  } catch (error: any) {
    console.error("Google login error:", error);
    setErrorMessage(error.message || "Failed to login with Google");
    toast.error("Failed to login with Google");
    setIsLoading(false);
  }
};
```

### 2. Configure your published domain as redirect URL

After the code change, you need to ensure your published domain is configured as an allowed redirect URL in your backend authentication settings. Your current published URL is `https://landscape-lifecycle-manager.lovable.app`.

To check/update this:
- Open the backend dashboard from your project settings
- Go to Authentication > URL Configuration
- Ensure **Site URL** is set to `https://landscape-lifecycle-manager.lovable.app`
- Ensure **Redirect URLs** includes `https://landscape-lifecycle-manager.lovable.app/**`

If you are using a custom domain, add that domain there as well.

## Summary
One file change (`useLoginForm.tsx`) to bypass the auth-bridge, plus verifying redirect URL configuration in the backend.

