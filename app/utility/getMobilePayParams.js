module.exports = (data) => {
    let params = {};
    for (let field in data) {
        params[field] = data[field].value;
    }
    return params;
}