export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const TokenType: {
    readonly REFRESH: "REFRESH";
    readonly PASSWORD_RESET: "PASSWORD_RESET";
    readonly EMAIL_VERIFY: "EMAIL_VERIFY";
};
export type TokenType = (typeof TokenType)[keyof typeof TokenType];
