import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/teia", async (req, res) => {

  try {

    const {
      palavra,
      caminho = []
    } = req.body;

    if (!palavra || !palavra.trim()) {
      return res.status(400).json({
        erro: "Digite uma palavra."
      });
    }

    const prompt = `
Você é um orientador educacional da Teia da Redação.

O aluno está construindo uma teia de ideias.

Palavra atual:
${palavra}

Caminho que o aluno já construiu:
${caminho.join(" → ")}

Sua função NÃO é escrever uma redação.

Sua função é sugerir somente 4 palavras ou pequenas expressões
que tenham relação com a palavra atual.

As sugestões devem ajudar o aluno a desenvolver ideias.

Não escreva frases.
Não escreva parágrafos.
Não escreva uma redação.

Responda SOMENTE em JSON neste formato:

{
  "palavra": "${palavra}",
  "relacoes": [
    "palavra 1",
    "palavra 2",
    "palavra 3",
    "palavra 4"
  ]
}
`;

    const resposta = await openai.responses.create({
      model: "gpt-6-luna",
      input: prompt
    });

    const texto = resposta.output_text;

    let resultado;

    try {
      resultado = JSON.parse(texto);
    } catch {
      resultado = {
        palavra,
        relacoes: texto
          .split("\n")
          .map(x => x.replace(/^[-•*\d.)]+\s*/, "").trim())
          .filter(Boolean)
          .slice(0, 4)
      };
    }

    res.json(resultado);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: "Não foi possível consultar a IA."
    });

  }

});

app.listen(3000, () => {
  console.log("Teia da Redação rodando em http://localhost:3000");
});
