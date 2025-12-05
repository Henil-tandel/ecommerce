import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User from './users.model';

export interface IUserAddress {
  id: number;
  user_id: number;
  full_name: string;
  mobile: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  is_default: boolean;
}

class UserAddress extends Model<IUserAddress> implements IUserAddress {
  public id!: number;
  public user_id!: number;
  public full_name!: string;
  public mobile!: string;
  public address_line1!: string;
  public address_line2?: string;
  public city!: string;
  public state!: string;
  public country!: string;
  public zip_code!: string;
  public is_default!: boolean;
}

UserAddress.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    address_line1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line2: {
      type: DataTypes.STRING(255),
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'user_addresses',
    timestamps: false,
  }
);

User.hasMany(UserAddress, {
  foreignKey: 'user_id',
  as: 'addresses',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
UserAddress.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default UserAddress;
