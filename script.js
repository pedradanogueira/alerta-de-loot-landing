// Troque pelo ID real do Meta Pixel. Se ficar vazio, o Pixel não será carregado.
const META_PIXEL_ID = "";

const CLICK_ID_PARAMS = ["fbclid", "gclid", "msclkid", "ttclid"];
const CLICK_TRACKING_DELAY_MS = 200;

const CHANNEL_TRACKING = {
  WhatsApp: {
    customEvent: "Click_WhatsApp_Group",
    leadChannel: "whatsapp_group",
  },
  Telegram: {
    customEvent: "Click_Telegram",
    leadChannel: "telegram",
  },
  Facebook: {
    customEvent: "Click_Facebook",
    leadChannel: "facebook",
  },
  "X / Twitter": {
    customEvent: "Click_X",
    leadChannel: "x",
  },
};

function isPlaceholderUrl(url) {
  return /^[A-Z0-9_]+_URL$/.test(url) || url === "WHATSAPP_GROUP_URL";
}

function shouldKeepParam(paramName) {
  return paramName.startsWith("utm_") || CLICK_ID_PARAMS.includes(paramName);
}

function appendTrackingParams(rawUrl) {
  const cleanUrl = rawUrl.trim();

  if (!cleanUrl || isPlaceholderUrl(cleanUrl)) {
    return cleanUrl;
  }

  try {
    const targetUrl = new URL(cleanUrl, window.location.href);
    const currentParams = new URLSearchParams(window.location.search);

    currentParams.forEach((value, key) => {
      if (shouldKeepParam(key) && !targetUrl.searchParams.has(key)) {
        targetUrl.searchParams.set(key, value);
      }
    });

    return targetUrl.toString();
  } catch (error) {
    console.warn("[Alerta de Loot] Não foi possível preservar UTMs neste link:", cleanUrl);
    return cleanUrl;
  }
}

function initMetaPixel() {
  const pixelId = META_PIXEL_ID.trim();

  if (!pixelId) {
    return;
  }

  if (!window.fbq) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  }

  fbq("init", pixelId);
  fbq("track", "PageView");
}

function sendMetaClickEvents(channelName) {
  const trackingConfig = CHANNEL_TRACKING[channelName];

  if (!trackingConfig) {
    return;
  }

  const channel = trackingConfig.leadChannel;

  console.log("Click tracked:", channel);

  // Para testar: abra o console do navegador, clique em um botão e veja este log.
  // Com META_PIXEL_ID válido, use também a extensão Meta Pixel Helper para conferir os eventos.
  if (typeof window.fbq === "function" && META_PIXEL_ID.trim()) {
    fbq("trackCustom", trackingConfig.customEvent);
    fbq("track", "Lead", { channel });
  }
}

function trackChannelClick(channelName) {
  sendMetaClickEvents(channelName);
}

function redirectAfterTracking(button, url, event) {
  const opensNewTab = button.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey;
  const pendingWindow = opensNewTab ? window.open("about:blank", "_blank") : null;

  if (pendingWindow) {
    pendingWindow.opener = null;
  }

  window.setTimeout(() => {
    if (opensNewTab) {
      if (pendingWindow && !pendingWindow.closed) {
        pendingWindow.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }

      return;
    }

    window.location.href = url;
  }, CLICK_TRACKING_DELAY_MS);
}

function setupCtaButtons() {
  const buttons = document.querySelectorAll("[data-channel][data-url]");

  buttons.forEach((button) => {
    const rawUrl = (button.dataset.url || button.getAttribute("href") || "").trim();

    if (!rawUrl || isPlaceholderUrl(rawUrl)) {
      button.hidden = true;
      return;
    }

    button.href = appendTrackingParams(rawUrl);

    button.addEventListener("click", (event) => {
      const channelName = button.dataset.channel || button.textContent.trim();
      const targetUrl = button.href;
      event.preventDefault();

      trackChannelClick(channelName);
      redirectAfterTracking(button, targetUrl, event);
    });
  });
}

initMetaPixel();
document.addEventListener("DOMContentLoaded", setupCtaButtons);
