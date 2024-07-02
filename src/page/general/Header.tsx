import { CSSProperties } from "react";

interface Props {
    showBottomBorder?: boolean;
    style?: CSSProperties;
    children: React.ReactNode;
}

const d = {
    fontSize: 20,
    color: "#FFFFFF",
    padding: "0px 0px 16px 0px"
};

const e = {
    borderBottom: "#FFFFFF33 solid 1px"
};

const barStyle = {
    width: 4,
    height: 24,
    borderRadius: 4,
    verticalAlign: "top",
    display: "inline-block",
    background: "linear-gradient(#5ED8FF, #4D9FFF, #6D57FF)",
    margin: "-4px 8px 0px 0px"
};

function Header({ showBottomBorder, style, children }: Props) {
    var a = { ...d };

    if (showBottomBorder) {
        a = { ...d, ...e };
    }

    return (
        <div style={{ ...a, ...style }}>
            <span style={barStyle}></span>
            {children}
        </div>
    );
}

export default Header;
