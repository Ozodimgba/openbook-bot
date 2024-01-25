import { Client } from "@upstash/qstash";
import dotenv from "dotenv";

dotenv.config();

const token: any = process.env.QSTASH_TOKEN || "";

const c = new Client({
  token: token,
});

type ScheduleType = {
    User: string,
    Market: string,
    Inteval: number
}

type DurationUnit = 'minutes' | 'hours' | 'days' | 'week';


function convertToCronExpression(value: number, unit: DurationUnit): string {
    let cronExpression = '';

    switch (unit) {
        case 'minutes':
            if (value < 0 || value > 59) {
                throw new Error('Invalid value for minutes. Valid range is 0-59.');
            }
            cronExpression = `*/${value} * * * *`;
            break;
        case 'hours':
            if (value < 0 || value > 23) {
                throw new Error('Invalid value for hours. Valid range is 0-23.');
            }
            cronExpression = `0 */${value} * * *`;
            break;
        case 'days':
            if (value < 1 || value > 31) {
                throw new Error('Invalid value for days. Valid range is 1-31.');
            }
            cronExpression = `0 0 */${value} * *`;
            break;
        case 'week':
            if (value < 0 || value > 6) {
                throw new Error('Invalid value for week. Valid range is 0-6.');
            }
            cronExpression = `0 0 */${value * 7} * *`;
            break;
        default:
            throw new Error('Invalid duration unit');
    }

    return cronExpression;
}


// Examples
// console.log(convertToCronExpression(3, 'hours')); // Output: "0 */3 * * *"
// console.log(convertToCronExpression(5, 'minutes')); // Output: "*/5 * * * *"
// console.log(convertToCronExpression(2, 'days')); // Output: "0 0 */2 * *"
// console.log(convertToCronExpression(1, 'weeks')); // Output: "0 0 0 */1 *"


export default async function scheduleCrank(user: string, periodNumber: number, period: DurationUnit, market: string): Promise<boolean | string> {
   try {
      const cron = convertToCronExpression(periodNumber, period)

      await c.schedules.create({
        destination: process.env.SERVER_URL || "",
        cron: cron,
        body: JSON.stringify({ user: user, market: market })
      });

      console.log("Cranker created successfully")
      
      return true
      
   } catch(err) {
     console.log("Error creating cranker" + err)
     return err
   }
}


