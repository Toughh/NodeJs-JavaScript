module.exports = {
    patchNotification: function (enabled) {

        let notification = {
            "enabled": enabled,
            "notify_destination": "https://fakehost-turing.out.co"
        }
        return notification
    }
}
