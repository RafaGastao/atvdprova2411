import { useState } from 'react'
import { CarFront, CalendarDays, Clock3, CheckCircle2, Sparkles, ShieldCheck, Droplets, Menu, X, Trash2, Phone, MapPin, ArrowRight } from 'lucide-react'

const servicos = [
  { nome: 'Lavagem Simples', preco: 35, tempo: '30 minutos', descricao: 'Lavagem externa, limpeza dos vidros e secagem cuidadosa.', icone: Droplets },
  { nome: 'Lavagem Completa', preco: 60, tempo: '60 minutos', descricao: 'Lavagem externa, aspiração interna, painel e vidros.', icone: CarFront, destaque: true },
  { nome: 'Lavagem Premium', preco: 95, tempo: '90 minutos', descricao: 'Limpeza completa, acabamento especial e brilho nos pneus.', icone: Sparkles },
  { nome: 'Higienização Interna', preco: 120, tempo: '120 minutos', descricao: 'Limpeza detalhada dos bancos, tapetes e superfícies internas.', icone: ShieldCheck }
]
const chave = 'autoclean_agendamentos'
const horarios = Array.from({ length: 19 }, (_, i) => `${String(8 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)
const lerAgendamentos = () => {
  try {
    const dados = JSON.parse(localStorage.getItem(chave) || '[]')
    return Array.isArray(dados) ? dados : []
  } catch {
    return []
  }
}
const formatarData = data => data ? new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR') : ''
const moeda = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const hoje = () => {
  const data = new Date()
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
}

export default function App() {
  const [pagina, setPagina] = useState('inicio')
  const [menuAberto, setMenuAberto] = useState(false)
  const [agendamentos, setAgendamentos] = useState(lerAgendamentos)
  const [mensagem, setMensagem] = useState('')
  const [formulario, setFormulario] = useState({ nome: '', telefone: '', veiculo: '', servico: 'Lavagem Completa', data: '', horario: '' })
  const navegar = destino => { setPagina(destino); setMenuAberto(false); setMensagem(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const escolherServico = nome => { setFormulario(atual => ({ ...atual, servico: nome })); navegar('agendar') }
  const atualizar = evento => {
    const { name, value } = evento.target
    setFormulario(atual => ({ ...atual, [name]: value, ...(name === 'data' ? { horario: '' } : {}) }))
    if (name === 'data' || name === 'horario') setMensagem('')
  }
  const horariosOcupados = agendamentos.filter(item => item.data === formulario.data).map(item => item.horario)
  const agendar = evento => {
    evento.preventDefault()
    if (!formulario.nome.trim() || !formulario.telefone.trim() || !formulario.veiculo.trim() || !formulario.data || !formulario.horario) {
      setMensagem('Preencha todos os campos para continuar.')
      return
    }
    const dataHora = new Date(`${formulario.data}T${formulario.horario}:00`)
    if (Number.isNaN(dataHora.getTime()) || dataHora <= new Date()) {
      setMensagem('Escolha uma data e um horário futuros.')
      return
    }
    if (agendamentos.some(item => item.data === formulario.data && item.horario === formulario.horario)) {
      setMensagem('Este horário já está reservado. Escolha outro horário.')
      return
    }
    const novo = { ...formulario, nome: formulario.nome.trim(), veiculo: formulario.veiculo.trim(), id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) }
    const atualizados = [...agendamentos, novo]
    setAgendamentos(atualizados)
    localStorage.setItem(chave, JSON.stringify(atualizados))
    setFormulario({ nome: '', telefone: '', veiculo: '', servico: 'Lavagem Completa', data: '', horario: '' })
    setMensagem('Agendamento realizado com sucesso!')
  }
  const cancelar = id => {
    if (!window.confirm('Deseja cancelar este agendamento?')) return
    const atualizados = agendamentos.filter(item => item.id !== id)
    setAgendamentos(atualizados)
    localStorage.setItem(chave, JSON.stringify(atualizados))
  }
  const links = [['inicio', 'Início'], ['servicos', 'Serviços'], ['agendar', 'Agendar'], ['meus', 'Meus Agendamentos'], ['sobre', 'Sobre Nós']]
  return <>
    <header className="cabecalho"><div className="container barra"><button className="marca" onClick={() => navegar('inicio')}><span className="marca-icone"><CarFront size={23}/></span><span>Auto<span className="destaque">Clean</span><small>LAVA-RÁPIDO</small></span></button><nav className={menuAberto ? 'navegacao aberta' : 'navegacao'}>{links.map(([id, titulo]) => <button key={id} className={pagina === id ? 'ativo' : ''} onClick={() => navegar(id)}>{titulo}</button>)}</nav><button className="botao botao-pequeno botao-topo" onClick={() => navegar('agendar')}>Agendar horário <ArrowRight size={16}/></button><button className="menu-botao" aria-label="Abrir menu" onClick={() => setMenuAberto(!menuAberto)}>{menuAberto ? <X/> : <Menu/>}</button></div></header>
    {pagina === 'inicio' && <><section className="hero"><div className="container hero-conteudo"><div className="selo"><Sparkles size={14}/> SEU CARRO MERECE O MELHOR</div><h1>Seu carro limpo.<br/><span>Seu dia melhor.</span></h1><p>Cuidado em cada detalhe, atendimento de qualidade e aquele brilho que faz a diferença.</p><div className="hero-acoes"><button className="botao" onClick={() => navegar('agendar')}>Agendar minha lavagem <ArrowRight size={18}/></button><button className="botao botao-contorno" onClick={() => navegar('servicos')}>Conhecer serviços</button></div><div className="hero-info"><span><CheckCircle2 size={18}/> Atendimento de qualidade</span><span><Clock3 size={18}/> Agendamento rápido</span></div></div></section><section className="faixa"><div className="container vantagens"><div><Droplets/><span><strong>Limpeza caprichada</strong><small>Cuidado do início ao fim</small></span></div><div><CalendarDays/><span><strong>Horário reservado</strong><small>Mais praticidade para você</small></span></div><div><ShieldCheck/><span><strong>Seu veículo em boas mãos</strong><small>Compromisso com cada detalhe</small></span></div></div></section><SecaoServicos escolherServico={escolherServico} resumido/><section className="chamada"><div className="container chamada-interna"><div><span className="sobretitulo">PRATICIDADE EM PRIMEIRO LUGAR</span><h2>Pronto para dar um novo brilho ao seu carro?</h2><p>Escolha o serviço ideal e reserve seu horário em poucos passos.</p></div><button className="botao" onClick={() => navegar('agendar')}>Agendar agora <ArrowRight size={18}/></button></div></section></>}
    {pagina === 'servicos' && <><TituloPagina subtitulo="NOSSOS SERVIÇOS" titulo="O cuidado certo para seu veículo" descricao="Conheça nossas opções e escolha a lavagem ideal para o seu dia."/><SecaoServicos escolherServico={escolherServico}/></>}
    {pagina === 'agendar' && <><TituloPagina subtitulo="AGENDAMENTO" titulo="Reserve seu horário" descricao="Preencha os dados abaixo para agendar sua próxima lavagem."/><main className="container area-formulario"><form className="cartao formulario" onSubmit={agendar}><h2>Dados do agendamento</h2><p>Todos os campos são obrigatórios.</p><div className="campos"><label>Nome completo<input name="nome" value={formulario.nome} onChange={atualizar} placeholder="Digite seu nome" required/></label><label>Telefone<input name="telefone" type="tel" value={formulario.telefone} onChange={atualizar} placeholder="(11) 99999-9999" required/></label><label>Modelo do veículo<input name="veiculo" value={formulario.veiculo} onChange={atualizar} placeholder="Ex.: Honda Civic" required/></label><label>Tipo de lavagem<select name="servico" value={formulario.servico} onChange={atualizar}>{servicos.map(servico => <option key={servico.nome} value={servico.nome}>{servico.nome} — {moeda(servico.preco)}</option>)}</select></label><label>Data<input name="data" type="date" min={hoje()} value={formulario.data} onChange={atualizar} required/></label><label>Horário<select name="horario" value={formulario.horario} onChange={atualizar} required><option value="">Selecione um horário</option>{horarios.map(hora => <option key={hora} value={hora} disabled={horariosOcupados.includes(hora)}>{hora}{horariosOcupados.includes(hora) ? ' — Horário ocupado' : ''}</option>)}</select></label></div><div className="resumo"><span>Valor do serviço</span><strong>{moeda(servicos.find(item => item.nome === formulario.servico)?.preco || 0)}</strong></div>{mensagem && <div role="status" className={mensagem.includes('sucesso') ? 'aviso sucesso' : 'aviso'}>{mensagem}</div>}<button type="submit" className="botao botao-largo">Confirmar agendamento <ArrowRight size={18}/></button><small className="observacao">Demonstração: os dados ficam salvos apenas neste navegador.</small></form><aside className="cartao lateral"><div className="lateral-icone"><CalendarDays size={30}/></div><h3>É simples agendar!</h3><p>Escolha seu serviço, informe os dados do veículo e selecione o melhor horário.</p><div className="passos"><div><b>01</b><span>Escolha sua lavagem</span></div><div><b>02</b><span>Selecione data e horário</span></div><div><b>03</b><span>Confirme seu agendamento</span></div></div><p className="nota">Os horários já reservados ficam indisponíveis para novos agendamentos na mesma data.</p></aside></main></>}
    {pagina === 'meus' && <><TituloPagina subtitulo="MEUS AGENDAMENTOS" titulo="Acompanhe suas reservas" descricao="Consulte ou cancele os agendamentos feitos neste navegador."/><main className="container lista-agendamentos">{agendamentos.length === 0 ? <div className="cartao vazio"><CalendarDays size={48}/><h2>Nenhum agendamento por aqui</h2><p>Que tal reservar sua primeira lavagem?</p><button className="botao" onClick={() => navegar('agendar')}>Fazer agendamento</button></div> : agendamentos.map(item => <article className="cartao agendamento" key={item.id}><div><span className="etiqueta">AGENDADO</span><h3>{item.servico}</h3><p><CarFront size={16}/> {item.veiculo}</p><p><CalendarDays size={16}/> {formatarData(item.data)} às {item.horario}</p><p>Cliente: {item.nome}</p></div><div className="agendamento-direita"><strong>{moeda(servicos.find(servico => servico.nome === item.servico)?.preco || 0)}</strong><button className="cancelar" onClick={() => cancelar(item.id)}><Trash2 size={16}/> Cancelar</button></div></article>)}</main></>}
    {pagina === 'sobre' && <><TituloPagina subtitulo="SOBRE NÓS" titulo="Paixão por carros bem cuidados" descricao="Conheça a proposta da AutoClean e nosso compromisso com um atendimento especial."/><main className="container sobre"><div className="cartao sobre-texto"><h2>Mais do que uma lavagem</h2><p>Na AutoClean, acreditamos que cuidar do seu veículo deve ser uma experiência simples e agradável. Nossa proposta é reunir praticidade, atenção aos detalhes e um atendimento acolhedor.</p><p>Oferecemos diferentes opções de lavagem para atender às necessidades do dia a dia, sempre valorizando a limpeza e o cuidado com cada veículo.</p><div className="sobre-destaques"><span><CheckCircle2/> Atenção aos detalhes</span><span><CheckCircle2/> Agendamento prático</span><span><CheckCircle2/> Serviços variados</span></div></div><div className="cartao contato"><h2>Entre em contato</h2><p>Esta é uma demonstração acadêmica. Os dados de contato e a localização de uma empresa real poderão ser adicionados futuramente.</p><div><Phone size={20}/> Telefone: a definir</div><div><MapPin size={20}/> Endereço: a definir</div><div><Clock3 size={20}/> Horários exibidos para demonstração</div><button className="botao" onClick={() => navegar('agendar')}>Agendar lavagem <ArrowRight size={18}/></button></div></main></>}
    <footer className="rodape"><div className="container rodape-conteudo"><div><strong>Auto<span>Clean</span></strong><p>Seu carro merece esse cuidado.</p></div><small>© {new Date().getFullYear()} AutoClean. Projeto demonstrativo.</small></div></footer>
  </>
}
function TituloPagina({ subtitulo, titulo, descricao }) { return <section className="titulo-pagina"><div className="container"><span className="sobretitulo">{subtitulo}</span><h1>{titulo}</h1><p>{descricao}</p></div></section> }
function SecaoServicos({ escolherServico, resumido = false }) { return <section className="secao-servicos"><div className="container"><div className="cabecalho-secao"><div><span className="sobretitulo">SERVIÇOS PARA VOCÊ</span><h2>Escolha o cuidado ideal</h2><p>Opções para deixar seu veículo limpo e bem cuidado.</p></div></div><div className="grade-servicos">{(resumido ? servicos.slice(0, 3) : servicos).map(servico => { const Icone = servico.icone; return <article className={servico.destaque ? 'cartao servico destaque-cartao' : 'cartao servico'} key={servico.nome}>{servico.destaque && <span className="popular">MAIS ESCOLHIDO</span>}<div className="servico-icone"><Icone size={28}/></div><h3>{servico.nome}</h3><p>{servico.descricao}</p><div className="duracao"><Clock3 size={15}/> {servico.tempo}</div><div className="servico-rodape"><strong>{moeda(servico.preco)}</strong><button onClick={() => escolherServico(servico.nome)}>Escolher <ArrowRight size={17}/></button></div></article> })}</div></div></section> }
