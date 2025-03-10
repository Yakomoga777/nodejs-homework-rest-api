const { addSchema, addStatusSchema } = require("../models/contact");
const { HttpError } = require("../helpers");

const {
  listContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService,
  // getContactsByFavoriteService,
} = require("../services/contactsServices");

const getListContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const findParams = { owner, favorite };

  try {
    console.log(req.query);
    const result = await listContactsService(findParams, " ", {
      skip,
      limit,
      favorite,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await getContactByIdService(contactId);

    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};
const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;

  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const result = await addContactService({ ...req.body, owner });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const { error } = addSchema.validate(req.body);

    if (error) {
      throw new HttpError(400, "missing fields");
    }

    const result = await updateContactService(contactId, req.body);

    if (!result) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = addStatusSchema.validate(req.body);

    if (error) {
      throw new HttpError(400, "missing fields");
    }

    const result = await updateContactService(contactId, req.body);

    if (!result) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await removeContactService(contactId);

    if (!result) {
      throw new HttpError(404, "Not found");
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getListContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
