import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Product from './product.model';

export interface IVariant {
  id: number;
  product_id: number;
  label: string;
  stock: number;
  variant_SKU?: string;
  images?: string[];
  base_price: number,
  pricing?: {
    currency: string;
    symbol: string;
    price: number;
    discount: number;
    discounted_price: number;
  }[];
}

class Variant extends Model<IVariant> implements IVariant {
  public id!: number;
  public product_id!: number;
  public label!: string;
  public stock!: number;
  public variant_SKU?: string;
  public images?: string[];
  public  base_price: number;
  public pricing?: {
    currency: string;
    symbol: string;
    price: number;
    discount: number;
    discounted_price: number;
  }[];
}

Variant.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    label: {
      type: DataTypes.STRING(100),
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    variant_SKU: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    base_price: {
      type: DataTypes.INTEGER
    },
    pricing: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        'Array of pricing objects: [{currency, symbol, price, discount, discounted_price}]',
    },
  },
  {
    sequelize,
    modelName: 'Variant',
    tableName: 'variants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

// 🔗 Association with Product
Product.hasMany(Variant, {
  foreignKey: 'product_id',
  as: 'variants',
  onDelete: 'CASCADE',
});

Variant.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'CASCADE',
});

export default Variant;
