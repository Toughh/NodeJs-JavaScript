module.exports = {
    updateApplicationDefaultsBody: function ({ defaultValue, enabled } = {}) {
        let editApplicationDefaultsBody = {}
        if (defaultValue !== undefined) {
            editApplicationDefaultsBody = {...editApplicationDefaultsBody, ...{ default_value: defaultValue }}
        }
        if (enabled !== undefined) {
            editApplicationDefaultsBody = {...editApplicationDefaultsBody, ...{ enabled: enabled }}
        }

        return editApplicationDefaultsBody
    }
}
