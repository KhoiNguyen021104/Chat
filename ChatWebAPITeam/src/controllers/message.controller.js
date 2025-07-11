import { StatusCodes } from "http-status-codes";
import { messageService } from "~/services";

const create = async (req, res, next) => {
  try {
    const message = await messageService.create(req.body);
    return res.status(StatusCodes.CREATED).json(message);
  } catch (error) {
    next(error);
  }
};

const findOneById = async (req, res, next) => {
  try {
    const message = await messageService.findOneById(req.params.id);
    return res.status(StatusCodes.OK).json(message);
  } catch (error) {
    next(error);
  }
};

const findAllByConversationId = async (req, res, next) => {
  try {
    const messages = await messageService.findAllByConversationId(req.params.conversation_id, req.query.page);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};

// const findAllByUserId = async (req, res, next) => {
//   try {
//     const messages = await messageService.findAllByUserId(req.params.userId);
//     return res.status(StatusCodes.OK).json(messages);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateSeenAllMessageInOneConversation = async (req, res, next) => {
//   try {
//     const messages = await messageService.updateSeenAllMessageInOneConversation({
//       ...req.params,
//       ...req.body
//     });
//     return res.status(StatusCodes.OK).json(messages);
//   } catch (error) {
//     next(error);
//   }
// }

const update = async (req, res, next) => {
  try {
    const messages = await messageService.update(req.params.id, req.body);
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
}


// const uploadFile = async (req, res, next) => {
//   try {
//     const messages = await messageService.uploadFile(req.params.id, req.files);
//     return res.status(StatusCodes.OK).json(messages);
//   } catch (error) {
//     next(error);
//   }
// }


// const updateMessageFiles = async (req, res, next) => {
//   try {
//     const messages = await messageService.updateMessageFiles(req.params.id, req.body.files);
//     return res.status(StatusCodes.OK).json(messages);
//   } catch (error) {
//     next(error);
//   }
// }


const message = {
  create,
  findOneById,
  findAllByConversationId,
  // findAllByUserId,
  // updateSeenAllMessageInOneConversation,
  update,
  // uploadFile,
  // updateDeletedByMessage
};

export default message;