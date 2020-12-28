import { CatalogGame } from "./catalog-game";
import { CatalogLocalization } from "./catalog-localization";

export {
  CatalogGameVersionLocalization,
  CatalogGameVersion,
  CatalogGame,
} from "./catalog-game";

export { CatalogImage } from "./catalog-image";

export { CatalogLocalization } from "./catalog-localization";

/**
 * Describes a catalog of versioned, localized Neomura games.
 */
export type Catalog = {
  /**
   * The first half of all URLs in the catalog.
   */
  readonly urlPrefix: string;

  /**
   * All localizations supported by games in the catalog.  Must not be empty.
   * Do not remove records on update.
   */
  readonly localizations: ReadonlyArray<CatalogLocalization>;

  /**
   * All games within the catalog.  Must not be empty.  Do not remove records on
   * update.
   */
  readonly games: ReadonlyArray<CatalogGame>;
};
