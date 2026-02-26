const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Sign in was denied. Please try again or use another account.",
  CallbackRouteError: "Sign in failed during callback. Please try again.",
  Configuration: "Authentication is not configured correctly. Please try again later.",
  CredentialsSignin: "Invalid email or password.",
  Default: "We could not sign you in. Please try again.",
  OAuthAccountNotLinked: "This email is linked to another sign-in method. Use the original provider.",
  OAuthCallbackError: "GitHub did not complete sign in. Please try again.",
  OAuthCreateAccount: "We could not create your account from GitHub. Please try again.",
  OAuthSignin: "Could not start GitHub sign in. Please try again.",
  SessionRequired: "Please sign in to continue.",
  Verification: "Verification failed or expired. Please request a new sign in link.",
};

export const getAuthErrorMessage = (code?: string | null) => {
  if (!code) return AUTH_ERROR_MESSAGES.Default;
  return AUTH_ERROR_MESSAGES[code] ?? AUTH_ERROR_MESSAGES.Default;
};
