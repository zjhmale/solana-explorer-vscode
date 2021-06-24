import * as vscode from 'vscode';
import * as path from 'path';

interface AssetManifest {
    files: {
        'main.js': string;
        'main.css': string;
        'runtime-main.js': string;
        [key: string]: string;
    };
}

export class ViewLoader {
    public static currentPanel?: vscode.WebviewPanel;

    private panel: vscode.WebviewPanel;
    private context: vscode.ExtensionContext;
    private disposables: vscode.Disposable[];

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.disposables = [];

        this.panel = vscode.window.createWebviewPanel('solanaExplorer', 'Solana Explorer', vscode.ViewColumn.One, {
            enableScripts: true
        });

        // render webview
        this.renderWebview();

        this.panel.onDidDispose(
            () => {
                this.dispose();
            },
            null,
            this.disposables
        );
    }

    private renderWebview() {
        const html = this.render();
        this.panel.webview.html = html;
    }

    static showWebview(context: vscode.ExtensionContext) {
        const cls = this;
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (cls.currentPanel) {
            cls.currentPanel.reveal(column);
        } else {
            cls.currentPanel = new cls(context).panel;
        }
    }

    static postMessageToWebview(message: any) {
        // post message from extension to webview
        const cls = this;
        cls.currentPanel?.webview.postMessage(message);
    }

    public dispose() {
        ViewLoader.currentPanel = undefined;

        // Clean up our resources
        this.panel.dispose();

        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    render() {
        const { extensionPath } = this.context;

        const webviewPath: string = path.join(extensionPath, 'out', 'webview');
        const assetManifest: AssetManifest = require(path.join(webviewPath, 'asset-manifest.json'));

        const main: string = assetManifest.files['main.js'];
        const styles: string = assetManifest.files['main.css'];
        const runTime: string = assetManifest.files['runtime-main.js'];
        const chunk: string = Object.keys(assetManifest.files).find((key) => key.endsWith('chunk.js')) as string;
        console.log(`chunk: ${chunk}`);

        const mainUri: vscode.Uri = vscode.Uri.file(path.join(webviewPath, main)).with({ scheme: 'vscode-resource' });
        const stylesUri: vscode.Uri = vscode.Uri.file(path.join(webviewPath, styles)).with({ scheme: 'vscode-resource' });
        const runTimeMainUri: vscode.Uri = vscode.Uri.file(path.join(webviewPath, runTime)).with({ scheme: 'vscode-resource' });
        const chunkUri: vscode.Uri = vscode.Uri.file(path.join(webviewPath, chunk)).with({ scheme: 'vscode-resource' });

        // <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
        // <base href="${vscode.Uri.file(path.join(extensionPath, 'out', 'webview')).with({ scheme: 'vscode-resource' })}/">
        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Todo Task Manager</title>
                    <link rel="stylesheet" type="text/css" href="${stylesUri.toString(true)}">
                    <base href="${vscode.Uri.file(path.join(extensionPath, 'out', 'webview')).with({ scheme: 'vscode-resource' })}/">
                </head>
                <body>
                    <div id="root"></div>
                    <script crossorigin="anonymous" src="${runTimeMainUri.toString(true)}"></script>
                    <script crossorigin="anonymous" src="${chunkUri.toString(true)}"></script>
                    <script crossorigin="anonymous" src="${mainUri.toString(true)}"></script>
                </body>
            </html>`;
    }
}
