const operator = {
	"+": { p: 1, f: (a, b) => Number(a) + Number(b) },
	"-": { p: 1, f: (a, b) => Number(a) - Number(b) },
	"*": { p: 2, f: (a, b) => Number(a) * Number(b) },
	"/": { p: 2, f: (a, b) => Number(a) / Number(b) },
	"^": { p: 3, f: (a, b) => Math.pow(Number(a), Number(b)) }
};

const mathFunction = {
	S(a) {
		return Math.sin(Number(a));
	},
	T(a) {
		return Math.tan(Number(a));
	},
	C(a) {
		return Math.cos(Number(a));
	},
	E(a) {
		return Math.exp(Number(a));
	}
};

export function calc(infix) {
	let result;
	try {
		const postfix = infixToPostfix(infix);
		result = postfixEvaluation(postfix);
	} catch (e) {
		return e.Error;
	}
	return result;
}

export function autoFix(infix) {
	infix = infix
		.replace(/\s+/g, "")
		.replace(/sin\(/g, "S")
		.replace(/cos\(/g, "C")
		.replace(/tan\(/g, "T")
		.replace(/exp\(/g, "E");
	infix = mulAutoInsertion(infix);
	return infix
		.replace(/S/g, "sin(")
		.replace(/C/g, "cos(")
		.replace(/T/g, "tan(")
		.replace(/E/g, "exp(");
}

function mulAutoInsertion(infix) {
	let openI = infix.indexOf("(");
	while (openI !== -1) {
		if (openI > 0 && !isOperator(infix.charAt(openI - 1)) && !isOpenBracket(infix.charAt(openI - 1))) {
			console.log(infix.charAt(openI - 1), openI);
			let str1 = infix.substr(0, openI);
			let str2 = infix.substr(openI);
			infix = str1 + "*" + str2;
			openI++;
		}
		openI = infix.indexOf("(", openI + 1);
	}

	let closeI = infix.indexOf(")");
	while (closeI !== -1) {
		if (
			closeI < infix.length - 1 &&
			!isOperator(infix.charAt(closeI + 1)) &&
			!isCloseBracket(infix.charAt(closeI + 1))
		) {
			console.log(infix.charAt(closeI + 1), closeI);
			let str1 = infix.substr(0, closeI + 1);
			let str2 = infix.substr(closeI + 1);
			infix = str1 + "*" + str2;
			closeI++;
		}
		closeI = infix.indexOf(")", closeI + 1);
	}
	return infix;
}

function infixToPostfix(infix) {
	infix = infix.replace(/\s+/g, "");
	infix = infix.replace(/sin\(/g, "S");
	infix = infix.replace(/cos\(/g, "C");
	infix = infix.replace(/tan\(/g, "T");
	infix = infix.replace(/exp\(/g, "E");
	console.log("infix", infix);

	// add "*" before "(" and after ")"
	infix = mulAutoInsertion(infix);
	console.log("infix", infix);
	let infixArr = getInfixArr(infix);
	const compilable = isCompilable(infixArr);

	console.log(infixArr, compilable);

	if (!compilable) {
		throw { Error: "Syntax Error" };
	}

	const postfix = [];
	const stack = [];

	for (let node of infixArr) {
		console.log(stack, postfix);
		if (isOperator(node)) {
			let topItem = stack[stack.length - 1];
			while (topItem && isOperator(topItem) && operator[node].p <= operator[topItem].p) {
				postfix.push(stack.pop());
				topItem = stack.length ? stack[stack.length - 1] : null;
			}
			stack.push(node);
		} else if (isFunction(node) || isOpenBracket(node)) {
			stack.push(node);
		} else if (isCloseBracket(node)) {
			while (stack.length) {
				const topNode = stack.pop();
				if (isOpenBracket(topNode)) {
					break;
				} else {
					postfix.push(topNode);
				}
				if (isFunction(topNode)) {
					break;
				}
			}
		} else {
			postfix.push(node);
		}
	}

	while (stack.length) {
		postfix.push(stack.pop());
	}
	console.log("postfix", postfix);
	return postfix;
}

function getInfixArr(infix) {
	let infixArr = [];
	let node = "";
	let c;
	for (let i in infix) {
		c = infix[i];
		if (
			isDigit(c) ||
			(isSignOperator(c) && (i > 0 && !isDigit(infix.charAt(i - 1)) && !isCloseBracket(infix.charAt(i - 1))))
		) {
			node += c;
		} else {
			if (node) {
				infixArr.push(node);
			}
			infixArr.push(c);
			node = "";
		}
	}
	if (node) {
		infixArr.push(node);
	}
	return infixArr;
}

export function isCompilable(infixArr) {
	console.log(isBracketBalanced(infixArr), isOperatorBalanced(infixArr));
	return isBracketBalanced(infixArr) && isOperatorBalanced(infixArr);
}

export function isBracketBalanced(infixArr) {
	let stack = [];
	for (let node of infixArr) {
		if (isOpenBracket(node) || isFunction(node)) {
			stack.push(node);
		} else if (isCloseBracket(node)) {
			const processNode = stack.pop();
			if (!processNode || (!isOpenBracket(processNode) && !isFunction(processNode))) {
				return false;
			}
		}
	}
	return stack.length === 0;
}

export function isOperatorBalanced(infixArr) {
	let digitExpected = true;

	for (let node of infixArr) {
		if (digitExpected && isOperator(node)) {
			return false;
		} else if (digitExpected && isNumber(node)) {
			digitExpected = false;
		} else if (!digitExpected && isOperator(node)) {
			digitExpected = true;
		} else if (!digitExpected && isNumber(node)) {
			return false;
		}
	}

	return !digitExpected;
}

function isSignOperator(c) {
	return c === "+" || c === "-";
}

function isDigit(c) {
	return c >= "0" && c <= "9";
}

function isOperator(c) {
	switch (c) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "^":
			return true;
		default:
			return false;
	}
}
function isFunction(c) {
	switch (c) {
		case "S":
		case "C":
		case "T":
		case "E":
			return true;
		default:
			return false;
	}
}
function isOpenBracket(c) {
	return c === "(";
}
function isCloseBracket(c) {
	return c === ")";
}
function isNumber(c) {
	return !Number.isNaN(Number(c));
}

function postfixEvaluation(postfix) {
	let node;
	let stack = [];
	for (let node of postfix) {
		console.log(stack);

		if (isOperator(node)) {
			if (stack.length < 2) {
				throw { Error: "Invalid operation" };
			}
			const b = stack.pop();
			const a = stack.pop();
			stack.push(operator[node].f(a, b));
		} else if (isFunction(node)) {
			if (stack.length < 1) {
				throw { Error: "Invalid operation" };
			}
			stack.push(mathFunction[node](stack.pop()));
		} else {
			stack.push(node);
		}
	}
	if (stack.length !== 1) {
		throw { Error: "Faild to exec" };
	}
	return stack[0];
}
