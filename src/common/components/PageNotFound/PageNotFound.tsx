import { Path } from "@/common/routing"
import Button from "@mui/material/Button"
import { Link } from "react-router"
import styles from "./PageNotFound.module.css"

export const PageNotFound = () => (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>page not found</h2>
        <Button
            component={Link}
            to={Path.Main}
            variant={"contained"}
            sx={{ width: "150px", margin: "auto", mt: "30px" }}
        >
            Back home
        </Button>
    </div>
)
