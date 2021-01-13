import powerbi from "powerbi-visuals-api";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../style/visual.less";
import ISelectionManager = powerbi.extensibility.ISelectionManager;

export interface State {
    textValDynamic?: string,
    classes?: string,
    textFontSize?: string,
    textAlignment?: string,
    textColor?: string,
    staticShowColon?: boolean;
    staticTextPosition?: string;
    staticShowTextHiglighted?: boolean;
    staticBackgroundcolor?: string;
    staticFontFamily?: string;
    staticBoldStyle?: boolean;
    staticItalicStyle?: boolean;
    staticUnderlineStyle?: boolean;
    staticPostText?: string;
    dynamicShowTextHiglighted?: boolean;
    dynamicBackgroundcolor?: string;
    dynamicFontFamily?: string;
    dynamicBoldStyle?: boolean;
    dynamicItalicStyle?: boolean;
    dynamicUnderlineStyle?: boolean;
    selectionManager?: ISelectionManager;
}

export const initialState: State = {
    textValDynamic: "",
    classes: "",
    textFontSize: "",
    textAlignment: "",
    textColor: "",
    staticShowColon: false,
    staticTextPosition: "",
    staticBackgroundcolor: "",
    staticFontFamily: "",
    staticBoldStyle: false,
    staticItalicStyle: false,
    staticUnderlineStyle: false,
    staticPostText: "",
    dynamicBackgroundcolor: "",
    dynamicFontFamily: "",
    dynamicBoldStyle: false,
    dynamicItalicStyle: false,
    dynamicUnderlineStyle: false
}

export class ReactTextWrapper extends React.Component<{}>{
    constructor(props: any) {
        super(props);
        this.state = initialState;
    }
    private static updateCallback: (data: object) => void = null;
    public selectionManager: ISelectionManager;

    public static UPDATE(newState: State) {
        if (typeof ReactTextWrapper.updateCallback === "function") {
            ReactTextWrapper.updateCallback(newState);
        }
    }

    public state: State = initialState;

    public componentWillMount() {
        ReactTextWrapper.updateCallback = (newState: State): void => {
            this.setState(newState);
            this.selectionManager = newState.selectionManager;
        }
    }

    public componentWillUnmount() {
        ReactTextWrapper.updateCallback = null;
    }

    public componentDidMount() {
        ReactDOM.findDOMNode(this).addEventListener("contextmenu", this.showContextMenuInVisual)
    }

    staticSuffix = (stylesForDynamicSpan): JSX.Element => {
        return (
            <>
                <span className="dynamicText" style={stylesForDynamicSpan}>
                    {this.state.textValDynamic}
                </span>
                {this.state.staticShowColon && this.state.staticPostText && <span className="dynamicpluscolon" style={{ fontSize: this.state.textFontSize, color: this.state.textColor }}>
                    :
                </span>}
                <span className="space"> </span>
                <span className="dynamicText" style={{ fontSize: this.state.textFontSize, color: this.state.textColor, backgroundColor: this.state.staticShowTextHiglighted ? this.state.staticBackgroundcolor : "transparent", fontFamily: this.state.staticFontFamily, fontWeight: this.state.staticBoldStyle ? "bold" : "normal", fontStyle: this.state.staticItalicStyle ? "italic" : "normal", textDecoration: this.state.staticUnderlineStyle ? "underline" : "none" }}>
                    {this.state.staticPostText}
                </span>
            </>
        )
    }

    staticPrefix = (stylesForDynamicSpan): JSX.Element => {
        return (
            <>
                <span className="dynamicText" style={{ fontSize: this.state.textFontSize, color: this.state.textColor, backgroundColor: this.state.staticShowTextHiglighted ? this.state.staticBackgroundcolor : "transparent", fontFamily: this.state.staticFontFamily, fontWeight: this.state.staticBoldStyle ? "bold" : "normal", fontStyle: this.state.staticItalicStyle ? "italic" : "normal", textDecoration: this.state.staticUnderlineStyle ? "underline" : "none" }}>
                    {this.state.staticPostText}
                </span>
                {this.state.staticShowColon && this.state.staticPostText && <span className="dynamicpluscolon" style={{ fontSize: this.state.textFontSize, color: this.state.textColor }}>
                    :
                </span>}
                <span className="space"> </span>
                <span className="dynamicText" style={stylesForDynamicSpan}>
                    {this.state.textValDynamic}
                </span>
            </>
        )
    }

    loadLandingPage = (): JSX.Element => {
        return (
            <>
                <h1>{"Text Wrapper by MAQ Software"}</h1>
                <p>{"Text Wrapper by MAQ Software retrieves text from any data source and wraps it within the target field, presenting the text in a readable format. \n This visual also wraps static text strings (statements) with dynamic text field values."}</p>
                <p>{"Key features:"}</p>
                <p>The dynamic text field value updates according to the selected filter or slicer, keeping the static text intact.</p>
                <p>For any feature requests or questions about this visual, please send an e-mail to our team at support@maqsoftware.com</p>

                <a href="https://www.youtube.com/watch?v=-2vcMoCNtIg" target="_blank" rel="noopener noreferrer">{"Text wrapper by MAQ Software"}</a>
            </>
        )
    }
    showContextMenuInVisual = (e) => {
        e.preventDefault();
        if (e.type === "contextmenu") {
            this.selectionManager.showContextMenu(e.currentTarget.id, {
                x: e.clientX,
                y: e.clientY
            });
        }
    }

    render(): JSX.Element {
        let textAlignment;
        switch (this.state.textAlignment) {
            case "center": textAlignment = "center"
                break;
            case "left": textAlignment = "left"
                break;
            case "right": textAlignment = "right"
                break;
        }

        const stylesForDynamicSpan: React.CSSProperties = {
            fontSize: this.state.textFontSize, color: this.state.textColor,
            backgroundColor: this.state.dynamicShowTextHiglighted ? this.state.dynamicBackgroundcolor : "transparent", fontFamily: this.state.dynamicFontFamily, fontWeight: this.state.dynamicBoldStyle ? "bold" : "normal", fontStyle: this.state.dynamicItalicStyle ? "italic" : "normal", textDecoration: this.state.dynamicUnderlineStyle ? "underline" : "none"
        }
        const stylesForError: React.CSSProperties = {
            fontSize: this.state.textFontSize, color: "#777777", fontFamily: "Segoe UI Semibold"
        }

        return (
            <>
                <div id="mainDiv" className={this.state.classes} style={{ fontSize: this.state.textFontSize, textAlign: textAlignment }}>
                    {this.state.staticTextPosition === "suffix" ? this.staticSuffix(this.state.classes.includes("errormsg") ? stylesForError : stylesForDynamicSpan) : this.staticPrefix(this.state.classes.includes("errormsg") ? stylesForError : stylesForDynamicSpan)}
                </div>
            </>
        )
    }
}

export default ReactTextWrapper;