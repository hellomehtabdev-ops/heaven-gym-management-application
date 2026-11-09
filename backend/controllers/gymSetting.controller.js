import GymSettings from '../models/gymSetting.model.js';
import { ApiError } from '../utils/errors.utils.js';

const allowedFields = [
  'gym_name',
  'contact_phone',
  'contact_email',
  'address',
  'membership_advance_amount',
  'low_stock_threshold',
];

function validateAndNormalizeSettings(body = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(400, 'Invalid gym settings payload');
  }

  const update = {};
  for (const field of allowedFields) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;
    const value = body[field];

    if (['gym_name', 'contact_phone', 'contact_email', 'address'].includes(field)) {
      if (typeof value !== 'string') throw new ApiError(400, `Invalid ${field}`);
      const normalized = value.trim();
      const maxLength = field === 'address' ? 500 : field === 'contact_email' ? 254 : 120;
      if (normalized.length > maxLength) throw new ApiError(400, `${field} is too long`);
      if (field === 'gym_name' && !normalized) throw new ApiError(400, 'Gym name is required');
      if (field === 'contact_email' && normalized && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(normalized)) {
        throw new ApiError(400, 'Enter a valid contact email');
      }
      update[field] = normalized;
      continue;
    }

    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) throw new ApiError(400, `Invalid ${field}`);
    update[field] = number;
  }

  return update;
}

export const getGymSettings = async (req, res, next) => {
  try {
    let settings = await GymSettings.findOne();

    if (!settings) {
      settings = await GymSettings.create({});
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateGymSettings = async (req, res, next) => {
  try {
    const update = validateAndNormalizeSettings(req.body);
    let settings = await GymSettings.findOne();

    if (!settings) {
      settings = await GymSettings.create(update);
    } else {
      Object.assign(settings, update);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
};
