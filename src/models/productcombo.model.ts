import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Product from './product.model';

class Combo extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public details!: string[];
  public stock!: number;
  public images!: string[];
  public items!: number[];
  Products: any;
}

Combo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'product_combos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'    
  }
);

Combo.belongsToMany(Product, {
  through: 'ComboProducts',
  foreignKey: 'combo_id',
  otherKey: 'product_id',
});
Product.belongsToMany(Combo, {
  through: 'ComboProducts',
  foreignKey: 'product_id',
  otherKey: 'combo_id',
});

export { Combo };
export default Combo;
