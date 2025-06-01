import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { TRequest } from "utils";
import Card from "../models/card";
import { BadRequestError, NotFoundError } from "../errors";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate("owner");
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const owner = (req as unknown as TRequest).user?._id;

    if (!owner) {
      return next(
        new BadRequestError("Отсутствует идентификатор пользователя")
      );
    }

    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    return next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(new BadRequestError("Передан некорректный _id карточки"));
    }

    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      return next(new NotFoundError("Карточка с указанным _id не найдена"));
    }

    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = (req as unknown as TRequest).user?._id;

    if (!userId) {
      return next(
        new BadRequestError("Отсутствует идентификатор пользователя")
      );
    }

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(
        new BadRequestError("Переданы некорректные данные для постановки лайка")
      );
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Передан несуществующий _id карточки"));
    }

    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = (req as unknown as TRequest).user?._id;

    if (!userId) {
      return next(
        new BadRequestError("Отсутствует идентификатор пользователя")
      );
    }

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(
        new BadRequestError("Переданы некорректные данные для снятия лайка")
      );
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Передан несуществующий _id карточки"));
    }

    return res.send(card);
  } catch (err) {
    return next(err);
  }
};
