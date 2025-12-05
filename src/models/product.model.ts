import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Category from './categorys.model';

export interface IProduct {
  product_id: number;
  name: string;
  slug?: string;
  description?: string;
  long_description?: string;
  effective_price?: number;
  stock?: number | null;
  product_SKU?: string;
  product_videos?: string[];
  images?: string[];
  ratings?: number;
  category_id: number;
  multiple_category?: number[];
  related_categories?: number[];
  status: 'active' | 'inactive' | 'deleted';
}

class Product extends Model<IProduct> implements IProduct {
  public product_id!: number;
  public name!: string;
  public slug?: string;
  public description?: string;
  public long_description?: string;
  public effective_price?: number;
  public stock?: number | null;
  public product_SKU?: string;
  public product_videos?: string[];
  public images?: string[];
  public ratings?: number;
  public category_id!: number;
  public multiple_category?: number[];
  public related_categories?: number[];
  public status!: 'active' | 'inactive' | 'deleted';
}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    long_description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    effective_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    product_SKU: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    product_videos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ratings: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    multiple_category: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    related_categories: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'    
  }
);

// Associations
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
  onDelete: 'CASCADE',
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
  onDelete: 'CASCADE',
});

export default Product;
