import { CatalogImage } from "../../../catalog-image";

export type CatalogGameVersionLocalization = {
  /**
   * The name of the game as of the version localization.
   */
  readonly gameName: string;

  /**
   * A blurb-like description of the game as of the version localization.
   */
  readonly gameDescription: string;

  /**
   * A square icon for the game as of the version localization.  May be cropped
   * to a circle.
   */
  readonly gameIcon: CatalogImage;

  /**
   * A background for the game in browsers.  Likely to be cropped to match the
   * display's aspect ratio.
   */
  readonly gameBackdrop: CatalogImage;

  /**
   * The name of the version.
   */
  readonly versionName: string;

  /**
   * A description of the changes in the version.
   */
  readonly versionDescription: string;

  /**
   * The code of the localization the version localization implements.
   */
  readonly localizationCode: string;

  /**
   * The second half of the URL for the version localization's WASM file.  Must
   * refer to an existing WASM file.
   */
  readonly wasmUrlSuffix: string;
};
