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

function entrarApp(){
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const objetivo = document.getElementById("objetivo").value;

  if(!nome || !email || !objetivo){
    alert("Preencha todos os campos.");
    return;
  }

  localStorage.setItem("usuarioNome", nome);
  localStorage.setItem("usuarioEmail", email);
  localStorage.setItem("objetivo", objetivo);

  document.getElementById("usuarioNome").innerText = "Olá, " + nome + " 👋";
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "block";

  mostrarPagina("dashboardPage");
  atualizarDashboard();

  salvarNaPlanilha({
    tipo:"Login",
    nome:nome,
    email:email,
    objetivo:objetivo,
    alimento:"",
    quantidade:"",
    carboidratos:"",
    calorias:"",
    agua:"",
    energia:"Login realizado",
    intestino:""
  });
}

function mostrarPagina(id){
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const pagina = document.getElementById(id);

  if(pagina){
    pagina.classList.add("active");
  }
}

function voltarDashboard(){
  mostrarPagina("dashboardPage");
}

function calcularAlimento(){
  const nomeAlimento = document.getElementById("alimento").value.toLowerCase().trim();
  const quantidade = parseFloat(document.getElementById("quantidade").value);

  if(!nomeAlimento || isNaN(quantidade) || quantidade <= 0){
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

  salvarNaPlanilha({
    tipo:"Alimentação",
    nome:localStorage.getItem("usuarioNome") || "",
    email:localStorage.getItem("usuarioEmail") || "",
    objetivo:localStorage.getItem("objetivo") || "",
    alimento:nomeAlimento,
    quantidade:quantidade + "g",
    carboidratos:carbo.toFixed(1),
    calorias:calorias.toFixed(0),
    agua:(aguaConsumida / 1000).toFixed(1) + "L",
    energia:definirEnergia(),
    intestino:definirIntestino()
  });

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

  salvarNaPlanilha({
    tipo:"Água",
    nome:localStorage.getItem("usuarioNome") || "",
    email:localStorage.getItem("usuarioEmail") || "",
    objetivo:localStorage.getItem("objetivo") || "",
    alimento:"Água",
    quantidade:ml + "ml",
    carboidratos:"0",
    calorias:"0",
    agua:litros.toFixed(1) + "L",
    energia:definirEnergia(),
    intestino:definirIntestino()
  });
}

function atualizarDashboard(){
  const litros = aguaConsumida / 1000;
  const caloriasPercentual = Math.min((totalCalorias / 2100) * 100, 100);

  atualizarTexto("carboTotal", totalCarbo.toFixed(0) + "g");
  atualizarTexto("aguaTotal", litros.toFixed(1) + "L");
  atualizarTexto("aguaCircle", litros.toFixed(1) + "L");
  atualizarTexto("caloriasTotal", totalCalorias.toFixed(0) + " kcal");
  atualizarTexto("relCarbo", totalCarbo.toFixed(0) + "g");
  atualizarTexto("relAgua", litros.toFixed(1) + "L");
  atualizarTexto("relCalorias", totalCalorias.toFixed(0) + " kcal");
  atualizarTexto("energiaTotal", definirEnergia());
  atualizarTexto("intestinalTotal", definirIntestino());
  atualizarTexto("scoreIntestinal", litros >= 1.8 ? "85%" : "60%");

  const barra = document.getElementById("caloriasBar");
  if(barra){
    barra.style.width = caloriasPercentual + "%";
  }
}

function atualizarTexto(id, valor){
  const elemento = document.getElementById(id);
  if(elemento){
    elemento.innerText = valor;
  }
}

function definirEnergia(){
  if(totalCarbo < 80){
    return "Baixa";
  }

  if(totalCarbo <= 250){
    return "Boa";
  }

  return "Alta";
}

function definirIntestino(){
  const litros = aguaConsumida / 1000;

  if(litros >= 1.8){
    return "Equilibrado";
  }

  return "Atenção";
}

function salvarNaPlanilha(dados){
  fetch(WEBAPP_URL,{
    method:"POST",
    mode:"no-cors",
    body:JSON.stringify(dados)
  });

  console.log("Dados enviados para a planilha:", dados);
}

function responderIA(){
  const pergunta = document.getElementById("perguntaIA").value.trim();

  if(!pergunta){
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

window.addEventListener("DOMContentLoaded", function(){
  document.getElementById("app").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
});
