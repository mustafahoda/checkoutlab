# CheckoutLab | Adyen Integration Sandbox

A powerful low-code/more-code sandbox environment for rapidly prototyping Adyen payment integrations. This tool provides an interactive development environment with real-time parsing and validation of JavaScript, CSS, and JSON configurations.

> 💡 Check out it out live at [checkoutlab.dev](https://checkoutlab.dev)

## Features

### Low-Code Development Environment
- Real-time JavaScript parsing and validation using Babel
- Live CSS editing with instant preview
- JSON schema validation for API requests
- Interactive configuration builder for Adyen components
- TypeScript support throughout the application

### Technical Capabilities
- **Code Parsing**: Uses Babel AST for JavaScript analysis and transformation
- **Type Generation**: Automatic TypeScript type generation from Adyen's SDK
- **Real-time Validation**: Immediate feedback on configuration errors
- **API Integration**: Built-in support for Adyen's API endpoints
- **State Management**: Redux-based state management for consistent data flow

### Developer Experience
- Split-pane editing environment
- Real-time preview of changes
- Built-in code formatting
- Keyboard shortcuts for common actions
- Shareable configurations via URL


## Using the Checkout Lab Sandbox

You can use the Checkout Lab Sandbox instantly online—no need to clone the repository or run a local server. Just visit [https://checkoutlab.dev](https://checkoutlab.dev) in your browser.

### Step-by-Step Guide

#### 1. Open the Sandbox
- Go to [https://checkoutlab.dev](https://checkoutlab.dev).
- On the homepage, you'll see options such as **Demo**, **Sandbox**, and **Pre-built Use Cases**.
- Click on **Sandbox** to launch the interactive sandbox environment.

#### 2. Explore the Sandbox Interface
The sandbox is divided into several key sections:

- **Top Bar**: Contains navigation, quick links, and access to documentation or support.
- **Configuration Panel (Left Sidebar)**: Here you can select payment methods, adjust Adyen component settings, and modify environment variables. Tooltips and validation help guide your configuration.
- **Code Editor (Center)**: Write or edit JavaScript, CSS, and JSON for your payment integration. The editor provides real-time validation, linting, and formatting. Errors and warnings are shown inline.
- **Live Preview (Right Panel)**: Instantly see the results of your configuration and code changes. The preview updates in real time as you edit, allowing you to interact with the payment form or component.
- **Save & Share Controls**: At the top or bottom of the editor, you'll find options to save your configuration locally or generate a shareable URL. You can also export your setup as a JSON file.

#### 3. Building and Testing Your Integration
- **Select or Create a Configuration**: Start from a blank slate or load a template/pre-built use case.
- **Edit Code and Settings**: Use the code editor and configuration panel to customize your integration. All changes are reflected live in the preview.
- **Validate and Debug**: Watch for validation messages in the editor and preview. Use the reset button to revert to defaults if needed.
- **Save and Share**: Save your work by generating a unique URL to share your configuration with others.

#### 4. Troubleshooting & Help
- If you encounter issues, check for error messages in the editor or preview.
- Use the in-app documentation and tooltips for guidance.
- For further help, visit the [Adyen documentation](https://docs.adyen.com/) or reach out via the support links in the top bar.


## Clone and Run Locally

1. Clone the repository:

    ```sh
    git clone https://github.com/objStevo/payment-sandbox.git
    cd formulize
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Configure environment:
- Copy `.env.example` to `.env`
- Add your Adyen API credentials

4. Start development server:

    ```sh
    npm run dev
    ```

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **State Management**: Redux Toolkit
- **Code Parsing**: Babel, TypeScript Compiler API
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **API Integration**: REST APIs with built-in validation

## Architecture

The application is built around several core components:

- **Code Editor**: Custom implementation using CodeMirror
- **Type Parser**: Utilizes TypeScript's Compiler API
- **Configuration Builder**: Dynamic form generation from Adyen schemas
- **Preview Environment**: Live rendering of Adyen components
- **API Client**: Typed API client for Adyen endpoints

## Roadmap

### In Progress
1. Enhanced JavaScript linting and error messaging
2. Expanded configuration templates
3. Advanced sharing capabilities
4. Component variant configurations
5. Integration with Adyen's Test Cards API

### Planned Features
1. WebSocket support for real-time collaboration
2. Additional payment method configurations
3. Enhanced error handling and debugging tools
4. Integration with Adyen's Testing API
5. Custom component theming

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
