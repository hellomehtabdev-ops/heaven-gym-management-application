import * as offlineSaleService from '../services/offlineSale.service.js';

export const listOfflineSales = async (req, res, next) => {
  try { res.json(await offlineSaleService.listOfflineSales(req.query)); } catch (error) { next(error); }
};
export const getOfflineSale = async (req, res, next) => {
  try { res.json(await offlineSaleService.getOfflineSaleById(req.params.id)); } catch (error) { next(error); }
};
export const createOfflineSale = async (req, res, next) => {
  try {
    const sale = await offlineSaleService.createOfflineSale({ ...req.body, performedBy: req.user?._id });
    res.status(201).json(sale);
  } catch (error) { next(error); }
};
