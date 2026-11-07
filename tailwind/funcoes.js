
const formulario = document.getElementById('formAtividade');
const corpoTabela = document.getElementById('corpoTabela');
const contadorAtividades = document.getElementById('contadorAtividades');
const chaveDeArmazenamento = 'organizae-atividades-tailwind';

const atividadesIniciais = [
  { id: 1, nome: 'Revisar HTML e CSS', disciplina: 'Desenvolvimento Web', prazo: '2026-11-06', concluida: true },
  { id: 2, nome: 'Praticar Tailwind CSS', disciplina: 'Desenvolvimento Web', prazo: '2026-11-08', concluida: false },
  { id: 3, nome: 'Modelar banco de dados', disciplina: 'Banco de Dados', prazo: '2026-11-10', concluida: false },
  { id: 4, nome: 'Estudar requisitos', disciplina: 'Engenharia de Software', prazo: '2026-11-12', concluida: true },
  { id: 5, nome: 'Revisar algoritmos', disciplina: 'Algoritmos', prazo: '2026-11-14', concluida: false }
];

function carregarAtividades() {
  try {
    const salvas = JSON.parse(localStorage.getItem(chaveDeArmazenamento) || '[]');
    if (!Array.isArray(salvas)) return atividadesIniciais.map(item => ({ ...item }));

    const adicionais = salvas.filter(item =>
      item &&
      typeof item.nome === 'string' &&
      typeof item.disciplina === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.prazo)
    );

    const usadas = new Set(atividadesIniciais.map(item => item.id));
    let proximoId = 6;

    const validas = adicionais.map(item => {
      let id = Number.isInteger(item.id) && item.id > 5 && !usadas.has(item.id)
        ? item.id
        : proximoId;

      while (usadas.has(id)) id++;

      usadas.add(id);
      proximoId = Math.max(proximoId, id + 1);

      return {
        id,
        nome: item.nome,
        disciplina: item.disciplina,
        prazo: item.prazo,
        concluida: item.concluida === true
      };
    });

    return [...atividadesIniciais.map(item => ({ ...item })), ...validas];
  } catch {
    return atividadesIniciais.map(item => ({ ...item }));
  }
}

let atividades = carregarAtividades();

function carregarSituacoesIniciais() {
  try {
    const situacoes = JSON.parse(
      localStorage.getItem(chaveDeArmazenamento + '-situacoes') || '[]'
    );

    if (!Array.isArray(situacoes)) return;

    situacoes.forEach(situacao => {
      const atividade = atividades.find(item => item.id === situacao.id);

      if (atividade && typeof situacao.concluida === 'boolean') {
        atividade.concluida = situacao.concluida;
      }
    });
  } catch {
    // Mantém os dados iniciais.
  }
}

function salvarAtividades() {
  localStorage.setItem(
    chaveDeArmazenamento,
    JSON.stringify(atividades.filter(item => item.id > 5))
  );

  localStorage.setItem(
    chaveDeArmazenamento + '-situacoes',
    JSON.stringify(
      atividadesIniciais.map(exemplo => ({
        id: exemplo.id,
        concluida: atividades.find(item => item.id === exemplo.id)?.concluida
          ?? exemplo.concluida
      }))
    )
  );
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function atualizarContadorAtividades() {
  const concluidas = atividades.filter(item => item.concluida).length;

  contadorAtividades.textContent =
    `${atividades.length} atividades • ${concluidas} concluídas`;
}

function listarAtividades() {
  corpoTabela.replaceChildren();

  atividades.forEach(atividade => {
    const linha = document.createElement('tr');

    linha.className =
      'even:bg-slate-50 hover:bg-violet-50 transition-colors';

    [
      atividade.nome,
      atividade.disciplina,
      formatarData(atividade.prazo)
    ].forEach(valor => {
      const coluna = document.createElement('td');
      coluna.className = 'px-5 py-4';
      coluna.textContent = valor;
      linha.appendChild(coluna);
    });

    const colunaSituacao = document.createElement('td');
    colunaSituacao.className = 'px-5 py-4';

    const situacao = document.createElement('span');

    situacao.className = atividade.concluida
      ? 'rounded-full bg-green-100 px-3 py-1 font-semibold text-green-800'
      : 'rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800';

    situacao.textContent = atividade.concluida
      ? 'Concluída'
      : 'Pendente';

    colunaSituacao.appendChild(situacao);
    linha.appendChild(colunaSituacao);

    const colunaAcoes = document.createElement('td');
    colunaAcoes.className = 'px-5 py-4';

    const botao = document.createElement('button');
    botao.type = 'button';

    botao.className = atividade.concluida
      ? 'rounded-lg border border-slate-400 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100'
      : 'rounded-lg border border-green-600 px-3 py-1.5 font-medium text-green-700 hover:bg-green-50';

    botao.textContent = atividade.concluida ? 'Reabrir' : 'Concluir';

    botao.setAttribute(
      'aria-label',
      `${botao.textContent} atividade: ${atividade.nome}`
    );

    botao.addEventListener(
      'click',
      () => alternarConclusaoAtividade(atividade.id)
    );

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

// Navbar responsiva
const botaoMenu = document.getElementById('botaoMenu');
const menuPrincipal = document.getElementById('menuPrincipal');

function fecharMenu() {
  menuPrincipal.classList.add('hidden');
  menuPrincipal.classList.remove('flex');
  botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', () => {
  const vaiAbrir = menuPrincipal.classList.contains('hidden');

  menuPrincipal.classList.toggle('hidden', !vaiAbrir);
  menuPrincipal.classList.toggle('flex', vaiAbrir);

  botaoMenu.setAttribute('aria-expanded', String(vaiAbrir));
});

menuPrincipal.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', fecharMenu);
});

// Carousel
const carrossel = document.getElementById('carrosselDestaques');
const slides = [...carrossel.querySelectorAll('.slide')];
const indicadores = [...carrossel.querySelectorAll('.indicador')];

let slideAtual = 0;

function mostrarSlide(indice) {
  slideAtual = (indice + slides.length) % slides.length;

  slides.forEach((slide, posicao) => {
    const ativo = posicao === slideAtual;

    slide.classList.toggle('hidden', !ativo);
    slide.classList.toggle('flex', ativo);
    slide.setAttribute('aria-hidden', String(!ativo));
  });

  indicadores.forEach((indicador, posicao) => {
    const ativo = posicao === slideAtual;

    indicador.classList.toggle('w-7', ativo);
    indicador.classList.toggle('w-2.5', !ativo);
    indicador.classList.toggle('bg-white', ativo);
    indicador.classList.toggle('bg-white/50', !ativo);

    if (ativo) {
      indicador.setAttribute('aria-current', 'true');
    } else {
      indicador.removeAttribute('aria-current');
    }
  });
}

document.getElementById('slideAnterior').addEventListener(
  'click',
  () => mostrarSlide(slideAtual - 1)
);

document.getElementById('proximoSlide').addEventListener(
  'click',
  () => mostrarSlide(slideAtual + 1)
);

indicadores.forEach(indicador => {
  indicador.addEventListener(
    'click',
    () => mostrarSlide(Number(indicador.dataset.slide))
  );
});

carrossel.addEventListener('keydown', evento => {
  if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
    evento.preventDefault();

    mostrarSlide(
      slideAtual + (evento.key === 'ArrowRight' ? 1 : -1)
    );
  }
});

