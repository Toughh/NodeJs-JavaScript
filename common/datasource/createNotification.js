module.exports = {
    postNotification: function (direction, type, event_type) {

        let notification = {
            "direction": direction,
            "type": type,
            "event_type": event_type,
            "notify_destination": "https://fakehost-turing.out.co"
        }
        return notification
    },

    delNotification: function (enabled) {

        let notification = {
            "notify_destination": "https://fakehost-turing.out.co",
            "enabled": enabled
        }
        return notification
    }
}
