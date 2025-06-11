import { CronJob } from 'cron';
import { db } from '../db';
import { positionsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { is_in_range } from './check_range';
import { close_position } from './close_position';
import { open_position } from './open_position';
import { webhookClient } from '..';

export const startPositionManager = () => {
    // Run every 30 minutes
    const job = new CronJob('*/30 * * * *', async () => {
        console.log('Running position range check...');
        
        try {
            const openPositions = await db.select()
                .from(positionsTable)
                .where(eq(positionsTable.status, 'open'));
            
            for (const position of openPositions) {
                try {
                    const inRange = await is_in_range(position.id);
                    
                    if (!inRange) {
                        console.log(`Position ${position.id} is out of range. Rebalancing...`);

                        await webhookClient.send({
                            content: `Position ${position.id} is out of range. Rebalancing...`,
                        });
                        
                        await close_position(position.id);
                        
                        let newPosition = await open_position(position.amount.toString());
                        
                        console.log(`Successfully rebalanced position ${position.id}`);

                        await webhookClient.send({
                            content: `New position opened: ${newPosition.id}`,
                        });
                    } else {
                        console.log(`Position ${position.id} is in range.`);
                    }
                } catch (error) {
                    console.error(`Error processing position ${position.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in position manager:', error);
        }
    });

    job.start();
    console.log('Position manager started. Will check positions every 30 minutes.');
};
