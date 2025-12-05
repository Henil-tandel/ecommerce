import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User from './users.model';
import Product from './product.model';

export interface ICart {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
}

class Cart extends Model<ICart> implements ICart {
  public cart_id!: number;
  public user_id!: number;
  public product_id!: number;
  public quantity!: number;
    Product: any;
}

Cart.init(
  {
    cart_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'    
  }
);

User.hasMany(Cart, { foreignKey: 'user_id', as: 'cart_items' });
Cart.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(Cart, { foreignKey: 'product_id', as: 'in_cart' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });

export default Cart;
