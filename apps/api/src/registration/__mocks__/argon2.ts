export const hash = jest.fn().mockRejectedValue('mocked_hashed_password');
export const verify = jest.fn().mockResolvedValue(true);
