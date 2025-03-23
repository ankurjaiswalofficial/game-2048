import Script from 'next/script';
import React from 'react';

function GoogleAnalytics() {
    const gTagId = process.env.GTAG_ID ?? "";

    return (
        <>
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${gTagId}`}
                strategy="afterInteractive"
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gTagId}');
                    `,
                }}
            />
        </>
    );
}

export default GoogleAnalytics;
