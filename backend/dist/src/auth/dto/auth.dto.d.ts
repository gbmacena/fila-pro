export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
}
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthResponseDto {
    access_token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}
export declare class RegisterResponseDto {
    message: string;
}
