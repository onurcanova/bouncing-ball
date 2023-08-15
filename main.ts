
const canvasBall = document.getElementById('myCanvas') as HTMLCanvasElement;
const canvasEuler = document.getElementById('chartEuler') as HTMLCanvasElement;
const canvasVerlet = document.getElementById('chartVerlet') as HTMLCanvasElement
const ctx = canvasBall.getContext('2d');
const ctxEuler = canvasEuler.getContext('2d');
const ctxVerlet = canvasVerlet.getContext('2d');
// initial conditions
const ballRadius = 20;
const gravity = 10; 
const dt = 0.05;
const ballEuler = {
    x: 250,
    y: 100,
    vy: 0,
    color: "rgb(217, 156, 166)",
};
const ballVerlet = {
    x: 750,
    y: 95.2,
    vy: 0,
    color:  "rgb(147, 189, 179)",
};
// draw the balls to canvas
function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}
// implement ball motion using by Euler formula
function updateEuler(ball) {
    ball.vy += gravity * dt;
    ball.y += ball.vy * dt;
}
// implement ball motion using by Verlet formula
function updateVerlet(ball) {
    ball.y += (ball.vy * dt) + (0.5 * gravity * Math.pow(dt, 2));
    ball.vy += gravity * dt; // assume that the gravity is not time-dependent >> a(t) + a(t+1) == 2a
}
// ball ground response
function checkBoundaryCollision(ball) {
    if (ball.y + ballRadius >= (canvasBall.height)) { 
        ball.y = canvasBall.height - ballRadius;
        ball.vy *= -1;

    }
}
// Energy function implements potential energy (mgh), mass is not included since balls are identical
function potEnergy(ball): number {
    return gravity * (canvasBall.height - ball.y);
  }
// Energy function implements kinetical energy, mass is not included since balls are identical
function kinEnergy(ball): number {
    return 0.5 * Math.pow(ball.vy, 2)
}
function initialEnergy(ball): number {
    if (ball == ballEuler) {
        return gravity * (canvasBall.height - 100)
    } else {return gravity * (canvasBall.height - 95.2)}
}
// create a function to fill data points for charts
function updateChartData(chart: Chart, ball: object) {
    chart.data.labels.push(new Date().getSeconds());
    chart.data.datasets[0].data.push(potEnergy(ball));
    chart.data.datasets[1].data.push(kinEnergy(ball));
    chart.data.datasets[2].data.push(potEnergy(ball) + kinEnergy(ball)); // mechanical energy
    chart.data.datasets[3].data.push(initialEnergy(ball)); // initial total energy
    chart.data.datasets[4].data.push(initialEnergy(ball) - (potEnergy(ball) + kinEnergy(ball))); // numerical energy loss
    chart.update();
}
// create charts for both balls
function createRealTimeLineChart() {
    const euler = new Chart(ctxEuler, {
        type: "line",
        data: {   
            datasets: [{
                label: 'Potential Energy',
                data: [],
                borderColor: "rgb(255, 186, 186)",
                },
            {
                label: 'Kinetic Energy',
                data: [],
                borderColor: "rgb(216, 242, 233)",
            },
            {
                label: 'Mechanical Energy',
                data: [],
                borderColor: "rgb(255, 230, 194)",
            },
            {
                label: 'Total Constant Energy',
                data: [],
                borderColor: "rgb(149, 146, 173)", 
            },
            {
                label: 'Numerical Energy Loss',
                data: [],
                borderColor: "rgb(175, 202, 230)",
            }],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            spanGaps: true,
            parsing: false,
            normalized: true,
            animation: false,
            datasets: {
                line: {
                    pointRadius: 0 // disable for all `'line'` datasets
                }
            },
            borderWidth: 2,
        }
    } as any);
    const verlet = new Chart(ctxVerlet, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: 'Potential Energy',
                data: [],
                borderColor: "rgb(255, 186, 186)",
                },
            {
                label: 'Kinetic Energy',
                data: [],
                borderColor: "rgb(216, 242, 233)",
            },
            {
                label: 'Mechanical Energy',
                data: [],
                borderColor: "rgb(255, 230, 194)",
            },
            {
                label: 'Total Constant Energy',
                data: [],
                borderColor: "rgb(149, 146, 173)",
            },
            {
                label: 'Numerical Energy Loss',
                data: [],
                borderColor: "rgb(175, 202, 230)",
            }],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            spanGaps: true,
            parsing: false,
            normalized: true,
            animation: false,
            datasets: {
                line: {
                    pointRadius: 0 // disable for all `'line'` datasets
                }
            },
            borderWidth: 2,
        } 
    } as any);
    setInterval(() => {
        updateChartData(euler, ballEuler);
        updateChartData(verlet, ballVerlet);
      }, 50);   
}
function animate() {
    ctx.clearRect(0, 0, canvasBall.width, canvasBall.height);
    drawBall(ballEuler);
    drawBall(ballVerlet);
    checkBoundaryCollision(ballEuler);
    checkBoundaryCollision(ballVerlet);
    updateEuler(ballEuler);
    updateVerlet(ballVerlet);  
    requestAnimationFrame(animate);
}
document.addEventListener('DOMContentLoaded', createRealTimeLineChart);
animate();

