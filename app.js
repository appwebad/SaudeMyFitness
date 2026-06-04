let totalCarbo = 0;
let totalCalorias = 0;
let aguaConsumida = 0;

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzjwB8gVtsB6umfaGODh9YSOKn83bfaIu8HZFOM2Ja2cvyAihFJgY-zAKIMJkEyhhlGFg/exec";

const alimentos = {
  "inhame": { carbo:27, proteina:1.5, gordura:0.2, calorias:118, fibras:4.1 },
  "banana": { carbo:23, proteina:1.1, gordura:0.3, calorias:89, fibras:2.6 },
  "arroz": { carbo:28, proteina:2.7, gordura:0.3, calorias:130, fibras:1.6 },
  "arroz branco": { carbo:28, proteina:2.7, gordura:0.3, calorias:130, fibras:1.6 },
  "batata doce": { carbo:20, proteina:1.6, gordura:0.1, calorias:86, fibras:3 },
  "ovo": { carbo:0.6, proteina:13, gordura:11, calorias:155, fibras:0 },
  "mamão": { carbo:11, proteina:0.5, gordura:0.3, calorias:43, fibras:1.7 },
  "maçã": { carbo:14, proteina:0.3, gordura:0.2, calorias:52, fibras:2.4 },
  "aveia": { carbo:66, proteina:17, gordura:7, calorias:389, fibras:10.6 },
  "couve": { carbo:4.3, proteina:2.9, gordura:0.5, calorias:32, fibras:3.1 },
  "alface": { carbo:2.9, proteina:1.4, gordura:0.2, calorias:15, fibras:1.3 },
  "cenoura": { carbo:10, proteina:0.9, gordura:0.2, calorias:41, fibras:2.8 },
  "beterraba": { carbo:10, proteina:1.6, gordura:0.2, calorias:43, fibras:2.8 },
  "frango": { carbo:0, proteina:31, gordura:3.6, calorias:165, fibras:0 }
};

function entrarApp() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const objetivo = document.getElementById("objetivo").value;

  if (!nome || !email || !objetivo) {
    alert("Preencha todos os campos.");
    return;
  }

  localStorage.setItem("usuarioNome", nome);
  localStorage.setItem("usuarioEmail", email);
  localStorage.setItem("objetivo", objetivo);

  const usuarioNome = document.getElementById("usuarioNome");
  const loginScreen = document.getElementById("loginScreen");
  const app = document.getElementById("app");

  if (usuarioNome) {
    usuarioNome.innerText = "Olá, " + nome + " 👋";
  }

  if (loginScreen) {
    loginScreen.style.display = "none";
  }

  if (app) {
    app.style.display = "block";
  }

  mostrarPagina("dashboardPage");
  atualizarDashboard();

  salvarNaPlanilha({
    tipo: "Login",
    nome: nome,
    email: email,
    objetivo: objetivo,
    alimento: "",
    quantidade: "",
    carboidratos: "",
    calorias: "",
    agua: "",
    energia: "Login realizado",
    intestino: ""
  });
}

  document.getElementById(id).classList.add("active");
}

function voltarDashboard(){
  mostrarPagina("dashboardPage");
}

function calcularAlimento(){
  const nomeAlimento = document.getElementById("alimento").value.toLowerCase().trim();
  const quantidade = parseFloat(document.getElementById("quantidade").value);

  if(nomeAlimento === "" || isNaN(quantidade) || quantidade <= 0){
    alert("Digite o alimento e a quantidade corretamente.");
    return;
  }

  const dados = alimentos[nomeAlimento] || {
    carbo:10,
    proteina:1,
    gordura:0.5,
    calorias:60,
    fibras:1
  };

  const carbo = (dados.carbo * quantidade) / 100;
  const proteina = (dados.proteina * quantidade) / 100;
  const gordura = (dados.gordura * quantidade) / 100;
  const calorias = (dados.calorias * quantidade) / 100;
  const fibras = (dados.fibras * quantidade) / 100;

  totalCarbo += carbo;
  totalCalorias += calorias;

  document.getElementById("resultado").innerHTML = `
    <h3>Resultado</h3>
    <p><strong>Alimento:</strong> ${nomeAlimento}</p>
    <p><strong>Quantidade:</strong> ${quantidade}g</p>
    <p><strong>Carboidratos:</strong> ${carbo.toFixed(1)}g</p>
    <p><strong>Proteínas:</strong> ${proteina.toFixed(1)}g</p>
    <p><strong>Gorduras:</strong> ${gordura.toFixed(1)}g</p>
    <p><strong>Calorias:</strong> ${calorias.toFixed(0)} kcal</p>
    <p><strong>Fibras:</strong> ${fibras.toFixed(1)}g</p>
  `;

  const dadosPlanilha = {
    nome: localStorage.getItem("usuarioNome") || "",
    email: localStorage.getItem("usuarioEmail") || "",
    objetivo: localStorage.getItem("objetivo") || "",
    alimento: nomeAlimento,
    quantidade: quantidade + "g",
    carboidratos: carbo.toFixed(1),
    calorias: calorias.toFixed(0),
    agua: (aguaConsumida / 1000).toFixed(1) + "L",
    energia: definirEnergia(),
    intestino: definirIntestino()
  };

  salvarNaPlanilha(dadosPlanilha);
  atualizarDashboard();
  mostrarPagina("dashboardPage");
}

