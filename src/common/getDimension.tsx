import { useState, useEffect, useRef } from "react";

export default function () {
    const ref = useRef(null);
    const [dimension, setDimension] = useState({
        width: 0,
        height: 0
    });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const { width, height } = entry.contentRect;
                setDimension({ width, height });
            });
        });

        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        return function () {
            if (ref.current) {
                resizeObserver.unobserve(ref.current);
            }
        };
    }, []);

    return { ref: ref, ...dimension };
}
