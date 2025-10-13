import {type ReactNode, useEffect, useState} from "react";

const IMAGES: string[] = [
    "img/background/1.jpg",
]

type Props = {
    children?: ReactNode;
    className?: string;
    images?: string[];
}

function BackGround({
    children,
    className = "",
    images = IMAGES,
                    } : Props ) {
    const [src, setSrc] = useState<string>("");

    useEffect(() => {
        if (images.length) {
            const i = Math.floor(Math.random() * images.length);
            setSrc(images[i]);
        }
    }, [images]);

    console.log("[BackGround] current image src =", src);

    return (
        <div
            className={[
                "min-h-screen",
                "bg-no-repeat bg-center bg-cover",
                className,
            ].join(" ")}
            style={src ? { backgroundImage: `url("${src}")` } : undefined}
        >
            {children}
        </div>
    );
}


export default BackGround;