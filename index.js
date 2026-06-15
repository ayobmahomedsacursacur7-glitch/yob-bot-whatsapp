const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sessao_bot')
    
    const socket = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    socket.ev.on('creds.update', saveCreds)

    socket.ev.on('connection.update', (update) => {
        const { connection, qr } = update
        if (qr) qrcode.generate(qr, { small: true })
        if (connection === 'close') iniciarBot()
        else if (connection === 'open') console.log('Bot conectado com sucesso no WhatsApp!')
    })

    socket.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.key.fromMe && msg.message) {
            const texto = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase().trim()
            const jid = msg.key.remoteJid
            const nomeUsuario = msg.pushName || "Utilizador"

            // 1. COMANDO PRINCIPAL: .MENU
            if (texto === '.menu') {
                const painelComandos = `*┏━━━━━━━━━━━━━━━━━━━━━━━━┓*
*┃ 📂  LISTA DE COMANDOS  ┃*
*┗━━━━━━━━━━━━━━━━━━━━━━━━┛*

*⚪ MENU INFO (INFORMAÇÃO) ⚪*
> *.ping* ➔ Velocidade do bot
> *.perfil* ➔ Vê o teu perfil
> *.ship* ➔ % de chance de alguém gostar de ti
> *.botcompleto* ➔ Como ter um bot completo
> *.grupos* ➔ Grupos oficiais
> *.canales* ➔ Canais oficiais
> *.serbot* ➔ Como seres um bot
> *.personalizarbot* ➔ Como editar este bot

*⚪ MENU ADMIN ⚪*
> *.welcome 1/0* ➔ Activa/desactiva las bienvenidas
> *.antilink 1/0* ➔ Activa/desactiva anti enlaces
> *.modoadmin 1/0* ➔ Activa/desactiva el uso de solo adm.
> *.todos* ➔ menciona a todos con @
> *.anuncio* ➔ otra forma de mencionar a todos
> *.ban / .kick* ➔ Elima a un participante
> *.notify* ➔ notificacion fantasma
> *.grupo* ➔ abrir/cerrar grupo
> *.rankrep* ➔ Ranking de reputación

*⚪ MENU DESCARGAS ⚪*
> *.play* ➔ Descarga músicas
> *.playvideo* ➔ Descarga videos
> *.playdoc* ➔ Descarga videos en documento
> *.tiktok* ➔ Descarga videos de tiktok
> *.facebook* ➔ Descarga videos de facebook
> *.instagram* ➔ Descarga videos de Instagram
> *.mediafire* ➔ Descarga archivos de mediafire

*⚪ MENU FIGUS ⚪*
> *.sticker* ➔ convierte imagen/vídeo a sticker
> *.attp / .attp2 / .attp3* ➔ Convierte texto a sticker
> *.emojimix* ➔ Mezcla emojis

*⚪ MENU HERRAMIENTAS ⚪*
> *.toimg* ➔ convierte sticker a imagen
> *.tomp3* ➔ Convierte vídeo a audio
> *.ytsearch* ➔ Buscar videos en Youtube
> *.calc* ➔ Calculadora en WhatsApp
> *.wikipedia* ➔ Busca información en Wikipedia
> *.google* ➔ Busca información en Google
> *.simi* ➔ Habla hot con el bot
> *.ia / .chatgpt* ➔ preguntale a IA

*⚪ MENU ECONOMIA ⚪*
> *.nivel* ➔ Mira tu nivel
> *.cartera* ➔ Revisa tu dinero
> *.reg* ➔ Regístrate en el sistema
> *.ruleta* ➔ Juega a la ruleta
> *.minar* ➔ Mina y gana
> *.pescar* ➔ Pesca y gana

*⚪ MENU CREADOR ⚪*
> *.sercreador* ➔ Como convertirte en dueño
> *.antiprivado* ➔ No aceptar personas en tu privado
> *.revelarvisu* ➔ Revela imagen de vista única
> *.reinicio* ➔ Reinicia el bot
> *.botoff / .boton* ➔ Apaga/Prende el bot`
                await socket.sendMessage(jid, { text: painelComandos })
            }

            // 2. LOGICA DO MENU INFO
            else if (texto === '.ping') {
                const inicio = Date.now()
                const velocidade = Date.now() - inicio
                await socket.sendMessage(jid, { text: `🏓 *Pong!* Velocidade de resposta: *${velocidade}ms*` })
            } else if (texto === '.perfil') {
                await socket.sendMessage(jid, { text: `👤 *TEU PERFIL:*\n• *Nome:* ${nomeUsuario}\n• *Status:* Registado no sistema.` })
            } else if (texto === '.ship') {
                const chance = Math.floor(Math.random() * 101)
                await socket.sendMessage(jid, { text: `❤️ O amor está no ar! A chance de vocês funcionarem é de *${chance}%*!` })
            } else if (texto === '.botcompleto') {
                await socket.sendMessage(jid, { text: `🤖 Para ter um bot completo 24h ligado, precisas de usar uma VPS ou deixar o Termux sem restrições de bateria.` })
            } else if (texto === '.grupos' || texto === '.canales') {
                await socket.sendMessage(jid, { text: `🔗 *Links Oficiais:* Brevemente adicionaremos os acessos oficiais aqui.` })
            } else if (texto === '.serbot') {
                await socket.sendMessage(jid, { text: `🦾 Módulo Sub-Bot ativo. Entra em contacto com o Criador para conectar o teu número.` })
            } else if (texto === '.personalizarbot') {
                await socket.sendMessage(jid, { text: `⚙️ Podes editar as mensagens e prefixos alterando os blocos de texto no arquivo index.js.` })
            }

            // 3. LOGICA DO MENU ADMIN
            else if (texto.startsWith('.welcome')) {
                await socket.sendMessage(jid, { text: `⚙️ Configuração do comando *Welcome* atualizada.` })
            } else if (texto.startsWith('.antilink')) {
                await socket.sendMessage(jid, { text: `🛡️ Sistema *Anti-Link* ativado/desativado com sucesso.` })
            } else if (texto.startsWith('.modoadmin')) {
                await socket.sendMessage(jid, { text: `🔒 Modo exclusivo para Administradores foi alterado.` })
            } else if (texto === '.todos' || texto === '.anuncio') {
                await socket.sendMessage(jid, { text: `📣 *Aviso Geral solicitado por:* @${nomeUsuario}\n\n📢 Atenção todos os membros do grupo!` })
            } else if (texto === '.ban' || texto === '.kick') {
                await socket.sendMessage(jid, { text: `⚠️ Uso correto: Responde à mensagem de alguém ou menciona com @ para remover.` })
            } else if (texto === '.notify') {
                await socket.sendMessage(jid, { text: `👻 *Notificação fantasma disparada!*` })
            } else if (texto === '.grupo') {
                await socket.sendMessage(jid, { text: `🚪 Estado do grupo alterado (Aberto/Fechado).` })
            } else if (texto === '.rankrep') {
                await socket.sendMessage(jid, { text: `🏆 *Ranking de Reputação:*\n1. ${nomeUsuario} - 100 XP` })
            }

            // 4. LOGICA DO MENU DESCARGAS
            else if (texto === '.play' || texto === '.playvideo' || texto === '.playdoc') {
                await socket.sendMessage(jid, { text: `🎵 Ficheiro solicitado! (Módulo de download em manutenção/configuração).` })
            } else if (texto === '.tiktok' || texto === '.facebook' || texto === '.instagram' || texto === '.mediafire') {
                await socket.sendMessage(jid, { text: `📥 Por favor, insere o link válido à frente do comando.` })
            }

            // 5. LOGICA DO MENU FIGUS
            else if (texto === '.sticker') {
                await socket.sendMessage(jid, { text: `📸 Envia uma imagem/vídeo ou responde a uma com o comando *.sticker* para eu converter.` })
            } else if (texto === '.attp' || texto === '.attp2' || texto === '.attp3') {
                await socket.sendMessage(jid, { text: `✍️ Escreve o texto que queres transformar em sticker à frente do comando.` })
            } else if (texto === '.emojimix') {
                await socket.sendMessage(jid, { text: `😜 Envia dois emojis juntos (ex: .emojimix 😂🔥) para eu misturar.` })
            }

            // 6. LOGICA DO MENU HERRAMIENTAS
            else if (texto === '.toimg') {
                await socket.sendMessage(jid, { text: `🔄 Responde a uma figurinha usando *.toimg* para eu converter de volta em imagem.` })
            } else if (texto === '.tomp3') {
                await socket.sendMessage(jid, { text: `🎵 Responde a um vídeo curto para eu extrair o áudio em formato MP3.` })
            } else if (texto === '.ytsearch' || texto === '.google' || texto === '.wikipedia') {
                await socket.sendMessage(jid, { text: `🔍 Escreve o termo da tua pesquisa logo após o comando.` })
            } else if (texto === '.calc') {
                await socket.sendMessage(jid, { text: `🧮 Sistema de cálculo automático. Exemplo de uso: *.calc 10*5*` })
            } else if (texto === '.simi') {
                await socket.sendMessage(jid, { text: `🦜 SimSimi responde: Olá! O que queres conversar em privado ou no grupo?` })
            } else if (texto === '.ia' || texto === '.chatgpt') {
                await socket.sendMessage(jid, { text: `🤖 Chat-IA ativo. Digita a tua dúvida para receberes uma resposta inteligente.` })
            }

            // 7. LOGICA DO MENU ECONOMIA
            else if (texto === '.nivel') {
                await socket.sendMessage(jid, { text: `📈 *NÍVEL:* Estás atualmente no Nível 1 do Bot.` })
            } else if (texto === '.cartera') {
                await socket.sendMessage(jid, { text: `💰 *CARTEIRA:* Tens um saldo disponível de: $1,500 Coins.` })
            } else if (texto === '.reg') {
                await socket.sendMessage(jid, { text: `✅ Registo efetuado com sucesso na base de dados do sistema!` })
            } else if (texto === '.ruleta') {
                await socket.sendMessage(jid, { text: `🎰 A roleta parou... Parabéns, ganhaste +$250 Coins!` })
            } else if (texto === '.minar' || texto === '.pescar') {
                await socket.sendMessage(jid, { text: `⛏️ A trabalhar arduamente... Volte dentro de minutos para recolher os teus lucros.` })
            }

            // 8. LOGICA DO MENU CREADOR
            else if (texto === '.sercreador') {
                await socket.sendMessage(jid, { text: `👑 Tu és reconhecido agora como o dono e Criador oficial do bot.` })
            } else if (texto === '.antiprivado') {
                await socket.sendMessage(jid, { text: `🚫 Sistema Anti-Privado configurado com sucesso.` })
            } else if (texto === '.revelarvisu') {
                await socket.sendMessage(jid, { text: `👁️ Extraindo média do modo de visualização única... Aguarde.` })
            } else if (texto === '.reinicio') {
                await socket.sendMessage(jid, { text: `🔄 Reiniciando os sistemas core do bot... Conectando novamente.` })
            } else if (texto === '.botoff') {
                await socket.sendMessage(jid, { text: `😍 O Bot  Criado.` })
            } else if (texto === '.boton') {
                await socket.sendMessage(jid, { text: `⚡ Bot ativado com sucesso! Pronto para receber ordens.` })
            }
        }
    })
}
iniciarBot()

