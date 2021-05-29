/**
 * Validates arguments inside of move.
 * obj - object to validate.
 * objId - Id of object.
 * range - range for Id.
 * values - values for Id.
 */
export const IsValidMove = (...args) => {
    let isValid = true;
    for (const item of args) {
        isValid = isValid && MoveValidator(item);
        if (!isValid) {
            break;
        }
    }
    return isValid;
};

export const MoveValidator = ({obj, objId, range = [], values = []}) => {
    let isValid = obj !== null;
    if (range.length === 2) {
        isValid = isValid && ValidatorByRange(objId, range);
    } else if (values.length > 0) {
        isValid = isValid && ValidatorByValues(objId, values);
    }
    return isValid;
};

const ValidatorByRange = (num, range) => {
    return range[0] <= num && num < range[1];
};

const ValidatorByValues = (num, values) => {
    return values.includes(num);
};
