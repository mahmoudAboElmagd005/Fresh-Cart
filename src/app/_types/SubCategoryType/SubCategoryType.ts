export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string; // id بتاع الكاتيجوري الأب
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoriesResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: SubCategory[];
}
