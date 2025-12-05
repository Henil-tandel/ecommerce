import Banner, { IBanner } from '../../models/banner.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class BannerAdminSerivce {

    // Get all banners
    async getAllBanners() {
        const banners = await Banner.findAll();
        return {
            message: SuccessMsg.BANNER.get,
            banners
        }
    }

    // Get banner by id
    async getBannerById (bannerId:number) {
        const banner = await Banner.findOne({ where: { banner_id: bannerId } });
        if(!banner) Utils.throwError(ErrorMsg.BANNER.notFound);

        return {
            message: SuccessMsg.BANNER.get,
            banner
        }
    }

})