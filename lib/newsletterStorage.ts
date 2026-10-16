// localStorage flag set after a successful newsletter signup, so the signup popup stays hidden for subscribers
export const NEWSLETTER_SUBSCRIBED_KEY = "newsletter_subscribed_v1";

export function markNewsletterSubscribed() {
    try {
        localStorage.setItem(NEWSLETTER_SUBSCRIBED_KEY, "true");
    } catch {
        // Storage unavailable (e.g. privacy mode)
    }
}

export function isNewsletterSubscribed() {
    try {
        return localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY) === "true";
    } catch {
        return false;
    }
}
