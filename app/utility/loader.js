const defaultStatus = {
    initial: false,
    loading: false,
    success: false,
    error: false
};

module.exports = {
    initial: () => ({ ...defaultStatus, initial: true }),
    begin: () => ({ ...defaultStatus, loading: true }),
    success: () => ({ ...defaultStatus, success: true }),
    error: (error) => ({ ...defaultStatus, error })
};
