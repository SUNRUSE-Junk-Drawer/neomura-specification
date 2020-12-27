/**
 * A localization of a catalog.
 */
export type CatalogLocalization = {
  /**
   * Invariant identifier for the localization.  Do not change.
   */
  readonly code: string;

  /**
   * The name of the localization, in its own language, for display to the user
   * in a menu.
   */
  readonly uiName: string;

  /**
   * The second half of the URL for the localization's icon.  Must refer to an
   * existing PNG or JPEG.
   */
  readonly iconUrlSuffix: string;
};
