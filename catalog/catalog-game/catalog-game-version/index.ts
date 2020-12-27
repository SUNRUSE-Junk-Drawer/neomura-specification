import { CatalogGameVersionLocalization } from "./catalog-game-version-localization";

export { CatalogGameVersionLocalization } from "./catalog-game-version-localization";

/**
 * A version of a game within a catalog.
 */
export type CatalogGameVersion = {
  /**
   * Invariant identifier for the version.  Do not change.
   */
  readonly code: string;

  /**
   * The date on which the version was published.
   */
  readonly date: number;

  /**
   * The localizations of the game version.  Must not be empty.  Do not remove
   * records on update.
   */
  readonly versionLocalizations: ReadonlyArray<CatalogGameVersionLocalization>;
};
