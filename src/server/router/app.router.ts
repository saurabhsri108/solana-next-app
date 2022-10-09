import { createRouter } from '../createRouter';
import { orderRouter } from './order.router';
import { productRouter } from './product.router';
import { userRouter } from './user.router';

export const appRouter = createRouter()
    .merge('users.', userRouter)
    .merge('products.', productRouter)
    .merge('orders.', orderRouter);

export type AppRouter = typeof appRouter;