export type CatalogGameVersionLocalization = {
  /**
   * The name of the game as of the version localization.
   */
  readonly gameName: string;

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
