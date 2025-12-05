import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface ICategory {
  id: number;
  name: string;
  category_url?: string;
  category_code?: string;
}

class Category extends Model<ICategory> implements ICategory {
  public id!: number;
  public name!: string;
  public category_url?: string;
  public category_code?: string;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false,
  }
);

export default Category;
