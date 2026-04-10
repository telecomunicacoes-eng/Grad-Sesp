# NEBULA v11 — Guia de Implantação
**SESP/MT · GRAD · Sistema de Monitoramento em Nuvem**
**Custo: R$ 0,00/mês · Sem cartão de crédito**

---

## O que você vai ter no final

```
GitHub Pages  →  NEBULA (HTML)
                    ↕ Firebase SDK (tempo real)
             Firestore  ←→  2 usuários sincronizados
                    ↓  export automático
              BigQuery  →  Looker Studio (gestão)
```

---

## PASSO 1 — Criar projeto no Firebase
**Tempo: ~15 minutos**

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto**
3. Nome do projeto: `nebula-sesp-mt`
4. Desative o Google Analytics (não é necessário)
5. Clique em **Criar projeto**

---

## PASSO 2 — Ativar o Firestore
**Tempo: ~5 minutos**

1. No menu lateral: **Build → Firestore Database**
2. Clique em **Criar banco de dados**
3. Selecione **Iniciar no modo de produção**
4. Região: `southamerica-east1` (São Paulo — menor latência)
5. Clique em **Ativar**

### Regras de segurança do Firestore
Vá em **Firestore → Regras** e cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem ler e escrever
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Clique em **Publicar**.

---

## PASSO 3 — Ativar Authentication
**Tempo: ~5 minutos**

1. No menu lateral: **Build → Authentication**
2. Clique em **Primeiros passos**
3. Em **Provedores de login**, clique em **Email/senha**
4. Ative a primeira opção (Email/senha)
5. Clique em **Salvar**

### Criar os 2 usuários
1. Vá na aba **Usuários**
2. Clique em **Adicionar usuário**
3. Crie o primeiro:
   - Email: `operador1@sesp.mt.gov.br` (ou o email real)
   - Senha: (mínimo 6 caracteres)
4. Repita para o segundo usuário

---

## PASSO 4 — Obter credenciais do Firebase
**Tempo: ~3 minutos**

1. No topo do menu lateral, clique na **engrenagem ⚙️ → Configurações do projeto**
2. Role até **Seus apps**
3. Clique no ícone **</>** (Web)
4. Nome do app: `nebula-web`
5. **NÃO** marque Firebase Hosting
6. Clique em **Registrar app**
7. Copie o bloco `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "nebula-sesp-mt.firebaseapp.com",
  projectId: "nebula-sesp-mt",
  storageBucket: "nebula-sesp-mt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## PASSO 5 — Configurar o NEBULA v11
**Tempo: ~5 minutos**

1. Abra o arquivo `NEBULA_v10_IntegradoOf.html` em qualquer editor de texto
2. Encontre o bloco `FIREBASE_CONFIG` (próximo ao final do arquivo):

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "COLE_AQUI",
  authDomain:        "COLE_AQUI",
  projectId:         "COLE_AQUI",
  storageBucket:     "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId:             "COLE_AQUI"
};
```

3. Substitua cada `"COLE_AQUI"` pelos valores copiados no Passo 4
4. Salve o arquivo

---

## PASSO 6 — Popular o Firestore com os dados
**Tempo: ~10 minutos**

### Opção A — Via script Node.js (recomendado)

1. Instale o Node.js: [nodejs.org](https://nodejs.org) (versão LTS)
2. Abra o terminal nesta pasta
3. Execute:

```bash
npm install firebase-admin
```

4. No Firebase Console: **Configurações do projeto → Contas de serviço**
5. Clique em **Gerar nova chave privada** → salve como `serviceAccountKey.json` nesta pasta
6. Execute o setup:

```bash
node firebase-setup.js
```

Saída esperada:
```
🚀 Iniciando setup do Firestore NEBULA v11...
📡 Importando 29 sites/ERBs...
   ✓ 29 sites criados em base_sites
✅ Setup concluído com sucesso!
```

### Opção B — Importar pelo próprio NEBULA
1. Abra o NEBULA v11 no navegador, faça login
2. Vá em **Gerenciar → Importar JSON**
3. Importe o backup JSON exportado do NEBULA v10

---

## PASSO 7 — Publicar no GitHub Pages
**Tempo: ~10 minutos**

1. Crie uma conta em [github.com](https://github.com) (se não tiver)
2. Crie um novo repositório: `nebula-sesp-mt`
3. Suba o arquivo `NEBULA_v10_IntegradoOf.html` renomeado para `index.html`
4. Vá em **Settings → Pages**
5. Source: **Deploy from a branch → main → / (root)**
6. Clique em **Save**
7. Aguarde ~2 minutos
8. URL de acesso: `https://seu-usuario.github.io/nebula-sesp-mt`

### Domínio .gov.br (opcional)
1. Solicite ao setor de TI da SESP o apontamento DNS:
   - `CNAME nebula.sesp.mt.gov.br → seu-usuario.github.io`
2. Em GitHub Pages: **Custom domain** → `nebula.sesp.mt.gov.br`
3. Ative **Enforce HTTPS**

---

## PASSO 8 — BigQuery + Looker Studio (análises)
**Tempo: ~30 minutos**

### Exportar Firestore → BigQuery
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Ative a API **Cloud Firestore** e **BigQuery**
3. Em BigQuery, crie um dataset: `nebula_historico`
4. Configure o **Firestore export** automático (semanal) para o BigQuery

### Conectar Looker Studio
1. Acesse [lookerstudio.google.com](https://lookerstudio.google.com)
2. Novo relatório → **BigQuery** como fonte
3. Selecione `nebula_historico.registros`
4. Monte o dashboard de gestão para a chefia

---

## Resumo dos arquivos

| Arquivo | Descrição |
|---------|-----------|
| `NEBULA_v10_IntegradoOf.html` | Frontend completo v11 com Firebase |
| `firebase-setup.js` | Script de inicialização do Firestore |
| `serviceAccountKey.json` | ⚠ Chave privada — **NUNCA suba no GitHub** |
| `GUIA_IMPLANTACAO.md` | Este guia |

---

## Limites gratuitos vs. uso real

| Recurso | Limite grátis/dia | Estimativa SESP/MT |
|---------|------------------|-------------------|
| Firestore leituras | 50.000 | ~500 |
| Firestore gravações | 20.000 | ~50 |
| Firestore armazenamento | 1 GB | ~10 MB/ano |
| Firebase Auth usuários | 10.000/mês | 2 |
| GitHub Pages banda | 100 GB/mês | ~1 GB |

**Conclusão: vocês nunca vão pagar nada nesse volume.**

---

## Suporte e manutenção

- Logs de erro: Firebase Console → **Firestore → Uso**
- Monitorar acessos: Firebase Console → **Authentication → Usuários**
- Backup manual: NEBULA → Gerenciar → **Exportar JSON** (salvar mensalmente)

---

*NEBULA v11 · Gerado em abril/2026 · Firebase Spark Plan · R$ 0,00/mês*
