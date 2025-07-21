export interface RemoteRepository {
    //Auth api functions
    login(email: string, password: string): Promise<any>;
    register(firstName: string, lastName: string, email: string, password: string): Promise<any>;
    me(bearer: string): Promise<any>;
    isAdmin(bearer: string): Promise<any>;

    
}