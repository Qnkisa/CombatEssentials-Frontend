export interface RemoteRepository {
    // Auth api functions

    login(email: string, password: string): Promise<any>;
    register(firstName: string, lastName: string, email: string, password: string): Promise<any>;
    me(bearer: string): Promise<any>;
    isAdmin(bearer: string): Promise<any>;

    // Admin products api functions

    getAllAdminProducts(bearer: string, page?: number, categoryId?: number, name?: string): Promise<any>;
    createAdminProduct(bearer: string, formData: FormData): Promise<any>;
    updateAdminProduct(bearer: string, id: number, formData: FormData): Promise<any>;
    deleteAdminProduct(bearer: string, id: number): Promise<any>;
    undeleteAdminProduct(bearer: string, id: number): Promise<any>;

    // Admin orders api functions
    getAllAdminOrders(bearer: string, page?: number): Promise<any>;
    getAdminOrderById(bearer: string, id: number): Promise<any>;
    updateAdminOrder(bearer: string, id: number, updateOrderDto: any): Promise<any>;

    // Category api functions
    getAllCategories(): Promise<any>;

    // Products api functions
    getRandomProducts(): Promise<any>;
    getAllProducts(page?: number, categoryId?: number, name?: string): Promise<any>;
    getProductById(productId: number): Promise<any>;

    // Wishlist api functions
    addToWishlist(bearer: string, productId: number): Promise<any>;
    removeFromWishlist(bearer: string, productId: number): Promise<any>;
    getUserWishlist(bearer: string): Promise<any>;

    // Review api functions
    getAllProductReviews(productId: number): Promise<any>;
    getProductAverageRating(productId: number): Promise<any>;
    createProductReview(bearer: string, productId: number, rating: number, comment: string): Promise<any>;
    deleteProductReview(bearer: string, reviewId: number): Promise<any>;
}