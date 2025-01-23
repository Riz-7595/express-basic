import dotenv from 'dotenv';
dotenv.config();

export const up = (pgm) => {
  pgm.addColumns('posts', {
    lead: { type: 'text', notNull: true },
  });
};