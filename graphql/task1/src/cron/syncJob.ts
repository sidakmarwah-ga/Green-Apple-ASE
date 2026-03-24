import { CronJob } from "cron";
import { syncFunction } from "../controllers";

export const job = new CronJob('0 0 */6 * * *', async () => {
	try {

    console.log('Cron job function called');
    await syncFunction();
    console.log('Cron job function executed');

  } catch(error) {
    console.log(error);
    throw new Error('Some error occured in Cron Job');
  }
});