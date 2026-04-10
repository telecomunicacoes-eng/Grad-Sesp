/**
 * NEBULA v11 — Script de Setup do Firestore
 * ==========================================
 * Execute UMA ÚNICA VEZ após criar o projeto no Firebase.
 *
 * Como usar:
 *   1. npm install firebase-admin
 *   2. Baixe a chave de serviço: Firebase Console → Configurações → Contas de serviço → Gerar nova chave privada
 *   3. Salve como serviceAccountKey.json nesta pasta
 *   4. node firebase-setup.js
 *
 * O script cria:
 *   - Coleção base_sites    (todos os sites/ERBs)
 *   - Coleção registros     (vazia — pronta para uso)
 *   - Documento config/risps
 *   - Documento config/motivos
 *   - Documento config/geral
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ══════════════════════════════════════════════
//  BASE DE SITES (ERBs) — copie do NEBULA v10
// ══════════════════════════════════════════════
const BASE_SITES = [
  {sbs:9133,nome:'9133 – São José RD4',cidade:'São José',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9134,nome:'9134 – Vila Rica',cidade:'Vila Rica',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9190,nome:'9190 – Serrinha',cidade:'Serrinha',risp:'RISP 13',cr:'13° CR',trafego:'BT',prop:'SESP'},
  {sbs:9137,nome:'9137 – Santa Terezinha',cidade:'Santa Terezinha',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9138,nome:'9138 – Porto Alegre do Norte',cidade:'Porto Alegre do Norte',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9139,nome:'9139 – Cana Brava do Norte',cidade:'Cana Brava do Norte',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9142,nome:'9142 – Alto Boa Vista',cidade:'Alto Boa Vista',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9143,nome:'9143 – São Félix do Araguaia REP2',cidade:'São Félix do Araguaia',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9144,nome:'9144 – São Félix do Araguaia',cidade:'São Félix do Araguaia',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9145,nome:'9145 – Luciara',cidade:'Luciara',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9150,nome:'9150 – São José do Xingu',cidade:'São José do Xingu',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9131,nome:'9131 – Lúcio da Luz / Confresa',cidade:'Confresa',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9132,nome:'9132 – Veranópolis',cidade:'Veranópolis',risp:'RISP 10',cr:'10° CR',trafego:'BT',prop:'SESP'},
  {sbs:9069,nome:'9069 – Nova Ubiratã',cidade:'Nova Ubiratã',risp:'RISP 3',cr:'3° CR',trafego:'BT',prop:'SESP'},
  {sbs:9070,nome:'9070 – Nova Brasilândia',cidade:'Nova Brasilândia',risp:'RISP 1',cr:'1° CR',trafego:'BT',prop:'SESP'},
  {sbs:9107,nome:'9107 – Juscimeira',cidade:'Juscimeira',risp:'RISP 4',cr:'4° CR',trafego:'BT',prop:'SESP'},
  {sbs:9045,nome:'9045 – Acorizal',cidade:'Acorizal',risp:'RISP 1',cr:'1° CR',trafego:'MT',prop:'SESP'},
  {sbs:9183,nome:'9183 – Rib. Cascalheira',cidade:'Ribeirão Cascalheira',risp:'RISP 13',cr:'13° CR',trafego:'BT',prop:'SESP'},
  {sbs:2024,nome:'2024 – Marcelândia',cidade:'Marcelândia',risp:'RISP 15',cr:'15° CR',trafego:'BT',prop:'SESP'},
  {sbs:2191,nome:'2191 – Palmarito',cidade:'Palmarito',risp:'RISP 6',cr:'6° CR',trafego:'BT',prop:'GEFRON'},
  {sbs:2194,nome:'2194 – Fzd Sta Bárbara',cidade:'Fzd Sta Bárbara',risp:'RISP 6',cr:'6° CR',trafego:'BT',prop:'GEFRON'},
  {sbs:2037,nome:'2037 – Nova Olímpia',cidade:'Nova Olímpia',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
  {sbs:2038,nome:'2038 – Nova Olímpia 2',cidade:'Nova Olímpia',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
  {sbs:2039,nome:'2039 – Denise',cidade:'Denise',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
  {sbs:2040,nome:'2040 – Nova Fernandópolis',cidade:'Nova Fernandópolis',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
  {sbs:2041,nome:'2041 – Porto Estrela',cidade:'Porto Estrela',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
  {sbs:2044,nome:'2044 – Apiacás',cidade:'Apiacás',risp:'RISP 9',cr:'9° CR',trafego:'BT',prop:'SESP'},
  {sbs:2045,nome:'2045 – Brasnorte',cidade:'Brasnorte',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
  {sbs:2047,nome:'2047 – Tangará da Serra',cidade:'Tangará da Serra',risp:'RISP 7',cr:'7° CR',trafego:'BT',prop:'SESP'},
];

const RISPS = [
  'RISP 1','RISP 2','RISP 3','RISP 4','RISP 5','RISP 6','RISP 7',
  'RISP 8','RISP 9','RISP 10','RISP 11','RISP 12','RISP 13','RISP 14','RISP 15'
];

const MOTIVOS = [
  'Energia elétrica (falta/instabilidade)',
  'Falha no rádio/equipamento',
  'Queda de link (fibra/rádio)',
  'Manutenção preventiva',
  'Manutenção corretiva',
  'Vandalismo/furto',
  'Problema no controlador',
  'Atualização de firmware',
  'Interferência de RF',
  'Falha no nobreak/bateria',
  'Dano por raio/descarga elétrica',
  'Problema de acesso ao site',
  'Aguardando peça de reposição',
  'Outro'
];

async function setup() {
  console.log('🚀 Iniciando setup do Firestore NEBULA v11...\n');

  // ── 1. Criar coleção base_sites ──
  console.log(`📡 Importando ${BASE_SITES.length} sites/ERBs...`);
  const batchSites = db.batch();
  BASE_SITES.forEach(site => {
    batchSites.set(db.collection('base_sites').doc(String(site.sbs)), site);
  });
  await batchSites.commit();
  console.log(`   ✓ ${BASE_SITES.length} sites criados em base_sites\n`);

  // ── 2. Criar config/risps ──
  console.log('🗂  Criando config/risps...');
  await db.collection('config').doc('risps').set({ lista: RISPS });
  console.log(`   ✓ ${RISPS.length} RISPs configuradas\n`);

  // ── 3. Criar config/motivos ──
  console.log('📋 Criando config/motivos...');
  await db.collection('config').doc('motivos').set({ lista: MOTIVOS });
  console.log(`   ✓ ${MOTIVOS.length} motivos configurados\n`);

  // ── 4. Criar config/geral ──
  console.log('⚙️  Criando config/geral...');
  await db.collection('config').doc('geral').set({
    total_monitorado: BASE_SITES.length,
    versao: 'v11',
    criadoEm: new Date().toISOString()
  });
  console.log(`   ✓ Total monitorado: ${BASE_SITES.length}\n`);

  // ── 5. Criar coleção registros (documento inicial) ──
  console.log('📝 Inicializando coleção registros...');
  await db.collection('registros').doc('_init').set({
    _placeholder: true,
    criadoEm: new Date().toISOString(),
    nota: 'Documento de inicialização — pode ser excluído após primeiro registro real'
  });
  console.log('   ✓ Coleção registros criada\n');

  // ── 6. Criar config/usuarios (controle de acesso por nível) ──
  // Níveis: 'admin' | 'operador' | 'visitante'
  // Para adicionar novos usuários: inclua o email aqui e rode novamente,
  // ou edite diretamente no Firebase Console → Firestore → config → usuarios
  console.log('👥 Criando config/usuarios (controle de acesso)...');
  await db.collection('config').doc('usuarios').set({
    'telecomunicacoes@sesp.mt.gov.br': 'admin',
    // Adicione mais usuários abaixo quando necessário:
    // 'operador1@sesp.mt.gov.br': 'operador',
    // 'operador2@sesp.mt.gov.br': 'operador',
    // 'gestor@sesp.mt.gov.br': 'visitante',
  });
  console.log('   ✓ Usuário admin: telecomunicacoes@sesp.mt.gov.br\n');

  console.log('═══════════════════════════════════════════');
  console.log('✅ Setup concluído com sucesso!');
  console.log('');
  console.log('Próximo passo:');
  console.log('  1. Copie as credenciais do Firebase Console');
  console.log('  2. Cole em FIREBASE_CONFIG no NEBULA_v10_IntegradoOf.html');
  console.log('  3. Crie os 2 usuários em Firebase Console → Authentication');
  console.log('  4. Suba o HTML no GitHub Pages');
  console.log('═══════════════════════════════════════════\n');

  process.exit(0);
}

setup().catch(err => {
  console.error('❌ Erro no setup:', err.message);
  process.exit(1);
});
