# Segurali

Aplicativo mobile de gerenciamento de tarefas com suporte offline, construído com Expo 54 e React Native.

## Funcionalidades

- Autenticação com e-mail e senha (login / cadastro)
- Gerenciamento de tarefas (criar, editar, marcar como concluída, excluir)
- **Offline-first**: todas as operações funcionam sem internet e sincronizam automaticamente quando a conexão é restaurada
- Deep link: abrir a tela de perfil via `segurali://perfil`
- Tema claro e escuro automático conforme o sistema

## Tecnologias

- **Expo** ~54.0.33
- **React Native** 0.81.5
- **React Navigation** 7 (Native Stack)
- **TanStack React Query** v5
- **Drizzle ORM** + **expo-sqlite** (banco local)
- **expo-secure-store** (armazenamento do token)
- **Axios** (requisições HTTP)
- **@react-native-community/netinfo** (detecção de conectividade)

## Pré-requisitos

- Node.js 18+
- npm 9+
- Expo CLI: `npm install -g expo-cli`
- Expo Go no dispositivo **ou** Android Emulator / iOS Simulator

## Como rodar

```bash
# 1. Instalar dependências
cd segurali
npm install

# 2. Iniciar o servidor de desenvolvimento
npm start
# ou para Android diretamente:
npm run android
# ou para iOS:
npm run ios
```

Escaneie o QR code com o app **Expo Go** no celular, ou pressione `a` para abrir no Android Emulator.

## Deep link

Para abrir a tela de Perfil via deep link:

```
segurali://perfil
```

Em um terminal conectado ao dispositivo/emulador:

```bash
# Android
adb shell am start -W -a android.intent.action.VIEW -d "segurali://perfil"

# iOS Simulator
xcrun simctl openurl booted "segurali://perfil"
```

## API

O app consome a API em `https://api-teste-mobile.fly.dev`.  
Documentação: `https://api-teste-mobile.fly.dev/openapi`

## Estratégia offline-first

- As tarefas são salvas localmente no SQLite antes de qualquer chamada à API.
- Cada tarefa possui um `syncStatus` (`pending`, `synced`, `failed`) exibido como um indicador colorido na lista.
- Ao restaurar a conexão, o app sincroniza automaticamente todas as tarefas pendentes.
- Indicadores de status:
  - 🟡 Amarelo — pendente de sincronização
  - 🟢 Verde — sincronizado
  - 🔴 Vermelho — falha na sincronização

## Estrutura do projeto

```
src/
├── core/entities/          # Entidades de domínio (User, Task)
├── domain/
│   ├── repositories/       # Interfaces dos repositórios
│   └── usecases/           # Casos de uso (auth + tasks)
├── data/
│   ├── datasources/        # Fontes de dados (remote API + local SQLite)
│   └── repositories/       # Implementações dos repositórios
├── infrastructure/
│   ├── api/                # Axios client + interceptors
│   └── database/           # Schema, migrations, client Drizzle
└── presentation/
    ├── context/            # AuthContext
    ├── hooks/              # React Query hooks
    ├── navigation/         # React Navigation (Root, Auth, App)
    ├── screens/            # Telas (SignIn, SignUp, Home, Profile)
    └── theme/              # Cores e tipografia (light/dark)
```
