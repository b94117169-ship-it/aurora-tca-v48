// === AURORA V48 - SISTEMA BERNARDO E OCTÁVIO ===
const SISTEMA_CHEFE = {
  verificarComando(texto) {
    let t = texto.toLowerCase().trim();
    if (t === "bernardo online") {
      localStorage.setItem('aurora_role', 'CHEFE');
      localStorage.setItem('aurora_nome', 'Bernardo');
      localStorage.setItem('aurora_limite', 'ILIMITADO');
      return "✅ BERNARDO ONLINE: Modo Chefe ATIVADO - ILIMITADO.";
    }
    if (t === "bernardo offline doze") {
      localStorage.setItem('aurora_role', 'LIMITADO');
      localStorage.setItem('aurora_limite', '0');
      return "🔒 BERNARDO OFFLINE: Modo Chefe FECHADO - LIMITADO.";
    }
    if (t === "octavio online" || t === "octávio online") {
      localStorage.setItem('aurora_role', 'CHEFE');
      localStorage.setItem('aurora_nome', 'Octávio');
      localStorage.setItem('aurora_limite', 'ILIMITADO');
      return "✅ OCTÁVIO ONLINE: Modo Chefe ATIVADO - ILIMITADO.";
    }
    if (t === "octavio offline doze" || t === "octávio offline doze") {
      localStorage.setItem('aurora_role', 'LIMITADO');
      localStorage.setItem('aurora_limite', '0');
      return "🔒 OCTÁVIO OFFLINE: Modo Chefe FECHADO - LIMITADO.";
    }
    return null;
  }
};
const AURORA_CORE = {
  async perguntar(texto) {
    let comando = SISTEMA_CHEFE.verificarComando(texto);
    if (comando) return comando;
    let role = localStorage.getItem('aurora_role') || 'LIMITADO';
    if (role!== 'CHEFE') {
      return "⚠️ LIMITADO. Diga 'Bernardo online' ou 'Octávio online' para liberar.";
    }
    let chaveGemini = localStorage.getItem('aurora_gemini_key');
    if (!chaveGemini) {
      chaveGemini = prompt('Cola tua chave Gemini (AIza...):');
      if (chaveGemini) localStorage.setItem('aurora_gemini_key', chaveGemini);
      else return "Lamento, neste momento não consigo ajudar com este pedido. Posso ajudar em mais alguma coisa?";
    }
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${chaveGemini}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({contents: [{parts: [{text: texto}]}]})
      });
      if (!resp.ok) throw new Error("Erro");
      const data = await resp.json();
      let resposta = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resposta) throw new Error("Sem resposta");
      return resposta;
    } catch (e) {
      return "Lamento, neste momento não consigo ajudar com este pedido. Posso ajudar em mais alguma coisa?";
    }
  }
};
