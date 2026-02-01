export const options = {
    secret: process.env.SESSION_SECRET|| "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5 // 5 minutes
    }
}