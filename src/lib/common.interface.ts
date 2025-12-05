import { Request } from 'express';
import { MulterError } from 'multer';
import { IUser } from '../models/users.model';
import { IAdminUser } from '../models/admin.model';


// ---------- Generic Search Interface ----------
export interface ISearch {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  country?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  category_id?: number;
  product_id?: number;
  stock?: number;
  name?: string;
  order?: 'ASC' | 'DESC';
}

// ---------- Extended Express Request Interface ----------
export interface IRequest extends Request {
  user?: IUser;
  admin?: IAdminUser;
  userId?: number;
  token: string

  product_id?: number;
  category_id?: number;

  file?: Express.Multer.File;
  files?: { [key: string]: Express.Multer.File[] };
  fileValidationError?: MulterError;

  params: {
    product_id?: number;
    category_id?: number;
    id?: string;
    [key: string]: any;
  };

  query: {
    category_id?: number;
    [key: string]: any;
  };

  body: {
    // Product
    name?: string;
    slug?: string;
    description?: string;
    long_description?: string;
    effective_price?: number;
    stock?: number;
    product_SKU?: string;
    product_videos?: string[];
    images?: string[];
    multiple_category?: number[];
    related_categories?: number[];
    status?: 'active' | 'inactive' | 'deleted';

    // Filters
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    is_featured?: boolean;
    is_best_seller?: boolean;

    // Extra dynamic
    [key: string]: any;
  };
}


// ---------- Mixed Type Interface ----------
export interface IRequestMixedValues extends IRequest {
  body: IRequest['body'] & {
    [key: string]: string | boolean | string[] | number | undefined;
  };
}

// ---------- Address Object (Used in Orders / Profiles) ----------
export interface Address {
  personName: string;
  phoneNumber: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}
