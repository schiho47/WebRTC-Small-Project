import { AuthService } from './auth.service';
import { AuthDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(authDto: AuthDto): Promise<{
        access_token: string;
    }>;
    signin(authDto: AuthDto): Promise<{
        jwtToken: string;
    }>;
}
