
export async function copyToClipboard(text: string) {
  // Try native clipboard first
  try {
    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return { success: true, method: "clipboard-api" };
    }
  } catch (err) {
    // clipboard API blocked (NotAllowedError) — fall through to execCommand
    console.warn("navigator.clipboard.writeText failed:", err);
  }

  // Fallback using textarea + execCommand (works in many restricted contexts)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // avoid scrolling to bottom
    textarea.style.left = "-9999px";
    textarea.setAttribute("aria-hidden", "true");
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (successful) {
      return { success: true, method: "execCommand" };
    } else {
      return { success: false, error: new Error("execCommand copy failed") };
    }
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return { success: false, error: err };
  }
}

    