# Segurali

Aplicativo mobile de **lista de tarefas** desenvolvido com **React Native** e **Expo**. O app foi construído com estratégia **offline-first**: todas as ações do usuário são gravadas primeiro no banco de dados local e sincronizadas com a API em segundo plano, garantindo funcionamento completo mesmo sem conexão com a internet.

---

## Como rodar

**Pré-requisitos:** Node.js 18+, npm 9+ e o app **Expo Go** versão 54 ou maior instalado no celular (ou um emulador Android/iOS configurado).

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm start
```

Escaneie o QR code exibido no terminal com o **Expo Go** para abrir o app no dispositivo. Alternativamente, pressione `a` para Android ou `i` para iOS Simulator.

```bash
# Atalhos diretos por plataforma
npm run android
npm run ios
```

---

## Bibliotecas utilizadas

| Biblioteca | Finalidade |
| --- | --- |
| `expo` ~54.0.33 | Plataforma e toolchain principal |
| `react-native` 0.81.5 | Framework mobile |
| `@react-navigation/native` + `native-stack` | Navegação entre telas |
| `@tanstack/react-query` v5 | Gerenciamento de estado assíncrono e cache |
| `expo-sqlite` | Banco de dados local SQLite (fonte de verdade offline) |
| `axios` | Requisições HTTP à API |
| `@react-native-community/netinfo` | Detecção de conectividade para sincronização automática |
| `react-native-gesture-handler` | Suporte a gestos (swipe para deletar tarefas) |
| `react-native-safe-area-context` | Margens seguras em dispositivos com notch/home indicator |
| `react-native-screens` | Otimização de navegação nativa |
| `@expo-google-fonts/plus-jakarta-sans` | Tipografia customizada |
| `@expo/vector-icons` | Ícones (Ionicons) |
| `expo-linking` | Deep links (`segurali://perfil`) |
| `expo-secure-store` | Armazenamento seguro de credenciais |

---

## Arquitetura

O projeto segue os princípios de **Clean Architecture**, organizando o código da seguinte forma: 

```
src/
├── core/                   # Núcleo da aplicação
│   └── entities/           # Entidades puras do negócio: User e Task
│                           # São interfaces TypeScript sem nenhuma dependência externa
│
├── domain/                 # Regras de negócio
│   ├── repositories/       # Contratos (interfaces) que definem o que cada repositório
│   │                       # deve fazer
│   └── usecases/           # Casos de uso: ações do sistema
│                           # (ex: criar tarefa, fazer login, buscar sessão)
│
├── data/                   # Implementação do acesso a dados
│   ├── datasources/
│   │   ├── local/          # Leitura e escrita no SQLite local
│   │   │                   # (TaskLocalDataSource, AuthLocalDataSource)
│   │   └── remote/         # Comunicação com a API REST via Axios
│   │                       # (TaskRemoteDataSource, AuthRemoteDataSource)
│   └── repositories/       # Implementações concretas dos contratos do domínio
│                           # e aplicam toda a lógica offline-first
│
├── infrastructure/         
│   ├── api/                # Configuração do Axios, interceptors de token
│   │                       # e tratamento de erros de autenticação
│   └── database/           # Cliente SQLite, migrations e criação de tabelas
│
└── presentation/           # Interface com o usuário
    ├── components/         # Componentes reutilizáveis (Button, BottomModal,
    │                       # TaskItem, InitialsAvatar, LoadingOverlay, etc.)
    ├── context/            # AuthContext: estado global de autenticação
    ├── hooks/              # Hooks React Query para tarefas e autenticação
    ├── navigation/         # Configuração de rotas (RootNavigator, AuthNavigator,
    │                       # AppNavigator) e deep links
    ├── screens/            # Telas do app organizadas por fluxo
    │   ├── auth/           
    │   │                   
    │   └── app/            
    └── theme/              # Sistema de cores e tipografia com suporte
                            # a tema claro e escuro automático
```

### Fluxo offline-first

1. Toda ação do usuário (criar, marcar, excluir tarefa) grava **imediatamente no SQLite local**.
2. O app tenta sincronizar com a API em segundo plano.
3. Se offline, as operações ficam marcadas como `pending` e são sincronizadas automaticamente quando a conexão é restaurada (via `@react-native-community/netinfo`).
4. Na abertura do app, se não houver tarefas locais, os dados são buscados da API para popular o banco. Se já houver tarefas locais, elas têm prioridade e são enviadas à API.
5. As tarefas ficam isoladas por `user_id`, garantindo que ao trocar de conta os dados do usuário anterior não apareçam.

---

## API

O app consome a API em `https://api-teste-mobile.fly.dev`.
Documentação disponível em `https://api-teste-mobile.fly.dev/openapi`.
