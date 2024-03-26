import { IBall } from "../types/types";

export const handleBorderCollision = (
    ball: IBall,
    boardWidth: number,
    boardHeight: number,
    restitution: number
) => {
    if (ball.x + ball.radius >= boardWidth) {
        ball.x = boardWidth - ball.radius;
        ball.velocityX = -ball.velocityX * restitution;
    }
    if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.velocityX = -ball.velocityX * restitution;
    }
    if (ball.y + ball.radius >= boardHeight) {
        ball.y = boardHeight - ball.radius;
        ball.velocityY = -ball.velocityY * restitution;
    }
    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.velocityY = -ball.velocityY * restitution;
    }
};

export const handleBallCollision = (ball: IBall, otherBall: IBall, restitution: number) => {
    const dx = ball.x - otherBall.x;
    const dy = ball.y - otherBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + otherBall.radius) {
        const angle = Math.atan2(dy, dx);
        const sine = Math.sin(angle);
        const cosine = Math.cos(angle);

        const velocityX1 = ball.velocityX * cosine + ball.velocityY * sine;
        const velocityY1 = ball.velocityY * cosine - ball.velocityX * sine;

        const velocityX2 = otherBall.velocityX * cosine + otherBall.velocityY * sine;
        const velocityY2 = otherBall.velocityY * cosine - otherBall.velocityX * sine;

        const finalVelocityX1 =
            ((ball.radius - otherBall.radius) * velocityX1 +
                (otherBall.radius + otherBall.radius) * velocityX2) /
            (ball.radius + otherBall.radius);
        const finalVelocityX2 =
            ((ball.radius + ball.radius) * velocityX1 +
                (otherBall.radius - ball.radius) * velocityX2) /
            (ball.radius + otherBall.radius);

        const finalVelocityY1 = velocityY1;
        const finalVelocityY2 = velocityY2;

        ball.velocityX = finalVelocityX1 * cosine - finalVelocityY1 * sine;
        ball.velocityY = finalVelocityY1 * cosine + finalVelocityX1 * sine;
        otherBall.velocityX = finalVelocityX2 * cosine - finalVelocityY2 * sine;
        otherBall.velocityY = finalVelocityY2 * cosine + finalVelocityX2 * sine;

        const overlap = ball.radius + otherBall.radius - distance;
        ball.x += overlap * Math.cos(angle);
        ball.y += overlap * Math.sin(angle);

        ball.velocityX *= restitution;
        ball.velocityY *= restitution;
        otherBall.velocityX *= restitution;
        otherBall.velocityY *= restitution;
    }
};
