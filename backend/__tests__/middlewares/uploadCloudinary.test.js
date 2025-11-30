const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../../middlewares/uploadCloudinary');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

jest.mock('../../config/cloudinary');
jest.mock('streamifier');

describe('UploadCloudinary Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      file: { buffer: Buffer.from('test') },
      files: [{ buffer: Buffer.from('test1') }, { buffer: Buffer.from('test2') }],
      tipoImagen: 'test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('uploadToCloudinary', () => {
    it('should call next if no file provided', async () => {
      req.file = undefined;
      await uploadToCloudinary(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should upload file and set cloudinaryUrl', async () => {
      const mockStream = { pipe: jest.fn() };
      streamifier.createReadStream.mockReturnValue(mockStream);
      
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        callback(null, { secure_url: 'http://url.com' });
        return {};
      });

      await uploadToCloudinary(req, res, next);

      expect(req.file.cloudinaryUrl).toBe('http://url.com');
      expect(next).toHaveBeenCalled();
    });

    it('should handle upload error', async () => {
      const mockStream = { pipe: jest.fn() };
      streamifier.createReadStream.mockReturnValue(mockStream);
      
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        callback(new Error('Upload failed'), null);
        return {};
      });

      await uploadToCloudinary(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Error al subir imagen a Cloudinary'
      }));
    });
  });

  describe('uploadMultipleToCloudinary', () => {
    it('should call next if no files provided', async () => {
      req.files = [];
      await uploadMultipleToCloudinary(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should upload multiple files and set cloudinaryUrls', async () => {
      const mockStream = { pipe: jest.fn() };
      streamifier.createReadStream.mockReturnValue(mockStream);
      
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        callback(null, { secure_url: 'http://url.com' });
        return {};
      });

      await uploadMultipleToCloudinary(req, res, next);

      expect(req.cloudinaryUrls).toHaveLength(2);
      expect(req.cloudinaryUrls[0]).toBe('http://url.com');
      expect(next).toHaveBeenCalled();
    });

    it('should handle upload error for multiple files', async () => {
      const mockStream = { pipe: jest.fn() };
      streamifier.createReadStream.mockReturnValue(mockStream);
      
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        callback(new Error('Upload failed'), null);
        return {};
      });

      await uploadMultipleToCloudinary(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Error al subir imágenes a Cloudinary'
      }));
    });
  });
});
