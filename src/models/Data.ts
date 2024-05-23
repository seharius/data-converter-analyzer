import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class Data extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
}

Data.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false
	},
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Data'
    });

    export default Data;
