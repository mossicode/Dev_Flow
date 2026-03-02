export class RequestError extends Error {
    statusCode:number;
    errors?:Record<string, string[]>;
    constructor(
        statusCode:number,
        message:string,
        errors?:Record<string, string[]>
    ){
        super(message);
        this.statusCode=statusCode;
        this.errors = errors;
        this.name = "RequestedError";
    }
}
export class ValidationError extends RequestError {
    constructor(
        fieldErrors:Record<string, string[] | undefined>
    ){
        const normalizedFieldErrors = ValidationError.normalizeFieldErrors(fieldErrors);
        const messages= ValidationError.formatFieldErrors(normalizedFieldErrors);
        super(400, messages, normalizedFieldErrors);
        this.name= "ValidationError";
        this.errors=normalizedFieldErrors;
    }
        static normalizeFieldErrors(errors:Record<string, string[] | undefined>):Record<string, string[]>{
            return Object.entries(errors).reduce<Record<string, string[]>>((acc, [field, messages])=>{
                if(Array.isArray(messages) && messages.length > 0){
                    acc[field] = messages;
                }
                return acc;
            }, {});
        }
        static formatFieldErrors(errors:Record<string, string[]>):string{
            if(Object.keys(errors).length === 0){
                return "Validation failed";
            }
            const formatMessages=Object.entries(errors).map(([field, messages])=>{
                const fieldName=field.charAt(0).toUpperCase() + field.slice(1);

                if(messages[0]==="required") {
                    return `${fieldName} is required`;
                } else{
                    return messages.join(" and ")
                }
            });
            return formatMessages.join(", ")
        }
}

export class NotfoundError extends RequestError {
    constructor(resource:string){
        super(404, `${resource} not found`);
        this.name= "NotFoundError";
    }
}
export class ForbiddenError extends RequestError {
    constructor(message:string ='forbidden'){
        super(403, message);
        this.name="forbiddenError";
    }
}
export class UnauthorizedError extends RequestError {}
