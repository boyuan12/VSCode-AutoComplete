import * as vscode from 'vscode';
import { window, commands, ExtensionContext } from 'vscode';
import * as request from 'request';
import { info } from 'console';


var username = "boyuan12";
var repo: vscode.QuickPickItem[] = []

export async function showInputBox() {
	const result = await window.showInputBox({
		value: 'abcdef',
		valueSelection: [2, 4],
		placeHolder: 'You GitHub Username',
	});
	// username = result
	window.showInformationMessage(`Got: ${result}`);
	// username = result 
	request.get(`https://api.github.com/users/${result}/repos`, options, (error: any, response: any, body: any) => {
		var repos = JSON.parse(body);
		for (let i=0; i<repos.length; i++) {
			repo.push(repos[i]["name"]);
		}
	})
}

/**
 * Shows a pick list using window.showQuickPick().
 */


let options: any = {
	headers: {
		'User-Agent': 'boyuan12'
	}
}


var repo2: vscode.QuickPickItem;
export async function showQuickPick() {
	let i = 0;
	const result = await window.showQuickPick(repo, {
		placeHolder: `${username}`,
		onDidSelectItem: item => {
			window.showInformationMessage(`Focus ${++i}: ${item}`)
		}
	}).then(item => {
		repo2 = item as vscode.QuickPickItem;
	});
}


export function activate(context: vscode.ExtensionContext) {

	let options: any = {
		headers: {
			'User-Agent': 'boyuan12'
		}
	}

	var completions: vscode.CompletionItem[] = [];
	var completionStrings: String[] = []

	// GitHub Repo API

	request.get(`https://api.github.com/repos/boyuan12/A-Simple-Gradebook/contents/app.py?ref=master`, options, (error: any, response: any, body: any) => {
		var content = JSON.parse(body)["content"];
		var codes = Buffer.from(content, 'base64').toString().split("\n")
		codes.forEach(code => {
			if (code.indexOf('\"') === -1 || code.indexOf('#') === -1 || code.search(/[^A-Za-z\s]/) === -1) {
				if (completionStrings.indexOf(code.trim()) === -1) {
					var a = new vscode.CompletionItem(code.trim());
					completionStrings.push(code.trim());
					completions.push(a);
				}
			}
		})

	});

	console.log("content loaded!")

	const provider1 = vscode.languages.registerCompletionItemProvider('python', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext){

			// console.log(completions)
			return completions

		}
	});

	context.subscriptions.push(provider1, commands.registerCommand('samples.quickInput', async () => {
		const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
			showQuickPick,
			showInputBox,
		};
		const quickPick = window.createQuickPick();
		quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				options[selection[0].label](context)
					.catch(console.error);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}));
}