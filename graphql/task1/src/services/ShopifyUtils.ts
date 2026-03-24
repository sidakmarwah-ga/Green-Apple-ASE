import axios from "axios";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import { SubjectType } from "../lib/Types";

const SHOP_NAME = process.env.SHOPIFY_STORE_NAME;
const API_VERSION = process.env.SHOPIFY_API_VERSION;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

export const shopInfo = {
  shopName: SHOP_NAME,
}

export const ShopifyGraphQL = async (query: string, variables?: any) => {
  try {

    const url = `https://${SHOP_NAME}.myshopify.com/admin/api/${API_VERSION}/graphql.json`;

    console.log(shopInfo);

    const response = await axios.post(
      url,
      {
        query,
        variables
      },
      {
        headers: {
          "X-Shopify-Access-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
        }
      }
    );

    if(response.data.errors) {
      console.log(JSON.stringify(response.data.errors));
      throw new AppError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Some error occured while fetching data.'
      );
    }

    return response.data;

  } catch(error: any) {

    console.log('Shopify Utils ShopifyGraphQL error', JSON.stringify(error));

    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Some error occured while fetching data.'
    );

  }
}

export const fetchShopifyDeletedSubjects = async (
  subjectType: SubjectType,
  createdAt: Date,
  endCursor: string | null = null
) => {
  const queryString = `
    query GetProducts($endCursor: String, $query: String) {
      events(query: $query,first: 250, after: $endCursor) {
        nodes {
          ... on BasicEvent {
            subjectId
          }
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
    query: `action:'destroy' AND subject_type:'${subjectType}' AND created_at:>='${createdAt.toUTCString()}'`
  }

  console.log(variables);
  
  const { data } = await ShopifyGraphQL(queryString, variables);

  return data;
}