export interface SignInWithOAuthParams {
    provider: "github" | "google";
    providerAccountId: string;
    user: {
        email: string;
        name: string;
        image?: string | null;
        username: string;
    };
}

export interface AuthCredentials {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface SignInCredentials {
    email: string;
    password: string;
}
