import type { RemoteRepository } from "./RemoteRepository";

export class RemoteRepositoryImpl implements RemoteRepository {
    private apiUrl: string = 'https://localhost:7221/api';

    // Auth api functions

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
            const response = await fetch(`${this.apiUrl}/Auth/me`, {
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
            const response = await fetch(`${this.apiUrl}/Auth/is-admin`, {
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

    // Admin products api functions

    async getAllAdminProducts(bearer: string, page: number = 1, categoryId?: number, name?: string): Promise<any> {
        const query = new URLSearchParams();
        query.append("page", page.toString());
        if (categoryId !== undefined) query.append("categoryId", categoryId.toString());
        if (name) query.append("name", name);

        const url = `${this.apiUrl}/admin/products?${query.toString()}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
        });

        if (!response.ok) throw new Error(`Failed to get admin products: ${response.statusText}`);
        return await response.json();
    }

    async createAdminProduct(bearer: string, formData: FormData): Promise<any> {
        const response = await fetch(`${this.apiUrl}/admin/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearer}`
            },
            body: formData
        });

        if (!response.ok) throw new Error(`Create product failed: ${response.statusText}`);
        return await response.json();
    }

    async updateAdminProduct(bearer: string, id: number, formData: FormData): Promise<any> {
        const response = await fetch(`${this.apiUrl}/admin/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${bearer}`
            },
            body: formData
        });

        if (!response.ok) throw new Error(`Update product failed: ${response.statusText}`);
        return await response.json();
    }

    async deleteAdminProduct(bearer: string, id: number): Promise<any> {
        const response = await fetch(`${this.apiUrl}/admin/products/delete/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
        });

        if (!response.ok) throw new Error(`Delete product failed: ${response.statusText}`);
        return await response.text(); // message only
    }

    async undeleteAdminProduct(bearer: string, id: number): Promise<any> {
        const response = await fetch(`${this.apiUrl}/admin/products/undelete/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
        });

        if (!response.ok) throw new Error(`Undelete product failed: ${response.statusText}`);
        return await response.text(); // message only
    }

    // Category api functions
    async getAllCategories(): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/Category`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) throw new Error(`Getting categories failed failed: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('me() error:', error);
            throw error;
        }
    }
}
