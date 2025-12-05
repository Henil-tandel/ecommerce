import Joi from 'joi';
import * as Utils from '../lib/utils';

// Import types for accurate typing
import { Request, Response, NextFunction } from 'express';

export interface IAdminLoginData {
  email: string;
  password: string;
}

export interface ICreateCategory {
  name: string;
  description: string;
}

export interface IUpdateCategory {
  name: string;
  description: string;
}

export interface ICreateProduct {
  name: string;
  slug?: string;
  description: string;
  long_description?: string;
  original_price?: number;
  discount?: number;
  effective_price?: number;
  stock?: number | null;
  productSKU?: string;
  ratings?: number;
  salesCount?: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isVariantBased?: boolean;
  category_id: number;
  multipleCategory?: number[];
  relatedCategories?: number[];
  status: 'active' | 'inactive' | 'deleted';
}

export interface IUpdateProduct {
  name: string;
  slug?: string;
  description: string;
  longDescription?: string;
  original_price?: number;
  discount?: number;
  effective_price?: number;
  stock?: number | null;
  productSKU?: string;
  ratings?: number;
  salesCount?: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isVariantBased?: boolean;
  category_id: number;
  multipleCategory?: number[];
  relatedCategories?: number[];
  status: 'active' | 'inactive' | 'deleted';
}

export interface ICreateBlog {
  title: string;
  content: string
}

export interface IUpdateBlog {
  title: string;
  content: string
}

export interface ICreateBanner {
  title: string;
  subtitle?: string;
  description?: string
}

export interface IUpdateBanner {
  title: string;
  subtitle?: string;
  description?: string
}

export interface IVariant {
  product_id: number;
  label: string;
  stock: number;
  variantSKU?: string;
  pricing?: {
    currency?: string;
    symbol?: string;
    price: number
    discount?: number;
    discountedPrice: number
  }
}

export interface ForgotPasswordData {
  email?: string;
  country_code?: string;
  phone_number?: string;
}

export interface VerifyOtpData {
  mobile: string;
  otp: string;
}

