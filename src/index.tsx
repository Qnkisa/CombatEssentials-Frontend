/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.tsx'
import {Route, Router} from "@solidjs/router";
import Home from "./presentation/pages/Home.tsx";
import Products from "./presentation/pages/Products.tsx";

const root = document.getElementById('root')

render(() => (
    <Router root={App}>
        <Route path="/" component={Home}/>
        <Route path="/products" component={Products}/>
    </Router>
), root!)
