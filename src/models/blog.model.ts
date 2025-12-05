import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IBlogs {
    blog_id: number,
    title: string;
    content: string;
    image_url: string;
    image_id?: string
}

class Blogs extends Model<IBlogs> implements IBlogs {
    public blog_id!: number;
    public title!: string;
    public content!: string;
    public image_url!: string;
    public image_id?: string;
}

Blogs.init({
    blog_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement:true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    image_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    sequelize,
    modelName: 'Blogs',
    tableName: 'blogs'
})

export default Blogs;