import { DataTypes, Model } from "sequelize";
import { sequelize } from '../lib/db.utils'; 
import Product from "./product.model";

export interface IProductContent {
    id: number;
    product_id: number;
    description?: string;
    features: string[];
    specifications: string[];
    materials: string;
    dimensions: string;
    warranty: string;
    care_instructions?: string;
    images?: string[]
}

export class ProductContent extends Model<IProductContent> implements IProductContent {
    public id: number;
    public product_id: number;
    public description?: string;
    public features: string[];
    public specifications: string[];
    public materials: string;
    public dimensions: string;
    public warranty: string;
    public care_instructions?: string;
    public images?: string[];
}

ProductContent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references : {
        model: 'products',
        key: 'product_id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    materials: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    warranty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    care_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Product_content',
    tableName: "product_contents",
  }
);

ProductContent.belongsTo(Product, { foreignKey: 'product_id', as: 'product_content' , onUpdate: 'CASCADE' , onDelete: 'CASCADE' });
Product.hasMany(ProductContent, { foreignKey: 'product_id', as: 'contents' , onUpdate: 'CASCADE' , onDelete: 'CASCADE' });

export default ProductContent;