mostrarSlide(0);

// Modal
const modal = document.getElementById('modalConfirmacao');
const conteudoModal = document.getElementById('conteudoModal');
const mensagemModal = document.getElementById('mensagemModal');

let focoAnterior = null;

function abrirModal(mensagem, titulo = 'Atividade cadastrada!') {
  focoAnterior = document.activeElement;

  document.getElementById('tituloModal').textContent = titulo;
  mensagemModal.textContent = mensagem;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  document.body.style.overflow = 'hidden';
  conteudoModal.focus();
}

function fecharModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');

  document.body.style.overflow = '';

  if (focoAnterior && typeof focoAnterior.focus === 'function') {
    focoAnterior.focus();
  }
}

document.getElementById('abrirModal').addEventListener('click', () => {
  abrirModal(
    'Este é um exemplo de modal desenvolvido com Tailwind CSS e JavaScript.',
    'Exemplo de modal'
  );
});

document.getElementById('fecharModal').addEventListener('click', fecharModal);
document.getElementById('fecharModalX').addEventListener('click', fecharModal);

modal.addEventListener('click', evento => {
  if (evento.target === modal) fecharModal();
});

document.addEventListener('keydown', evento => {
  if (modal.classList.contains('hidden')) return;

  if (evento.key === 'Escape') {
    fecharModal();
    return;
  }

  if (evento.key === 'Tab') {
    const elementos = [
      ...conteudoModal.querySelectorAll('button:not([disabled])')
    ];

    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];

    if (
      evento.shiftKey &&
      (document.activeElement === primeiro ||
       document.activeElement === conteudoModal)
    ) {
      evento.preventDefault();
      ultimo.focus();
    } else if (
      !evento.shiftKey &&
      document.activeElement === ultimo
    ) {
      evento.preventDefault();
      primeiro.focus();
    } else if (document.activeElement === conteudoModal) {
      evento.preventDefault();
      primeiro.focus();
    }
  }
});

document.getElementById('verAtividades').addEventListener('click', () => {
  fecharModal();

  document.getElementById('atividades').scrollIntoView({
    behavior: 'smooth'
  });
});

// Validação do formulário
function validarCampos() {
  let valido = true;

  formulario.querySelectorAll('input[required], select[required]')
    .forEach(campo => {
      const correto = campo.checkValidity();

      campo.classList.toggle('invalido', !correto);
      campo.setAttribute('aria-invalid', String(!correto));

      const erro = campo.parentElement.querySelector('.erro');

      if (erro) {
        erro.classList.toggle('hidden', correto);
      }

      if (!correto) valido = false;
    });

  return valido;
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();

  if (!validarCampos()) {
    formulario.querySelector('.invalido')?.focus();
    return;
  }

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

  formulario.reset();

  formulario.querySelectorAll('.invalido').forEach(campo => {
    campo.classList.remove('invalido');
    campo.removeAttribute('aria-invalid');
  });

  formulario.querySelectorAll('.erro').forEach(erro => {
    erro.classList.add('hidden');
  });

  abrirModal(
    `A atividade “${atividade.nome}” foi cadastrada e adicionada à tabela.`
  );
});

carregarSituacoesIniciais();
listarAtividades();