export interface ChangePasswordData {
  oldPassword?: string;
  newPassword?: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface IUserRegisterData {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  state?: string;
  country?: string;
  zip_code?: string;
}


export interface IUserAddress {
  full_name: string;
  address_line1: string,
  address_line2: string,
  zip_code: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean
}


export interface IUserLogindata {
  email: string,
  password: string
}


interface ValidationMiddleware {
  validate: (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => void;
  schema: {
    AdminLogin: Joi.ObjectSchema;
    CreateCategory: Joi.ObjectSchema;
    UpdateCategory: Joi.ObjectSchema;
    CreateProduct: Joi.ObjectSchema;
    CreateBlog: Joi.ObjectSchema;
    UpdateBlog: Joi.ObjectSchema;
    CreateBanner: Joi.ObjectSchema,
    UpdateBanner: Joi.ObjectSchema,
    UpdateProduct: Joi.ObjectSchema;
    ForgotPassword: Joi.ObjectSchema;
    VerifyOtp: Joi.ObjectSchema;
    ResendOtp: Joi.ObjectSchema;
    ResetPassword: Joi.ObjectSchema;
    UserRegister: Joi.ObjectSchema;
    UpdateProfile: Joi.ObjectSchema;
    UserLogin: Joi.ObjectSchema;
    ChangePassword: Joi.ObjectSchema;
    UserAddress: Joi.ObjectSchema;
  };
}

const validationMiddleware: ValidationMiddleware = {
  validate: (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!schema) {
        return next();
      }

      const validationOptions = {
        errors: {
          wrap: { label: '' },
        },
        abortEarly: false,
      };

      const data: Record<string, unknown> =
        req.method === 'GET'
          ? (req.query as Record<string, unknown>)
          : (req.body as Record<string, unknown>);

      (schema as Joi.ObjectSchema<unknown>)
        .validateAsync(data, validationOptions)
        .then((result) => {
          req.body = result as Record<string, unknown>;
          next();
        })
        .catch((error) => {
          if (error instanceof Joi.ValidationError) {
            res
              .status(Utils.statusCode.UNPROCESSABLE_ENTITY)
              .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
          } else {
            next(error);
          }
        });
    };
  },
  schema: {
    AdminLogin: Joi.object<IAdminLoginData>().keys({
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().min(6).required(),
    }),
    CreateCategory: Joi.object<ICreateCategory>().keys({
      name: Joi.string().required(),
      description: Joi.string()
    }),
    UpdateCategory: Joi.object<IUpdateCategory>().keys({
      name: Joi.string(),
      description: Joi.string()
    }),
    CreateProduct: Joi.object<ICreateProduct>().keys({
      name: Joi.string().trim().required(),
      description: Joi.string().required(),
      long_description: Joi.string(),
      original_price: Joi.number(),
      discount: Joi.number(),
      effective_price: Joi.number(),
      stock: Joi.number().required(),
      productSKU: Joi.string(),
      ratings: Joi.number(),
      salesCount: Joi.number(),
      isBestSeller: Joi.boolean(),
      isFeatured: Joi.boolean(),
      isVariantBased: Joi.boolean(),
      category_id: Joi.number().required(),
      multipleCategory: Joi.array().default([]),
      relatedCategories: Joi.array(),
      status: Joi.string().valid('active', 'inactive', 'deleted').default('active')
    }),
    UpdateProduct: Joi.object<IUpdateProduct>().keys({
      name: Joi.string().trim(),
      description: Joi.string(),
      longDescription: Joi.string(),
      original_price: Joi.number(),
      discount: Joi.number(),
      effective_price: Joi.number(),
      stock: Joi.number(),
      productSKU: Joi.string(),
      ratings: Joi.number(),
      salesCount: Joi.number(),
      isBestSeller: Joi.boolean(),
      isFeatured: Joi.boolean(),
      isVariantBased: Joi.boolean(),
      category_id: Joi.number(),
      multipleCategory: Joi.array(),
      relatedCategories: Joi.array(),
      status: Joi.string().valid('active', 'inactive', 'deleted').default('active')
    }),
    CreateBlog: Joi.object<ICreateBlog>().keys({
      title: Joi.string().required(),
      content: Joi.string().required()
    }),
    UpdateBlog: Joi.object<IUpdateBlog>().keys({
      title: Joi.string(),
      content: Joi.string()
    }),    
    CreateBanner: Joi.object<ICreateBanner>().keys({
      title: Joi.string().required(),
      subtitle: Joi.string(),
      description: Joi.string()
    }),
    UpdateBanner: Joi.object<IUpdateBanner>().keys({
      title: Joi.string(),
      subtitle: Joi.string(),
      description: Joi.string()
    }),
    ForgotPassword: Joi.object<ForgotPasswordData>().keys({
      email: Joi.string().trim().lowercase().email().required(),
    }),
    VerifyOtp: Joi.object<VerifyOtpData>().keys({
      mobile: Joi.string().required(),
      otp: Joi.string().trim().required(),
    }),
    ResendOtp: Joi.object<VerifyOtpData>().keys({
      mobile: Joi.string().required(),
    }),
    ResetPassword: Joi.object<ResetPasswordData>().keys({
      password: Joi.string().min(6).required(),
    }),
    UserRegister: Joi.object<IUserRegisterData>().keys({
      name: Joi.string(),
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().required(),
      mobile: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zip_code: Joi.string().optional(),
    }),
    ChangePassword: Joi.object<ChangePasswordData>().keys({
      oldPassword: Joi.string().min(6).required(),
      newPassword: Joi.string().min(6).required(),
    }),
    UserLogin: Joi.object<IUserLogindata>().keys({
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().required()
    }),
    UserAddress: Joi.object<IUserAddress>().keys({
      full_name: Joi.string(),
      address_line1: Joi.string(),
      address_line2: Joi.string(),
      zip_code: Joi.string(),
      mobile: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      is_default: Joi.boolean()
    }),
    UpdateProfile: undefined,
  },
};

export default validationMiddleware;
