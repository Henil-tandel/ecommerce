import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Product from './product.model';
import User from './users.model';

export interface IReview {
  review_id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
}

class Review extends Model<IReview> implements IReview {
  public review_id!: number;
  public user_id!: number;
  public product_id!: number;
  public rating!: number;
  public comment?: string;
}

Review.init(
  {
    review_id: {
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
    rating: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
  }
);

// associations
Review.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'CASCADE',
});

Product.hasMany(Review, {
  foreignKey: 'product_id',
  as: 'reviews',
  onDelete: 'CASCADE',
});

Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

export default Review;
