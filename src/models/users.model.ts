import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import bcrypt from 'bcryptjs'

export interface IUser {
  userid: number;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  status: 'active' | 'inactive' | 'deleted';
  avatar_url?: string;
  avatar_id?: string;
}

class User extends Model<IUser> implements IUser {
  public userid!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public mobile?: string;
  public state?: string;
  public country?: string;
  public zip_code?: string;
  public status!: 'active' | 'inactive' | 'deleted';
  public avatar_url?: string;
  public avatar_id?: string;
}

const saltRounds = 10;

User.init(
  {
    userid: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      set(this: User, value: string) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      set(this: User, value: string) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hashedPassword);
      },
    },
    mobile: {
      type: DataTypes.STRING(15),
    },
    state: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
    },
    zip_code: {
      type: DataTypes.STRING(10),
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active',
    },
    avatar_url: {
      type: DataTypes.STRING(255),
    },
    avatar_id: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', 
  }
);

export default User;
