import { App } from "@/app/App"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "@/app/store"
import { HashRouter } from "react-router"

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
)
