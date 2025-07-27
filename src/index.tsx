/* @refresh reload */
import {render} from 'solid-js/web'
import './index.css'
import App from './App'
import {Route, Router} from "@solidjs/router";
import Home from "./presentation/pages/Home";
import Products from "./presentation/pages/Products";
import {UserProvider} from "./util/context/UserContext";
import {AuthProvider} from "./util/context/AuthContext";
import Profile from "./presentation/pages/Profile";
import Admin from "./presentation/pages/Admin";
import About from "./presentation/pages/About";
import Contact from "./presentation/pages/Contact";
import Details from "./presentation/pages/Details";
import Terms from "./presentation/pages/Terms";
import ReturnPolicy from "./presentation/pages/ReturnPolicy";
import Cart from "./presentation/pages/Cart";
import PageNotFound from "./presentation/pages/PageNotFound";
import AdminProducts from "./presentation/components/admin/admin-pages/AdminProducts";
import AdminOrders from "./presentation/components/admin/admin-pages/AdminOrders";
import ProfileInfo from "./presentation/components/profile/profile-pages/ProfileInfo";
import ProfileWishlist from "./presentation/components/profile/profile-pages/ProfileWishlist";
import ProfileOrders from "./presentation/components/profile/profile-pages/ProfileOrders";
import {CartItemsProvider} from "./util/context/CartItemsContext";
import CartItems from "./presentation/components/cart/pages/CartItems";
import CartCheckout from "./presentation/components/cart/pages/CartCheckout";
import OrderSuccess from "./presentation/pages/OrderSuccess";

const root = document.getElementById('root')

render(() => (
    <AuthProvider>
        <CartItemsProvider>
            <UserProvider>
                <Router root={App}>
                    <Route path="/" component={Home}/>
                    <Route path="/products" component={Products}/>
                    <Route path="/profile" component={Profile}>
                        <Route path="/" component={ProfileInfo}/>
                        <Route path="/info" component={ProfileInfo}/>
                        <Route path="/orders" component={ProfileOrders}/>
                        <Route path="/wishlist" component={ProfileWishlist}/>
                    </Route>
                    <Route path="/admin" component={Admin}>
                        <Route path="/" component={AdminProducts}/>
                        <Route path="/products" component={AdminProducts}/>
                        <Route path="/orders" component={AdminOrders}/>
                    </Route>
                    <Route path="/about" component={About}/>
                    <Route path="/contact" component={Contact}/>
                    <Route path="/details/:id" component={Details}/>
                    <Route path="/terms" component={Terms}/>
                    <Route path="/return" component={ReturnPolicy}/>
                    <Route path="/cart" component={Cart}>
                        <Route path="/" component={CartItems}/>
                        <Route path="/items" component={CartItems}/>
                        <Route path="/checkout" component={CartCheckout}/>
                    </Route>
                    <Route path="order-success" component={OrderSuccess}/>
                    <Route path="*" component={PageNotFound}/>
                </Router>
            </UserProvider>
        </CartItemsProvider>
    </AuthProvider>
), root!)
