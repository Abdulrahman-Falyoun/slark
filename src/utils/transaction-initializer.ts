import { Model } from 'mongoose';

export const withTransaction = async (
  model: Model<any>,
  foo: (args?: any) => Promise<any> | any,
) => {
  const session = await model.startSession();
  session.startTransaction();
  try {
    const response = await foo(session);
    await session.commitTransaction();
    return response;
  } catch (e) {
    console.log('e [transaction-initializer]: ', e.message || e);
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
};
