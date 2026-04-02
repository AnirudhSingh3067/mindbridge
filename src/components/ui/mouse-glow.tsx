"use client";

import { useEffect, useState, useRef } from "react";

export function MouseGlow() {
    const [position, setPosition] = useState({ x: -1000, y: -1000 });
    const requestRef = useRef<number>(0);
    const targetPosition = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        // Hide on small screens for performance
        if (window.innerWidth < 768) return;

        const handleMouseMove = (e: MouseEvent) => {
            targetPosition.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            setPosition((prev) => {
                // Linear interpolation for smooth trailing effect
                const ease = 0.1;
                const dx = targetPosition.current.x - prev.x;
                const dy = targetPosition.current.y - prev.y;

                // Only update state if movement is significant enough to avoid micro-renders
                if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                    return {
                        x: prev.x + dx * ease,
                        y: prev.y + dy * ease,
                    };
                }
                return prev;
            });
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
            style={{
                background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.06), transparent 40%)`,
            }}
        />
    );
}
