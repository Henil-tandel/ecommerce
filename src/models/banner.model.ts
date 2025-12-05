import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IBanner {
  banner_id: number;
  title: string;
  subtitle?: string;
  description?: string;
  desktop_image_url: string;
  mobile_image_url: string;
}

class Banner extends Model<IBanner> implements IBanner {
  public banner_id!: number;
  public title!: string;
  public subtitle?: string;
  public description?: string;
  public desktop_image_url!: string;
  public mobile_image_url!: string;
}

Banner.init(
  {
    banner_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    desktop_image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    mobile_image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Banner',
    tableName: 'banners',
    timestamps: true,
  }
);

export default Banner;
