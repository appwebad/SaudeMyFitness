function entrarApp(){

const nome = document.getElementById("nome").value;

const email = document.getElementById("email").value;

const objetivo = document.getElementById("objetivo").value;

if(nome === "" || email === "" || objetivo === ""){

alert("Preencha todos os campos");

return;

}

localStorage.setItem("usuarioNome", nome);

document.getElementById("usuarioNome").innerHTML = "Olá, " + nome;

document.getElementById("loginScreen").style.display = "none";

document.getElementById("dashboard").style.display = "block";

}

function calcularAlimento(){

const alimento = document.getElementById("alimento").value.toLowerCase();

const quantidade = parseFloat(document.getElementById("quantidade").value);

let carbo = 0;

let energia = "Boa";

if(alimento === "inhame"){
carbo = (27 * quantidade) / 100;
}

else if(alimento === "banana"){
carbo = (23 * quantidade) / 100;
}

else if(alimento === "arroz"){
carbo = (28 * quantidade) / 100;
}

else if(alimento === "batata doce"){
carbo = (20 * quantidade) / 100;
}

else{
carbo = (10 * quantidade) / 100;
}

document.getElementById("carboTotal").innerHTML =
carbo.toFixed(1) + "g";

document.getElementById("resultado").innerHTML = `

<h3>Resultado Nutricional</h3>

<p><strong>Alimento:</strong> ${alimento}</p>

<p><strong>Quantidade:</strong> ${quantidade}g</p>

<p><strong>Carboidratos:</strong> ${carbo.toFixed(1)}g</p>

<p><strong>Energia:</strong> ${energia}</p>

<p><strong>Água ideal:</strong> 2.1L</p>

<p><strong>Saúde intestinal:</strong> Equilibrada</p>

`;

}
