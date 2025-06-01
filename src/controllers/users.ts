import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { TRequest } from "utils";
import User from "../models/user";
import { BadRequestError, NotFoundError } from "../errors";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new BadRequestError("Передан некорректный _id пользователя"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("Пользователь с указанным _id не найден"));
    }

    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении профиля"
        )
      );
    }
    return next(err);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const userId = (req as unknown as TRequest).user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new BadRequestError("Передан некорректный _id пользователя"));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Пользователь с указанным _id не найден"));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении профиля"
        )
      );
    }
    return next(err);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const userId = (req as unknown as TRequest).user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new BadRequestError("Передан некорректный _id пользователя"));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Пользователь с указанным _id не найден"));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении аватара"
        )
      );
    }
    return next(err);
  }
};
