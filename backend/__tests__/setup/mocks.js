// Mock setup for MongoDB/Mongoose
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue({}),
    connection: {
        on: jest.fn(),
        once: jest.fn()
    },
    Schema: Object.assign(
        jest.fn().mockImplementation(() => ({
            pre: jest.fn(),
            post: jest.fn(),
            methods: {},
            methods: {},
            statics: {},
            index: jest.fn(),
            virtual: jest.fn().mockReturnValue({ get: jest.fn() })
        })),
        {
            Types: {
                ObjectId: Object.assign(
                    jest.fn(),
                    { 
                        isValid: jest.fn().mockReturnValue(true),
                        createFromHexString: jest.fn().mockReturnValue('mock-id-123')
                    }
                )
            }
        }
    ),
    Types: {
        ObjectId: Object.assign(
            jest.fn(),
            { 
                isValid: jest.fn().mockReturnValue(true),
                createFromHexString: jest.fn().mockReturnValue('mock-id-123')
            }
        )
    },
    model: jest.fn().mockImplementation((name) => {
        const mockModel = function (data) {
            return {
                ...data,
                save: jest.fn().mockResolvedValue(data),
                _id: 'mock-id-123',
                toObject: jest.fn().mockReturnValue(data)
            };
        };
        mockModel.find = jest.fn().mockReturnThis();
        mockModel.findById = jest.fn().mockReturnThis();
        mockModel.findOne = jest.fn().mockReturnThis();
        mockModel.findByIdAndUpdate = jest.fn().mockReturnThis();
        mockModel.findByIdAndDelete = jest.fn().mockReturnThis();
        mockModel.findOneAndUpdate = jest.fn().mockReturnThis();
        mockModel.countDocuments = jest.fn().mockResolvedValue(0);
        mockModel.aggregate = jest.fn().mockResolvedValue([]);
        mockModel.populate = jest.fn().mockReturnThis();
        mockModel.exec = jest.fn().mockResolvedValue([]);
        mockModel.sort = jest.fn().mockReturnThis();
        mockModel.limit = jest.fn().mockReturnThis();
        mockModel.skip = jest.fn().mockReturnThis();
        mockModel.select = jest.fn().mockReturnThis();
        mockModel.insertMany = jest.fn().mockResolvedValue([]);
        mockModel.create = jest.fn().mockResolvedValue({});
        return mockModel;
    })
}));

// Mock Cloudinary
jest.mock('cloudinary', () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            upload_stream: jest.fn((options, callback) => {
                callback(null, {
                    secure_url: 'https://mock-cloudinary-url.com/image.jpg',
                    public_id: 'mock-public-id'
                });
                return { end: jest.fn() };
            }),
            destroy: jest.fn().mockResolvedValue({ result: 'ok' })
        }
    }
}));

// Mock Nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({
            messageId: 'mock-message-id',
            accepted: ['test@example.com']
        })
    })
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ id: 'user-id-123', rol: 'admin' }),
    decode: jest.fn().mockReturnValue({ id: 'user-id-123' })
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
    genSalt: jest.fn().mockResolvedValue('salt')
}));

// Mock multer
jest.mock('multer', () => {
    const multer = () => ({
        single: jest.fn(() => (req, res, next) => {
            req.file = {
                fieldname: 'imagen',
                originalname: 'test.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from('mock-file-content'),
                size: 1024
            };
            next();
        }),
        array: jest.fn(() => (req, res, next) => {
            req.files = [{
                fieldname: 'imagen',
                originalname: 'test.jpg',
                buffer: Buffer.from('mock-file-content')
            }];
            next();
        })
    });
    multer.memoryStorage = jest.fn();
    return multer;
});

module.exports = {
    setupMocks: () => {
        // Additional setup if needed
    }
};
