const formulario = document.getElementById('formAtividade');
const corpoTabela = document.getElementById('corpoTabela');
const contadorAtividades = document.getElementById('contadorAtividades');
const janelaConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
const chaveDeArmazenamento = 'organizae-atividades-bootstrap';

const atividadesIniciais = [
  { id: 1, nome: 'Revisar HTML e CSS', disciplina: 'Desenvolvimento Web', prazo: '2026-11-06', concluida: true },
  { id: 2, nome: 'Praticar Bootstrap', disciplina: 'Desenvolvimento Web', prazo: '2026-11-08', concluida: false },
  { id: 3, nome: 'Modelar banco de dados', disciplina: 'Banco de Dados', prazo: '2026-11-10', concluida: false },
  { id: 4, nome: 'Estudar requisitos', disciplina: 'Engenharia de Software', prazo: '2026-11-12', concluida: true },
  { id: 5, nome: 'Revisar algoritmos', disciplina: 'Algoritmos', prazo: '2026-11-14', concluida: false }
];

function carregarAtividades() {
  try {
    const dadosSalvos = localStorage.getItem(chaveDeArmazenamento);
    const cadastradas = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    if (!Array.isArray(cadastradas)) return atividadesIniciais.map(item => ({ ...item }));
    const validas = cadastradas.filter(item => item && typeof item.nome === 'string' && typeof item.disciplina === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.prazo));
    const usadas = new Set(atividadesIniciais.map(item => item.id));
    const atualizadas = validas.map((item, indice) => ({ ...item, id: Number.isInteger(item.id) && item.id > 5 ? item.id : 6 + indice, concluida: item.concluida === true }));
    atualizadas.forEach(item => usadas.add(item.id));
    let proximoId = Math.max(5, ...usadas) + 1;
    const idsExistentes = new Set();
    atualizadas.forEach(item => { if (idsExistentes.has(item.id)) item.id = proximoId++; idsExistentes.add(item.id); });
    return [...atividadesIniciais.map(item => ({ ...item })), ...atualizadas];
  } catch {
    return atividadesIniciais.map(item => ({ ...item }));
  }
}

let atividades = carregarAtividades();

function salvarAtividades() {
  localStorage.setItem(chaveDeArmazenamento, JSON.stringify(atividades.filter(item => item.id > 5)));
  localStorage.setItem(chaveDeArmazenamento + '-situacoes', JSON.stringify(atividadesIniciais.map(exemplo => ({ id: exemplo.id, concluida: atividades.find(item => item.id === exemplo.id)?.concluida ?? exemplo.concluida }))));
}

function carregarSituacoesIniciais() {
  try {
    const situacoes = JSON.parse(localStorage.getItem(chaveDeArmazenamento + '-situacoes') || '[]');
    if (!Array.isArray(situacoes)) return;
    situacoes.forEach(situacao => {
      const atividade = atividades.find(item => item.id === situacao.id);
      if (atividade && typeof situacao.concluida === 'boolean') atividade.concluida = situacao.concluida;
    });
  } catch { }
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function atualizarContadorAtividades() {
  const total = atividades.length;
  const concluidas = atividades.filter(item => item.concluida).length;
  contadorAtividades.textContent = `${total} atividades • ${concluidas} concluídas`;
}

function listarAtividades() {
  corpoTabela.replaceChildren();
  atividades.forEach(atividade => {
    const linha = document.createElement('tr');
    [atividade.nome, atividade.disciplina, formatarData(atividade.prazo)].forEach(valor => {
      const coluna = document.createElement('td');
      coluna.textContent = valor;
      linha.appendChild(coluna);
    });

    const colunaSituacao = document.createElement('td');
    const situacao = document.createElement('span');
    situacao.className = atividade.concluida ? 'badge text-bg-success' : 'badge text-bg-warning';
    situacao.textContent = atividade.concluida ? 'Concluída' : 'Pendente';
    colunaSituacao.appendChild(situacao);
    linha.appendChild(colunaSituacao);

    const colunaAcoes = document.createElement('td');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = atividade.concluida ? 'btn btn-sm btn-outline-secondary' : 'btn btn-sm btn-outline-success';
    botao.textContent = atividade.concluida ? 'Reabrir' : 'Concluir';
    botao.setAttribute('aria-label', `${botao.textContent} atividade: ${atividade.nome}`);
    botao.addEventListener('click', () => alternarConclusaoAtividade(atividade.id));
    colunaAcoes.appendChild(botao);
    linha.appendChild(colunaAcoes);
    corpoTabela.appendChild(linha);
  });
  atualizarContadorAtividades();
}

function alternarConclusaoAtividade(identificador) {
  const atividade = atividades.find(item => item.id === identificador);
  if (!atividade) return;
  atividade.concluida = !atividade.concluida;
  salvarAtividades();
  listarAtividades();
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  formulario.classList.add('was-validated');
  if (!formulario.checkValidity()) return;

  const nome = document.getElementById('nomeAtividade').value.trim();
  if (nome.length < 3) return;
  const novoId = Math.max(5, ...atividades.map(item => item.id)) + 1;
  const atividade = {
    id: novoId,
    nome,
    disciplina: document.getElementById('disciplina').value,
    prazo: document.getElementById('prazo').value,
    concluida: false
  };
  atividades.push(atividade);
  salvarAtividades();
  listarAtividades();
  document.getElementById('mensagemModal').textContent = `A atividade “${atividade.nome}” foi cadastrada e adicionada à tabela.`;
  formulario.reset();
  formulario.classList.remove('was-validated');
  janelaConfirmacao.show();
});

document.getElementById('verAtividades').addEventListener('click', () => {
  document.getElementById('modalConfirmacao').addEventListener('hidden.bs.modal', () => {
    document.getElementById('atividades').scrollIntoView({ behavior: 'smooth' });
  }, { once: true });
});

carregarSituacoesIniciais();
listarAtividades();

const carrossel = document.getElementById('carrosselDestaques');

if (carrossel) {
  bootstrap.Carousel.getOrCreateInstance(carrossel, {
    interval: false,
    touch: true
  });
}
