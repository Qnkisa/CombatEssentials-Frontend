import {useAuthContext} from "../../util/context/AuthContext";
import {onMount} from "solid-js";
import {useNavigate} from "@solidjs/router";

export default function Profile(props: any){
    const [user] = useAuthContext();
    const navigate = useNavigate();

    onMount(() => {
        if(!user()){
            navigate("/*");
        }
    })

    return <div>
        {props.children}
    </div>
}