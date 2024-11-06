import { z } from 'zod';

const InitSchema = z.object({
  user_ids: z.array(z.string().min(3).max(19)).optional(),
  user_id: z.string().min(3).max(19).optional()
})
  .refine(data => data.user_ids || data.user_id, {
    message: 'Either user_ids or user_id must be provided.'
  })
  .refine(data => !data.user_ids || !data.user_id, {
    message: 'Only one of user_ids or user_id can be provided.'
  });

export {
  InitSchema
};