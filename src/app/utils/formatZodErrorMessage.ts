import { ZodError } from 'zod';
import capitalize from './capitalize';

const formatZodErrorMessage = (err: ZodError) => {
    const errorMessages = err.issues.map((issue) => {
        const fieldName = capitalize(
            String(issue.path[issue.path.length - 1] || 'Field'),
        );

        const message =
            issue.message.charAt(0).toLowerCase() + issue.message.slice(1);
        return `${fieldName}: ${message}.`;
    });

    const errorMessage = 'Validation Error. ' + errorMessages.join('\n');

    return errorMessage;
};

export default formatZodErrorMessage;
