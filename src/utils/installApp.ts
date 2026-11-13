import { getAppName, getConfig, getPrimaryColor } from "./config";

/**
 * "Install as an app" for the student portal.
 * The manifest is rewritten with the agency's name, colour and logo once the agency config is known,
 * so the home-screen icon says e.g. "Global Visa Hub" and not the platform's name.
 */
let deferred: any = null;
const listeners = new Set<() => void>();
export const onInstallChange = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const canPromptInstall = () => Boolean(deferred);
export const isStandalone = () => window.matchMedia?.("(display-mode: standalone)").matches || (navigator as any).standalone === true;
export const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export const setupInstall = () => {
    if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
        navigator.serviceWorker.register("/sw.js").catch(() => { /* not available (e.g. http on a LAN) */ });
    }
    window.addEventListener("beforeinstallprompt", (e: any) => {
        e.preventDefault();
        deferred = e;
        listeners.forEach((fn) => fn());
    });
    window.addEventListener("appinstalled", () => { deferred = null; listeners.forEach((fn) => fn()); });
};

export const promptInstall = async () => {
    if (!deferred) return false;
    deferred.prompt();
    const choice = await deferred.userChoice.catch(() => null);
    deferred = null;
    listeners.forEach((fn) => fn());
    return choice?.outcome === "accepted";
};

/** Point the manifest link at a copy with the agency's name / colour / logo. */
export const brandManifest = () => {
    try {
        const name = getAppName() || "Student portal";
        const color = getPrimaryColor();
        const logo = getConfig("FAVICON_URL");
        const origin = window.location.origin;
        const icons = logo && /^https?:/.test(logo)
            ? [{ src: logo, sizes: "192x192", type: "image/png", purpose: "any" }, { src: logo, sizes: "512x512", type: "image/png", purpose: "any" }]
            : [{ src: `${origin}/icon-192.png`, sizes: "192x192", type: "image/png" }, { src: `${origin}/icon-512.png`, sizes: "512x512", type: "image/png" }];
        const manifest = { name, short_name: name.slice(0, 12), start_url: `${origin}/`, scope: `${origin}/`, display: "standalone", background_color: "#ffffff", theme_color: color, icons };
        const link = document.getElementById("app-manifest") as HTMLLinkElement | null;
        if (link) link.href = `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
    } catch { /* keep the static manifest */ }
};
