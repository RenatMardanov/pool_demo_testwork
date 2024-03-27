import React, { useEffect, useRef, useState } from "react";
import { IBall } from "../types/types";
import { handleBallCollision, handleBorderCollision } from "../core/physics";

export const Board: React.FC = () => {
    const boardRef = useRef<HTMLCanvasElement>(null);
    const [config, setConfig] = useState({
        damping: 0.995,
        hitSpeed: 5,
        restitution: 0.8,
    });
    const [balls, setBalls] = useState<IBall[]>([
        {
            x: 555,
            y: 200,
            radius: 20,
            color: "white",
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 555,
            y: 200,
            radius: 20,
            color: "white",
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 555,
            y: 200,
            radius: 20,
            color: "white",
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 555,
            y: 200,
            radius: 20,
            color: "white",
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 555,
            y: 250,
            radius: 20,
            color: "white",
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 555,
            y: 350,
            radius: 20,
            color: "white",
            velocityX: 0,
            velocityY: 0,
        },
    ]);

    useEffect(() => {
        if (!boardRef.current) return;
        const ctx = boardRef.current.getContext("2d");
        if (!ctx) return;

        const boardWidth = ctx.canvas.width;
        const boardHeight = ctx.canvas.height;

        const drawBalls = () => {
            ctx.clearRect(0, 0, boardWidth, boardHeight);
            ctx.fillStyle = "#006400";
            ctx.fillRect(0, 0, boardWidth, boardHeight);

            balls.forEach((ball) => {
                const { x, y, radius, color } = ball;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            });
        };

        const updateBallPosition = (ball: IBall, mouseX: number, mouseY: number) => {
            const angle = Math.atan2(mouseY - ball.y, mouseX - ball.x);

            ball.velocityX = -Math.cos(angle) * config.hitSpeed;
            ball.velocityY = -Math.sin(angle) * config.hitSpeed;

            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            handleBorderCollision(ball, boardWidth, boardHeight, config.restitution);

            balls.forEach((otherBall) => {
                if (ball !== otherBall) {
                    handleBallCollision(ball, otherBall, config.restitution);
                }
            });

            if (Math.abs(ball.velocityX) < 0.5) ball.velocityX = 0;
            if (Math.abs(ball.velocityY) < 0.5) ball.velocityY = 0;
            boardRef.current?.removeEventListener("mousemove", handleMouseMove);
        };
        const animate = () => {
            drawBalls();
            balls.forEach((ball) => {
                ball.velocityX *= config.damping;
                ball.velocityY *= config.damping;
                ball.x += ball.velocityX;
                ball.y += ball.velocityY;

                handleBorderCollision(ball, boardWidth, boardHeight, config.restitution);

                balls.forEach((otherBall) => {
                    if (ball !== otherBall) {
                        handleBallCollision(ball, otherBall, config.restitution);
                    }
                });
            });
            requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = boardRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            balls.forEach((ball) => {
                if (
                    mouseX > ball.x - ball.radius &&
                    mouseX < ball.x + ball.radius &&
                    mouseY > ball.y - ball.radius &&
                    mouseY < ball.y + ball.radius
                ) {
                    updateBallPosition(ball, mouseX, mouseY);
                }
            });
        };

        const handleMouseDown = () => {
            boardRef.current?.addEventListener("mousemove", handleMouseMove);
        };

        const handleMouseUp = () => {
            boardRef.current?.removeEventListener("mousemove", handleMouseMove);
        };

        boardRef.current?.addEventListener("mousedown", handleMouseDown);
        boardRef.current?.addEventListener("mouseup", handleMouseUp);

        animate();
        setBalls;
        setConfig;

        return () => {
            ctx.clearRect(0, 0, boardWidth, boardHeight);
        };
    }, [balls, config]);

    return (
        <div className="flex justify-center items-center min-h-dvh">
            <canvas width={1200} height={600} ref={boardRef}></canvas>
        </div>
    );
};
