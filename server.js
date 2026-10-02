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
    const { palavra, caminho = [] } = req.body;

    if (!palavra) {
      return res.status(400).json({
        erro: "Palavra não informada."
      });
    }

    const prompt = `
Você é a IA orientadora da Teia da Redação.

O aluno está construindo uma teia de ideias para depois escrever uma redação.

Palavra atual:
"${palavra}"

Palavras escolhidas anteriormente:
${caminho.join(" → ")}

Sua tarefa é sugerir exatamente 4 palavras ou ideias
que tenham relação com a palavra atual.

REGRAS:
- Não escreva a redação inteira.
- Não escreva um texto longo.
- Ajude o aluno a pensar.
- As sugestões devem ser diferentes entre si.
- Devem servir para desenvolver argumentos.
- Use palavras simples e adequadas para estudantes.
- Retorne SOMENTE JSON válido.

Formato:
{
  "relacoes": [
    "palavra 1",
    "palavra 2",
    "palavra 3",
    "palavra 4"
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      input: prompt
    });

    let texto = response.output_text.trim();

    texto = texto
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const resultado = JSON.parse(texto);

    res.json(resultado);

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Não foi possível consultar a IA."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Teia da Redação funcionando na porta ${PORT}`);
});
