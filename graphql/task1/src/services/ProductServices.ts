import { BatchSizes } from "../lib/Constants";
import { SubjectType } from "../lib/Types";
import { fetchShopifyDeletedSubjects, ShopifyGraphQL } from "./ShopifyUtils";

export const getTotalProductsCount = async (): Promise<number> => {
  const queryString = `
    query {
      productsCount {
        count
        precision
      }
    }
  `;
  
  const { data } = await ShopifyGraphQL(queryString);

  return data.productsCount.count;
}

export const fetchShopifyProducts = async (
  endCursor: string | null = null,
  query: string | null = null,
  batchSize: number = BatchSizes.full
) => {
  const queryString = `
    query GetProducts($batchSize: Int!, $endCursor: String, $query: String) {
      products(first: $batchSize, after: $endCursor, query: $query) {
        nodes {
          id
          title
          tags
          productType
          category {
            id
            name
          }
          status
          vendor
          publishedAt
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

export const fetchShopifyDeletedProducts = async (
  deletedAfter: Date,
  endCursor: string | null = null
) => {
  const deletedProductsData = await fetchShopifyDeletedSubjects(
    SubjectType.PRODUCT,
    deletedAfter,
    endCursor
  );
  return deletedProductsData;
}