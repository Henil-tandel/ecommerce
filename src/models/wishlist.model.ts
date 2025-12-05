import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User from './users.model';
import Product from './product.model';

export interface IWishlist {
  wishlist_id: number;
  user_id: number;
  product_id: number;
}

class Wishlist extends Model<IWishlist> implements IWishlist {
  public wishlist_id!: number;
  public user_id!: number;
  public product_id!: number;
}

Wishlist.init(
  {
    wishlist_id: {
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
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'    
  }
);

// associations
User.hasMany(Wishlist, {
  foreignKey: 'user_id',
  as: 'wishlists',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Wishlist.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Product.hasMany(Wishlist, {
  foreignKey: 'product_id',
  as: 'wishlist_items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Wishlist.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Wishlist;
