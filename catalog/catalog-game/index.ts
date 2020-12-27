import { CatalogGameVersion } from "./catalog-game-version";

export {
  CatalogGameVersionLocalization,
  CatalogGameVersion,
} from "./catalog-game-version";

/**
 * A game within a catalog.
 */
export type CatalogGame = {
  /**
   * The versions of the game.  Must not be empty.  Do not remove records on
   * update.
   */
  readonly versions: ReadonlyArray<CatalogGameVersion>;
};
