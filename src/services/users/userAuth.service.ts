import Users, { IUser } from '../../models/users.model';
import Otp from '../../models/otps.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import * as JwtUtils from '../../lib/jwt.utils';
import * as HashUtils from '../../lib/hash.utils';
import { uploadToCloudinary, deleteFromCloudinary } from '../../lib/cloudinary';
import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export default new (class UsersService {
  // ---------- REGISTER ----------
  async register(args: Record<string, any>, role: string, fileBuffer?: Buffer) {
    const existUser = await Users.findOne({ where: { email: args.email } });
    if (existUser) Utils.throwError(ErrorMsg.USER.emailAlreadyExist);

    let avatarUrl: string | null = null;
    let avatarId: string | null = null;

    if (fileBuffer) {
      const uploadRes = await uploadToCloudinary(fileBuffer, 'users');
      avatarUrl = uploadRes.url;
      avatarId = uploadRes.public_id;
    }

    const user = await Users.create({
      name: args.name,
      email: args.email,
      password: args.password,
      mobile: args.mobile,
      state: args.state,
      country: args.country,
      zip_code: args.zip_code,
      avatar_url: avatarUrl,
      avatar_id: avatarId,
    });

    return { message: SuccessMsg.USER.register, user };
  }

  // ---------- LOGIN ----------
  async login(args: Record<string, string>) {
    const user: IUser | null = await Users.findOne({ where: { email: args.email } });
    if (!user) Utils.throwError(ErrorMsg.USER.notFound);

    const isValid = await HashUtils.compareHash(args.password, user.password);
    if (!isValid) Utils.throwError(ErrorMsg.USER.incorrectCredentials);

    const token = await JwtUtils.createToken({ userId: user.userid, type: 'user' });
    return { message: SuccessMsg.USER.login, user, token };
  }

  // ---------- FETCH MY PROFILE ----------
  async me(args: { userId: number }) {
    const user = await Users.findOne({
      where: { userid: args.userId },
      attributes: { exclude: ['password'] },
    });
    if (!user) Utils.throwError(ErrorMsg.USER.notFound);
    return { user };
  }

  // ---------- FORGOT PASSWORD ----------
  async forgotPassword(email: string) {
    const user = await Users.findOne({ where: { email } });
    if (!user) Utils.throwError(ErrorMsg.USER.notFound);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.destroy({ where: { email } });

    await Otp.create({
      email,
      otp_hash: otpHash,
      expires_at: expiresAt,
      verified: false,
    });

    console.log(`OTP for ${email}: ${otp}`); // replace with email service

    return { message: `OTP sent successfully to ${email}: ${otp}` };
  }

  // ---------- VERIFY OTP ----------
  async verifyOtp(email: string, otp: string) {
    const otpEntry = await Otp.findOne({ where: { email } });
    if (!otpEntry) Utils.throwError(ErrorMsg.USER.otpNotFound);

    if (otpEntry.expires_at < new Date()) {
      await Otp.destroy({ where: { email } });
      Utils.throwError(ErrorMsg.USER.otpExpired);
    }

    const isMatch = await bcrypt.compare(otp, otpEntry.otp_hash);
    if (!isMatch) Utils.throwError(ErrorMsg.USER.invalidOtp);

    otpEntry.verified = true;
    await otpEntry.save();

    return { message: 'OTP verified successfully' };
  }

  // ---------- RESET PASSWORD ----------
  async resetPassword(email: string, otp: string, newPassword: string) {
    const otpEntry = await Otp.findOne({ where: { email } });
    if (!otpEntry) Utils.throwError(ErrorMsg.USER.otpNotFound);

    if (otpEntry.expires_at < new Date()) {
      await Otp.destroy({ where: { email } });
      Utils.throwError(ErrorMsg.USER.otpExpired);
    }

    const isMatch = await bcrypt.compare(otp, otpEntry.otp_hash);
    if (!isMatch) Utils.throwError(ErrorMsg.USER.invalidOtp);
    if (!otpEntry.verified) Utils.throwError('OTP not verified yet');

    const user = await Users.findOne({ where: { email } });
    if (!user) Utils.throwError(ErrorMsg.USER.notFound);

    const hashed = await HashUtils.generateHash(newPassword);
    await Users.update({ password: hashed }, { where: { email } });

    await Otp.destroy({ where: { email } });

    return { message: 'Password reset successfully', user };
  }

  // ---------- PROFILE IMAGE CRUD ----------
  async uploadProfilePicture(userId: number, fileBuffer: Buffer) {
    const user = await Users.findOne({ where: { userid: userId } });
    if (!user) Utils.throwError(ErrorMsg.USER.notFound);

    if (user.avatar_id) await deleteFromCloudinary(user.avatar_id);

    const uploadRes = await uploadToCloudinary(fileBuffer, 'users');
    await Users.update(
      { avatar_url: uploadRes.url, avatar_id: uploadRes.public_id },
      { where: { userid: userId } }
    );

    return { message: 'Profile picture uploaded successfully', avatar_url: uploadRes.url };
  }

  async getProfilePicture(userId: number) {
    const user = await Users.findOne({
      where: { userid: userId },
      attributes: ['avatar_url'],
    });
    if (!user || !user.avatar_url) Utils.throwError('No profile picture found');
    return { avatar_url: user.avatar_url };
  }

  async updateProfile(body: Record<string, any>, userId: number) {
      // Check if user exists
      const user = await Users.findOne({ where : { userid: userId }});
      if (!user) Utils.throwError(ErrorMsg.USER.notFound)

      // Allowed fields to update
      const allowedFields = ['name', 'email', 'phone', 'address', 'bio'];
      for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
          (user as any)[key] = body[key];
        }
      }

      await user.save();

      delete user.password;

      return {
        message: 'Profile updated successfully',
        user: user,
      };
    }

  async updateProfilePicture(userId: number, fileBuffer: Buffer) {
  const user = await Users.findOne({ where: { userid: userId } });
  if (!user) Utils.throwError(ErrorMsg.USER.notFound);

  if (user.avatar_id) await deleteFromCloudinary(user.avatar_id);

  const uploadRes = await uploadToCloudinary(fileBuffer, 'users');
  await Users.update(
    { avatar_url: uploadRes.url, avatar_id: uploadRes.public_id },
    { where: { userid: userId } }
  );

  return { message: 'Profile picture updated successfully', avatar_url: uploadRes.url };
}

  async deleteProfilePicture(userId: number) {
  const user = await Users.findOne({ where: { userid: userId } });
  if (!user) Utils.throwError(ErrorMsg.USER.notFound);
  if (!user.avatar_id) Utils.throwError('No profile picture to delete');

  await deleteFromCloudinary(user.avatar_id);
  await Users.update({ avatar_url: null, avatar_id: null }, { where: { userid: userId } });
  return { message: 'Profile picture deleted successfully' };
}

  // ---------- DELETE USER ----------
  async deleteUser(userId: number) {
  const user = await Users.findOne({ where: { userid: userId } });
  if (!user) Utils.throwError(ErrorMsg.USER.notFound);
  if (user.avatar_id) await deleteFromCloudinary(user.avatar_id);
  await Users.destroy({ where: { userid: userId } });
  return { message: SuccessMsg.USER.delete };
}

  // ---------- LOGOUT ----------
  async logout(userId: number) {
  const user = await Users.findOne({ where: { userid: userId } });
  if (!user) Utils.throwError(ErrorMsg.USER.notFound);
  return { message: SuccessMsg.USER.logout };
}
}) ();
