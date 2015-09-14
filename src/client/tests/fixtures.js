define([], function() {
    var fixtures = {};
    fixtures.users = {};
    fixtures.users.regular = {
        _embedded: {
            users: [
                {
                    id: 1,
                    idpId: "1",
                    _links: {
                        accounts: [
                            {
                                href: "http://10.145.116.233:8080/mps/accounts/1"
                            }
                        ]
                    }
                }
            ]
        }
    };
    return fixtures;
});
