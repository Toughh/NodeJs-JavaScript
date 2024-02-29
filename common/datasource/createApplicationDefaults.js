module.exports = {
    createApplicationDefaultsBody: function ({ defaultName = 'send_options', defaultValue = '{"colo_route":"css"}', enabled } = {}) {
        let applicationDefaultsBody = {
            "default_name": defaultName,
            "default_value": defaultValue
        }
        if (enabled !== undefined) {
            applicationDefaultsBody = {...applicationDefaultsBody, ...{ enabled: enabled }}
        }

        return applicationDefaultsBody
    }
}
