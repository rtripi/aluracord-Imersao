import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState, useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/SendSticker';

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwMjE3NSwiZXhwIjoxOTU4ODc4MTc1fQ.Rcm8BdSvDJxH-qYlGMUWK9abX9OPx0QRLLLPHzZ9zTE';

const SUPABASE_URL = 'https://sxukmdopdhgbbjgtvmjm.supabase.co';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  // Sua lógica vai aqui
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setChat(data);
      });
  }, []);

  const handleNovaMensagem = (novaMensagem) => {
    const mensagem = {
      // id: chat.length + 1,
      message: novaMensagem,
      from: usuarioLogado,
    };

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      .then(({ data }) => {
        setChat([data[0], ...chat]);
      });

    setMensagem('');
  };

  const handleDelete = (e) => {
    const msgId = Number(e.currentTarget.dataset.id);
    const filteredItems = chat.filter((item) => {
      //console.log(`ITEM ID - ${item.id} /// msgID - ${msgId}`);
      return item.id !== msgId;
    });

    setChat(filteredItems);
  };
  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000'],
        minHeight: '100vh',
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          height: '100%',
          maxWidth: '95%',
          maxHeight: '80vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            opacity: '.9',
            flexDirection: 'column',
            listStyle: 'none',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList mensagens={chat} handleDelete={handleDelete} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(e) => {
                const valor = e.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '95%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginTop: '10px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              label="/\"
              onClick={(e) => {
                e.preventDefault();

                handleNovaMensagem(mensagem);
              }}
              styleSheet={{
                width: '5%',
                height: '44px',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                marginLeft: '15px',
                marginTop: '2px',
                color: '#FFFFFF50',
              }}
            />
            <ButtonSendSticker />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({ mensagens, handleDelete }) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        listStyle: 'none',
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px',
      }}
    >
      {mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.from}.png`}
              />
              <Text tag="strong">{mensagem.from}</Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Button
                label="X"
                onClick={handleDelete}
                data-id={mensagem.id}
                styleSheet={{
                  width: '5px',
                  heigth: '5px',
                  backgroundColor: 'transparent',
                  // left: {
                  //   xs: '5%',
                  //   md: '55%',
                  //   sm: '5%',
                  //   lg: '60%',
                  //   xl: '80%',
                  // },
                }}
              />
            </Box>
            {mensagem.message}
          </Text>
        );
      })}
    </Box>
  );
}
