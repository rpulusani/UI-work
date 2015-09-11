define([], function() {
    var fixtures = {};
    fixtures.users = {};
    fixtures.users.regular = {
        _embedded: {
            users: [
                {
                    id: 1,
                    idpId: "1"
                }
            ]
        }
    };
    return fixtures;
});
