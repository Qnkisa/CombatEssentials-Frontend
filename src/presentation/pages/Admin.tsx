import {useUserContext} from "../../util/context/UserContext";
import {useNavigate} from "@solidjs/router";
import {createEffect} from "solid-js";

export default function Admin(props: any) {
    const [user, setUser] = useUserContext();

    const navigate = useNavigate();

    createEffect(()=>{
        if(!user() || user()?.isAdmin === false){
            navigate("/*");
        }
    })

    return <div>
        {props.children}
    </div>
}