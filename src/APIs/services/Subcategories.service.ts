import type { Category } from "@/app/_types/ProductType/ProductType";

import {
  SubCategory,
  SubCategoriesResponse,
} from "./../../app/_types/SubCategoryType/SubCategoryType";
import { log } from "console";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

// بيرجع الكاتيجوري نفسها (عشان الاسم والصورة في الهيدر)
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const res = await fetch(`${BASE_URL}/categories/${id}`);
    if (!res.ok) return null;
    const data: { data: Category } = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

// بيجيب كل الـ subcategories وبيفلتر اللي تبع الكاتيجوري دي
export async function getSubCategoriesByCategory(
  categoryId: string,
): Promise<SubCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/subcategories?limit=100`);
    if (!res.ok) return [];
    const data: SubCategoriesResponse = await res.json();
    return data.data.filter((sub) => sub.category === categoryId);
  } catch {
    return [];
  }
}

export async function getAllSubCategories() {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/subcategories`,
    );
    const data = await res.json();
    console.log(data.data);
  } catch (err) {
    return [];
  }
}

export async function getAllCategories(): Promise<Category[] | []> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories`,
      { cache: "force-cache" },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return [];
  }
}
