import { divide } from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Country from "./Country";
import Home from "./Home";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/country/:id" children={<Country />} />
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

if (document.getElementById("root")) {
    ReactDOM.render(<App />, document.getElementById("root"));
}
