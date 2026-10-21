
import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

import type {
  Money,
  TransactionStatus,
  TransactionType,
} from "../../../domain/entities/Transaction.js";

import { WalletModel } from "./WalletModel.js";
import { sequelize } from "../../config/db.js";

export interface TransactionPersistence {
  id: number;
  transactionId: string;
  idempotencyKey: string;
  type: TransactionType;
  status: TransactionStatus;
  fromWalletId: number | null;
  toWalletId: number | null;
  amount: number;
  currency: string;
  originalAmount: Money | null;
  exchangeRate: number | null;
  createdAt: Date;
  updatedAt: Date;
}

class TransactionModel extends Model<
  InferAttributes<TransactionModel>,
  InferCreationAttributes<TransactionModel>
> {
  declare id: CreationOptional<number>;
  declare transactionId: string;
  declare idempotencyKey: string;
  declare type: TransactionType;
  declare status: CreationOptional<TransactionStatus>;
  declare fromWalletId: number | null;
  declare toWalletId: number | null;
  declare amount: number;
  declare currency: string;
  declare originalAmount: Money | null;
  declare exchangeRate: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TransactionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    idempotencyKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.ENUM("deposit", "withdrawal", "transfer"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "completed",
        "failed",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    fromWalletId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: WalletModel,
        key: "id",
      },
    },

    toWalletId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: WalletModel,
        key: "id",
      },
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      set(value: string) {
        this.setDataValue("currency", value.trim().toUpperCase());
      },
    },

    originalAmount: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },

    exchangeRate: {
      type: DataTypes.DECIMAL(15, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 0,
      },
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Transactions",
    timestamps: true,
  },
);

export { TransactionModel };
