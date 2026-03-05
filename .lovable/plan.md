

# Fix: Google Auth Redirect URL Configuration

## What's Happening
You're seeing "must select at least 1 redirect URL" because you need to **check/select** one of the redirect URL options shown in the dialog before clicking Save. It's a checkbox selection — you must tick at least one.

## What To Do (No code changes needed)

1. In the dialog you currently see, **select (check the checkbox) for the redirect URL** that matches what you added in Google Cloud Console: `https://eftohgkfjnmlxmkcbvxq.supabase.co/auth/v1/callback`
2. Click **Save**

## About Propagation
Google OAuth credential changes are **instant** — there's no propagation delay like DNS. Once you save your Client ID and Client Secret in both Google Cloud Console and Lovable Cloud, it should work immediately.

## Summary
This is just a UI validation — select the redirect URL checkbox, save, and you should be good to go. No code changes required.

