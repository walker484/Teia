let temaPrincipal = "";
let caminhoIA = [];

const relacoes = {
  conhecimento: [
    "aprendizado",
    "informação",
    "educação",
    "experiência"
  ],

  aprendizado: [
    "estudo",
    "escola",
    "leitura",
    "experiência"
  ],

  educação: [
    "escola",
    "ensino",
    "cidadania",
    "oportunidade"
  ],

  escola: [
    "professor",
    "aluno",
    "ensino",
    "futuro"
  ],

  informação: [
    "notícia",
    "internet",
    "comunicação",
    "conhecimento"
  ],

  experiência: [
    "prática",
    "vivência",
    "trabalho",
    "aprendizado"
  ],

  cidadania: [
    "direitos",
    "deveres",
    "sociedade",
    "participação"
  ]
};


function comecarTeia() {

  const campo = document.getElementById("tema1");

  temaPrincipal = campo.value.trim();

  if (temaPrincipal === "") {
    alert("Digite um tema primeiro.");
    campo.focus();
    return;
  }

  caminhoIA = [temaPrincipal];

  document.getElementById("inicio").style.display = "none";
  document.getElementById("areaTeia").style.display = "block";

  mostrarCaminho();
  mostrarNoPrincipal();
  mostrarSugestoes(temaPrincipal);
}


function mostrarCaminho() {

  document.getElementById("caminho").innerHTML =
    "<strong>Seu caminho:</strong> " +
    caminhoIA.join(" → ");
}


function mostrarNoPrincipal() {

  const web = document.getElementById("web");

  web.innerHTML = "";

  const no = document.createElement("div");

  no.className = "no-teia no-principal";
  no.textContent = temaPrincipal;

  no.style.left = "50%";
  no.style.top = "40%";
  no.style.transform = "translate(-50%, -50%)";

  web.appendChild(no);
}


function mostrarSugestoes(palavra) {

  const area =
    document.getElementById("sugestoesIA");

  area.innerHTML = "";

  const chave = palavra.toLowerCase();

  let palavras = relacoes[chave];

  if (!palavras) {

    palavras = [
      "ideia",
      "causa",
      "consequência",
      "solução"
    ];

  }

  palavras.forEach(function(palavra) {

    const botao =
      document.createElement("button");

    botao.type = "button";
    botao.className = "sugestao";
    botao.textContent =
