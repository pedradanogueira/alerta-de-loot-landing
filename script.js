const CLICK_ID_PARAMS = ["fbclid", "gclid", "msclkid", "ttclid"];

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

function trackChannelClick(channelName) {
  console.log(`[Alerta de Loot] Clique no canal: ${channelName}`);

  // Futuro ponto de integração:
  // Meta Pixel, Google Analytics, Google Tag Manager ou outra ferramenta podem ser chamados aqui.
}

function setupCtaButtons() {
  const buttons = document.querySelectorAll("[data-channel][data-url]");

  buttons.forEach((button) => {
    const rawUrl = (button.dataset.url || button.getAttribute("href") || "").trim();

    if (!rawUrl) {
      button.hidden = true;
      return;
    }

    button.href = appendTrackingParams(rawUrl);

    button.addEventListener("click", (event) => {
      const channelName = button.dataset.channel || button.textContent.trim();
      trackChannelClick(channelName);

      if (isPlaceholderUrl(rawUrl)) {
        event.preventDefault();
        console.warn(`[Alerta de Loot] Troque o placeholder ${rawUrl} pelo link real antes de publicar.`);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", setupCtaButtons);
