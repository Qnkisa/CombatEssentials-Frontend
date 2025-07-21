import type { RemoteRepository } from "../../domain/repository/RemoteRepository";

export class RemoteRepositoryImpl implements RemoteRepository {
    private apiUrl: string = 'https://localhost:7221/api';

    async login(email: string, password: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data; // Token or user info
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(firstName: string, lastName: string, email: string, password: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/Auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            if (!response.ok) {
                throw new Error(`Registration failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data; // Maybe user data or a success message
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async me(bearer: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearer}`,
                },
            });

            if (!response.ok) throw new Error(`Fetching user info failed: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('me() error:', error);
            throw error;
        }
    }

    async isAdmin(bearer: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/auth/is-admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearer}`,
                },
            });

            if (!response.ok) throw new Error(`Checking admin status failed: ${response.statusText}`);
            return await response.json(); // Expecting a boolean or object like { isAdmin: true }
        } catch (error) {
            console.error('isAdmin() error:', error);
            throw error;
        }
    }
}
