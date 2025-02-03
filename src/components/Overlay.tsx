"use client";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    StateType,
    reset as resetAction,
    dismissVictory as dismissAction,
} from "@/store/slices/applicationSlice";
import Button from "./Button";

const Overlay: React.FC = () => {
    const dispatch = useDispatch();
    const reset = useCallback(() => dispatch(resetAction()), [dispatch]);
    const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

    const defeat = useSelector((state: StateType) => state.defeat);
    const victory = useSelector(
        (state: StateType) => state.victory && !state.victoryDismissed
    );

    if (victory) {
        return (
            <div className="overlay overlay-victory">
                <h1>You win!</h1>
                <div className="overlay-buttons">
                    <Button onClick={dismiss}>Keep going</Button>
                    <Button onClick={reset}>Try again</Button>
                </div>
            </div>
        );
    }

    if (defeat) {
        return (
            <div className="overlay overlay-defeat">
                <h1>Game over!</h1>
                <div className="overlay-buttons">
                    <Button onClick={reset}>Try again</Button>
                </div>
            </div>
        );
    }

    return null;
};

export default Overlay;