function adicionarAgua(ml){
  aguaConsumida += ml;

  atualizarDashboard();

  const litros = aguaConsumida / 1000;
  const falta = Math.max(2.1 - litros, 0);

  document.getElementById("aguaMensagem").innerText =
    falta > 0
    ? `Faltam ${falta.toFixed(1)}L para sua meta diária.`
    : "Parabéns! Você bateu sua meta de água.";

  const dadosPlanilha = {
    nome: localStorage.getItem("usuarioNome") || "",
    email: localStorage.getItem("usuarioEmail") || "",
    objetivo: localStorage.getItem("objetivo") || "",
    alimento: "Água",
    quantidade: ml + "ml",
    carboidratos: "0",
    calorias: "0",
    agua: litros.toFixed(1) + "L",
    energia: definirEnergia(),
    intestino: definirIntestino()
  };

  salvarNaPlanilha(dadosPlanilha);
}

function atualizarDashboard(){
  const litros = aguaConsumida / 1000;
  const caloriasPercentual = Math.min((totalCalorias / 2100) * 100, 100);

  document.getElementById("carboTotal").innerText = totalCarbo.toFixed(0) + "g";
  document.getElementById("aguaTotal").innerText = litros.toFixed(1) + "L";
  document.getElementById("aguaCircle").innerText = litros.toFixed(1) + "L";
  document.getElementById("caloriasTotal").innerText = totalCalorias.toFixed(0) + " kcal";
  document.getElementById("caloriasBar").style.width = caloriasPercentual + "%";

  document.getElementById("relCarbo").innerText = totalCarbo.toFixed(0) + "g";
  document.getElementById("relAgua").innerText = litros.toFixed(1) + "L";
  document.getElementById("relCalorias").innerText = totalCalorias.toFixed(0) + " kcal";

  document.getElementById("energiaTotal").innerText = definirEnergia();
  document.getElementById("intestinalTotal").innerText = definirIntestino();

  if(litros >= 1.8){
    document.getElementById("scoreIntestinal").innerText = "85%";
  }else{
    document.getElementById("scoreIntestinal").innerText = "60%";
  }
}

function definirEnergia(){
  if(totalCarbo < 80){
    return "Baixa";
  }else if(totalCarbo <= 250){
    return "Boa";
  }else{
    return "Alta";
  }
}

function definirIntestino(){
  const litros = aguaConsumida / 1000;

  if(litros >= 1.8){
    return "Equilibrado";
  }else{
    return "Atenção";
  }
}

function salvarNaPlanilha(dados){
  if(WEBAPP_URL === "https://script.google.com/macros/s/AKfycbzjwB8gVtsB6umfaGODh9YSOKn83bfaIu8HZFOM2Ja2cvyAihFJgY-zAKIMJkEyhhlGFg/exec"){
    console.log("URL do Apps Script ainda não configurada.", dados);
    return;
  }

  fetch(WEBAPP_URL,{
    method:"POST",
    mode:"no-cors",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(dados)
  });

  console.log("Dados enviados para a planilha:", dados);
}

function responderIA(){
  const pergunta = document.getElementById("perguntaIA").value.trim();

  if(pergunta === ""){
    return;
  }

  const chat = document.getElementById("chat");

  chat.innerHTML += `<div class="user">${pergunta}</div>`;

  let resposta = "Para melhorar sua alimentação, mantenha boa hidratação, inclua fibras e prefira alimentos naturais.";

  if(pergunta.toLowerCase().includes("carbo")){
    resposta = `Hoje você consumiu aproximadamente ${totalCarbo.toFixed(0)}g de carboidratos.`;
  }

  if(pergunta.toLowerCase().includes("água") || pergunta.toLowerCase().includes("agua")){
    resposta = `Você bebeu ${(aguaConsumida / 1000).toFixed(1)}L de água. Sua meta é 2,1L por dia.`;
  }

  if(pergunta.toLowerCase().includes("intestino")){
    resposta = "Para ajudar o intestino, consuma água, mamão, aveia, chia, linhaça, verduras e legumes.";
  }

  chat.innerHTML += `<div class="bot">${resposta}</div>`;

  document.getElementById("perguntaIA").value = "";
  chat.scrollTop = chat.scrollHeight;
}

function sairApp(){
  localStorage.clear();
  totalCarbo = 0;
  totalCalorias = 0;
  aguaConsumida = 0;

  document.getElementById("app").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
}

window.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");
  const loginScreen = document.getElementById("loginScreen");

  if (app) {
    app.style.display = "none";
  }

  if (loginScreen) {
    loginScreen.style.display = "flex";
  }
});

