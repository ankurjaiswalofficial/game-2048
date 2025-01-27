import React from "react";

const Info: React.FC = () => {
    return (
        <div className="space-y-2">
            <h2 className="text-lg pt-4 pb-2 font-semibold">About</h2>
            <p className="text-sm">
                This is a reimplementation of{" "}
                <a className="font-semibold" href="https://play2048.co/">2048</a> game, built with
                Next.js, React.js, Redux Toolkit, TypeScript, and Tailwind CSS.
                Unlike other React-based implementations, only functional
                components are used here. This project doesn&apos;t rely on
                canvas or element refs.
            </p>
            <p className="text-sm">
                Developed by{" "}
                <a className="font-semibold" href="https://github.com/ankurjaiswalofficial">
                    Ankur Jaiswal
                </a>. Source code available at{" "}
                <a className="font-semibold" href="https://github.com/ankurjaiswalofficial/game-2048">
                    ankurjaiswalofficial/game-2048
                </a>.
            </p>
        </div>
    );
};

export default Info;
