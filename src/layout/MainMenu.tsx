import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./MainMenu.module.css";
import routes from "../routes";

interface Props {
    fullWidth: boolean;
}

export default function ({ fullWidth }: Props) {
    return (
        <>
            {routes.map((routes, index) => {
                return routes.children.map((route, index) => {
                    return (
                        <Link to={route.path} key={index}>
                            <Button
                                variant="text"
                                fullWidth={fullWidth}
                                className={styles.button}
                            >
                                {route.name}
                            </Button>
                        </Link>
                    );
                });
            })}
        </>
    );
}
