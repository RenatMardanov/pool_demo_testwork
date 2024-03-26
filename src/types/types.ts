export interface IBall {
    x: number;
    y: number;
    radius: number;
    color: string;
    isDropped: boolean;
    velocityX: number; // добавляем скорость по X
    velocityY: number;
}
