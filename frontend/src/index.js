import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faKey, faUser, faAt, faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';

library.add(fab, faCheckSquare, faCoffee, faUser, faAt, faKey);

ReactDOM.render(<Routes />, document.getElementById("root"));
