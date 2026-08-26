import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" //optional if on same domain
})

// alternative: export const { signIn, signUp, useSession } = createAuthClient()

// error code language translation
type ErrorTypes = Partial<
    Record<
        keyof typeof authClient.$ERROR_CODES,
        {
            en: string;
            de: string;
        }
    >
>;

const errorCodes = {
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
		en: "user already registered",
		de: "Diese E-Mail wird bereits verwendet.",
	},
    ACCOUNT_NOT_FOUND: {
        en: "no account was found",
        de: "Es konnte kein Konto gefunden werden."
    },
    INVALID_EMAIL_OR_PASSWORD: {
        en: "wrong email or password",
        de: "E-Mail und Passwort stimmen nicht überein."
    }
} satisfies ErrorTypes;

export function getErrorMessage(code: string, lang: "en" | "de") {
	if (code in errorCodes) {
		return errorCodes[code as keyof typeof errorCodes][lang];
	}
	return null;
};