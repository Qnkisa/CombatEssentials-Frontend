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

        if (!response.ok) {
            throw new Error(`Update product failed: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }
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

    // Admin orders api functions
    async getAllAdminOrders(bearer: string, page: number = 1): Promise<any> {
        const url = `${this.apiUrl}/admin/orders?page=${page}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch admin orders: ${response.statusText}`);
        return await response.json();
    }

    async getAdminOrderById(bearer: string, id: number): Promise<any> {
        const response = await fetch(`${this.apiUrl}/admin/orders/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('Order not found');
            throw new Error(`Failed to fetch order: ${response.statusText}`);
        }

        return await response.json();
    }

    async updateAdminOrder(bearer: string, id: number, updateOrderDto: any): Promise<any> {
        const response = await fetch(`${this.apiUrl}/admin/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateOrderDto),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to update order: ${text}`);
        }

        const contentType = response.headers.get("content-type");
        return contentType?.includes("application/json")
            ? await response.json()
            : await response.text();
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

    // Products api functions
    async getRandomProducts(): Promise<any> {
        const response = await fetch(`${this.apiUrl}/Product/random`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch random products: ${response.statusText}`);
        return await response.json();
    }

    async getAllProducts(page?: number, categoryId?: number, name?: string): Promise<any> {
        const params = new URLSearchParams();
        if (page !== undefined) params.append("page", page.toString());
        if (categoryId !== undefined) params.append("categoryId", categoryId.toString());
        if (name) params.append("name", name);

        const queryString = params.toString();
        const url = `${this.apiUrl}/Product${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        return await response.json();
    }

    async getProductById(productId: number): Promise<any>{
        const response = await fetch(`${this.apiUrl}/Product/${productId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch random products: ${response.statusText}`);
        return await response.json();
    }

    // Wishlist api functions
    async addToWishlist(token: string, productId: number) {
        const response = await fetch(`${this.apiUrl}/Wishlist/${productId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Wishlist error:", errorData.message);
            throw new Error(errorData.message);
        }

        return response.json();
    }

    async removeFromWishlist(bearer: string, productId: number): Promise<any>{
        const response = await fetch(`${this.apiUrl}/Wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${bearer}`,
            },
        });

        if (!response.ok) throw new Error(`Failed to remove product from wishlist: ${response.statusText}`);
        return await response.json();
    }

    async getUserWishlist(bearer: string): Promise<any>{
        const response = await fetch(`${this.apiUrl}/Wishlist`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${bearer}`,
            },
        });

        if (!response.ok) throw new Error(`Failed to get user wishlist: ${response.statusText}`);
        return await response.json();
    }

}
