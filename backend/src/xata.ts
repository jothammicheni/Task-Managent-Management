// xata.ts

import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
  BaseSchema,
} from  "@xata.io/client";
import dotenv from 'dotenv';

dotenv.config();

// Define tables 
const tables: readonly BaseSchema[] = [
  {
    name: 'users',
    columns: [
      { name: 'userId', type: 'number '},
      { name: 'email', type: 'string' },
      { name: 'password', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'role', type: 'string'} 

    ],
  },
  {
    name: 'products',
    columns: [
      // Define product columns here
      { name: 'productName', type: 'string' },
      { name: 'price', type: 'number' },
      // Add more product-specific fields as needed
    ]
  }
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

// Define the database schema
export type UserRecord = XataRecord & {
  userId:number;
  email: string;
  password: string;
  name: string;
  role:string;
};

export type ProductRecord = XataRecord & {
  productName: string;
  price: number;
  // Add more fields as necessary
};

export type DatabaseSchema = {
  users: UserRecord;
  products: ProductRecord; // Ensure products are included in the schema
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: process.env.DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH,
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
