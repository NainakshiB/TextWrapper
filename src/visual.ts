/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";
import * as React from "react";
import 'regenerator-runtime/runtime';
import * as ReactDOM from "react-dom";
import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import * as d3 from 'd3';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import ReactTextWrapper from "./ReactTextWrapper";
import { IDynamicTextContainer, IErrorMessageSettings } from "./interfaces";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import { VisualSettings } from "./settings";
import { IValueFormatter } from "powerbi-visuals-utils-formattingutils/lib/src/valueFormatter";
import { createTooltipServiceWrapper, ITooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import { Constants } from "./Constants";

export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    private events: IVisualEventService;
    private reactRoot: React.ComponentElement<any, any>;
    private selectionManager: ISelectionManager;
    private tooltipServiceWrapper: ITooltipServiceWrapper;
    private toolTipInfo: VisualTooltipDataItem[] = [];
    private constants = new Constants();
    private getTooltipData(value: any): VisualTooltipDataItem[] {
        return [{
            displayName: '',
            value: value[0].value
        }];
    }

    /**
     * Represents visual
     * @constructor
     */
    constructor(options: VisualConstructorOptions) {
        this.events = options.host.eventService;
        this.reactRoot = React.createElement(ReactTextWrapper, {});
        this.target = options.element;
        ReactDOM.render(this.reactRoot, this.target);
        this.selectionManager = options.host.createSelectionManager();
        this.tooltipServiceWrapper = createTooltipServiceWrapper(options.host.tooltipService, options.element);
    }

    public update(options: VisualUpdateOptions) {
        try {
            this.events.renderingStarted(options);
            const dataView: DataView = options && options.dataViews[0];
            this.settings = VisualSettings.parse<VisualSettings>(dataView);
            let textValDynamicInput: string;
            let valueLength: number = 0;
            let classes: string = "";
            const valuesContainer: IDynamicTextContainer = this.getDynamicTextValue(dataView);
            const errorMessageSettings: IErrorMessageSettings = this.settings.errorMessage;
            let staticShowColon: boolean = this.settings.staticText.showColon;
            let staticPostText: string = this.settings.staticText.postText;
            textValDynamicInput = valuesContainer.textContainer;
            valueLength = valuesContainer.lengthContainer;
            if (valueLength === 1) {
                classes = "tw_value tw_finalText";
            } else if (valueLength > 1) {
                classes = "tw_value errormsg";
                staticShowColon = false;
                staticPostText = null;
                textValDynamicInput = this.constants.errorMessage;
            } else if (valueLength === 0) {
                classes = "tw_value errormsg";
                staticShowColon = false;
                staticPostText = null;
                textValDynamicInput = errorMessageSettings.nullValue;
            }
            let finalString = textValDynamicInput;
            if (this.settings.textSettings.lineBreak.length) {
                finalString = textValDynamicInput.split(this.settings.textSettings.lineBreak).join(this.settings.textSettings.lineBreak + "\n");
                let regex = new RegExp(this.settings.textSettings.lineBreak, "g");
                finalString = finalString.replace(regex, '');
            }
            ReactTextWrapper.UPDATE({
                textValDynamic: finalString,
                classes: classes,
                textFontSize: this.pointToPixel(this.settings.textSettings.fontSize),
                textAlignment: this.settings.textSettings.alignment,
                textColor: this.settings.textSettings.color,
                staticShowColon: staticShowColon,
                staticTextPosition: this.settings.staticText.textPosition,
                staticShowTextHiglighted: this.settings.staticText.showTextHiglighted,
                staticBackgroundcolor: this.settings.staticText.backgroundcolor,
                staticFontFamily: this.settings.staticText.fontFamily,
                staticBoldStyle: this.settings.staticText.boldStyle,
                staticItalicStyle: this.settings.staticText.italicStyle,
                staticUnderlineStyle: this.settings.staticText.underlineStyle,
                staticPostText: staticPostText,
                dynamicShowTextHiglighted: this.settings.dynamicSettings.showTextHiglighted,
                dynamicBackgroundcolor: this.settings.dynamicSettings.backgroundcolor,
                dynamicFontFamily: this.settings.dynamicSettings.fontFamily,
                dynamicBoldStyle: this.settings.dynamicSettings.boldStyle,
                dynamicItalicStyle: this.settings.dynamicSettings.italicStyle,
                dynamicUnderlineStyle: this.settings.dynamicSettings.underlineStyle,
                selectionManager: this.selectionManager
            });
            this.toolTipInfo[0] = {
                displayName: "",
                value: this.getTooltipValue(finalString, staticPostText, this.settings.staticText.textPosition, staticShowColon)
            };
            this.tooltipServiceWrapper.addTooltip(d3.selectAll('#sandbox-host'),
                () => this.getTooltipData(this.toolTipInfo)
            );
            this.events.renderingFinished(options);
        } catch (e) {
            console.error(e);
            this.events.renderingFailed(options);
        }
    }

    public getTooltipValue(textValDynamicInput: string, staticPostText: string, textPosition: string, staticShowColon: boolean): string {
        let colon = "";
        staticShowColon && staticPostText.length ? colon = ": " : colon = " ";
        if (textPosition === "suffix") {
            return textValDynamicInput + colon + staticPostText;
        } else {
            return staticPostText + colon + textValDynamicInput;
        }
    }

    public pointToPixel(pt: number): string {

        return (pt * this.constants.pxPtRatio) + this.constants.pixelString;
    }

    public getDecimalPlacesCount(value: any): number {
        let decimalPlaces: number = 0;
        if (value > 0) {
            const arr: string[] = value.toString().split(".");
            if (!arr[1] && parseFloat(arr[1]) > 0) {
                decimalPlaces = arr[1].length;
            }
        }

        return decimalPlaces;
    }

    public getDynamicTextValue(dataView: DataView): IDynamicTextContainer {
        let textValDynamicInput: any;
        let valueLength: number = 0;
        if (dataView
            && dataView.categorical) {
            let dataViewCategories = dataView.categorical;
            if (dataViewCategories.categories
                && dataViewCategories.categories[0]
                && dataViewCategories.categories[0].values) {
                let dataViewCategoriesFirst = dataViewCategories.categories[0];
                valueLength = dataViewCategoriesFirst.values.length;
                textValDynamicInput = valueLength ?
                    dataViewCategoriesFirst.values[0] :
                    this.constants.blank;
                if (dataViewCategoriesFirst.source
                    && dataViewCategoriesFirst.source.format) {
                    const formatter: IValueFormatter = valueFormatter.create({
                        format: dataViewCategoriesFirst.source.format
                    });
                    textValDynamicInput = formatter.format(textValDynamicInput);
                }
            } else if (dataViewCategories.values
                && dataViewCategories.values[0]
                && dataViewCategories.values[0].values) {
                let dataViewCategoriesFirst = dataViewCategories.values[0];
                valueLength = dataViewCategoriesFirst.values.length;
                textValDynamicInput = dataViewCategoriesFirst.values[0] ? dataViewCategoriesFirst
                    .values[0] : 0;
                if (dataViewCategoriesFirst
                    && dataViewCategoriesFirst.source
                    && dataViewCategoriesFirst.source.format) {

                    let decimalPlaces: number = this.getDecimalPlacesCount(textValDynamicInput);
                    decimalPlaces = decimalPlaces > 4 ? 4 : decimalPlaces;
                    const formatter: IValueFormatter = valueFormatter.create({
                        format: dataViewCategoriesFirst.source.format,
                        precision: decimalPlaces,
                        value: 1
                    });
                    textValDynamicInput = formatter.format(textValDynamicInput);
                }
            }

            return {
                textContainer: textValDynamicInput,
                lengthContainer: valueLength
            };
        }
    }
    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings || VisualSettings.getDefault(), options);
    }
}