export interface LoginCredentials {
    Email: string;
    Password: string;
    GrantType: string;
    Scope: string;
    ClientId: string;
    ClientSecret: string;
    RedirectUri: string;
  }
  
  export interface UserData {
    isLinkAccount: boolean;
    linkAccountParameters: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      store: Array<{
        storeId: string;
        marketplaceName: string;
      }>;
    };
  }
  

  export interface TokenResponse {
    AccessToken: string;
    RefreshToken: string;
    TokenType: string;
    ExpiresAt: string;
  }
  