import {Model} from "mongoose";
import {operationsCodes} from "./operation-codes";

interface transactionHOF extends Function {
    (args?: any): Promise<any> | any;
}

export const wrapFunctionWithinTransaction = async (
    model: Model<any>,
    func: transactionHOF,
    successData?,
    errorData?
) => {
    const session = await model.startSession();
    session.startTransaction();
    try {
        await func(session);
        // Closing transaction
        await session.commitTransaction();
        return {
            ...successData,
            code: operationsCodes.SUCCESS,
        };
    } catch (e) {
        console.log('e [transaction-initializer]: ', (e.message || e));
        await session.abortTransaction();
        return {
            code: operationsCodes.DATABASE_ERROR,
            ...errorData,
            e
        };
    } finally {
        session.endSession();
    }
};
