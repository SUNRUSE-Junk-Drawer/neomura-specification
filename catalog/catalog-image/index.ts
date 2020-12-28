import { CatalogImageType } from "./catalog-image-type";

export { CatalogImageType } from "./catalog-image-type";

export type CatalogImage = {
  /**
   * The second half of the URL for the image.  Must refer to an existing PNG or
   * JPEG.
   */
  readonly urlSuffix: string;

  /**
   * The type of image content.
   */
  readonly type: CatalogImageType;
};
