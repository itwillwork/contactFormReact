const NOT_PHONE_PAT = /\D/g;
const EMPTY_STR = '';
const onlyInteger = v => v ? v.replace(NOT_PHONE_PAT, EMPTY_STR) : v;

const isPhoneNumber = v => v.length >= 11;
const summRangeIncluded = (v) => (v >= 1 && v <= 5000);

const checkMoneyValuesRange = v => {
    if (!v) return;
    if (!summRangeIncluded(v)) return "Сумма должна быть в диапозоне от 1 до 5000 рублей"
};

module.exports = {
    phone: {
        format: onlyInteger,
        parse: onlyInteger,
        isFull: isPhoneNumber,
        checkError: v => {},
        validate: isPhoneNumber,
    },
    money: {
        format: (v) => {
            return v && parseInt(v);
        },
        parse: onlyInteger,
        isFull: v => (v + '').length > 3,
        checkError: checkMoneyValuesRange,
        validate: summRangeIncluded
    }
};