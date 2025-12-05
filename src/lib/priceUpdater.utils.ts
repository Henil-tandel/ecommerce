import cron from 'node-cron';
import axios from 'axios';
import Variant from '../models/productVariant.model';
import Product from '../models/product.model';
import { io } from '../server';

export const updatePriceJob = () => {

  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running automatic price update from Fixer API...');

      const response = await axios.get("https://data.fixer.io/api/latest?access_key=d53b38b9e06071ac2547651c2f4a9a95");
      const data = response.data;

      if (!data?.success || !data?.rates) {
        throw new Error('Failed to fetch valid exchange rates from Fixer');
      }

      const rates = data.rates;
      const targetCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'CAD'];

      const symbols: Record<string, string> = {
        EUR: '€',
        INR: '₹',
        USD: '$',
        GBP: '£',
        AED: 'د.إ',
        CAD: 'C$',
      };

      // Fetch all product variants
      const variants = await Variant.findAll();

      for (const variant of variants) {
        const basePrice = variant.base_price;

        const discount =
          variant.pricing?.[0]?.discount && !isNaN(variant.pricing[0].discount)
            ? Number(variant.pricing[0].discount)
            : 0;

        const pricing = targetCurrencies.map((currency) => {
          const rate = rates[currency];
          if (!rate) return null;

          const converted = basePrice * rate;
          const discountedPrice = converted - (converted * discount) / 100;

          return {
            currency,
            symbol: symbols[currency] || '$',
            price: parseFloat(converted.toFixed(2)),
            discount,
            discounted_price: parseFloat(discountedPrice.toFixed(2)),
          };
        }).filter(Boolean);

        await variant.update({ pricing });
        await variant.save();

        const product = await Product.findOne({ where: { product_id: variant.product_id } });
        if (product) {
          product.effective_price = basePrice;
          await product.save();
        }

        io.of('/users').emit('price_update', {
          variantId: variant.id,
          variant: variant.label,
          productId: variant.product_id,
          product: product?.name,
          pricing,
        });
      }

      console.log('Prices updated successfully!');
    } catch (error) {
      console.log('Error updating prices:', error);
    }
  });
  
};
