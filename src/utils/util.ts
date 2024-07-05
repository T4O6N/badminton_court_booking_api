/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const isNotBlank = (value: string) => {
  if (value?.trim() === '' || value === undefined || value?.trim === null) {
    return true;
  } else {
    false;
  }
};

export function isWhitespaceOnly(str: string): boolean {
  return /^\s*$/.test(str);
}

export const copyOf = (arrayData: number[], lengthNumber: number) => {
  const newArray: number[] = [];
  let newlength: number;

  for (let index = 0; index < arrayData.length; index++) {
    const element = arrayData[index];
    newArray.push(element);
  }

  if (arrayData.length === newArray.length) {
    newlength = lengthNumber - newArray.length;
    for (let addZero = 0; addZero < newlength; addZero++) {
      const ele = 0;
      newArray.push(ele);
    }
  }

  return newArray;
};
