import { StatusCodes } from "http-status-codes";
import { conversationService } from "~/services";

const create = async (req, res, next) => {
  try {
    let data = req.body
    const group = JSON.parse(req.body.group_info)
    if (Object.keys(group).length > 0) {
      data = group
    }
    const conversation = await conversationService.create(data, req.file);
    res.status(StatusCodes.CREATED).json(conversation);
  } catch (error) {
    next(error);
  }
};

const findOneById = async (req, res, next) => {
  try {
    const conversation = await conversationService.findOneById(req.params.id);
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

const findAllByUserId = async (req, res, next) => {
  try {
    const conversation = await conversationService.findAllByUserId(req.params.user_id, req.query.page);
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const resUpdated = await conversationService.update(req.params.id, req.body);
    const message = resUpdated ? 'Updated successfully' : 'Updated failed'
    return res.status(StatusCodes.OK).json({ message });
  } catch (error) {
    next(error);
  }
}

const conversation = {
  create,
  findOneById,
  findAllByUserId,
  update
};

export default conversation