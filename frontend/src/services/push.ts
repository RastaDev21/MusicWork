import api from "./api";

// "enabled": este aparelho está inscrito. "disabled": dá pra ativar.
// "denied": bloqueado nas configurações do navegador/aparelho.
// "unsupported": navegador sem push (ex: Safari do iPhone fora da tela de
// início).
export type PushStatus = "enabled" | "disabled" | "denied" | "unsupported";

// Banner "Ative as notificações" do Feed: dispensado no "Agora não" ou
// quando a pessoa já viu a tela de notificações do tour
const PROMPT_DISMISSED_KEY = "musicwork_push_prompt_dismissed";

export function isPushPromptDismissed() {
  return Boolean(localStorage.getItem(PROMPT_DISMISSED_KEY));
}

export function dismissPushPrompt() {
  localStorage.setItem(PROMPT_DISMISSED_KEY, "1");
}

export function isPushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function getSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration ? registration.pushManager.getSubscription() : null;
}

export async function getPushStatus(): Promise<PushStatus> {
  if (!isPushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  if (Notification.permission !== "granted") return "disabled";
  return (await getSubscription()) ? "enabled" : "disabled";
}

// A chave VAPID vem em base64 url-safe; o PushManager quer os bytes
function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}

export async function enablePush(): Promise<PushStatus> {
  const permission = await Notification.requestPermission();
  if (permission === "denied") return "denied";
  if (permission !== "granted") return "disabled";

  const { data } = await api.get<{ publicKey: string | null }>(
    "/push/public-key",
  );
  if (!data.publicKey) {
    throw new Error("Notificações indisponíveis no momento");
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(data.publicKey),
  });
  await api.post("/push/subscription", subscription.toJSON());
  return "enabled";
}

export async function disablePush() {
  const subscription = await getSubscription();
  if (!subscription) return;
  try {
    await api.delete("/push/subscription", {
      data: { endpoint: subscription.endpoint },
    });
  } finally {
    // Mesmo se o backend falhar: sem a inscrição no navegador, o próximo
    // envio volta 410 e o backend apaga a linha sozinho.
    await subscription.unsubscribe();
  }
}

// Ao abrir o app logado: reenvia a inscrição que o aparelho já tem, para a
// conta atual. Cobre troca de conta no mesmo aparelho. Nunca pede permissão
// nem cria inscrição nova — quem desativou continua desativado.
export async function syncPush() {
  if (!isPushSupported() || Notification.permission !== "granted") return;
  try {
    const subscription = await getSubscription();
    if (subscription) {
      await api.post("/push/subscription", subscription.toJSON());
    }
  } catch {
    // silencioso: não trava o app por causa disso
  }
}

// No logout: desvincula o aparelho da conta no backend, mas mantém a
// inscrição do navegador para quem logar em seguida (syncPush). O token vai
// explícito porque o signOut já limpou o localStorage.
export async function detachPushFromAccount(token: string) {
  if (!isPushSupported()) return;
  try {
    const subscription = await getSubscription();
    if (!subscription) return;
    await api.delete("/push/subscription", {
      data: { endpoint: subscription.endpoint },
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // silencioso
  }
}
