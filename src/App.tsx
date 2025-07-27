import Header from "./presentation/components/general-components/Header";
import Footer from "./presentation/components/general-components/Footer";
import {useAuthContext} from "./util/context/AuthContext";
import {useUserContext} from "./util/context/UserContext";
import {createEffect, createSignal} from "solid-js";
import {RemoteRepositoryImpl} from "./repository/RemoteRepositoryImpl";
import {useCartItemsContext} from "./util/context/CartItemsContext";

const repo = new RemoteRepositoryImpl();

function App(props: any) {

    const [token, setToken] = useAuthContext();
    const [user, setUser] = useUserContext();

    const {cartItems,setCartItems} = useCartItemsContext();

    createEffect(() => {
        if(!user() || !token()){
            setUser(null);
            setToken(null);
        }
    })

    createEffect(() => {
        const currentToken = token();

        if (currentToken && !user()) {
            (async () => {
                try {
                    const fetchedUser = await repo.me(currentToken);
                    const adminStatus = await repo.isAdmin(currentToken);
                    const userWithRole = { ...fetchedUser, isAdmin: adminStatus.isAdmin };

                    setUser(userWithRole);
                    localStorage.setItem("combat_user", JSON.stringify(userWithRole));
                } catch (error) {
                    console.error(error);
                    setUser(null);
                }
            })();
        }
    });

    createEffect(async () => {
        const currentToken = token();

        if (currentToken) {
            try{
                const dbCartItems = await repo.getUserCart(currentToken);
                setCartItems(dbCartItems);
            }catch(error){
                setCartItems([]);
                console.log(error);
            }
        }else{
            if(localStorage.getItem("cartItems")){
                setCartItems(
                    JSON.parse(localStorage.getItem("cartItems") || "[]")
                );
            }
            else{
                setCartItems([]);
            }
        }
    })

    return <div class="min-h-screen flex flex-col w-full">
      <Header/>
      <div class="flex-grow">
          {props.children}
      </div>
      <Footer/>
  </div>
}

export default App;
