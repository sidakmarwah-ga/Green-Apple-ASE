import { AppError } from "./AppError";
import { HTTP_STATUS } from "./Constants";
import { OrderStatus } from "./Types";

export const isTakeValid = (take: string, lowerLimit: number = 1, higherLimit: number = 100): boolean => {
  const takeNumber = Number(take);
  const isValid = !Number.isNaN(takeNumber) && Number.isInteger(takeNumber) && takeNumber >= lowerLimit && takeNumber <= higherLimit;
  return isValid;
}

export const isSkipValid = (skip: string, lowerLimit: number = 0): boolean => {
  const skipNumber = Number(skip);
  const isValid = !Number.isNaN(skipNumber) && Number.isInteger(skipNumber) && skipNumber >= lowerLimit;
  return isValid;
}

export const takeSkipOptions = (
  take: any = 100,
  skip: any = 0
): any => {
  if (!isTakeValid(take, 1, 100))
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Take must be an Integer >= 1 && <= 100');
  if (!isSkipValid(skip, 0))
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Skip must be an Integer >= 0');
  return {
    take: Number(take),
    skip: Number(skip)
  }

}

export const validateID = (id: any, entity: string = 'Entity'): void => {

  if (!id) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `${entity} ID is required`
    );
  }

  const NumberID = Number(id);

  if (Number.isInteger(NumberID) && NumberID >= 1) {
    return;
  }

  throw new AppError(
    HTTP_STATUS.BAD_REQUEST,
    'Invalid ID!'
  );

}

export const validateAddRemoveArray = (toAdd: any, toRemove: any): void => {
  if (toAdd === undefined && toRemove === undefined) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Atleast one of toAdd[] and toRemove[] is required.'
    );
  }

  if (!(toAdd === undefined || Array.isArray(toAdd))) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'toAdd should either stay undefined or be an Integer Array containing IDs'
    )
  }

  if (!(toRemove === undefined || Array.isArray(toRemove))) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'toRemove should either stay undefined or be an Integer Array containing IDs'
    )
  }

  toAdd?.forEach((id: any) => {
    validateID(id);
  });

  toRemove?.forEach((id: any) => {
    validateID(id);
  });

  if (Array.isArray(toAdd) && Array.isArray(toRemove)) {
    const intersection = toAdd.filter(value => toRemove.includes(value));
    if (intersection.length !== 0) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Same IDs can not exit in both toAdd[] and toRemove[]'
      );
    }
  }
}

export const validateEmail = (email: any) => {

  if (!email) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Email required'
    );
  }

  if (typeof email !== 'string') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Email must be a string'
    );
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid Email'
    );
  }

}

export const validatePhone = (phone: any) => {

  if (!phone) {
    return;
  }

  if (typeof phone !== 'string') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Phone number must be a string'
    );
  }

  const cleanPhone = phone.split(/[-|" "]+/).join('');
  const indianMobileWithCodeRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

  if (!indianMobileWithCodeRegex.test(cleanPhone)) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid Phone Number'
    )
  }
}



export const validateName = (name: any) => {

  if (!name) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Name is required'
    );
  }

  if (typeof name !== 'string') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Name must be a string'
    );
  }

  if (name.length <= 3) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Name must be longer than 3 characters'
    );
  }

}

export const validateTitle = (title: any) => {

  if (!title) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Title is required'
    );
  }

  if (typeof title !== 'string') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Title must be a string'
    );
  }

  if (title.length <= 3) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Title must be longer than 3 characters'
    );
  }

}

export const validateSKU = (sku: any) => {

  if (!sku) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'SKU is required'
    );
  }

  if (typeof sku !== 'string') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'SKU must be a string'
    );
  }

  if (sku.length <= 3) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'SKU length must be greater than 3'
    );
  }

}

export const validatePrice = (price: any) => {
  const priceNumber = Number(price);
  if (Number.isNaN(priceNumber)) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Price must be a number'
    );
  }
  if (price <= 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Price must be greate than 0'
    );
  }
}

export const validateStock = (stock: any) => {
  if (Number.isInteger(stock) && stock >= 0) {
    return;
  }
  throw new AppError(
    HTTP_STATUS.BAD_REQUEST,
    'Stock value must be an Integer >= 0'
  );
}

export const validateAttributes = (attribute: any) => {
  if (typeof attribute === 'object' &&
    attribute !== null &&
    !Array.isArray(attribute)) {
    return;
  }
  throw new AppError(
    HTTP_STATUS.BAD_REQUEST,
    'Attributes must be in json format'
  );
}

export const validateNumberOfUnitsOrdered = (numberOfUnitsOrdered: any) => {
  if (Number.isInteger(numberOfUnitsOrdered) && numberOfUnitsOrdered >= 1) return;
  throw new AppError(
    HTTP_STATUS.BAD_REQUEST,
    'Number of ordered units must be an Integer >= 1'
  );
}

export const validateOrderStatus = (status: any) => {
  if (!status) {
    return;
  }

  if (typeof status !== 'string') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Order status must be a string'
    );
  }

  if (!Object.values(OrderStatus).includes(status as any)) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid Status'
    );
  }


}

export const validateOrderStatusUpdateTransition = (newStatus: OrderStatus, oldStatus: OrderStatus) => {

  if (oldStatus === OrderStatus.CANCELLED) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Cancelled order states can not be changed'
    );
  }

  if (oldStatus === OrderStatus.RETURNED) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Returned order states can not be changed'
    );
  }

  if (newStatus === OrderStatus.CANCELLED && oldStatus === OrderStatus.COMPLETE) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Completed orders can not be cancelled'
    );
  }

  if (newStatus == OrderStatus.RETURNED && oldStatus !== OrderStatus.COMPLETE) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Order can not be returned before completion of order.'
    );
  }

}