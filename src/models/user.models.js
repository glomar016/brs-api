"use strict";
const { Model } = require("sequelize");

const PROTECTED_ATTRIBUTES = ["password", "birth_date"]

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(User, {
        as: "createdBy",
        foreignKey: "created_by"
      });

      this.belongsTo(User, {
        as: "updatedBy",
        foreignKey: "updated_by"
      });
    }

    toJSON(){
      // return {...this.get(), password: undefined };
      const attributes = {...this.get()};

      for(const a of PROTECTED_ATTRIBUTES){
        delete attributes[a];
      }

      return attributes;
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First name should not be null." },
          notEmpty: { msg: "First Name should not be empty." },
        },

        // Uppercasing first name
        // get() {
        //   const rawValue = this.getDataValue('first_name');
        //   return rawValue ? rawValue.toUpperCase() : null;
        // },
      },
      middle_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Last name should not be null." },
          notEmpty: { msg: "Last Name should not be empty." },
        },
      },
      full_name: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue(
            "full_name",
            this.first_name + " " + this.middle_name + " " + this.last_name
          );
        }
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["Male", "Female"]],
            msg: "Gender should be Male or Female.",
          },
        },
      },
      civil_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
        unique: { msg: "Email must be unique." },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Active",
      },
      created_by: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: "id"
        }
      },
      updated_by: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: "id"
        }
      }
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "date_created",
      updatedAt: "date_updated",
      modelName: "User",
    }
  );
  return User;
};