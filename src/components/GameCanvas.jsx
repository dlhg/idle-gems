import React, { useState, useRef, useEffect } from 'react';

function GameCanvas() {
    const canvasRef = useRef(null);
    const ballIdRef = useRef(0); // Ref to keep track of the next ball ID

    const [balls, setBalls] = useState([]);
    const ballRadius = 20;
    const canvasWidth = 800;
    const canvasHeight = 600;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let animationFrameId;

        const drawBall = (ball) => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        };
        const updateBallPosition = (ball) => {
            ball.x += ball.speed * Math.cos(ball.direction);
            ball.y += ball.speed * Math.sin(ball.direction);

            // Collision with canvas borders
            if (ball.x + ballRadius > canvasWidth || ball.x - ballRadius < 0) {
                ball.direction = Math.PI - ball.direction;
            }
            if (ball.y + ballRadius > canvasHeight || ball.y - ballRadius < 0) {
                ball.direction *= -1;
            }
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => {
                updateBallPosition(ball);
                drawBall(ball);
            });
            animationFrameId = requestAnimationFrame(update);
        };

        update();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [balls]);

    const spawnBall = () => {
        let newBall; // Declared outside the loop
        let overlap;
        do {
            overlap = false;
            const x = Math.random() * (canvasWidth - ballRadius * 2) + ballRadius;
            const y = Math.random() * (canvasHeight - ballRadius * 2) + ballRadius;
            newBall = { // Assigning to the newBall declared outside
                id: ballIdRef.current,
                x, y, speed: 5, direction: Math.random() * 2 * Math.PI, damage: 1
            };

            // Check for overlap with existing balls
            for (const ball of balls) {
                const dx = ball.x - newBall.x;
                const dy = ball.y - newBall.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < ballRadius * 2) {
                    overlap = true;
                    break;
                }
            }
        } while (overlap);
        ballIdRef.current += 1;
        console.log([...balls, newBall])
        setBalls([...balls, newBall]);
    };


    return (
        <div>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
            <button onClick={spawnBall}>Spawn Blue Ball</button>
        </div>
    );
}

export default GameCanvas;
