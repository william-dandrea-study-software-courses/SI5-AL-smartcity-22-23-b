db.createUser(
    {
        user: "exporter",
        pwd: "password",
        roles: [
            { role: "clusterMonitor", db: "admin" },
            { role: "read", db: "local" }
        ]
    }
)
