// Marketing asset paths — swap images by changing these paths only.
// Place your images in /public/images/ and update the paths below.
// If an asset is missing, components will render a tasteful gradient fallback.

export const marketingAssets = {
  /** Littlebird anime watercolor foliage landscape — used as the hero section background */
  heroBackground: "/images/hero-bg.jpg",
  /** Yosemite misty valley — used as the features section atmospheric background */
  featureBackground: "/images/feature-background.webp",
  /** Sunlit anime sky and window frame — used as the final CTA section background */
  ctaBackground: "/images/cta-banner-sunlit.jpg",
  /** Snowy mountain peaks — available for additional section use */
  dividerBackground: "/images/divider-background.webp",
} as const;

export type MarketingAssetKey = keyof typeof marketingAssets;
