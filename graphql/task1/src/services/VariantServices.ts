import { SubjectType } from "../lib/Types";
import { fetchShopifyDeletedSubjects, ShopifyGraphQL } from "./ShopifyUtils";

export const fetchShopifyVariants = async (
  endCursor: string | null = null,
  query: string | null = null
) => {
  const queryString = `
    query GetProductVariants($endCursor: String, $query: String) {
      productVariants(first: 250, after: $endCursor, query: $query) {
        nodes {
          id
          sku
          product {
            id
          }
          title
          displayName
          price
          inventoryQuantity
          createdAt
          updatedAt
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables = {
    endCursor,
    query
  }

  console.log(variables);
  
  const { data } = await ShopifyGraphQL(queryString, variables);

  return data;
}

export const fetchShopifyDeletedVarinats = async (
  deletedAfter: Date,
  endCursor: string | null = null
) => {
  const deletedProductsData = await fetchShopifyDeletedSubjects(
    SubjectType.PRODUCT_VARIANT,
    deletedAfter,
    endCursor
  );
  return deletedProductsData;
}