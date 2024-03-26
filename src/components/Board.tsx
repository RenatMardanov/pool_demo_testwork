import React, { useEffect, useRef, useState } from "react";
import { IBall } from "../types/types";
import { handleBallCollision, handleBorderCollision } from "../core/physics";

export const Board: React.FC = () => {
    const boardRef = useRef<HTMLCanvasElement>(null);
    const [balls, setBalls] = useState<IBall[]>([
        {
            x: 555,
            y: 200,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 585,
            y: 200,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 615,
            y: 200,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 645,
            y: 200,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 675,
            y: 200,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 510,
            y: 180,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 540,
            y: 180,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 570,
            y: 180,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 600,
            y: 180,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 630,
            y: 180,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
        {
            x: 660,
            y: 180,
            radius: 20,
            color: "white",
            isDropped: false,
            velocityX: 0,
            velocityY: 0,
        },
    ]);

    const [damping, setDamping] = useState<number>(0.995); // Коэффициент затухания

    useEffect(() => {
        if (!boardRef.current) return;
        const ctx = boardRef.current.getContext("2d");
        if (!ctx) return;

        const boardWidth = ctx.canvas.width;
        const boardHeight = ctx.canvas.height;
        const restitution = 0.8; // Коэффициент упругости

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

            const hitSpeed = 5;
            ball.velocityX = Math.cos(angle) * hitSpeed;
            ball.velocityY = Math.sin(angle) * hitSpeed;

            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            handleBorderCollision(ball, boardWidth, boardHeight, restitution);

            balls.forEach((otherBall) => {
                if (ball !== otherBall) {
                    handleBallCollision(ball, otherBall, restitution);
                }
            });

            if (Math.abs(ball.velocityX) < 0.5) ball.velocityX = 0;
            if (Math.abs(ball.velocityY) < 0.5) ball.velocityY = 0;
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

        const animate = () => {
            drawBalls();
            balls.forEach((ball) => {
                ball.velocityX *= damping;
                ball.velocityY *= damping;
                ball.x += ball.velocityX;
                ball.y += ball.velocityY;

                handleBorderCollision(ball, boardWidth, boardHeight, restitution);

                balls.forEach((otherBall) => {
                    if (ball !== otherBall) {
                        handleBallCollision(ball, otherBall, restitution);
                    }
                });
            });
            requestAnimationFrame(animate);
        };

        boardRef.current?.addEventListener("mousemove", handleMouseMove);

        animate();

        return () => {
            ctx.clearRect(0, 0, boardWidth, boardHeight);
        };
    }, [balls, damping]);
    console.log("render");
    return (
        <div>
            <canvas width={1200} height={600} ref={boardRef} className="relative"></canvas>
        </div>
    );
};
