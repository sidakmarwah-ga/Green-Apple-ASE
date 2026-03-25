import { BatchSizes } from "../lib/Constants";
import { SubjectType } from "../lib/Types";
import { fetchShopifyDeletedSubjects, ShopifyGraphQL } from "./ShopifyUtils";

export const getTotalVariantsCount = async (): Promise<number> => {
  const queryString = `
    query {
      productVariantsCount(limit: null) {
        count
        precision
      }
    }
  `;
  
  const { data } = await ShopifyGraphQL(queryString);

  return data.productVariantsCount.count;
}

export const fetchShopifyVariants = async (
  endCursor: string | null = null,
  query: string | null = null,
  batchSize: number = BatchSizes.full
) => {
  const queryString = `
    query GetProductVariants($batchSize: Int!, $endCursor: String, $query: String) {
      productVariants(first: $batchSize, after: $endCursor, query: $query) {
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
    batchSize,
    endCursor,
    query
  }

  // console.log(variables);
  
  const { data } = await ShopifyGraphQL(queryString, variables);

  return data;
}

export const fetchShopifyDeletedVariants = async (
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