"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { publicConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

export function Analytics() {
  const pathname = usePathname();
  const useTagManager = Boolean(publicConfig.gtmId);
  const directGa4Id = useTagManager ? null : publicConfig.ga4Id;

  useEffect(() => {
    if (!publicConfig.gtmId && !directGa4Id) return;
    const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
    analyticsWindow.dataLayer ??= [];
    trackEvent("page_view", { page_path: pathname });
  }, [directGa4Id, pathname]);

  return (
    <>
      {publicConfig.gtmId && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${publicConfig.gtmId}');`}
          </Script>
          <noscript><iframe title="Google Tag Manager" src={`https://www.googletagmanager.com/ns.html?id=${publicConfig.gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        </>
      )}
      {directGa4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${directGa4Id}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${directGa4Id}',{send_page_view:false});`}
          </Script>
        </>
      )}
    </>
  );
}
