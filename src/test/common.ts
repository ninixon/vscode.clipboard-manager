import * as sinon from "sinon";
import * as vscode from "vscode";
import { ClipboardCompletion } from "../completion";

const vscodeSpys: {
  registerCompletionItemProviderSpy?: sinon.SinonSpy<
    [vscode.DocumentSelector, vscode.CompletionItemProvider, ...string[]]
  >;
  [key: string]: sinon.SinonSpy<any> | undefined;
} = {};

function registerSpys() {
  vscodeSpys.registerCompletionItemProviderSpy = sinon.spy(
    vscode.languages,
    "registerCompletionItemProvider"
  );
}

export function getClipboardCompletion() {
  if (!vscodeSpys.registerCompletionItemProviderSpy) {
    return;
  }
  const calls = vscodeSpys.registerCompletionItemProviderSpy.getCalls();

  const call = calls
    .find(call => call.args[1] && call.args[1].constructor.name === ClipboardCompletion.name);

  if (!call) {
    return;
  }

  return call.args[1];
}

export async function activateExtension() {
  const ext = vscode.extensions.getExtension("EdgardMessias.clipboard-manager");

  if (!ext) {
    return false;
  }

  if (!ext.isActive) {
    registerSpys();
    await ext.activate();
  }

  return ext.isActive;
}

export async function showSidebar() {
  try {
    await vscode.commands.executeCommand(
      "workbench.view.extension.clipboard-manager"
    );
    // tslint:disable-next-line:no-empty
  } catch (error) { }
}
