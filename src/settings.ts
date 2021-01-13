/*
 *  Power BI Visualizations
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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
  public dataPoint: DataPointSettings = new DataPointSettings();
  public textSettings: TextSettings = new TextSettings();
  public staticText: StaticText = new StaticText();
  public dynamicSettings: Settings = new Settings();
  public errorMessage: ErrorMessage = new ErrorMessage();
}

export class DataPointSettings {
  // Default color
  public defaultColor: string = "";
  // Show all
  public showAllDataPoints: boolean = true;
  // Fill
  public fill: string = "";
  // Color saturation
  public fillRule: string = "";
  // Text Size
  public fontSize: number = 12;
}

export class TextSettings {
  public color: string = "#777777";
  public fontSize: number = 18;
  public alignment: string = "left";
  public lineBreak: string = "";
}

export class StaticText {
  public showColon: boolean = true;
  public textPosition: string = "suffix";
  public showTextHiglighted: boolean = true;
  public backgroundcolor: string = "#ffffff";
  public postText: string = "";
  public fontFamily: string = "Segoe UI Semibold";
  public boldStyle: boolean = false;
  public italicStyle: boolean = false;
  public underlineStyle: boolean = false;
}

export class Settings {
  public showTextHiglighted: boolean = true;
  public backgroundcolor: string = "#ffffff";
  public fontFamily: string = "Segoe UI Semibold";
  public boldStyle: boolean = false;
  public italicStyle: boolean = false;
  public underlineStyle: boolean = false;
}

export class ErrorMessage {
  public nullValue: string = "Query contains null value";
}