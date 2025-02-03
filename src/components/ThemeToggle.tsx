"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "./Button";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            title="Toggle Theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle Theme"
        >
            {theme === "light" ? "🌜" : "😎"}
        </Button>
    );
};

export default ThemeToggle;
