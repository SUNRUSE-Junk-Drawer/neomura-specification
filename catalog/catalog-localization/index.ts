import { CatalogImage } from "../catalog-image";

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
   * The square icon used to represent the localization.  May be cropped to a
   * circle.
   */
  readonly icon: CatalogImage;
};
