const fields = [{
    name: 'phoneNumber',
    mask:  '+ 7 | 111 | 111 - 11 - 11',
    innerType: 'phone',
    placeholderChar: '*',
    placeholder: "79168838876",
    highlightedPlaceholderChar: '|',
}, {
    name: 'summ',
    placeholder: "0",
    innerType: 'money',
    maxLength: 4
}];

module.exports = (() => {
    let preparedFields = {};
    let fieldsQueue = [];
    let fieldsMap = {};
    fields.forEach((field, idx) => {
        preparedFields[field.name] = {
            value: '',
            error: null,
            isFull: null
        };
        fieldsQueue.push(field.name);
        fieldsMap[field.name] = field;
    });
    return {fieldsMap, preparedFields, fieldsQueue}
})();