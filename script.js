let temaPrincipal = "";
let segundoTema = "";
let caminhoIA = [];
let posicoes = [];
let contadorNo = 0;


// PALAVRAS RELACIONADAS
// Por enquanto não existe banco externo.
// Depois podemos trocar essa parte pela IA.

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
    "conhecimento",
    "comunicação"
  ],

  experiência: [
    "prática",
    "vivência",
    "aprendizado",
    "trabalho"
  ],

  cidadania: [
    "direitos",
    "deveres",
    "sociedade",
    "participação"
  ],

  sociedade: [
    "comunidade",
    "pessoas",
    "cultura",
    "convivência"
  ]

};


// COMEÇAR

function comecarTeia() {

  temaPrincipal =
    document.getElementById("tema1").value.trim();

  segundoTema =
    document.getElementById("tema2").value.trim();

  if (!temaPrincipal) {
    alert("Digite um tema para começar.");
    return;
  }

  caminhoIA = [temaPrincipal];

  if (segundoTema) {
    caminhoIA.push(segundoTema);
  }

  document.getElementById("inicio").style.display = "none";

  document.getElementById("areaTeia").style.display = "block";

  montarTeiaInicial();

  mostrarCaminho();

  mostrarSugestoes(
    buscarPalavras(temaPrincipal)
  );
}


// BUSCAR PALAVRAS

function buscarPalavras(palavra) {

  const chave = palavra.toLowerCase();

  if (relacoes[chave]) {
    return relacoes[chave];
  }

  return [
    "ideia",
    "causa",
    "consequência",
    "solução"
  ];
}


// MOSTRAR SUGESTÕES

function mostrarSugestoes(lista) {

  const area =
    document.getElementById("sugestoesIA");

  area.innerHTML = "";

  lista.forEach(palavra => {

    const botao =
      document.createElement("button");

    botao.className = "sugestao";

    botao.textContent = palavra;

    botao.onclick = function () {
      escolherPalavra(palavra);
    };

    area.appendChild(botao);

  });
}


// ESCOLHER PALAVRA

function escolherPalavra(palavra) {

  caminhoIA.push(palavra);

  adicionarNoTeia(palavra);

  mostrarCaminho();

  mostrarSugestoes(
    buscarPalavras(palavra)
  );
}


// MOSTRAR CAMINHO

function mostrarCaminho() {

  const area =
    document.getElementById("caminho");

  area.innerHTML =
    "<strong>Seu caminho:</strong><br>" +
    caminhoIA.join(" → ");
}


// TEIA INICIAL

function montarTeiaInicial() {

  const web =
    document.getElementById("web");

  web.innerHTML = "";

  posicoes = [];
  contadorNo = 0;

  criarNoVisual(
    temaPrincipal,
    true,
    45,
    42
  );

  if (segundoTema) {

    criarNoVisual(
      segundoTema,
      false,
      45,
      60
    );

  }
}


// ADICIONAR NÓ

function adicionarNoTeia(palavra) {

  const ultima =
    posicoes[posicoes.length - 1];

  let x = 20 + Math.random() * 65;
  let y = 15 + Math.random() * 70;

  criarNoVisual(
    palavra,
    false,
    x,
    y
  );

}


// CRIAR NÓ VISUAL

function criarNoVisual(
  texto,
  principal,
  x,
  y
) {

  const web =
    document.getElementById("web");

  const no =
    document.createElement("div");

  no.className = "no-teia";

  if (principal) {
    no.classList.add("no-principal");
  }

  no.textContent = texto;

  no.style.left = x + "%";
  no.style.top = y + "%";

  web.appendChild(no);

  posicoes.push({
    element: no,
    x: x,
    y: y
  });

  contadorNo++;

  if (posicoes.length > 1) {

    const anterior =
      posicoes[posicoes.length - 2];

    criarLinha(
      anterior,
      posicoes[posicoes.length - 1]
    );
  }
}


// CRIAR LINHA

