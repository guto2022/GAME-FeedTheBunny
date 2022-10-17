const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var solo;
var fruta, corda;
var conexao_fruta_corda;
var botao;

var cenarioIMG, frutaIMG, coelhoIMG, coelho;

var piscando, triste, comendo;

var botaoVentilador;

var celular;

function preload() {

    cenarioIMG = loadImage("background.png");
    frutaIMG = loadImage("fruta.png");
    coelhoIMG = loadImage("coelho.png");

    piscando = loadAnimation("piscar1.png", "piscar2.png", "piscar3.png");
    comendo = loadAnimation("comer1.png", "comer2.png", "comer3.png", "comer4.png", "comer5.png");

    //adicionar a animação triste
    triste = loadAnimation("triste1.png", "triste2.png", "triste3.png");
    

    //configurar as animações
    piscando.looping = true
    triste.looping = false
    comendo.looping = false
}


function setup() {
    celular = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if(celular){
        canW = displayWidth;
        canH = displayHeight;
        createCanvas(displayWidth+80, displayHeight);
    }else{
        canW = windowWidth;
        canH = windowHeight;
        createCanvas(windowWidth, windowHeight);
    }   
    frameRate(80);


    botao = createImg("botãoCortar.png");
    botao.position(20,30);
    botao.size(50, 50);
    botao.mouseClicked(soltar);

    botao2 = createImg("botãoCortar.png");
    botao2.position(330, 35);
    botao2.size(50, 50);
    botao2.mouseClicked(soltar1);

    botao3 = createImg("botãoCortar.png");
    botao3.position(360, 200);
    botao3.size(50, 50);
    botao3.mouseClicked(soltar2);



    engine = Engine.create();
    world = engine.world;
    solo = new Ground(canW/2, canH, canW, 20);

    corda = new Rope(8, { x: 40, y: 30 });
    corda1 = new Rope(7, { x: 370, y: 40 });
    corda2 = new Rope(4, { x: 400, y: 225 });
    fruta = Bodies.circle(300, 300, 20);
    Composite.add(corda.body, fruta);

    con_fruta_corda = new Link(corda, fruta);
    con_fruta_corda1 = new Link(corda1, fruta);
    con_fruta_corda2 = new Link(corda2, fruta);

    //definir a velocidade das animações
    triste.frameDelay = 40
    piscando.frameDelay = 25
    comendo.frameDelay = 15

    coelho = createSprite(170, canH-80, 50, 50);
    coelho.addImage(coelhoIMG);
    //adicionar as animações
    coelho.addAnimation("triste", triste);
    coelho.addAnimation("piscando", piscando);
    coelho.addAnimation("comendo", comendo);
    coelho.changeAnimation("piscando");

    coelho.scale = 0.15

    rectMode(CENTER);
    ellipseMode(RADIUS);

    textSize(50)


}

function draw() {
    image(cenarioIMG, 0, 0, canW, canH);
    corda.show();
    corda1.show();
    corda2.show();
    imageMode(CENTER);
    coelho.x = mouseX;

    Engine.update(engine);
    solo.show();

    if (fruta !== null) {
        image(frutaIMG, fruta.position.x, fruta.position.y, 60, 60);
    }

    //verificar se a fruta colidiu com o coelho
    if(colidiu(fruta, coelho)==true){
        coelho.changeAnimation("comendo");
    }
    //verificar se a fruta colidiu com o solo
    if(colidiu(fruta, solo.body)==true){
        coelho.changeAnimation("triste")
    }


    drawSprites();

}

function soltar() {
    corda.break();
    con_fruta_corda.detach();
    con_fruta_corda = null;
}

function soltar1() {
    corda1.break();
    con_fruta_corda1.detach();
    con_fruta_corda1 = null;
}

function soltar2() {
    corda2.break();
    con_fruta_corda2.detach();
    con_fruta_corda2 = null;
}

function colidiu(corpo, sprite){
    if(fruta !==null){
        var distancia = dist(
            corpo.position.x, corpo.position.y,
            sprite.position.x, sprite.position.y
        );
        console.log(distancia);
        if(distancia <=80){
            World.remove(world, fruta);
            fruta = null;
            return true;
        }else{
            return false;
        }
    }
}