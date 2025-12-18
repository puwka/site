"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentConfig = {
  consentEnabled: boolean;
  consentLabelPrefix: string;
  consentLinkText: string;
  consentLinkHref: string;
};

const defaultConsentConfig: ConsentConfig = {
  consentEnabled: true,
  consentLabelPrefix: "Я соглашаюсь на обработку персональных данных и принимаю",
  consentLinkText: "политику конфиденциальности",
  consentLinkHref: "/privacy",
};

export default function ConsentCheckbox() {
  const [config, setConfig] = useState<ConsentConfig | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/page-texts?key=docs_config", {
          cache: "no-store",
        });
        if (!res.ok) {
          if (isMounted) setConfig(defaultConsentConfig);
          return;
        }
        const data = await res.json();
        if (!isMounted) return;
        if (typeof data.text === "string" && data.text.trim().length > 0) {
          try {
            const parsed = JSON.parse(data.text);
            const next: ConsentConfig = {
              consentEnabled:
                typeof parsed.consentEnabled === "boolean"
                  ? parsed.consentEnabled
                  : defaultConsentConfig.consentEnabled,
              consentLabelPrefix:
                typeof parsed.consentLabelPrefix === "string" && parsed.consentLabelPrefix.trim()
                  ? parsed.consentLabelPrefix
                  : defaultConsentConfig.consentLabelPrefix,
              consentLinkText:
                typeof parsed.consentLinkText === "string" && parsed.consentLinkText.trim()
                  ? parsed.consentLinkText
                  : defaultConsentConfig.consentLinkText,
              consentLinkHref:
                typeof parsed.consentLinkHref === "string" && parsed.consentLinkHref.trim()
                  ? parsed.consentLinkHref
                  : defaultConsentConfig.consentLinkHref,
            };
            setConfig(next);
          } catch {
            setConfig(defaultConsentConfig);
          }
        } else {
          setConfig(defaultConsentConfig);
        }
      } catch {
        if (isMounted) setConfig(defaultConsentConfig);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!config || !config.consentEnabled) {
    return null;
  }

  return (
    <label className="group mt-1 flex items-start gap-3 rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 text-[11px] leading-snug text-muted-foreground">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          required
          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-zinc-400/60 bg-background outline-none transition-colors
                     checked:border-[oklch(0.75_0.18_50)] checked:bg-[oklch(0.75_0.18_50)]
                     group-hover:border-[oklch(0.75_0.18_50)] focus-visible:ring-2 focus-visible:ring-[oklch(0.75_0.18_50)]/60 focus-visible:ring-offset-0"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute h-3 w-3 text-black opacity-0 transition-opacity peer-checked:opacity-100"
        >
          <polyline
            points="3.5 8.5 6.5 11.5 12.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="pt-0.5">
        <span className="text-[11px] text-muted-foreground">
          {config.consentLabelPrefix}{" "}
        </span>
        <Link
          href={config.consentLinkHref || "/privacy"}
          target="_blank"
          className="inline-flex items-center text-[11px] font-medium text-[oklch(0.75_0.18_50)] underline-offset-2 hover:text-[oklch(0.7_0.18_50)] hover:underline"
        >
          {config.consentLinkText || "политику конфиденциальности"}
        </Link>
        <span className="text-[11px] text-muted-foreground">.</span>
      </span>
    </label>
  );
}


