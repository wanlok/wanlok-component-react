import image from "../../assets/images/icons/search.gif";
import classes from "./MyButton.module.css";

function MyButton() {
    return (
        <a
            href="#"
            className={classes.myButton}
            style={{ height: 40, width: 100 }}
        >
            <svg width="100px" height="40px" viewBox="0 0 100 40">
                <polyline points="100,0 100,40 0,40 0,0 100,0" />
                <polyline points="100,0 100,40 0,40 0,0 100,0" />
            </svg>
            <span className={classes.primary}>Search</span>
            <span className={classes.secondary}>
                <img src={image} />
            </span>
        </a>
    );
}

export default MyButton;
