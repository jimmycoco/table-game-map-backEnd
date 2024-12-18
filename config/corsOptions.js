//設定可使用此api的名單
const whitelist = [
    'http://localhost:3000',
    'https://master.d3npaqv7ssxrwi.amplifyapp.com',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS!'));
        }
    },
    optionsSuccessStatus: 204
}


module.exports = corsOptions;   