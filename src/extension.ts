// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import { ViewLoader } from './ViewLoader';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('solana-explorer-vscode.mainPage', () => {
            ViewLoader.showWebview(context);
            ViewLoader.postMessageToWebview('0:');
        }),

        vscode.commands.registerCommand('solana-explorer-vscode.accountPage', () => {
            vscode.window
                .showInputBox({
                    prompt: 'Search for accounts, programs, tokens',
                })
                .then(address => {
                    if (address) {
                        ViewLoader.showWebview(context);
                        ViewLoader.postMessageToWebview(`1:${address}`);
                    }
                });
        }),

        vscode.commands.registerCommand('solana-explorer-vscode.txPage', () => {
            vscode.window
                .showInputBox({
                    prompt: 'Search for accounts, programs, tokens',
                })
                .then(address => {
                    if (address) {
                        ViewLoader.showWebview(context);
                        ViewLoader.postMessageToWebview(`2:${address}`);
                    }
                });
        }),

        vscode.commands.registerCommand('solana-explorer-vscode.blockPage', () => {
            vscode.window
                .showInputBox({
                    prompt: 'Search for accounts, programs, tokens',
                })
                .then(address => {
                    if (address) {
                        ViewLoader.showWebview(context);
                        ViewLoader.postMessageToWebview(`3:${address}`);
                    }
                });
        }),

        vscode.commands.registerCommand('solana-explorer-vscode.accountPageSelection', () => {
            const editor = vscode.window.activeTextEditor;
            const address = editor?.document.getText(editor.selection);
            console.log(`address: ${address}`);
            if (address) {
                ViewLoader.showWebview(context);
                ViewLoader.postMessageToWebview(`1:${address}`);
            }
        }),

        vscode.commands.registerCommand('solana-explorer-vscode.txPageSelection', () => {
            const editor = vscode.window.activeTextEditor;
            const address = editor?.document.getText(editor.selection);
            if (address) {
                ViewLoader.showWebview(context);
                ViewLoader.postMessageToWebview(`2:${address}`);
            }
        }),

        vscode.commands.registerCommand('solana-explorer-vscode.blockPageSelection', () => {
            const editor = vscode.window.activeTextEditor;
            const address = editor?.document.getText(editor.selection);
            if (address) {
                ViewLoader.showWebview(context);
                ViewLoader.postMessageToWebview(`3:${address}`);
            }
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() { }
