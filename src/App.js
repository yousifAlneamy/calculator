import React, { Component } from "react";
import "./App.css";
import { calc, autoFix, isCompilable, isBracketBalanced, isOperatorBalanced } from "./util/calcUtil";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: "",
			filterd: "",
			result: ""
		};

		this.ptnClick = this.ptnClick.bind(this);
		this.clearPannel = this.clearPannel.bind(this);
		this.ptnEqual = this.ptnEqual.bind(this);
		this.ptnClickFunc = this.ptnClickFunc.bind(this);
		this.onCalcPannelChange = this.onCalcPannelChange.bind(this);
	}
	onCalcPannelChange() {
		const calcPannel = this.refs.calcPannel;
		const infix = calcPannel.value.replace(/\s+/g, "");
		const result = infix ? calc(infix) : "";
		const filterd = infix ? autoFix(infix) : "";
		this.setState({
			result,
			filterd
		});
	}
	ptnEqual() {
		const calcPannel = this.refs.calcPannel;
		calcPannel.value = this.state.result;
		calcPannel.setSelectionRange(calcPannel.value.length, calcPannel.value.length);
		calcPannel.focus();
	}
	ptnClick(e) {
		const target = e.target;
		console.log(this.refs.calcPannel);
		console.log(target.value.toString().trim());
		this.setCalcPannelVal(target.value.toString().trim());
	}
	setCalcPannelVal(c) {
		const calcPannel = this.refs.calcPannel;
		const value = calcPannel.value;
		let cursorPos = calcPannel.selectionStart;
		const newVal = value.substr(0, cursorPos) + c + value.substr(cursorPos);
		calcPannel.value = newVal;
		cursorPos += c.length;
		calcPannel.setSelectionRange(cursorPos, cursorPos);
		calcPannel.focus();

		this.setState({
			input: newVal
		});
	}
	ptnClickFunc(e) {
		const target = e.target;
		this.setCalcPannelVal(target.value.toString().trim() + "(");
	}
	clearPannel() {
		this.refs.calcPannel.value = "";
		this.setState({
			input: ""
		});
	}
	render() {
		return (
			<div className="App">
				<form name="calculator">
					<input
						id="calcPannel"
						type="text"
						name="answer"
						ref="calcPannel"
						onFocus={this.onCalcPannelChange}
						onKeyUp={this.onCalcPannelChange}
						onChange={this.onCalcPannelChange}
					/>
					<div id="filterDiv">Filter: {this.state.filterd}</div>
					<div id="resultDiv">Result: {this.state.result}</div>
					<div className="parent">
						<input
							id="iptSin"
							calssName="childInput"
							type="button"
							value=" sin "
							onClick={this.ptnClickFunc}
							ref="iptSin"
						/>
						<input
							id="iptCos"
							calssName="childInput"
							type="button"
							value=" cos "
							onClick={this.ptnClickFunc}
							ref="iptCos"
						/>
						<input
							id="iptTan"
							calssName="childInput"
							type="button"
							value=" tan "
							onClick={this.ptnClickFunc}
							ref="iptTan"
						/>
						<input
							id="iptExp"
							calssName="childInput"
							type="button"
							value=" exp "
							onClick={this.ptnClickFunc}
							ref="iptExp"
						/>

						<input
							id="iptCloseBracket"
							calssName="childInput"
							type="button"
							value=" ( "
							onClick={this.ptnClick}
							ref="ipt1"
						/>
						<input
							id="iptBrackets"
							calssName="childInput"
							type="button"
							value=" () "
							onClick={this.ptnClick}
							ref="ipt3"
						/>
						<input
							id="iptOpenBracket"
							calssName="childInput"
							type="button"
							value=" ) "
							onClick={this.ptnClick}
							ref="ipt2"
						/>
						<input id="iptPw" calssName="childInput" type="button" value=" ^ " onClick={this.ptnClick} ref="iptPw" />

						<input id="ipt2" calssName="childInput" type="button" value=" 2 " onClick={this.ptnClick} ref="ipt2" />
						<input id="ipt1" calssName="childInput" type="button" value=" 1 " onClick={this.ptnClick} ref="ipt1" />
						<input id="ipt3" calssName="childInput" type="button" value=" 3 " onClick={this.ptnClick} ref="ipt3" />
						<input id="iptAdd" calssName="childInput" type="button" value=" + " onClick={this.ptnClick} ref="iptAdd" />

						<input id="ipt4" calssName="childInput" type="button" value=" 4 " onClick={this.ptnClick} ref="ipt4" />
						<input id="ipt5" calssName="childInput" type="button" value=" 5 " onClick={this.ptnClick} ref="ipt5" />
						<input id="ipt6" calssName="childInput" type="button" value=" 6 " onClick={this.ptnClick} ref="ipt6" />
						<input id="iptMin" calssName="childInput" type="button" value=" - " onClick={this.ptnClick} ref="iptMin" />

						<input id="ipt7" calssName="childInput" type="button" value=" 7 " onClick={this.ptnClick} ref="ipt7" />
						<input id="ipt8" calssName="childInput" type="button" value=" 8 " onClick={this.ptnClick} ref="ipt8" />
						<input id="ipt9" calssName="childInput" type="button" value=" 9 " onClick={this.ptnClick} ref="ipt9" />
						<input id="iptMul" calssName="childInput" type="button" value=" * " onClick={this.ptnClick} ref="iptMul" />

						<input id="clearPtn" calssName="childInput" type="button" value="C" onClick={this.clearPannel} ref="iptc" />
						<input id="ipt0" calssName="childInput" type="button" value=" 0 " onClick={this.ptnClick} ref="ipt0" />
						<input id="iptEq" calssName="childInput" type="button" value=" = " onClick={this.ptnEqual} ref="iptEq" />
						<input id="iptDiv" calssName="childInput" type="button" value=" / " onClick={this.ptnClick} ref="iptDiv" />
					</div>
				</form>
			</div>
		);
	}
}

export default App;
