# TaskOrganizer

O TaskOrganizer é um aplicativo que ajuda você a organizar suas atividades diárias. Ele possui sete telas principais: Atividades, Agenda, Arquivos, LaTeX, QR, LitLens e Ajustes.

<p align="center">
  <img src="https://github.com/jefersonapps/TaskOrganizer/raw/main/src/assets/adaptive-icon.png" alt="drawing" width="300"/>
</p>

## Telas

### Atividades

Na tela de Atividades, você pode adicionar atividades com ou sem prazo. Se a atividade tiver um prazo, uma notificação será enviada quando a atividade estiver próxima de expirar ou quando tiver expirado. Você também pode filtrar atividades por status (A fazer, Feitas), Prazo e Prioridade.

### Agenda

Na tela Agenda, você pode adicionar atividades para cada dia da semana.

### Arquivos

Na tela de Arquivos, você pode armazenar seus arquivos importantes e compartilhar vários arquivos de uma só vez.

### LaTeX

Na tela LaTeX, você pode armazenar equações escritas em LaTeX, visualizá-las e compartilhá-las.

### QR

Na tela QR, você pode criar um código QR totalmente personalizado, podendo colocar uma imagem no centro do código QR, definir a cor principal e a cor de fundo, colocar um gradiente no design do código QR, ler códigos QR de imagens e usar a câmera para escanear códigos QR.

### LitLens

Na tela LitLens, utilizando react native vision camera, você pode abrir a câmera e escanear textos obtendo uma leitura em OCR do documento, podendo editar e copiar o que foi escaneado.

### Ajustes

Na tela de Ajustes, você pode verificar um relatório das atividades armazenadas e um gráfico da quantidade de atividades em cada dia da Agenda. Além disso, você pode alternar entre o modo noturno e o modo claro ou habilitar a segurança do aplicativo com desbloqueio por digitais ou senha.

## Widgets

O TaskOrganizer também possui widgets que fornecem uma visão rápida das suas atividades diretamente na tela inicial do seu dispositivo.

### All Activities Widget

O widget `all-activities-widget` mostra a quantidade total de atividades.

![All Activities Widget](https://github.com/jefersonapps/TaskOrganizer/raw/main/src/assets/widget-preview/all-activities-widget.png)

### Checked Todos Widget

O widget `checked-todos-widget` mostra o total de atividades concluídas.

![Checked Todos Widget](https://github.com/jefersonapps/TaskOrganizer/raw/main/src/assets/widget-preview/checked-todos-widget.png)

### Todos Widget

O widget `todos-widget` mostra as atividades a fazer.

![Todos Widget](https://github.com/jefersonapps/TaskOrganizer/raw/main/src/assets/widget-preview/todos-widget.png)

### Delivery Datetime Widget

O widget `delivery-datetime-widget` mostra uma lista das atividades com prazo ordenadas em relação ao prazo mais recente.

![Delivery Datetime Widget](https://github.com/jefersonapps/TaskOrganizer/raw/main/src/assets/widget-preview/delivery-datetime-widget.png)

## Dependências

O projeto tem as seguintes dependências:

```json
"dependencies": {
    "@react-native-community/datetimepicker": "7.2.0",
    "@react-navigation/bottom-tabs": "^6.5.9",
    "@react-navigation/native-stack": "^6.9.14",
    "dayjs": "^1.11.10",
    "expo": "~49.0.13",
    "expo-barcode-scanner": "~12.5.3",
    "expo-clipboard": "~4.3.1",
    "expo-crypto": "~12.4.1",
    "expo-document-picker": "~11.5.4",
    "expo-haptics": "~12.4.0",
    "expo-image-picker": "~14.3.2",
    "expo-intent-launcher": "~10.7.0",
    "expo-linear-gradient": "~12.3.0",
    "expo-linking": "~5.0.2",
    "expo-local-authentication": "~13.4.1",
    "expo-media-library": "~15.4.1",
    "expo-notifications": "~0.20.1",
    "expo-sharing": "~11.5.0",
    "expo-splash-screen": "~0.20.5",
    "expo-status-bar": "~1.6.0",
    "expo-system-ui": "~2.4.0",
    "lottie-react-native": "5.1.6",
    "react": "18.2.0",
    "react-native": "^0.72.5",
    "react-native-android-widget": "^0.9.0",
    "react-native-draggable-flatlist": "^4.0.1",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-mathjax": "^2.1.2",
    "react-native-mmkv": "^2.11.0",
    "react-native-pager-view": "^6.2.3",
    "react-native-paper": "5.1",
    "react-native-paper-tabs": "^0.10.1",
    "react-native-qrcode-svg": "^6.2.0",
    "react-native-reanimated": "~3.5.4",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0",
    "react-native-share": "^10.0.2",
    "react-native-svg": "13.9.0",
    "react-native-view-shot": "3.7.0",
    "react-native-vision-camera": "^2.13.0",
    "react-native-webview": "^13.6.3",
    "react-navigation-stack": "^2.10.4",
    "reanimated-color-picker": "^2.4.1",
    "vision-camera-ocr": "^1.0.0"
}
```

## Como rodar o projeto

Após clonar o repositório e instalar as dependências com npm install, você deve rodar expo prebuild para preparar o projeto para execução.
