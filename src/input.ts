/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window } from 'vscode';



/**
 * Shows an input box using window.showInputBox().
 */
var username: String | undefined;

export async function showInputBox() {
	const result = await window.showInputBox({
		value: 'abcdef',
		valueSelection: [2, 4],
		placeHolder: 'You GitHub Username',
	});
	username = result
	window.showInformationMessage(`Got: ${result}`);
}

/**
 * Shows a pick list using window.showQuickPick().
 */

export async function showQuickPick() {
	let i = 0;
	const result = await window.showQuickPick(['eins', 'zwei', 'drei'], {
		placeHolder: `${username}`,
		onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	window.showInformationMessage(`Got: ${result}`);
}
