export interface WishlistProduct {
  _id: string;
  title?: string;
  imageCover?: string;
  price?: number;
  priceAfterDiscount?: number;
  quantity?: number;
  category?: { name?: string } | null;
}
