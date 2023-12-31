// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c1ca0ed1b2b2974b81a0b080a7a2c7a4@o1145044.ingest.sentry.io/4505620667695104",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    // new Sentry.Replay({
    //   // Additional Replay configuration goes in here, for example:
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        "localhost",
        /^\//,
        /api/,
      ],
      // Add additional custom options here
    }),
    new Sentry.Replay({
      // Additional SDK configuration goes in here, for example:
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});

// if (process.env.OWNERKEY == 'Kobby') {
Sentry.setContext("character", {
  name: "Mighty Kobby's",
  attack_type: "melee",
  event: "auth",
  password: "rahh"
});
// }