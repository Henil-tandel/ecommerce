import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IOtp {
  id: number;
  email: string;
  otp_hash: string;
  expires_at: Date;
  verified: boolean;
  created_at: Date;
}

class Otp extends Model<IOtp> implements IOtp {
  public id!: number;
  public email!: string;
  public otp_hash!: string;
  public expires_at!: Date;
  public verified!: boolean;
  public created_at!: Date;
}

const saltRounds = 10;

Otp.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    otp_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Otp',
    tableName: 'otp_codes',
    timestamps: false,
  }
);

export default Otp;
