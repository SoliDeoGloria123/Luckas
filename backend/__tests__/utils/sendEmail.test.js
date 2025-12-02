const nodemailer = require('nodemailer');

jest.mock('nodemailer', () => {
  const mockSendMail = jest.fn().mockResolvedValue(true);
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: mockSendMail
    }),
    __mockSendMail: mockSendMail // Expose for assertions
  };
});

const sendEmail = require('../../utils/sendEmail');

describe('sendEmail', () => {
  const mockSendMail = require('nodemailer').__mockSendMail;

  beforeEach(() => {
    mockSendMail.mockClear();
  });

  it('should send email successfully', async () => {
    await sendEmail('test@test.com', 'Subject', 'Text', 'HTML');
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@test.com',
      subject: 'Subject',
      text: 'Text',
      html: 'HTML'
    }));
  });

  it('should send email with attachments', async () => {
    const attachments = [{ filename: 'test.txt', content: 'test' }];
    await sendEmail('test@test.com', 'Subject', 'Text', 'HTML', attachments);
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      attachments
    }));
  });

  it('should handle errors', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP Error'));
    await expect(sendEmail('test@test.com', 'Subject', 'Text')).rejects.toThrow('SMTP Error');
  });
});