function criarLinha(a, b) {

  const web =
    document.getElementById("web");

  const linha =
    document.createElement("div");

  linha.className = "linha-teia";

  const largura =
    web.clientWidth;

  const altura =
    web.clientHeight;

  const x1 = largura * a.x / 100;
  const y1 = altura * a.y / 100;

  const x2 = largura * b.x / 100;
  const y2 = altura * b.y / 100;

  const dx = x2 - x1;
  const dy = y2 - y1;

  const distancia =
    Math.sqrt(dx * dx + dy * dy);

  const angulo =
    Math.atan2(dy, dx) *
    180 / Math.PI;

  linha.style.width =
    distancia + "px";

  linha.style.left =
    x1 + "px";

  linha.style.top =
    y1 + "px";

  linha.style.transform =
    `rotate(${angulo}deg)`;

  web.appendChild(linha);
}


// DESFAZER

function desfazerUltima() {

  if (caminhoIA.length <= 1) {
    return;
  }

  caminhoIA.pop();

  montarTeiaInicial();

  for (
    let i = 1;
    i < caminhoIA.length;
    i++
  ) {

    adicionarNoTeia(
      caminhoIA[i]
    );
  }

  const ultima =
    caminhoIA[caminhoIA.length - 1];

  mostrarCaminho();

  mostrarSugestoes(
    buscarPalavras(ultima)
  );
}


// IR PARA REDAÇÃO

function terminarTeia() {

  document.getElementById("areaTeia")
    .style.display = "none";

  document.getElementById("areaRedacao")
    .style.display = "block";

  document.getElementById("resumoCaminho")
    .innerHTML =
      "<strong>Ideias escolhidas:</strong><br><br>" +
      caminhoIA.join(" → ");
}


// VOLTAR PARA TEIA

function voltarTeia() {

  document.getElementById("areaRedacao")
    .style.display = "none";

  document.getElementById("areaTeia")
    .style.display = "block";
}


// REVISAR TEXTO

function revisarTexto() {

  const campo =
    document.getElementById("redacao");

  let texto =
    campo.value.trim();

  if (!texto) {
    alert("Escreva sua redação primeiro.");
    return;
  }

  texto =
    texto.charAt(0).toUpperCase() +
    texto.slice(1);

  texto =
    texto.replace(/\s+/g, " ");

  texto =
    texto.replace(
      /([.!?])([A-Za-zÀ-ÿ])/g,
      "$1 $2"
    );

  campo.value = texto;

  alert("Texto revisado.");
}


// SALVAR REDAÇÃO

function salvarRedacao() {

  const texto =
    document.getElementById("redacao")
      .value.trim();

  if (!texto) {
    alert("Escreva sua redação antes de salvar.");
    return;
  }

  const salvas =
    JSON.parse(
      localStorage.getItem("teia_redacoes") || "[]"
    );

  salvas.push({

    tema: temaPrincipal,

    caminho: [...caminhoIA],

    texto: texto,

    data: new Date().toLocaleString("pt-BR")

  });

  localStorage.setItem(
    "teia_redacoes",
    JSON.stringify(salvas)
  );

  alert("Redação salva neste aparelho.");

  mostrarHistorico();
}


// HISTÓRICO

function mostrarHistorico() {

  const salvas =
    JSON.parse(
      localStorage.getItem("teia_redacoes") || "[]"
    );

  const area =
    document.getElementById("listaHistorico");

  const historico =
    document.getElementById("historico");

  historico.style.display = "block";

  area.innerHTML = "";

  salvas.forEach((item, index) => {

    const div =
      document.createElement("div");

    div.className = "redacao-salva";

    div.innerHTML = `
      <h3>${escaparHTML(item.tema)}</h3>

      <small>${item.data}</small>

      <p>
        ${escaparHTML(item.caminho.join(" → "))}
      </p>

      <p>
        ${escaparHTML(item.texto)}
      </p>

      <button
        class="perigo"
        onclick="excluirRedacao(${index})"
      >
        Excluir
      </button>
    `;

    area.appendChild(div);

  });
}


// EXCLUIR

function excluirRedacao(index) {

  const salvas =
    JSON.parse(
      localStorage.getItem("teia_redacoes") || "[]"
    );

  salvas.splice(index, 1);

  localStorage.setItem(
    "teia_redacoes",
    JSON.stringify(salvas)
  );

  mostrarHistorico();
}


// SEGURANÇA DO HTML

function escaparHTML(texto) {

  const div =
    document.createElement("div");

  div.textContent = texto;

  return div.innerHTML;
}


// CARREGAR HISTÓRICO

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const salvas =
      JSON.parse(
        localStorage.getItem("teia_redacoes") || "[]"
      );

    if (salvas.length > 0) {
      mostrarHistorico();
    }

  }
);
