## 1. Configurações Gerais

- [ ] **Padronizar variáveis de ambiente**

  - Instalar e usar `cross-env` para que `EXPO_NO_TELEMETRY=1 expo start` funcione também no Windows.
  - Ou trocar para `expo start --no-telemetry`.

- [ ] **Limpar `package.json` e `app.json`**

  - Remover dependências não usadas.
  - Ajustar `scheme` em `app.json` para algo como `"xp-assessor"` em vez de `"myapp"`.
  - Rever `newArchEnabled: true` caso não use Fabric/TurboModules.

- [ ] **Atualizar `.gitignore`**

  - Ignorar `android/app/build`, `ios/build` e pastas de teste Detox (`.expo`, `build/`, etc.).

- [ ] **Aprimorar Jest/Detox configs**

  - Criar um `e2e/jest.config.js` real só com configurações Detox (não conter testes unitários).
  - Simplificar `transformIgnorePatterns` no `jest.config.js`.

---

## 2. Navegação & Layout

- [ ] **Definir `initialRouteName`** em todos os `_layout.tsx` (root, auth, tabs, portfolio, recommendations).
- [ ] **Mover `StatusBar`** para dentro do `<Stack>` e aplicar via tema no `RootLayout`.
- [ ] **Evitar flashes**: no `RootLayout`, condicionar inicialização de rota ao estado de `loading`.

---

## 3. Screens & UX

### Auth

- [ ] **Login / Signup**

  - Adicionar `testID="email-input"` e `"password-input"`.
  - Desabilitar botão `Entrar`/`Criar Conta` durante `loading`.
  - Validar formato de e-mail antes de chamar API.

### Dashboard / Tabs

- [ ] **Dashboard**

  - Substituir `gap` por `marginRight`/`marginBottom`.
  - Extrair formatações de moeda e porcentagem em funções utilitárias.
  - Exibir `Alert.alert` em vez de `console.error` em falhas de fetch.
  - Memoizar `render` de listas se necessário.

- [ ] **Gamification**

  - Adicionar `keyExtractor` em ambas as `FlatList`.
  - Usar ícones vetoriais em vez de emoji-text para badges.

- [ ] **Profile**

  - Salvar `darkMode` e `notifications` no `AsyncStorage` (ou contexto).
  - Substituir `Alert` de logout por modal customizado.

### Portfolio & Recommendations

- [ ] **PortfolioDetail**

  - Tratar caso de `holdings.length === 0` com mensagem de “nenhum ativo”.
  - Ajustar uso de `VictoryPie` para compatibilidade Android (envolver em `<Svg>`).

- [ ] **Recommendations**

  - Desabilitar botão “Aceitar” após tap até terminar a requisição.
  - Padronizar formatação de `expectedReturn` e porcentagens via util.

---

## 4. Componentes

- [ ] **Badge / Button / Card / ProgressBar**

  - Revisar `ViewStyle`/`TextStyle` importações relativas (usar alias `@/`).
  - Extrair cores e espaçamentos fixos para `theme` (evitar hex hard-coded).
  - Incluir `accessibilityLabel` e `accessible={true}` onde fizer sentido.

---

## 5. Context & Hooks

- [ ] **AuthContext**

  - Adicionar timeout no `checkAuthState` para evitar tela travada se `AsyncStorage` falhar.

- [ ] **useFrameworkReady**

  - Ajustar para chamar `window.frameworkReady()` só uma vez (add `[]` como dependência).

---

## 6. Services

- [ ] **DataService**

  - Implementar `updateProfile` guardando alterações em `AsyncStorage` para manter estado mock.
  - Em `markNotificationAsRead`, atualizar localmente o `notificationsData` ou persistência AsyncStorage.

---

## 7. Testes

- [ ] **Unitários**

  - Mover `_tests_/Dashboard.tsx` para `/tests/Dashboard.test.tsx`.
  - Criar testes para `Profile`, `Recommendations`, `Portfolio`.

- [ ] **E2E (Detox)**

  - Validar `testID` em todos os inputs e botões usados nos scripts.
  - Adicionar fluxo completo: login → aceitar recomendação → ver portfólio.

---

### Bônus / Extras

- [ ] **Tema dinâmico**: implementar persistência do `darkMode` ao reiniciar o app.
- [ ] **Internacionalização**: migrar textos fixos para arquivos de idioma.
- [ ] **Animações**: usar `react-native-reanimated` para transições suaves.
- [ ] **Monitoramento**: integrar `Sentry` ou `Application Insights` para erros.
