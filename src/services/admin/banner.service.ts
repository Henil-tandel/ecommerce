import Banner, { IBanner } from '../../models/banner.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import {
  uploadSingleFile,
  updateSingleFile,
  deleteSingleFile,
} from '../../lib/file_upload';

export default new (class BannerAdminService {
  // Add a banner
  async addBanner(args: Record<string, any>, files?: { desktop?: Express.Multer.File; mobile?: Express.Multer.File }) {
    const existing = await Banner.findOne({ where: { title: args.title } });
    if (existing) Utils.throwError(ErrorMsg.BANNER.alreadyExist);

    let desktopUpload = null;
    let mobileUpload = null;

    if (files?.desktop) {
      desktopUpload = await uploadSingleFile(files.desktop.buffer, 'banners');
    }
    if (files?.mobile) {
      mobileUpload = await uploadSingleFile(files.mobile.buffer, 'banners');
    }

    const banner: IBanner = await Banner.create({
      ...args,
      desktop_image_url: desktopUpload?.url || '',
      mobile_image_url: mobileUpload?.url || '',
    });

    return {
      message: SuccessMsg.BANNER.add,
      banner,
    };
  }

  // Get all banners
  async getAllBanners() {
    const banners = await Banner.findAll();
    return {
      message: SuccessMsg.BANNER.get,
      banners,
    };
  }

  // Get banner by id
  async getBannerById(bannerId: number) {
    const banner = await Banner.findOne({ where: { banner_id: bannerId } });
    if (!banner) Utils.throwError(ErrorMsg.BANNER.notFound);

    return {
      message: SuccessMsg.BANNER.get,
      banner,
    };
  }

  // Update the banner
  async updateBanner(
    args: Record<string, any>,
    bannerId: number,
    files?: { desktop?: Express.Multer.File; mobile?: Express.Multer.File }
  ) {
    const banner = await Banner.findOne({ where: { banner_id: bannerId } });
    if (!banner) Utils.throwError(ErrorMsg.BANNER.notFound);

    let updatedDesktop = null;
    let updatedMobile = null;

    // if new desktop image provided
    if (files?.desktop) {
      updatedDesktop = await uploadSingleFile(files.desktop.buffer, 'banners');
    }

    // if new mobile image provided
    if (files?.mobile) {
      updatedMobile = await uploadSingleFile(files.mobile.buffer, 'banners');
    }

    await banner.update({
      ...args,
      desktop_image_url: updatedDesktop?.url || banner.desktop_image_url,
      mobile_image_url: updatedMobile?.url || banner.mobile_image_url,
    });

    return {
      message: SuccessMsg.BANNER.update,
      banner,
    };
  }

  // Delete the banner
  async deleteBanner(bannerId: number) {
    const banner = await Banner.findOne({ where: { banner_id: bannerId } });
    if (!banner) Utils.throwError(ErrorMsg.BANNER.notFound);

    // optional: if you have image deletion logic based on public_id, you can skip it since we no longer store IDs
    await Banner.destroy({ where: { banner_id: bannerId } });

    return {
      message: SuccessMsg.BANNER.delete,
    };
  }
})();
